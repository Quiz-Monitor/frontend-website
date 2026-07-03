import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Search, Users, Clock, Award,
  CheckCircle, User, Calendar,
  Brain, FileText, LayoutDashboard, Database, Settings,
  HelpCircle, LogOut, Filter, Loader2
} from 'lucide-react';
import { InstructorSidebar } from './InstructorSidebar';
import { getExamResults, ExamStudentResult } from '../services/examService';
import { toast } from 'sonner';

const examInfo = {
  'exam-4': {
    title: 'Advanced Mathematics - Final Exam',
    subject: 'Mathematics',
    code: 'MATH-2024',
    date: 'Nov 15, 2024',
    duration: '120 min'
  }
};

const mockStudents = [
  {
    id: 'student-1',
    name: 'Michael Johnson',
    email: 'michael.johnson@university.edu',
    startTime: '10:00 AM',
    submitTime: '11:05 AM',
    duration: '65 min',
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    wrongAnswers: 2,
    flagsCount: 0,
    status: 'excellent' as const,
    gradeStatus: 'graded' as const
  },
  {
    id: 'student-2',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@university.edu',
    startTime: '10:02 AM',
    submitTime: '11:12 AM',
    duration: '70 min',
    score: 88,
    totalQuestions: 25,
    correctAnswers: 22,
    wrongAnswers: 3,
    flagsCount: 1,
    status: 'excellent' as const,
    gradeStatus: 'pending' as const
  },
  {
    id: 'student-3',
    name: 'David Martinez',
    email: 'david.martinez@university.edu',
    startTime: '10:05 AM',
    submitTime: '11:15 AM',
    duration: '70 min',
    score: 84,
    totalQuestions: 25,
    correctAnswers: 21,
    wrongAnswers: 4,
    flagsCount: 2,
    status: 'good' as const,
    gradeStatus: 'pending' as const
  },
  {
    id: 'student-4',
    name: 'Emily Thompson',
    email: 'emily.thompson@university.edu',
    startTime: '10:08 AM',
    submitTime: '11:10 AM',
    duration: '62 min',
    score: 76,
    totalQuestions: 25,
    correctAnswers: 19,
    wrongAnswers: 6,
    flagsCount: 0,
    status: 'average' as const,
    gradeStatus: 'graded' as const
  },
  {
    id: 'student-5',
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    startTime: '10:10 AM',
    submitTime: '11:20 AM',
    duration: '70 min',
    score: 68,
    totalQuestions: 25,
    correctAnswers: 17,
    wrongAnswers: 8,
    flagsCount: 3,
    status: 'below-average' as const,
    gradeStatus: 'pending' as const
  },
  {
    id: 'student-6',
    name: 'Sophia Lee',
    email: 'sophia.lee@university.edu',
    startTime: '10:12 AM',
    submitTime: '11:18 AM',
    duration: '66 min',
    score: 96,
    totalQuestions: 25,
    correctAnswers: 24,
    wrongAnswers: 1,
    flagsCount: 0,
    status: 'excellent' as const,
    gradeStatus: 'graded' as const
  },
  {
    id: 'student-7',
    name: 'Daniel Brown',
    email: 'daniel.brown@university.edu',
    startTime: '10:15 AM',
    submitTime: '11:25 AM',
    duration: '70 min',
    score: 80,
    totalQuestions: 25,
    correctAnswers: 20,
    wrongAnswers: 5,
    flagsCount: 1,
    status: 'good' as const,
    gradeStatus: 'graded' as const
  },
  {
    id: 'student-8',
    name: 'Olivia Davis',
    email: 'olivia.davis@university.edu',
    startTime: '10:18 AM',
    submitTime: '11:22 AM',
    duration: '64 min',
    score: 72,
    totalQuestions: 25,
    correctAnswers: 18,
    wrongAnswers: 7,
    flagsCount: 2,
    status: 'average' as const,
    gradeStatus: 'graded' as const
  }
];

