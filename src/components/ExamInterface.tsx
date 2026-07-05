import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Camera, Monitor, Shield, Flag, Eye, Brain, X, AlertCircle, Loader2, Trophy } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getExamQuestions, submitBulkAnswers, ExamAttemptQuestionsResponse, Question, Choice, SubmitAnswerRequest, BulkAnswerResponse, submitViolation } from '../services/examService';
import { aiProctorService } from '../services/aiProctorService';
import { USE_WEBSOCKET } from '../config/ai';
import { toast } from 'sonner';

// Mock questions removed



export function ExamInterface() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [attemptData, setAttemptData] = useState<ExamAttemptQuestionsResponse | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, SubmitAnswerRequest>>({});
  const [selectedChoices, setSelectedChoices] = useState<number[]>([]);
  const [answerText, setAnswerText] = useState('');
  const [questionStartTime, setQuestionStartTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<BulkAnswerResponse | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aiSessionId = useRef<string | null>(null);
  const currentQuestionRef = useRef(0);

  useEffect(() => {
    currentQuestionRef.current = currentQuestionIndex;
  }, [currentQuestionIndex]);

  useEffect(() => {
    const initExam = async () => {
      if (!examId) return;
      try {
        setIsLoading(true);
        
        // Get attemptId from localStorage
        const savedAttempts = JSON.parse(localStorage.getItem('exam_attempts') || '{}');
        const attemptId = savedAttempts[parseInt(examId)];
        
        if (!attemptId) {
          toast.error('No exam attempt found. Please join the exam first.');
          navigate('/student');
          return;
        }

        const data = await getExamQuestions(attemptId);
        setAttemptData(data);
        setQuestions(data.questions);
        setTimeRemaining(data.durationMinutes * 60);
        setQuestionStartTime(new Date());
      } catch (error) {
        toast.error('Failed to load exam questions');
        navigate('/student');
      } finally {
        setIsLoading(false);
      }
    };
    initExam();
  }, [examId]);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isSubmitting) handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitting]);

  // Real AI Integration & DOM Tracking
  useEffect(() => {
    if (!attemptData) return;

    let aiTimer: NodeJS.Timeout;
    let stream: MediaStream | null = null;
    let isActive = true;
    const currentAttemptId = attemptData.attemptId;

    const initCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        const sessionId = await aiProctorService.startSession();
        if (!sessionId) return;
        aiSessionId.current = sessionId;

        // Build a human-readable description from the AI event details
        const buildDescription = (event: any): string => {
          const d = event.details || {};
          if (event.type === 'suspicious_object' || event.type === 'object_detected') {
            const objName = d.object || 'unknown object';
            return `AI detected suspicious object: ${objName}`;
          }
          if (event.type === 'gaze_away') {
            if (d.trigger === 'eyes_hidden') return 'AI detected: eyes hidden from camera';
            const yaw   = d.yaw_deg   != null ? ` (yaw: ${d.yaw_deg.toFixed(1)})` : '';
            const pitch = d.pitch_deg != null ? `, pitch: ${d.pitch_deg.toFixed(1)}` : '';
            return `AI detected gaze away from screen${yaw}${pitch}`;
          }
          if (event.type === 'multiple_persons') {
            return `AI detected multiple persons in frame (${d.num_persons ?? '?'} people)`;
          }
          if (event.type === 'face_missing') return 'AI detected: no face visible in camera';
          if (event.type === 'low_visibility') {
            const brightness = d.brightness != null ? ` (brightness: ${d.brightness.toFixed(1)})` : '';
            const sharpness = d.sharpness != null ? `, sharpness: ${d.sharpness.toFixed(1)}` : '';
            return `AI detected low visibility${brightness}${sharpness}`;
          }
          return `AI detected: ${event.type}`;
        };

        aiProctorService.onEvents(async (events) => {
          for (const event of events) {
            // generic 'object_detected' (non-suspicious) is intentionally ignored
            if (event.type !== 'object_detected') {
              const objectName: string | undefined = event.type === 'suspicious_object'
                ? (event.details?.object ?? 'unknown')
                : undefined;

              await submitViolation(currentAttemptId, {
                questionId: questions[currentQuestionRef.current]?.questionId || 0,
                violationType: event.type,
                description: buildDescription(event),
                durationSeconds: 0,
                ...(objectName ? { metadata: { object_name: objectName } } : {}),
              });
            }
          }
        });

        if (USE_WEBSOCKET) {
          aiProctorService.connect(sessionId);
        }

        // Send frames at 2 fps (every 500ms) — needed for time-based
        // duration filters (gaze_away: 1.5s, face_missing: 1.5s) to
        // accumulate enough frames before firing.
        aiTimer = setInterval(async () => {
          if (!isActive || !videoRef.current || !canvasRef.current || !aiSessionId.current) return;
          const video = videoRef.current;
          const canvas = canvasRef.current;
          if (video.videoWidth === 0) return;

          // Downscale to 320×240 before sending — the AI pipeline
          // resizes to 480px width anyway, so full 640×480 adds no value
          // and doubles transfer size over WebSocket.
          const CAPTURE_W = 320;
          const CAPTURE_H = Math.round(video.videoHeight * (CAPTURE_W / video.videoWidth));
          canvas.width = CAPTURE_W;
          canvas.height = CAPTURE_H;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(video, 0, 0, CAPTURE_W, CAPTURE_H);

          // Explicit quality 0.85 — avoids over-compression that
          // degrades MediaPipe iris landmark detection.
          const base64Image = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];

          if (USE_WEBSOCKET) {
            aiProctorService.sendFrame(base64Image);
          } else {
            const events = await aiProctorService.inferREST(base64Image);
            if (events && events.length > 0) {
              for (const event of events) {
                // generic 'object_detected' (non-suspicious) is intentionally ignored
                if (event.type !== 'object_detected') {
                  const objectName: string | undefined = event.type === 'suspicious_object'
                    ? (event.details?.object ?? 'unknown')
                    : undefined;

                  await submitViolation(currentAttemptId, {
                    questionId: questions[currentQuestionRef.current]?.questionId || 0,
                    violationType: event.type,
                    description: buildDescription(event),
                    durationSeconds: 0,
                    ...(objectName ? { metadata: { object_name: objectName } } : {}),
                  });
                }
              }
            }
          }
        }, 500);

      } catch (e) {
        console.error('Camera init failed', e);
      }
    };

    initCamera();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        submitViolation(currentAttemptId, {
          questionId: questions[currentQuestionRef.current]?.questionId || 0,
          violationType: 'tab_switch',
          description: 'User switched tabs or minimized window',
          durationSeconds: 0
        }).catch(console.error);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        submitViolation(currentAttemptId, {
          questionId: questions[currentQuestionRef.current]?.questionId || 0,
          violationType: 'tab_switch',
          description: 'User exited fullscreen mode',
          durationSeconds: 0
        }).catch(console.error);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      isActive = false;
      clearInterval(aiTimer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      aiProctorService.stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [attemptData, questions]);

  const handleAnswerSelect = (choiceId: number) => {
    const currentQuestionData = questions[currentQuestionIndex];
    if (!currentQuestionData) return;

    if (currentQuestionData.questionType === 'mcq_multiple') {
      setSelectedChoices(prev => 
        prev.includes(choiceId) ? prev.filter(id => id !== choiceId) : [...prev, choiceId]
      );
    } else {
      setSelectedChoices([choiceId]);
    }
  };

  const saveCurrentAnswer = () => {
    const currentQuestionData = questions[currentQuestionIndex];
    if (!currentQuestionData) return;

    const now = new Date();
    const answer: SubmitAnswerRequest = {
      questionId: currentQuestionData.questionId,
      selectedChoices: selectedChoices,
      answerText: answerText,
      startedAt: questionStartTime.toISOString(),
      answeredAt: now.toISOString(),
      timeSpentSeconds: Math.floor((now.getTime() - questionStartTime.getTime()) / 1000)
    };

    setAnswers(prev => ({
      ...prev,
      [currentQuestionData.questionId]: answer
    }));
  };

  const handleNavigate = (newIndex: number) => {
    saveCurrentAnswer();
    setCurrentQuestionIndex(newIndex);
    
    // Load existing answer if any
    const nextQuestion = questions[newIndex];
    const existingAnswer = answers[nextQuestion.questionId];
    if (existingAnswer) {
      setSelectedChoices(existingAnswer.selectedChoices);
      setAnswerText(existingAnswer.answerText);
      setQuestionStartTime(new Date()); // Reset start time for the next question view
    } else {
      setSelectedChoices([]);
      setAnswerText('');
      setQuestionStartTime(new Date());
    }
  };

  const handleSubmitExam = async () => {
    if (!attemptData) return;

    try {
      setIsSubmitting(true);
      saveCurrentAnswer(); // Save the last question's answer

      // We need to use the functional update or the current answers state carefully.
      // Since saveCurrentAnswer updates state asynchronously, we should construct the final list.
      const currentQuestionData = questions[currentQuestionIndex];
      const now = new Date();
      const lastAnswer: SubmitAnswerRequest = {
        questionId: currentQuestionData.questionId,
        selectedChoices: selectedChoices,
        answerText: answerText,
        startedAt: questionStartTime.toISOString(),
        answeredAt: now.toISOString(),
        timeSpentSeconds: Math.floor((now.getTime() - questionStartTime.getTime()) / 1000)
      };

      const allAnswers = { ...answers, [currentQuestionData.questionId]: lastAnswer };
      
      const result = await submitBulkAnswers(attemptData.attemptId, {
        answers: Object.values(allAnswers)
      });
      
      setSubmissionResult(result);
      setShowSubmitConfirm(false);
      toast.success('Exam submitted successfully!');
      navigate('/student');
    } catch (error) {
      toast.error('Failed to submit exam');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFlag = () => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentQuestionIndex)) {
      newFlags.delete(currentQuestionIndex);
    } else {
      newFlags.add(currentQuestionIndex);
    }
    setFlaggedQuestions(newFlags);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const totalQuestions = attemptData?.totalQuestions || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  const isLowTime = timeRemaining < 600; // Less than 10 minutes

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#0F111A' }}>
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-400">Preparing your exam environment...</p>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestionIndex];
  if (!attemptData || !currentQuestionData) return null;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />



      {/* Header */}
      <header className="relative z-10 border-b flex-shrink-0" style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: '0'
      }}>
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {attemptData.examTitle}
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                isLowTime 
                  ? 'bg-red-500/10 border-red-500/30 animate-pulse' 
                  : 'bg-blue-500/10 border-blue-500/30'
              }`}>
                <Clock className={`w-5 h-5 ${isLowTime ? 'text-red-400' : 'text-blue-400'}`} />
                <span className={`${isLowTime ? 'text-red-400' : 'text-blue-400'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                  {formatTime(timeRemaining)}
                </span>
              </div>

              {/* Submit Button */}
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/20 transition"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Submit Exam
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative z-10">
        <div className="max-w-[1600px] mx-auto h-full px-6 py-6">
          <div className="grid grid-cols-[1fr_340px] gap-6 h-full">
            {/* Left Column - Question */}
            <div className="flex flex-col gap-6 overflow-y-auto">
              {/* Question Card */}
              <div className="rounded-2xl border p-8" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                {/* Question Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <span className="text-blue-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        Question {currentQuestionIndex + 1}
                      </span>
                    </div>
                    {flaggedQuestions.has(currentQuestionIndex) && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
                        <Flag className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Flagged
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={toggleFlag}
                    className={`p-2 rounded-lg transition ${
                      flaggedQuestions.has(currentQuestionIndex)
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-white/5 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10'
                    }`}
                  >
                    <Flag className="w-5 h-5" />
                  </button>
                </div>

                {/* Question Text */}
                <div className="mb-8">
                  <h2 className="text-white text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    {currentQuestionData.questionText}
                  </h2>
                </div>

                {/* Image */}
                {currentQuestionData.questionImageUrl && (
                  <div className="mb-8">
                    <ImageWithFallback
                      src={currentQuestionData.questionImageUrl}
                      alt="Question Image"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  {(currentQuestionData.questionType === 'mcq_single' || 
                    currentQuestionData.questionType === 'mcq_multiple' || 
                    currentQuestionData.questionType === 'true_false') ? (
                    currentQuestionData.choices.map((choice) => (
                      <button
                        key={choice.choiceId}
                        onClick={() => handleAnswerSelect(choice.choiceId)}
                        className={`w-full text-left p-5 rounded-xl border-2 transition group ${
                          selectedChoices.includes(choice.choiceId)
                            ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                            : 'border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                            selectedChoices.includes(choice.choiceId)
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-500 group-hover:border-blue-400'
                          }`}>
                            {selectedChoices.includes(choice.choiceId) && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                          <span className={`text-lg transition ${
                            selectedChoices.includes(choice.choiceId) ? 'text-white' : 'text-gray-300 group-hover:text-white'
                          }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                            {choice.text}
                          </span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full h-64 p-6 rounded-xl border-2 border-white/10 bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition resize-none"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px' }}
                    />
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-6 rounded-2xl border" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={() => handleNavigate(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border transition disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Previous</span>
                </button>

                <div className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {Object.keys(answers).length} of {totalQuestions} answered
                </div>

                <button
                  onClick={() => {
                    if (currentQuestionIndex === totalQuestions - 1) {
                      setShowSubmitConfirm(true);
                    } else {
                      handleNavigate(currentQuestionIndex + 1);
                    }
                  }}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{currentQuestionIndex === totalQuestions - 1 ? 'Finish' : 'Next'}</span>
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-6 overflow-y-auto">
              {/* Webcam Preview */}
              <div className="rounded-2xl border overflow-hidden" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        AI Monitoring Active
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      <span className="text-red-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        LIVE
                      </span>
                    </div>
                  </div>
                </div>
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              </div>

              {/* Question Navigator */}
              <div className="rounded-2xl border p-5" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <h3 className="text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Questions
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: totalQuestions }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigate(index)}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm transition relative ${
                        currentQuestionIndex === index
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : answers[questions[index]?.questionId]
                          ? 'border-green-500/50 bg-green-500/20 text-green-400 hover:border-green-500'
                          : 'border-white/20 bg-white/5 text-gray-400 hover:border-white/40 hover:bg-white/10'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                    >
                      {index + 1}
                      {flaggedQuestions.has(index) && (
                        <Flag className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1" fill="currentColor" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-5 border-t space-y-3" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Answered</span>
                    <span className="text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {Object.keys(answers).length}/{totalQuestions}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Flagged</span>
                    <span className="text-yellow-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {flaggedQuestions.size}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Remaining</span>
                    <span className="text-gray-300" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {totalQuestions - Object.keys(answers).length}
                    </span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
          <div className="rounded-2xl border p-8 max-w-md w-full" style={{
            backgroundColor: 'rgba(30, 30, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            <div className="w-14 h-14 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7 text-yellow-400" />
            </div>
            <h3 className="text-white text-xl text-center mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Submit Exam?
            </h3>
            <p className="text-gray-400 text-center mb-6">
              {(() => {
                const currentQuestion = questions[currentQuestionIndex];
                const currentHasAnswer = currentQuestion && (
                  selectedChoices.length > 0 || answerText.trim().length > 0
                );
                // Count saved answers + current unsaved answer if it exists and isn't already saved
                const savedCount = Object.keys(answers).length;
                const currentIsSaved = currentQuestion && answers[currentQuestion.questionId] !== undefined;
                const effectiveAnsweredCount = savedCount + (currentHasAnswer && !currentIsSaved ? 1 : 0);
                const remaining = totalQuestions - effectiveAnsweredCount;
                return (
                  <>
                    You have answered {effectiveAnsweredCount} out of {totalQuestions} questions.
                    {remaining > 0 && (
                      <span className="block mt-2 text-yellow-400">
                        {remaining} question{remaining !== 1 ? 's' : ''} remain unanswered.
                      </span>
                    )}
                  </>
                );
              })()}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl border transition text-white hover:bg-white/5"
                style={{ borderColor: 'rgba(255, 255, 255, 0.2)', fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
              >
                Continue Exam
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/20 transition"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Modal */}
      {showScoreModal && submissionResult && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
          <div className="rounded-3xl border p-10 max-w-lg w-full text-center relative overflow-hidden animate-in fade-in zoom-in duration-300" style={{
            backgroundColor: 'rgba(30, 30, 35, 0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255, 255, 255, 0.1)'
          }}>
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-white text-3xl mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Exam Completed!
              </h2>
              <p className="text-gray-400 mb-10">Great job completing your assessment.</p>
              
              <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Total Score</div>
                  <div className="text-white text-2xl" style={{ fontWeight: 700 }}>
                    {submissionResult.score} <span className="text-gray-500 text-lg">/ {submissionResult.totalPoints}</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <div className="text-gray-500 text-xs uppercase tracking-wider mb-2" style={{ fontWeight: 600 }}>Percentage</div>
                  <div className="text-green-400 text-2xl" style={{ fontWeight: 700 }}>
                    {submissionResult.percentage}%
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/student')}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98]"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px' }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}