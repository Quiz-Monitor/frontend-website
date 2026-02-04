import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight, Camera, Monitor, Shield, Flag, Eye, Brain, X, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const mockQuestions = [
  {
    id: 1,
    question: 'What is the derivative of f(x) = 3x² + 2x - 5?',
    options: [
      '6x + 2',
      '3x + 2',
      '6x - 5',
      '3x² + 2'
    ],
    correctAnswer: 0
  },
  {
    id: 2,
    question: 'Evaluate the limit: lim(x→0) (sin x)/x',
    options: [
      '0',
      '1',
      '∞',
      'Does not exist'
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: 'Based on the geometric diagram below, calculate the area of the triangle:',
    image: 'https://images.unsplash.com/photo-1727522974599-0e4a9c2a5a73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnZW9tZXRyeSUyMHRyaWFuZ2xlJTIwZGlhZ3JhbXxlbnwxfHx8fDE3NjQ1NTgwNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    options: [
      '24 cm²',
      '36 cm²',
      '48 cm²',
      '52 cm²'
    ],
    correctAnswer: 2
  },
  {
    id: 4,
    question: 'What is the integral of f(x) = 2x?',
    options: [
      'x² + C',
      '2x² + C',
      'x²/2 + C',
      '2x + C'
    ],
    correctAnswer: 0
  },
  {
    id: 5,
    question: 'Find the critical points of f(x) = x³ - 3x + 1',
    options: [
      'x = -1, x = 1',
      'x = 0, x = 3',
      'x = -1, x = 0',
      'x = 1, x = 3'
    ],
    correctAnswer: 0
  },
  {
    id: 6,
    question: 'What is the second derivative of f(x) = e^x?',
    options: [
      'e^x',
      'xe^x',
      '2e^x',
      '0'
    ],
    correctAnswer: 0
  },
  {
    id: 7,
    question: 'Calculate the area under the curve y = x² from x = 0 to x = 2',
    options: [
      '8/3',
      '4',
      '2',
      '16/3'
    ],
    correctAnswer: 0
  },
  {
    id: 8,
    question: 'What is the slope of the tangent line to y = ln(x) at x = e?',
    options: [
      '1/e',
      'e',
      '1',
      'ln(e)'
    ],
    correctAnswer: 0
  },
  {
    id: 9,
    question: 'Solve the differential equation: dy/dx = 2x',
    options: [
      'y = x² + C',
      'y = 2x + C',
      'y = x²/2 + C',
      'y = 2x² + C'
    ],
    correctAnswer: 0
  },
  {
    id: 10,
    question: 'Find the maximum value of f(x) = -x² + 4x - 3',
    options: [
      '1',
      '2',
      '3',
      '4'
    ],
    correctAnswer: 0
  }
];

interface AIAlert {
  id: number;
  message: string;
  type: 'warning' | 'critical';
  timestamp: Date;
}