const statusConfig = {
  excellent: { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20', border: 'border-green-500/50' },
  good: { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50' },
  average: { label: 'Average', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
  'below-average': { label: 'Below Average', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' },
  'pending': { label: 'Pending Review', color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' }
};

export function ExamStudentsListPage() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [students, setStudents] = useState<ExamStudentResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const studentStatus = student.cheatingStatus === 'pending' ? 'pending' : (student.finalScore >= 90 ? 'excellent' : student.finalScore >= 80 ? 'good' : student.finalScore >= 70 ? 'average' : 'below-average');
    const matchesFilter = filterStatus === 'all' || studentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const avgScore = students.length > 0 ? (students.reduce((sum, s) => sum + s.finalScore, 0) / students.length).toFixed(1) : '0.0';
  const totalFlags = students.reduce((sum, s) => sum + s.totalViolations, 0);
  const passCount = students.filter(s => s.finalScore >= 60).length;
  const passRate = students.length > 0 ? ((passCount / students.length) * 100).toFixed(0) : '0';
  const pendingCount = students.filter(s => s.cheatingStatus === 'pending').length;

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
            {/* Back Button */}
            <button
              onClick={() => navigate('/instructor/results-database')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Back to Results Database</span>
            </button>

            {/* Exam Info */}
            <div className="mb-6">
              <h1 className="text-white text-3xl mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                {exam?.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{exam?.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{exam?.duration}</span>
                </div>
                <div className="px-3 py-1 rounded-full border" style={{
                  backgroundColor: 'rgba(147, 51, 234, 0.1)',
                  borderColor: 'rgba(147, 51, 234, 0.3)',
                  color: '#a855f7'
                }}>
                  {exam?.code}
                </div>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search students by name or email..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 border focus:outline-none focus:border-blue-500 transition"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-12 pr-8 py-3 rounded-xl text-white border focus:outline-none focus:border-blue-500 transition appearance-none cursor-pointer"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    fontFamily: 'Inter, sans-serif',
                    minWidth: '200px'
                  }}
                >
                  <option value="all">All Students</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="average">Average</option>
                  <option value="below-average">Below Average</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Pending Review Alert */}
            {pendingCount > 0 && (
              <div className="mb-6 rounded-2xl border p-6" style={{ 
                backgroundColor: 'rgba(234, 179, 8, 0.1)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(234, 179, 8, 0.3)'
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center animate-pulse">
                    <Clock className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-yellow-400 text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {pendingCount} Student{pendingCount > 1 ? 's' : ''} Awaiting Review
                    </h3>
                    <p className="text-gray-300">
                      Click on students with "Pending Review" status to review their AI violations and adjust grades before publishing results.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {/* Total Students */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {students.length}
                </div>
                <div className="text-gray-400 text-sm">Total Students</div>
              </div>

              {/* Average Score */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {avgScore}%
                </div>
                <div className="text-gray-400 text-sm">Average Score</div>
              </div>

              {/* Pass Rate */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {passRate}%
                </div>
                <div className="text-gray-400 text-sm">Pass Rate</div>
              </div>

              {/* Pending Reviews */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {pendingCount}
                </div>
                <div className="text-gray-400 text-sm">Pending Reviews</div>
              </div>
            </div>

            {/* Students Table */}
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
                <div className="col-span-3">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Student Name
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Time & Duration
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Score
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Answers
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Status
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
                {isLoading ? (
                  <div className="p-8 flex justify-center items-center text-gray-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No students found matching your search or filters.
                  </div>
                ) : (
                  filteredStudents.map((student, index) => {
                    const mappedStatus = student.cheatingStatus === 'pending' ? 'pending' : (student.finalScore >= 90 ? 'excellent' : student.finalScore >= 80 ? 'good' : student.finalScore >= 70 ? 'average' : 'below-average');
                    const status = statusConfig[mappedStatus as keyof typeof statusConfig] || statusConfig.average;
                    const isPending = student.cheatingStatus === 'pending';
                    return (
                      <div
                        key={student.studentId}
                        onClick={() => {
                          if (isPending) {
                            navigate(`/instructor/review-exam/${examId}/${student.studentId}`);
                          } else {
                            navigate(`/instructor/student-result/${examId}/${student.studentId}`);
                          }
                        }}
                        className={`grid grid-cols-12 gap-4 px-6 py-3.5 cursor-pointer transition-all duration-200 hover:bg-white/5 group ${
                          index !== filteredStudents.length - 1 ? 'border-b' : ''
                        }`}
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        {/* Student Info */}
                        <div className="col-span-3 flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <h3 
                              className="text-white text-sm truncate group-hover:text-blue-400 transition" 
                              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                            >
                              {student.studentName}
                            </h3>
                            <span className="text-gray-400 text-xs truncate">ID: {student.studentId}</span>
                          </div>
                        </div>

                        {/* Time & Duration (Placeholder since API doesn't provide it directly in this view) */}
                        <div className="col-span-2 flex flex-col gap-1 justify-center">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                              -
                            </span>
                          </div>
                        </div>

                        {/* Score */}
                        <div className="col-span-2 flex items-center">
                          <div className="flex items-center gap-2">
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${
                              student.finalScore >= 90 ? 'bg-green-500/20 border-green-500/50' :
                              student.finalScore >= 80 ? 'bg-blue-500/20 border-blue-500/50' :
                              student.finalScore >= 70 ? 'bg-yellow-500/20 border-yellow-500/50' :
                              'bg-orange-500/20 border-orange-500/50'
                            }`}>
                              <span className={`text-lg ${
                                student.finalScore >= 90 ? 'text-green-400' :
                                student.finalScore >= 80 ? 'text-blue-400' :
                                student.finalScore >= 70 ? 'text-yellow-400' :
                                'text-orange-400'
                              }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                                {student.finalScore}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                {student.finalScore}%
                              </span>
                              <span className="text-xs text-gray-400">score</span>
                            </div>
                          </div>
                        </div>

                        {/* Answers Placeholder */}
                        <div className="col-span-2 flex items-center gap-3">
                          <span className="text-gray-400 text-sm">See details</span>
                        </div>

                        {/* Status */}
                        <div className="col-span-2 flex items-center">
                          {isPending ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-yellow-500/20 border-yellow-500/50 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-yellow-400" />
                              <span className="text-xs text-yellow-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                Pending Review
                              </span>
                            </div>
                          ) : (
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.bg} ${status.border}`}>
                              <span className={`text-xs ${status.color}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                {status.label}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Flags */}
                        <div className="col-span-1 flex items-center justify-center">
                          {student.totalViolations > 0 ? (
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/30">
                              <span className="text-red-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                {student.totalViolations}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-500/20 border border-green-500/30">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}