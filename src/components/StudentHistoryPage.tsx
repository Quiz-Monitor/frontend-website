import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History, Search, Filter, Brain, Home, FileText, User, LogOut,
  Calendar, Clock, Award, CheckCircle, Target, BookOpen, Download
} from 'lucide-react';
import { StudentSidebar } from './StudentSidebar';
import { getStudentSubmittedExams, StudentSubmittedExam } from '../services/examService';

export function StudentHistoryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [exams, setExams] = useState<StudentSubmittedExam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExams() {
      try {
        const data = await getStudentSubmittedExams();
        setExams(data.exams);
      } catch (error) {
        console.error('Failed to fetch exams:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchExams();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graded': return 'text-green-400';
      case 'submitted': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    if (status === 'graded') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status === 'submitted') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getScoreBadgeColor = (score: number | null) => {
    if (score === null) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    if (score >= 85) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (score >= 70) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const filteredHistory = exams.filter(exam => {
    const matchesSearch = exam.examTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats
  const totalExams = exams.length;
  const gradedExams = exams.filter(exam => exam.gradingStatus === 'graded');
  const avgScore = gradedExams.length > 0 
    ? Math.round(gradedExams.reduce((sum, exam) => sum + (exam.scorePercentage || 0), 0) / gradedExams.length)
    : 0;
  const passedExams = gradedExams.filter(exam => (exam.scorePercentage || 0) >= 50).length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <StudentSidebar />

      {/* Main Content */}
      <div 
        className="flex-1 relative z-10 overflow-hidden flex flex-col"
        style={{ 
          marginLeft: 'var(--sidebar-width)',
          transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)'
        }}
      >
        {/* Header */}
        <header className="border-b flex-shrink-0" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <History className="w-8 h-8 text-blue-400" />
                  <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Exam History
                  </h1>
                </div>
                <p className="text-gray-400 text-sm">View your past exam results and performance</p>
              </div>
              
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition border border-blue-500/30">
                <Download className="w-5 h-5" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Export Results</span>
              </button>
            </div>
          </div>
        </header>

        {/* Stats Overview */}
        <div className="border-b px-8 py-6" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}>
          <div className="grid grid-cols-4 gap-6">
            <div className="rounded-xl border p-4" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {totalExams}
                  </div>
                  <div className="text-gray-400 text-xs">Total Exams</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {avgScore}%
                  </div>
                  <div className="text-gray-400 text-xs">Avg Score</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {passedExams}/{totalExams}
                  </div>
                  <div className="text-gray-400 text-xs">Passed</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {exams.filter(e => e.gradingStatus === 'submitted').length}
                  </div>
                  <div className="text-gray-400 text-xs">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="border-b px-8 py-4" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exam history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <option value="all" className="bg-gray-800">All Time</option>
                <option value="week" className="bg-gray-800">This Week</option>
                <option value="month" className="bg-gray-800">This Month</option>
                <option value="quarter" className="bg-gray-800">This Quarter</option>
              </select>
            </div>
          </div>
        </div>

        {/* History Table */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="rounded-2xl border overflow-hidden" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <table className="w-full" style={{ tableLayout: 'auto' }}>
                <thead>
                  <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                    <th className="text-left px-6 py-4 text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '35%' }}>
                      EXAM
                    </th>
                    <th className="text-left px-6 py-4 text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '30%' }}>
                      DATE & TIME
                    </th>
                    <th className="text-center px-6 py-4 text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '20%' }}>
                      STATUS
                    </th>
                    <th className="text-center px-6 py-4 text-gray-400 text-xs" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, width: '15%' }}>
                      RESULT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading exams...</td>
                    </tr>
                  ) : filteredHistory.map((exam) => (
                    <tr 
                      key={exam.attemptId}
                      className="border-t hover:bg-white/5 transition-colors cursor-pointer group"
                      style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white text-sm mb-0.5 group-hover:text-blue-400 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            {exam.examTitle}
                          </div>
                          <div className="text-gray-400 text-xs">{exam.instructorName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Calendar className="w-4 h-4" />
                          <span>{exam.submitTime ? new Date(exam.submitTime).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{exam.submitTime ? new Date(exam.submitTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-4 py-1.5 rounded-lg border ${getStatusBadgeColor(exam.gradingStatus)}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {exam.gradingStatus === 'graded' ? 'Graded' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {exam.gradingStatus === 'graded' ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border" style={{
                            backgroundColor: (exam.scorePercentage || 0) >= 85 ? 'rgba(34, 197, 94, 0.1)' : (exam.scorePercentage || 0) >= 70 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderColor: (exam.scorePercentage || 0) >= 85 ? 'rgba(34, 197, 94, 0.3)' : (exam.scorePercentage || 0) >= 70 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                          }}>
                            <Target className="w-4 h-4" style={{ 
                              color: (exam.scorePercentage || 0) >= 85 ? '#22c55e' : (exam.scorePercentage || 0) >= 70 ? '#3b82f6' : '#ef4444' 
                            }} />
                            <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              {exam.finalScore}/{exam.examTotalPoints}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
