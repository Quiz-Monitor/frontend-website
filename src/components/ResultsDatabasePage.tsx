import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, Clock, Users, ArrowLeft, Brain, FileText, 
  LayoutDashboard, Database, Shield, Settings, HelpCircle, LogOut,
  TrendingUp, CheckCircle, AlertTriangle, Award
} from 'lucide-react';
import { InstructorSidebar } from './InstructorSidebar';

const mockExams = [
  {
    id: 'exam-1',
    title: 'Advanced Mathematics - Final Exam',
    subject: 'Mathematics',
    code: 'MATH-2024',
    date: 'Nov 15, 2024',
    duration: '120 min',
    completedCount: 45,
    resultsPublished: true,
    passRate: 92,
    flagsCount: 3
  },
  {
    id: 'exam-2',
    title: 'Introduction to Physics - Midterm',
    subject: 'Physics',
    code: 'PHY-101',
    date: 'Nov 10, 2024',
    duration: '90 min',
    completedCount: 38,
    resultsPublished: false,
    passRate: 84,
    flagsCount: 5
  },
  {
    id: 'exam-3',
    title: 'Computer Science Fundamentals',
    subject: 'Computer Science',
    code: 'CS-150',
    date: 'Nov 8, 2024',
    duration: '150 min',
    completedCount: 52,
    resultsPublished: true,
    passRate: 96,
    flagsCount: 1
  },
  {
    id: 'exam-4',
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    code: 'CS-250',
    date: 'Nov 5, 2024',
    duration: '180 min',
    completedCount: 41,
    resultsPublished: false,
    passRate: 88,
    flagsCount: 7
  },
  {
    id: 'exam-5',
    title: 'Chemistry Lab Assessment',
    subject: 'Chemistry',
    code: 'CHEM-202',
    date: 'Nov 1, 2024',
    duration: '60 min',
    completedCount: 33,
    resultsPublished: true,
    passRate: 79,
    flagsCount: 4
  }
];

export function ResultsDatabasePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExams = mockExams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exam.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStudents = mockExams.reduce((sum, exam) => sum + exam.completedCount, 0);
  const totalFlags = mockExams.reduce((sum, exam) => sum + exam.flagsCount, 0);
  const publishedCount = mockExams.filter(exam => exam.resultsPublished).length;

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
        {/* Header */}
        <header className="border-b" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="px-8 py-6">
            {/* Title */}
            <div className="mb-6">
              <h1 className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                Results Database
              </h1>
              <p className="text-gray-400 text-sm">View detailed results and analytics for completed exams</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search completed exams..."
                className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 border focus:outline-none focus:border-blue-500 transition"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Exams */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {mockExams.length}
                </div>
                <div className="text-gray-400 text-sm">Completed Exams</div>
              </div>

              {/* Total Students */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {totalStudents}
                </div>
                <div className="text-gray-400 text-sm">Total Submissions</div>
              </div>

              {/* Published Results */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {publishedCount}/{mockExams.length}
                </div>
                <div className="text-gray-400 text-sm">Results Published</div>
              </div>

              {/* Total Flags */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {totalFlags}
                </div>
                <div className="text-gray-400 text-sm">Total Violations</div>
              </div>
            </div>

            {/* Exams Table */}
            <div className="rounded-2xl border overflow-hidden" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="col-span-4">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Exam Title
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Date & Duration
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Students
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Status
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Pass Rate
                  </span>
                </div>
                <div className="col-span-1">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Flags
                  </span>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {filteredExams.map((exam, index) => (
                  <div
                    key={exam.id}
                    onClick={() => navigate(`/instructor/exam-results/${exam.id}`)}
                    className={`grid grid-cols-12 gap-4 px-6 py-4 cursor-pointer transition-all duration-200 hover:bg-white/5 group ${
                      index !== filteredExams.length - 1 ? 'border-b' : ''
                    }`}
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {/* Title & Subject */}
                    <div className="col-span-4 flex flex-col gap-1.5">
                      <h3 
                        className="text-white text-sm truncate group-hover:text-blue-400 transition" 
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                      >
                        {exam.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="inline-flex w-fit px-2 py-0.5 rounded-full text-xs border" style={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          borderColor: 'rgba(59, 130, 246, 0.3)',
                          color: '#60a5fa'
                        }}>
                          {exam.subject}
                        </div>
                        <span className="text-purple-400 text-xs tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {exam.code}
                        </span>
                      </div>
                    </div>

                    {/* Date & Duration */}
                    <div className="col-span-2 flex flex-col gap-1.5 justify-center">
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                        <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {exam.date}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <Clock className="w-3.5 h-3.5 text-gray-400" strokeWidth={1.5} />
                        <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {exam.duration}
                        </span>
                      </div>
                    </div>

                    {/* Students Count */}
                    <div className="col-span-1 flex items-center">
                      <div className="flex flex-col">
                        <span className="text-white text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {exam.completedCount}
                        </span>
                        <span className="text-xs text-gray-400">completed</span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${
                          (exam as any).resultsPublished 
                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30' 
                            : 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                        }`}>
                          {(exam as any).resultsPublished ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className={`text-base ${
                            (exam as any).resultsPublished ? 'text-green-400' : 'text-yellow-400'
                          }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {(exam as any).resultsPublished ? 'Published' : 'Pending'}
                          </span>
                          <span className="text-xs text-gray-400">status</span>
                        </div>
                      </div>
                    </div>

                    {/* Pass Rate */}
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-base" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {exam.passRate}%
                          </span>
                          <span className="text-xs text-gray-400">pass rate</span>
                        </div>
                      </div>
                    </div>

                    {/* Flags */}
                    <div className="col-span-1 flex items-center justify-center">
                      {exam.flagsCount > 0 ? (
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30">
                          <span className="text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {exam.flagsCount}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredExams.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                  <Database className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-white text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No completed exams found
                </h3>
                <p className="text-gray-400">
                  {searchQuery ? 'Try adjusting your search query' : 'Completed exam results will appear here'}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}