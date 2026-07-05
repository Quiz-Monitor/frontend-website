import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Search, Users, Clock, Award, CheckCircle,
  User, FileText, Filter, Loader2, AlertTriangle, PenLine,
  Mail, TrendingUp, Shield
} from 'lucide-react';
import { InstructorSidebar } from './InstructorSidebar';
import {
  getSubmittedStudents,
  SubmittedStudent,
  SubmittedStudentsResponse,
} from '../services/examService';
import { toast } from 'sonner';

type FilterType = 'all' | 'needs-grading' | 'graded' | 'no-essays' | 'flagged';

function formatSubmitTime(raw: string | null | undefined): string {
  if (!raw) return '—';
  try {
    return new Date(raw).toLocaleString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return raw;
  }
}

function EssayBadge({ student }: { student: SubmittedStudent }) {
  if (!student.hasWrittenAnswers) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border"
        style={{ backgroundColor: 'rgba(107,114,128,0.15)', borderColor: 'rgba(107,114,128,0.3)', color: '#9ca3af' }}>
        No Essays
      </span>
    );
  }
  if (!student.writtenAnswersGraded) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border animate-pulse"
        style={{ backgroundColor: 'rgba(249,115,22,0.15)', borderColor: 'rgba(249,115,22,0.4)', color: '#fb923c' }}>
        <PenLine className="w-3 h-3" />
        Needs Grading
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border"
      style={{ backgroundColor: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.3)', color: '#4ade80' }}>
      <CheckCircle className="w-3 h-3" />
      Graded
    </span>
  );
}

function CheatingBadge({ status, violations }: { status: string; violations: number }) {
  if (violations === 0 || status.toLowerCase() === 'clean') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
        style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#4ade80' }}>
        <CheckCircle className="w-3 h-3" /> Clean
      </span>
    );
  }
  if (status.toLowerCase() === 'flagged') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
        style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
        <AlertTriangle className="w-3 h-3" /> Flagged ({violations})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
      style={{ backgroundColor: 'rgba(234,179,8,0.15)', color: '#facc15' }}>
      <Shield className="w-3 h-3" /> Warning ({violations})
    </span>
  );
}