export function ExamInterface() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [timeRemaining, setTimeRemaining] = useState(7200); // 120 minutes
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [aiAlerts, setAiAlerts] = useState<AIAlert[]>([]);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Simulate AI violations (for demo)
    const violations = [
      { message: 'Multiple faces detected in camera feed', type: 'warning' as const, delay: 15000 },
      { message: 'Tab switch detected - Suspicious activity logged', type: 'critical' as const, delay: 35000 },
      { message: 'Mobile device detected in frame', type: 'critical' as const, delay: 55000 },
      { message: 'Looking away from screen - Attention warning', type: 'warning' as const, delay: 75000 }
    ];

    const timeouts = violations.map(v => 
      setTimeout(() => {
        const newAlert: AIAlert = {
          id: Date.now(),
          message: v.message,
          type: v.type,
          timestamp: new Date()
        };
        setAiAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }, v.delay)
    );

    return () => {
      clearInterval(timer);
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleAnswerSelect = (optionIndex: number) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex
    });
  };

  const handleSubmitExam = () => {
    navigate('/student');
  };

  const toggleFlag = () => {
    const newFlags = new Set(flaggedQuestions);
    if (newFlags.has(currentQuestion)) {
      newFlags.delete(currentQuestion);
    } else {
      newFlags.add(currentQuestion);
    }
    setFlaggedQuestions(newFlags);
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const progress = ((Object.keys(answers).length) / mockQuestions.length) * 100;
  const isLowTime = timeRemaining < 600; // Less than 10 minutes

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Top AI Alert Banner */}
      {aiAlerts.length > 0 && (
        <div className={`fixed top-0 left-0 right-0 z-50 border-b animate-pulse ${
          aiAlerts[0].type === 'critical' 
            ? 'bg-red-500/20 border-red-500/50' 
            : 'bg-yellow-500/20 border-yellow-500/50'
        }`} style={{ backdropFilter: 'blur(20px)' }}>
          <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                aiAlerts[0].type === 'critical' ? 'bg-red-500/20' : 'bg-yellow-500/20'
              }`}>
                <AlertTriangle className={`w-5 h-5 ${
                  aiAlerts[0].type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                }`} />
              </div>
              <div>
                <div className={`text-xs uppercase tracking-wider mb-0.5 ${
                  aiAlerts[0].type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {aiAlerts[0].type === 'critical' ? '⚠️ CRITICAL VIOLATION' : '⚡ AI WARNING'}
                </div>
                <div className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  {aiAlerts[0].message}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setAiAlerts(prev => prev.slice(1))}
              className="text-gray-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative z-10 border-b flex-shrink-0" style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        marginTop: aiAlerts.length > 0 ? '72px' : '0'
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
                    Advanced Mathematics - Final Exam
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Question {currentQuestion + 1} of {mockQuestions.length}
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
                        Question {currentQuestion + 1}
                      </span>
                    </div>
                    {flaggedQuestions.has(currentQuestion) && (
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
                      flaggedQuestions.has(currentQuestion)
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
                    {mockQuestions[currentQuestion].question}
                  </h2>
                </div>

                {/* Image */}
                {mockQuestions[currentQuestion].image && (
                  <div className="mb-8">
                    <ImageWithFallback
                      src={mockQuestions[currentQuestion].image}
                      alt="Geometric Diagram"
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  {mockQuestions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition group ${
                        answers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                          : 'border-white/10 hover:border-blue-500/50 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition ${
                          answers[currentQuestion] === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-500 group-hover:border-blue-400'
                        }`}>
                          {answers[currentQuestion] === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className={`text-lg transition ${
                          answers[currentQuestion] === index ? 'text-white' : 'text-gray-300 group-hover:text-white'
                        }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                          {option}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-6 rounded-2xl border" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border transition disabled:opacity-50 disabled:cursor-not-allowed text-white hover:bg-white/10"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Previous</span>
                </button>

                <div className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {Object.keys(answers).length} of {mockQuestions.length} answered
                </div>

                <button
                  onClick={() => setCurrentQuestion(Math.min(mockQuestions.length - 1, currentQuestion + 1))}
                  disabled={currentQuestion === mockQuestions.length - 1}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
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
                        AI Monitoring
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
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                  <Camera className="w-16 h-16 text-gray-600" />
                  <div className="absolute inset-0 border-2 border-blue-500/30 animate-pulse" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50" style={{ backdropFilter: 'blur(10px)' }}>
                      <Eye className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        Face Detected
                      </span>
                    </div>
                  </div>
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
                  {mockQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm transition relative ${
                        currentQuestion === index
                          ? 'border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                          : answers[index] !== undefined
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
                      {Object.keys(answers).length}/{mockQuestions.length}
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
                      {mockQuestions.length - Object.keys(answers).length}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Alerts History */}
              {aiAlerts.length > 0 && (
                <div className="rounded-2xl border p-5" style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <h3 className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Activity Log
                    </h3>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {aiAlerts.map(alert => (
                      <div 
                        key={alert.id}
                        className={`p-3 rounded-lg border ${
                          alert.type === 'critical' 
                            ? 'bg-red-500/10 border-red-500/30' 
                            : 'bg-yellow-500/10 border-yellow-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <AlertCircle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                            alert.type === 'critical' ? 'text-red-400' : 'text-yellow-400'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-relaxed ${
                              alert.type === 'critical' ? 'text-red-300' : 'text-yellow-300'
                            }`} style={{ fontFamily: 'Inter, sans-serif' }}>
                              {alert.message}
                            </p>
                            <p className="text-gray-500 text-xs mt-1">
                              {alert.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
              You have answered {Object.keys(answers).length} out of {mockQuestions.length} questions.
              {mockQuestions.length - Object.keys(answers).length > 0 && (
                <span className="block mt-2 text-yellow-400">
                  {mockQuestions.length - Object.keys(answers).length} questions remain unanswered.
                </span>
              )}
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
    </div>
  );
}