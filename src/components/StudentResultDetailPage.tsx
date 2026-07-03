import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, AlertTriangle, User, Loader2, BookOpen
} from 'lucide-react';
import {
  getStudentWrittenAnswers,
  gradeStudentWrittenAnswers,
  StudentWrittenAnswersResponse,
  StudentWrittenAnswer,
} from '../services/examService';
import { toast } from 'sonner';
import { InstructorSidebar } from './InstructorSidebar';

export function StudentResultDetailPage() {
  const navigate = useNavigate();
  const { examId, studentId } = useParams();

  const [data, setData] = useState<StudentWrittenAnswersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Per-answer grading state
  const [scores, setScores] = useState<Record<number, number>>({});
  const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});

  useEffect(() => {
    const load = async () => {
      if (!examId || !studentId) return;
      try {
        setIsLoading(true);
        const response = await getStudentWrittenAnswers(Number(examId), Number(studentId));
        setData(response);
        // Pre-populate scores & feedbacks from existing grading
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
    const clamped = Math.min(maxPoints, Math.max(0, newScore));
    setScores((prev) => ({ ...prev, [answerId]: clamped }));
  };

  const handleFeedbackChange = (answerId: number, text: string) => {
    setFeedbacks((prev) => ({ ...prev, [answerId]: text }));
  };

  const buildPayload = () =>
    (data?.writtenAnswers ?? []).map((a) => ({
      answerId: a.answerId,
      score: scores[a.answerId] ?? 0,
      feedback: feedbacks[a.answerId] ?? '',
    }));

  const handleSave = async () => {
    if (!examId || !studentId) return;
    setIsSaving(true);
    try {
      await gradeStudentWrittenAnswers(Number(examId), Number(studentId), {
        grades: buildPayload(),
      });
      toast.success('Grades saved successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save grades');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!examId || !studentId) return;
    setIsPublishing(true);
    try {
      const result = await gradeStudentWrittenAnswers(Number(examId), Number(studentId), {
        grades: buildPayload(),
      });
      const s = result.attemptScoreSummary;
      toast.success(
        `Results published! Final: ${s.finalScore} (MCQ: ${s.mcqScore} + Written: ${s.manualScore})`
      );
      navigate(`/instructor/exam-results/${examId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish results');
    } finally {
      setIsPublishing(false);
    }
  };

  const totalAwarded = Object.values(scores).reduce((s, v) => s + v, 0);
  const totalPoints = data?.summary.totalWrittenPoints ?? 0;
  const gradedCount = data?.summary.gradedCount ?? 0;
  const ungradedCount = data?.summary.ungradedCount ?? 0;
  const totalQuestions = data?.summary.totalWrittenQuestions ?? 0;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <InstructorSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 relative z-10 overflow-hidden flex flex-col"
        style={{ 
          marginLeft: 'var(--sidebar-width)',
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        {/* Sticky Header */}
        <header
          className="border-b sticky top-0 z-20"
          style={{
            backgroundColor: 'rgba(15, 17, 26, 0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <div className="px-8 py-6">
            <button
              onClick={() => navigate(`/instructor/exam-results/${examId}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                Back to Student List
              </span>
            </button>

            {isLoading ? (
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-white/5 animate-pulse" />
                <div className="space-y-3">
                  <div className="w-52 h-6 rounded bg-white/5 animate-pulse" />
                  <div className="w-36 h-4 rounded bg-white/5 animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Student Info */}
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {data?.studentName ?? `Student #${studentId}`}
                      </h1>
                      {/* Status badge */}
                      {ungradedCount > 0 ? (
                        <div className="px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                          <span
                            className="text-yellow-400 text-sm uppercase tracking-wide"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                          >
                            {ungradedCount} Ungraded
                          </span>
                        </div>
                      ) : data ? (
                        <div className="px-3 py-1 rounded-lg bg-green-500/20 border border-green-500/50">
                          <span
                            className="text-green-400 text-sm uppercase tracking-wide"
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                          >
                            Fully Graded
                          </span>
                        </div>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400 flex-wrap">
                      <span>Exam: {data?.examTitle}</span>
                      <span>•</span>
                      <span>Status: <span className="text-white">{data?.attemptStatus}</span></span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-3">
                  <div className="text-center px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Graded
                    </div>
                    <div
                      className="text-green-400 text-xl"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                    >
                      {gradedCount}/{totalQuestions}
                    </div>
                  </div>
                  <div className="text-center px-5 py-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-gray-400 text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Points
                    </div>
                    <div
                      className="text-blue-400 text-xl"
                      style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                    >
                      {totalAwarded}/{totalPoints}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main className="p-8">
          <div className="max-w-5xl mx-auto">
            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-28 text-gray-400">
                <Loader2 className="w-12 h-12 animate-spin mb-4" />
                <p style={{ fontFamily: 'Inter, sans-serif' }}>Loading student's written answers…</p>
              </div>
            )}

            {/* No written answers */}
            {!isLoading && data && data.writtenAnswers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-28 text-gray-400">
                <BookOpen className="w-16 h-16 mb-4 opacity-40" />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  No Written Answers
                </h3>
                <p style={{ fontFamily: 'Inter, sans-serif' }}>
                  This student has no essay / written questions to grade.
                </p>
              </div>
            )}

            {/* Grading UI */}
            {!isLoading && data && data.writtenAnswers.length > 0 && (
              <>
                {/* Progress banner */}
                {ungradedCount > 0 && (
                  <div
                    className="mb-6 rounded-2xl border p-6"
                    style={{
                      backgroundColor: 'rgba(234,179,8,0.08)',
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(234,179,8,0.3)',
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center animate-pulse">
                        <AlertTriangle className="w-7 h-7 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-yellow-400 text-lg mb-1"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                        >
                          {ungradedCount} Answer{ungradedCount > 1 ? 's' : ''} Still Need Grading
                        </h3>
                        <p className="text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Assign a score and optional feedback for each written answer, then publish results.
                        </p>
                      </div>
                      {/* Progress bar */}
                      <div className="w-32 hidden sm:block">
                        <div className="text-xs text-gray-400 mb-1 text-right" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {gradedCount}/{totalQuestions}
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${totalQuestions > 0 ? (gradedCount / totalQuestions) * 100 : 0}%`,
                              background: 'linear-gradient(90deg, #eab308, #22c55e)',
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Answer Cards */}
                <div className="space-y-6">
                  {[...data.writtenAnswers]
                    .sort((a, b) => a.orderNumber - b.orderNumber)
                    .map((answer: StudentWrittenAnswer, index: number) => {
                      const currentScore = scores[answer.answerId] ?? 0;
                      const currentFeedback = feedbacks[answer.answerId] ?? '';
                      const pct = answer.points > 0 ? (currentScore / answer.points) * 100 : 0;
                      const alreadyGraded = answer.isManuallyGraded;

                      return (
                        <div
                          key={answer.answerId}
                          className="rounded-2xl border overflow-hidden"
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            backdropFilter: 'blur(12px)',
                            borderColor: alreadyGraded
                              ? 'rgba(34,197,94,0.25)'
                              : 'rgba(255,255,255,0.08)',
                          }}
                        >
                          {/* Card Top Bar */}
                          <div
                            className="px-6 py-4 border-b flex items-center justify-between"
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.03)',
                              borderColor: 'rgba(255,255,255,0.07)',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                                <Hash className="w-4 h-4 text-blue-400" />
                              </div>
                              <div>
                                <span
                                  className="text-white text-sm"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  Question {index + 1}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Clock className="w-3 h-3 text-gray-500" />
                                  <span
                                    className="text-gray-500 text-xs"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    {Math.floor(answer.timeSpentSeconds / 60)}m {answer.timeSpentSeconds % 60}s spent
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {alreadyGraded ? (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30">
                                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                                  <span
                                    className="text-green-400 text-xs"
                                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                                  >
                                    Graded
                                  </span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 border border-yellow-500/30 animate-pulse">
                                  <PenLine className="w-3.5 h-3.5 text-yellow-400" />
                                  <span
                                    className="text-yellow-400 text-xs"
                                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                                  >
                                    Needs Grading
                                  </span>
                                </div>
                              )}
                              <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                                <span
                                  className="text-blue-400 text-sm"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                                >
                                  {currentScore}/{answer.points} pts
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-6 space-y-5">
                            {/* Question Text */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-purple-400" />
                                <span
                                  className="text-gray-400 text-xs uppercase tracking-wider"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  Question
                                </span>
                              </div>
                              <p
                                className="text-white leading-relaxed"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
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
                            <div
                              className="rounded-xl border p-5"
                              style={{
                                backgroundColor: 'rgba(59,130,246,0.05)',
                                borderColor: 'rgba(59,130,246,0.2)',
                              }}
                            >
                              <div className="flex items-center gap-2 mb-3">
                                <User className="w-4 h-4 text-blue-400" />
                                <span
                                  className="text-blue-400 text-xs uppercase tracking-wider"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  Student's Answer
                                </span>
                              </div>
                              {answer.answerText ? (
                                <p
                                  className="text-gray-100 leading-relaxed whitespace-pre-wrap"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  {answer.answerText}
                                </p>
                              ) : (
                                <p
                                  className="text-gray-500 italic"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  No answer provided
                                </p>
                              )}
                            </div>

                            {/* Score Assignment */}
                            <div
                              className="rounded-xl border p-5"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                borderColor: 'rgba(255,255,255,0.08)',
                              }}
                            >
                              <div className="flex items-center gap-2 mb-4">
                                <Star className="w-4 h-4 text-yellow-400" />
                                <span
                                  className="text-gray-300 text-sm"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  Score Assignment
                                </span>
                              </div>

                              {/* Score bar */}
                              <div className="mb-4">
                                <div className="w-full h-2 rounded-full bg-white/10 mb-1">
                                  <div
                                    className="h-2 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${pct}%`,
                                      background:
                                        pct >= 80
                                          ? 'linear-gradient(90deg,#22c55e,#16a34a)'
                                          : pct >= 50
                                          ? 'linear-gradient(90deg,#eab308,#ca8a04)'
                                          : 'linear-gradient(90deg,#ef4444,#dc2626)',
                                    }}
                                  />
                                </div>
                                <div
                                  className="text-right text-xs text-gray-500"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  {pct.toFixed(0)}%
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <span
                                  className="text-gray-400 text-sm"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                >
                                  Points (0 – {answer.points}):
                                </span>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() =>
                                      handleScoreChange(answer.answerId, currentScore - 1, answer.points)
                                    }
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
                                    onChange={(e) =>
                                      handleScoreChange(answer.answerId, Number(e.target.value), answer.points)
                                    }
                                    className="w-20 text-center rounded-lg border text-white focus:outline-none focus:border-blue-500 transition"
                                    style={{
                                      backgroundColor: 'rgba(59,130,246,0.15)',
                                      borderColor: 'rgba(59,130,246,0.4)',
                                      fontFamily: 'Inter, sans-serif',
                                      fontWeight: 700,
                                      fontSize: '1.1rem',
                                      padding: '0.4rem',
                                    }}
                                  />
                                  <button
                                    onClick={() =>
                                      handleScoreChange(answer.answerId, currentScore + 1, answer.points)
                                    }
                                    disabled={currentScore === answer.points}
                                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                                  >
                                    +
                                  </button>
                                  <span
                                    className="text-gray-500 text-sm ml-1"
                                    style={{ fontFamily: 'Inter, sans-serif' }}
                                  >
                                    / {answer.points}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Feedback */}
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="w-4 h-4 text-purple-400" />
                                <span
                                  className="text-gray-400 text-xs uppercase tracking-wider"
                                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                                >
                                  Instructor Feedback (optional)
                                </span>
                              </div>
                              <textarea
                                value={currentFeedback}
                                onChange={(e) => handleFeedbackChange(answer.answerId, e.target.value)}
                                placeholder="Add feedback for the student about this answer…"
                                rows={3}
                                className="w-full rounded-xl border text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 transition resize-none"
                                style={{
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  borderColor: 'rgba(255,255,255,0.1)',
                                  fontFamily: 'Inter, sans-serif',
                                  padding: '0.875rem 1rem',
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
                    onClick={handleSave}
                    disabled={isSaving || isPublishing}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {isSaving ? 'Saving…' : 'Save Grades'}
                    </span>
                  </button>
                  <button
                    onClick={handlePublish}
                    disabled={isPublishing || isSaving}
                    className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {isPublishing ? 'Submitting…' : 'Submit & Publish Results'}
                    </span>
                  </button>
                </div>

                {/* Score Summary Footer */}
                <div
                  className="mt-6 rounded-2xl border p-6"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderColor: 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-yellow-400" />
                      <span
                        className="text-white"
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                      >
                        Written Section Total
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div
                          className="text-gray-400 text-xs mb-0.5"
                          style={{ fontFamily: 'Inter, sans-serif' }}
                        >
                          Awarded
                        </div>
                        <div
                          className="text-2xl text-white"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                        >
                          {totalAwarded}
                          <span className="text-gray-500 text-lg">/{totalPoints}</span>
                        </div>
                      </div>
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center border ${
                          totalPoints > 0 && totalAwarded / totalPoints >= 0.8
                            ? 'bg-green-500/20 border-green-500/50'
                            : totalPoints > 0 && totalAwarded / totalPoints >= 0.5
                            ? 'bg-yellow-500/20 border-yellow-500/50'
                            : 'bg-red-500/20 border-red-500/50'
                        }`}
                      >
                        <span
                          className={`text-xl ${
                            totalPoints > 0 && totalAwarded / totalPoints >= 0.8
                              ? 'text-green-400'
                              : totalPoints > 0 && totalAwarded / totalPoints >= 0.5
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                        >
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