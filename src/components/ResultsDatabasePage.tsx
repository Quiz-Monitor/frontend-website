import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Calendar, Clock, FileText,
  Database, CheckCircle, AlertTriangle, Loader2, PenLine,
  ChevronRight, Copy
} from 'lucide-react';
import { InstructorSidebar } from './InstructorSidebar';
import { getMyExams, Exam } from '../services/examService';
import { toast } from 'sonner';

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function examStatus(exam: Exam): 'upcoming' | 'active' | 'ended' {
  const now = Date.now();
  const start = new Date(exam.startTime).getTime();
  const end = new Date(exam.endTime).getTime();
  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'active';
  return 'ended';
}

export function ResultsDatabasePage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getMyExams()
      .then(setExams)
      .catch((err: any) => toast.error(err.message || 'Failed to load exams'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = exams.filter((e) =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.examCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const endedExams = exams.filter((e) => examStatus(e) === 'ended');
  const activeExams = exams.filter((e) => examStatus(e) === 'active');

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
          <div className="px-8 py-6">
            <h1 className="text-white text-2xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Results Database
            </h1>
            <p className="text-gray-400 text-sm mb-5">
              View submissions and grade essays for your exams
            </p>

            {/* Search */}
            <div className="relative max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                id="results-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search exams by title or code…"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-white placeholder-gray-500 border text-sm focus:outline-none focus:border-indigo-500 transition"
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
          <div className="max-w-6xl mx-auto">
            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: <FileText className="w-5 h-5 text-blue-400" />, bg: 'rgba(59,130,246,0.15)', value: exams.length, label: 'Total Exams' },
                { icon: <CheckCircle className="w-5 h-5 text-green-400" />, bg: 'rgba(34,197,94,0.15)', value: endedExams.length, label: 'Completed' },
                { icon: <AlertTriangle className="w-5 h-5 text-yellow-400" />, bg: 'rgba(234,179,8,0.15)', value: activeExams.length, label: 'Live Now' },
                { icon: <PenLine className="w-5 h-5 text-orange-400" />, bg: 'rgba(249,115,22,0.15)', value: endedExams.length, label: 'Available to Grade' },
              ].map(({ icon, bg, value, label }) => (
                <div
                  key={label}
                  className="rounded-2xl p-5 border"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: bg }}>
                    {icon}
                  </div>
                  <div className="text-white text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {isLoading ? '—' : value}
                  </div>
                  <div className="text-gray-400 text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>

            {/* Exam list */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              {/* Table header */}
              <div
                className="grid gap-4 px-6 py-3 border-b text-xs uppercase tracking-wider text-gray-500"
                style={{
                  gridTemplateColumns: '3fr 1.5fr 1fr 1.2fr 80px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  borderColor: 'rgba(255,255,255,0.08)',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 600,
                }}
              >
                <div>Exam</div>
                <div>Schedule</div>
                <div>Duration</div>
                <div>Status</div>
                <div />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center gap-3 py-20 text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span style={{ fontFamily: 'Inter, sans-serif' }}>Loading exams…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-20 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                  >
                    <Database className="w-8 h-8 text-indigo-400" />
                  </div>
                  <p className="text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {searchQuery ? 'No exams match your search.' : 'No exams created yet.'}
                  </p>
                </div>
              ) : (
                filtered.map((exam, idx) => {
                  const status = examStatus(exam);
                  const statusConfig = {
                    ended: { label: 'Ended', color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
                    active: { label: 'Live', color: '#facc15', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)' },
                    upcoming: { label: 'Upcoming', color: '#818cf8', bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.25)' },
                  }[status];

                  return (
                    <div
                      key={exam.examId}
                      onClick={() => navigate(`/instructor/exam-results/${exam.examId}`)}
                      className="grid gap-4 px-6 py-4 cursor-pointer hover:bg-white/5 transition group"
                      style={{
                        gridTemplateColumns: '3fr 1.5fr 1fr 1.2fr 80px',
                        borderBottom: idx < filtered.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                        alignItems: 'center',
                      }}
                    >
                      {/* Exam title + code */}
                      <div className="min-w-0">
                        <p
                          className="text-white text-sm truncate group-hover:text-indigo-300 transition"
                          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                        >
                          {exam.title}
                        </p>
                        <p className="text-white text-xs mt-0.5 flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {exam.examCode}
                          <Copy
                            className="w-3 h-3 cursor-pointer hover:text-indigo-300 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(exam.examCode);
                              toast.success('Copied to clipboard');
                            }}
                          />
                        </p>
                      </div>

                      {/* Schedule */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span style={{ fontFamily: 'Inter, sans-serif' }}>{formatDate(exam.startTime)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                          <span style={{ fontFamily: 'Inter, sans-serif' }}>→ {formatDate(exam.endTime)}</span>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span style={{ fontFamily: 'Inter, sans-serif' }}>{exam.durationMinutes} min</span>
                      </div>

                      {/* Status badge */}
                      <div>
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs"
                          style={{
                            backgroundColor: statusConfig.bg,
                            color: statusConfig.color,
                            border: `1px solid ${statusConfig.border}`,
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 500,
                          }}
                        >
                          {status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />}
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-end">
                        <ChevronRight
                          className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 transition"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}