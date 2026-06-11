import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Award, AlertTriangle, CheckCircle, User, Brain, 
  FileText, LayoutDashboard, Database, Settings, HelpCircle, LogOut,
  Send, Save, Loader2, MessageSquare, Star, BookOpen, Hash
} from 'lucide-react';
import { 
  getStudentWrittenAnswers, 
  gradeStudentWrittenAnswers,
  StudentWrittenAnswersResponse,
  StudentWrittenAnswer
} from '../services/examService';
import { toast } from 'sonner';

export function InstructorReviewExamPage() {
  const navigate = useNavigate();
  const { examId, studentId } = useParams();
  const [activeSection, setActiveSection] = useState('results');
  const [data, setData] = useState<StudentWrittenAnswersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Per-answer state: score and feedback
  const [scores, setScores] = useState<Record<number, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results Database', icon: Database },
  ];

  const utilityItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  useEffect(() => {
    const load = async () => {
      if (!examId || !studentId) return;
      try {
        setIsLoading(true);
        const response = await getStudentWrittenAnswers(Number(examId), Number(studentId));
        setData(response);
        // Initialize scores and feedbacks from existing data
        const initScores: Record<number, number> = {};
        const initFeedbacks: Record<number, string> = {};
        response.writtenAnswers.forEach((a) => {
          initScores[a.answerId] = a.score ?? 0;
          initFeedbacks[a.answerId] = a.instructorFeedback ?? '';
        });
        setScores(initScores);
        setFeedbacks(initFeedbacks);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load student answers');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [examId, studentId]);

  const handleScoreChange = (answerId: number, newScore: number, maxPoints: number) => {
    if (newScore >= 0 && newScore <= maxPoints) {
      setScores(prev => ({ ...prev, [answerId]: newScore }));
    }
  };

  const handleFeedbackChange = (answerId: number, text: string) => {
    setFeedbacks(prev => ({ ...prev, [answerId]: text }));
  };

  const buildGradesPayload = () => {
    return (data?.writtenAnswers ?? []).map((a) => ({
      answerId: a.answerId,
      score: scores[a.answerId] ?? 0,
      feedback: feedbacks[a.answerId] ?? '',
    }));
  };

  const handleSaveChanges = async () => {
    if (!examId || !studentId) return;
    setIsSaving(true);
    try {
      await gradeStudentWrittenAnswers(Number(examId), Number(studentId), {
        grades: buildGradesPayload(),
      });
      toast.success('Grades saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save grades');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishResults = async () => {
    if (!examId || !studentId) return;
    setIsPublishing(true);
    try {
      const result = await gradeStudentWrittenAnswers(Number(examId), Number(studentId), {
        grades: buildGradesPayload(),
      });
      const summary = result.attemptScoreSummary;
      toast.success(
        `Results published! Final score: ${summary.finalScore} (MCQ: ${summary.mcqScore} + Manual: ${summary.manualScore})`
      );
      navigate(`/instructor/exam-results/${examId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish results');
    } finally {
      setIsPublishing(false);
    }
  };

  const totalAwarded = data ? Object.values(scores).reduce((s, v) => s + v, 0) : 0;
  const totalPoints = data?.summary.totalWrittenPoints ?? 0;
  const ungradedCount = data?.summary.ungradedCount ?? 0;
  const gradedCount = data?.summary.gradedCount ?? 0;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-[250px] flex-shrink-0 border-r relative z-10" style={{ 
        backgroundColor: 'rgba(15, 17, 26, 0.6)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }}>
        <div className="h-full flex flex-col">
          {/* Header - Brand Logo */}
          <div className="px-6 pt-8 pb-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                <Brain className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-white tracking-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ExamGuard
                </span>
                <span className="text-xs text-blue-400">AI Platform</span>
              </div>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-4 pt-2">
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (item.id === 'dashboard') navigate('/instructor');
                      else if (item.id === 'exams') navigate('/instructor/exams');
                      else if (item.id === 'results') navigate('/instructor/results-database');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon 
                      className={`w-5 h-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'
                      }`} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: isActive ? 600 : 400 }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="my-6 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

            <div className="space-y-1">
              {utilityItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (item.id === 'settings') navigate('/instructor/settings');
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile Footer */}
          <div className="p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="flex items-center gap-3 px-3 py-3 rounded-lg group hover:bg-white/5 transition cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">JD</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2" style={{ borderColor: '#0F111A' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm truncate" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Dr. John Davis
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400">Pro Plan</span>
                  <div className="px-1.5 py-0.5 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded text-xs text-yellow-400 border border-yellow-500/30">
                    PRO
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition">
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-y-auto">
        {/* Sticky Header */}
        <header className="border-b sticky top-0 z-20" style={{ 
          backgroundColor: 'rgba(15, 17, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="px-8 py-6">
            <button
              onClick={() => navigate(`/instructor/exam-results/${examId}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Back to Student List</span>
            </button>

            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/5 animate-pulse" />
                <div className="space-y-2">
                  <div className="w-48 h-6 rounded bg-white/5 animate-pulse" />
                  <div className="w-32 h-4 rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {data?.studentName ?? `Student #${studentId}`}
                      </h1>
                      {ungradedCount > 0 && (
                        <div className="px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                          <span className="text-yellow-400 text-sm uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {ungradedCount} Ungraded
                          </span>
                        </div>
                      )}
                      {ungradedCount === 0 && data && (
                        <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/50">
                          <span className="text-green-400 text-sm uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            All Graded
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>Exam: {data?.examTitle}</span>
                      <span>•</span>
                      <span>Attempt Status: {data?.attemptStatus}</span>
                    </div>
                  </div>
                </div>

                {/* Score Display */}
                <div className="flex items-center gap-8">
                  {/* Summary cards */}
                  <div className="flex items-center gap-4">
                    <div className="text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Graded</div>
                      <div className="text-green-400 text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        {gradedCount}/{data?.summary.totalWrittenQuestions ?? 0}
                      </div>
                    </div>
                    <div className="text-center px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Points Awarded</div>
                      <div className="text-blue-400 text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        {totalAwarded}/{totalPoints}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p style={{ fontFamily: 'Inter, sans-serif' }}>Loading student answers...</p>
              </div>
            ) : !data || data.writtenAnswers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                <BookOpen className="w-16 h-16 mb-4 opacity-50" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>No Written Answers</h3>
                <p style={{ fontFamily: 'Inter, sans-serif' }}>This student has no essay/written questions to grade.</p>
              </div>
            ) : (
              <>
                {/* Grading progress banner */}
                {ungradedCount > 0 && (
                  <div className="mb-6 rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(234, 179, 8, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(234, 179, 8, 0.3)'
                  }}>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-7 h-7 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-yellow-400 text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {ungradedCount} Answer{ungradedCount > 1 ? 's' : ''} Need Grading
                        </h3>
                        <p className="text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Review each written answer and assign a score (0 – max points) along with optional feedback.
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className="w-32">
                        <div className="text-xs text-gray-400 mb-1 text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {gradedCount}/{data.summary.totalWrittenQuestions}
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all duration-500"
                            style={{ width: `${data.summary.totalWrittenQuestions > 0 ? (gradedCount / data.summary.totalWrittenQuestions) * 100 : 0}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Written Answer Cards */}
                <div className="space-y-6">
                  {data.writtenAnswers
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((answer: StudentWrittenAnswer, index: number) => {
                      const currentScore = scores[answer.answerId] ?? 0;
                      const currentFeedback = feedbacks[answer.answerId] ?? '';
                      const isGraded = answer.isManuallyGraded;
                      const pct = answer.points > 0 ? (currentScore / answer.points) * 100 : 0;

                      return (
                        <div
                          key={answer.answerId}
                          className="rounded-2xl border overflow-hidden"
                          style={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            backdropFilter: 'blur(10px)',
                            borderColor: isGraded ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'
                          }}
                        >
                          {/* Card Header */}
                          <div 
                            className="px-6 py-4 border-b flex items-center justify-between"
                            style={{ 
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              borderColor: 'rgba(255,255,255,0.08)'
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                                <Hash className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <span className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  Question {index + 1}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    Time spent: {Math.floor(answer.timeSpentSeconds / 60)}m {answer.timeSpentSeconds % 60}s
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {isGraded ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                  <span className="text-green-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Graded</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 animate-pulse">
                                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                                  <span className="text-yellow-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Pending</span>
                                </div>
                              )}
                              <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                                <span className="text-blue-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                                  {currentScore}/{answer.points} pts
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 space-y-5">
                            {/* Question text */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                                <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  Question
                                </span>
                              </div>
                              <p className="text-white leading-relaxed" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400 }}>
                                {answer.questionText}
                              </p>
                              {answer.questionImageUrl && (
                                <img 
                                  src={answer.questionImageUrl} 
                                  alt="Question" 
                                  className="mt-3 rounded-xl max-h-48 object-contain border border-white/10"
                                />
                              )}
                            </div>

                            {/* Student Answer */}
                            <div className="rounded-xl border p-5" style={{ 
                              backgroundColor: 'rgba(59, 130, 246, 0.05)',
                              borderColor: 'rgba(59, 130, 246, 0.2)'
                            }}>
                              <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-blue-400" />
                                <span className="text-blue-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  Student's Answer
                                </span>
                              </div>
                              {answer.answerText ? (
                                <p className="text-gray-100 leading-relaxed whitespace-pre-wrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  {answer.answerText}
                                </p>
                              ) : (
                                <p className="text-gray-500 italic" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  No answer provided
                                </p>
                              )}
                            </div>

                            {/* Score Adjustment */}
                            <div className="rounded-xl border p-5" style={{ 
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              borderColor: 'rgba(255,255,255,0.08)'
                            }}>
                              <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span className="text-gray-300 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  Score Assignment
                                </span>
                              </div>

                              {/* Score bar */}
                              <div className="mb-4">
                                <div className="w-full h-2 rounded-full bg-white/10 mb-2">
                                  <div 
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{ 
                                      width: `${pct}%`,
                                      background: pct >= 80 ? 'linear-gradient(90deg, #22c55e, #16a34a)' 
                                               : pct >= 50 ? 'linear-gradient(90deg, #eab308, #ca8a04)'
                                               : 'linear-gradient(90deg, #ef4444, #dc2626)'
                                    }}
                                  />
                                </div>
                                <div className="text-right text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  {pct.toFixed(0)}%
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                                  Points (0 – {answer.points}):
                                </span>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleScoreChange(answer.answerId, Math.max(0, currentScore - 1), answer.points)}
                                    disabled={currentScore === 0}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                                  >
                                    −
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    max={answer.points}
                                    value={currentScore}
                                    onChange={(e) => handleScoreChange(answer.answerId, Number(e.target.value), answer.points)}
                                    className="w-20 text-center rounded-lg border text-white focus:outline-none focus:border-blue-500 transition"
                                    style={{ 
                                      backgroundColor: 'rgba(59,130,246,0.15)',
                                      borderColor: 'rgba(59,130,246,0.4)',
                                      fontFamily: 'Inter, sans-serif',
                                      fontWeight: 700,
                                      fontSize: '1.1rem',
                                      padding: '0.4rem'
                                    }}
                                  />
                                  <button
                                    onClick={() => handleScoreChange(answer.answerId, Math.min(answer.points, currentScore + 1), answer.points)}
                                    disabled={currentScore === answer.points}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                                  >
                                    +
                                  </button>
                                  <span className="text-gray-500 text-sm ml-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                                    / {answer.points}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Feedback */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-purple-400" />
                                <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  Instructor Feedback (optional)
                                </span>
                              </div>
                              <textarea
                                value={currentFeedback}
                                onChange={(e) => handleFeedbackChange(answer.answerId, e.target.value)}
                                placeholder="Add feedback for the student about this answer..."
                                rows={3}
                                className="w-full rounded-xl border text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                                style={{ 
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  borderColor: 'rgba(255,255,255,0.1)',
                                  fontFamily: 'Inter, sans-serif',
                                  padding: '0.875rem 1rem'
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving || isPublishing}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {isSaving ? 'Saving...' : 'Save Grades'}
                    </span>
                  </button>
                  <button
                    onClick={handlePublishResults}
                    disabled={isPublishing || isSaving}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {isPublishing ? 'Submitting...' : 'Submit & Publish Results'}
                    </span>
                  </button>
                </div>

                {/* Score summary footer */}
                <div className="mt-6 rounded-2xl border p-6" style={{ 
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  borderColor: 'rgba(255,255,255,0.08)'
                }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-yellow-400" />
                      <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        Written Section Total
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-gray-400 text-xs mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Awarded</div>
                        <div className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          {totalAwarded}
                          <span className="text-gray-500 text-lg">/{totalPoints}</span>
                        </div>
                      </div>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                        totalPoints > 0 && (totalAwarded / totalPoints) >= 0.8 ? 'bg-green-500/20 border-green-500/50' :
                        totalPoints > 0 && (totalAwarded / totalPoints) >= 0.5 ? 'bg-yellow-500/20 border-yellow-500/50' :
                        'bg-red-500/20 border-red-500/50'
                      }`}>
                        <span className={`text-xl ${
                          totalPoints > 0 && (totalAwarded / totalPoints) >= 0.8 ? 'text-green-400' :
                          totalPoints > 0 && (totalAwarded / totalPoints) >= 0.5 ? 'text-yellow-400' :
                          'text-red-400'
                        }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          {totalPoints > 0 ? Math.round((totalAwarded / totalPoints) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}