export function ExamStudentsListPage() {
  const navigate = useNavigate();
  const { examId } = useParams<{ examId: string }>();
  const [data, setData] = useState<SubmittedStudentsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<FilterType>('all');

  useEffect(() => {
    if (!examId) return;
    setIsLoading(true);
    getSubmittedStudents(Number(examId))
      .then(setData)
      .catch((err: any) => toast.error(err.message || 'Failed to load students'))
      .finally(() => setIsLoading(false));
  }, [examId]);

  const students = data?.students ?? [];

  const filtered = students.filter((s) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      s.studentName.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q);
    let matchesFilter = true;
    if (filterType === 'needs-grading') matchesFilter = s.hasWrittenAnswers && !s.writtenAnswersGraded;
    else if (filterType === 'graded') matchesFilter = !s.hasWrittenAnswers || s.writtenAnswersGraded;
    else if (filterType === 'no-essays') matchesFilter = !s.hasWrittenAnswers;
    else if (filterType === 'flagged') matchesFilter = s.totalViolations > 0;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const totalStudents = students.length;
  const avgScore = totalStudents > 0
    ? (students.reduce((sum, s) => sum + s.finalScore, 0) / totalStudents).toFixed(1)
    : '0.0';
  const passCount = students.filter((s) => s.finalScore >= 60).length;
  const passRate = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;
  const essaysPendingCount = students.filter((s) => s.hasWrittenAnswers && !s.writtenAnswersGraded).length;

  function handleStudentClick(student: SubmittedStudent) {
    // All clicks go to the single grading/review page
    navigate(`/instructor/review-exam/${examId}/${student.studentId}`);
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <InstructorSidebar />

      <div
        className="flex-1 relative z-10 overflow-auto flex flex-col"
        style={{
          marginLeft: 'var(--sidebar-width)',
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <header
          className="border-b sticky top-0 z-20"
          style={{
            backgroundColor: 'rgba(15,17,26,0.95)',
            backdropFilter: 'blur(20px)',
            borderColor: 'rgba(255,255,255,0.1)',
          }}
        >
          <div className="px-8 py-5">
            <button
              onClick={() => navigate('/instructor/results-database')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-3"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Back to Results Database</span>
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-white text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {isLoading ? 'Loading…' : (data?.examTitle ?? `Exam #${examId}`)}
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  {isLoading ? '' : `${data?.totalSubmitted ?? 0} submissions`}
                </p>
              </div>
              {/* Filter tabs */}
              <div className="flex items-center gap-2">
                {(['all', 'needs-grading', 'graded', 'no-essays', 'flagged'] as FilterType[]).map((f) => {
                  const labels: Record<FilterType, string> = {
                    all: 'All',
                    'needs-grading': `Needs Grading${essaysPendingCount > 0 ? ` (${essaysPendingCount})` : ''}`,
                    graded: 'Graded',
                    'no-essays': 'No Essays',
                    flagged: 'Flagged',
                  };
                  const isActive = filterType === f;
                  return (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className="px-3 py-1.5 rounded-lg text-xs transition"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: isActive ? 600 : 400,
                        backgroundColor: isActive ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.05)',
                        color: isActive ? '#818cf8' : '#9ca3af',
                        border: `1px solid ${isActive ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      }}
                    >
                      {labels[f]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search */}
            <div className="mt-4 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email…"
                className="w-full pl-10 pr-4 py-2 rounded-lg text-white placeholder-gray-500 border text-sm focus:outline-none focus:border-indigo-500 transition"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
            </div>
          </div>
        </header>

        <main className="p-8">
          <div className="max-w-7xl mx-auto">

            {/* Essay grading alert */}
            {essaysPendingCount > 0 && (
              <div
                className="mb-6 rounded-2xl border p-5 flex items-center gap-4"
                style={{
                  backgroundColor: 'rgba(249,115,22,0.08)',
                  borderColor: 'rgba(249,115,22,0.3)',
                }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center animate-pulse"
                  style={{ backgroundColor: 'rgba(249,115,22,0.2)' }}>
                  <PenLine className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-orange-400 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {essaysPendingCount} student{essaysPendingCount > 1 ? 's' : ''} waiting for essay grading
                  </p>
                  <p className="text-gray-400 text-sm">
                    Click on a student row to open the grading panel.
                  </p>
                </div>
                <button
                  onClick={() => setFilterType('needs-grading')}
                  className="ml-auto px-4 py-2 rounded-lg text-sm transition hover:opacity-80"
                  style={{
                    backgroundColor: 'rgba(249,115,22,0.2)',
                    color: '#fb923c',
                    border: '1px solid rgba(249,115,22,0.4)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Show pending
                </button>
              </div>
            )}

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <Users className="w-5 h-5 text-blue-400" />, bg: 'rgba(59,130,246,0.15)', value: totalStudents, label: 'Total Students' },
                { icon: <Award className="w-5 h-5 text-green-400" />, bg: 'rgba(34,197,94,0.15)', value: `${avgScore}%`, label: 'Average Score' },
                { icon: <CheckCircle className="w-5 h-5 text-purple-400" />, bg: 'rgba(147,51,234,0.15)', value: `${passRate}%`, label: 'Pass Rate' },
                { icon: <PenLine className="w-5 h-5 text-orange-400" />, bg: 'rgba(249,115,22,0.15)', value: essaysPendingCount, label: 'Essays Pending' },
              ].map(({ icon, bg, value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                    {icon}
                  </div>
                  <div className="text-white text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{value}</div>
                  <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Student table */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* Table header */}
              <div
                className="grid gap-4 px-6 py-3 border-b text-xs uppercase tracking-wider text-gray-500"
                style={{
                  gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 1.2fr',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                }}
              >
                <div>Student</div>
                <div>Submit Time</div>
                <div>MCQ</div>
                <div>Manual</div>
                <div>Final</div>
                <div>Integrity</div>
                <div>Essays</div>
              </div>

              {/* Table body */}
              {isLoading ? (
                <div className="flex items-center justify-center gap-3 py-16 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>Loading students…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No students match your current filters.
                </div>
              ) : (
                filtered.map((student, idx) => (
                  <div
                    key={student.studentId}
                    onClick={() => handleStudentClick(student)}
                    className="grid gap-4 px-6 py-4 cursor-pointer transition-all duration-150 hover:bg-white/5 group"
                    style={{
                      gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr 1fr 1.2fr',
                      borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    {/* Student info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-white text-sm truncate group-hover:text-indigo-300 transition"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                        >
                          {student.studentName}
                        </p>
                        <p className="text-gray-500 text-xs truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          {student.email}
                        </p>
                      </div>
                    </div>

                    {/* Submit time */}
                    <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                      <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                      <span style={{ fontFamily: 'Inter, sans-serif' }}>{formatSubmitTime(student.submitTime)}</span>
                    </div>

                    {/* MCQ Score */}
                    <div className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="text-blue-300 font-semibold">{student.mcqScore ?? '—'}</span>
                    </div>

                    {/* Manual Score */}
                    <div className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="text-purple-300 font-semibold">{student.manualScore ?? '—'}</span>
                    </div>

                    {/* Final Score */}
                    <div className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span
                        className="font-bold"
                        style={{
                          color: student.finalScore >= 90 ? '#4ade80'
                            : student.finalScore >= 70 ? '#60a5fa'
                            : student.finalScore >= 50 ? '#facc15'
                            : '#f87171',
                        }}
                      >
                        {student.finalScore ?? '—'}
                      </span>
                    </div>

                    {/* Integrity */}
                    <div>
                      <CheatingBadge status={student.cheatingStatus} violations={student.totalViolations} />
                    </div>

                    {/* Essay badge */}
                    <div>
                      <EssayBadge student={student} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}