import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, Home, FileText, History, User, LogOut, Calendar, Clock,
  Trophy, Eye, Lock, Target, BookOpen, Award, TrendingUp, PlayCircle,
  CheckCircle, AlertCircle, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { NotificationsButton } from './NotificationsButton';

interface UpcomingExam {
  id: string;
  subject: string;
  instructor: string;
  startTime: Date;
  duration: string;
  questions: number;
}

interface CompletedExam {
  id: string;
  name: string;
  date: string;
  score: number | null;
  duration: string;
  totalQuestions: number;
  correctAnswers: number | null;
  status: 'graded' | 'pending';
}

const performanceData = [
  { exam: 'Exam 1', score: 65 },
  { exam: 'Exam 2', score: 72 },
  { exam: 'Exam 3', score: 78 },
  { exam: 'Exam 4', score: 85 },
  { exam: 'Exam 5', score: 92 },
  { exam: 'Exam 6', score: 95 }
];

export function StudentDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [examCode, setExamCode] = useState('');

  // Mock notifications
  const notifications = [
    { id: 1, type: 'exam', title: 'Exam Reminder', message: 'Advanced Mathematics exam starts in 2 days', time: '2 hours ago', unread: true },
    { id: 2, type: 'result', title: 'Result Published', message: 'Your English Literature result is now available', time: '5 hours ago', unread: true },
    { id: 3, type: 'announcement', title: 'System Update', message: 'Platform maintenance scheduled for tonight', time: '1 day ago', unread: false },
    { id: 4, type: 'exam', title: 'New Exam Added', message: 'Machine Learning exam has been scheduled', time: '2 days ago', unread: false }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Mock data for upcoming exams
  const upcomingExams: UpcomingExam[] = [
    {
      id: '1',
      subject: 'Advanced Mathematics - Final Exam',
      instructor: 'Dr. Sarah Johnson',
      startTime: new Date(Date.now() - 5 * 60 * 1000), // Started 5 minutes ago - ACTIVE NOW!
      duration: '120 min',
      questions: 25
    },
    {
      id: '2',
      subject: 'Machine Learning Fundamentals',
      instructor: 'Prof. Michael Chen',
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
      duration: '90 min',
      questions: 20
    },
    {
      id: '3',
      subject: 'Web Development - Midterm',
      instructor: 'Dr. Emily Parker',
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
      duration: '150 min',
      questions: 30
    }
  ];

  // Mock data for completed exams
  const completedExams: CompletedExam[] = [
    { id: '1', name: 'English Literature 101', date: 'Nov 28, 2024', score: 92, duration: '90 min', totalQuestions: 20, correctAnswers: 18, status: 'graded' },
    { id: '2', name: 'Calculus II - Chapter Test', date: 'Nov 25, 2024', score: 85, duration: '75 min', totalQuestions: 15, correctAnswers: 13, status: 'graded' },
    { id: '3', name: 'Physics Fundamentals', date: 'Nov 20, 2024', score: null, duration: '120 min', totalQuestions: 25, correctAnswers: null, status: 'pending' }
  ];

  const handleJoinExam = () => {
    if (examCode.trim()) {
      navigate('/student/waiting/demo');
    }
  };

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'history', label: 'History', icon: History },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Calculate stats
  const totalExams = completedExams.length;
  const gradedExams = completedExams.filter(exam => exam.status === 'graded');
  const avgScore = gradedExams.length > 0 
    ? Math.round(gradedExams.reduce((sum, exam) => sum + (exam.score || 0), 0) / gradedExams.length)
    : 0;
  const passedExams = gradedExams.filter(exam => (exam.score || 0) >= 60).length;
  const upcomingCount = upcomingExams.length;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Sidebar - SMALL WITH ICONS ONLY */}
      <aside className="w-[70px] flex-shrink-0 border-r relative z-10" style={{ 
        backgroundColor: 'rgba(15, 17, 26, 0.6)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }}>
        <div className="h-full flex flex-col">
          {/* Header - Brand Logo */}
          <div className="px-3 pt-8 pb-6 flex justify-center">
            <button onClick={() => navigate('/')} className="group">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 pt-2">
            <div className="space-y-2">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (item.id === 'dashboard') {
                        navigate('/student');
                      } else if (item.id === 'exams') {
                        navigate('/student/my-exams');
                      } else if (item.id === 'history') {
                        navigate('/student/history');
                      } else if (item.id === 'profile') {
                        navigate('/student/profile');
                      }
                    }}
                    className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={item.label}
                  >
                    <Icon 
                      className={`w-5 h-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'
                      }`} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile Footer */}
          <div className="p-2 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  <span className="text-white text-sm">MA</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: '#0F111A' }} />
              </div>
              <button 
                onClick={() => navigate('/login')}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition" 
                title="Logout"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
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
                  <Home className="w-8 h-8 text-blue-400" />
                  <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Dashboard
                  </h1>
                </div>
                <p className="text-gray-400 text-sm">Welcome back, Michael Anderson</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications Button */}
                <NotificationsButton />

                <div className="px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Join Exam Card */}
            <div className="rounded-2xl border p-6" style={{ 
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(59, 130, 246, 0.3)'
            }}>
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <PlayCircle className="w-6 h-6 text-blue-400" />
                    <h2 className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Have an exam code?
                    </h2>
                  </div>
                  <p className="text-blue-200 text-sm">Enter your exam code to join an active or upcoming exam</p>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={examCode}
                    onChange={(e) => setExamCode(e.target.value)}
                    placeholder="Enter Code (e.g. XF-9022)"
                    className="px-6 py-3 rounded-xl text-white placeholder-gray-500 border bg-white/10 focus:outline-none focus:border-blue-400 transition w-64"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinExam()}
                  />
                  <button
                    onClick={handleJoinExam}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    Join Exam
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
              {/* Total Exams */}
              <div className="rounded-2xl border p-6 group hover:border-blue-500/50 transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {totalExams}
                </div>
                <div className="text-gray-400 text-sm">Completed Exams</div>
              </div>

              {/* Average Score */}
              <div className="rounded-2xl border p-6 group hover:border-green-500/50 transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {avgScore}%
                </div>
                <div className="text-gray-400 text-sm">Average Score</div>
              </div>

              {/* Passed Exams */}
              <div className="rounded-2xl border p-6 group hover:border-purple-500/50 transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6 text-purple-400" />
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {passedExams}/{totalExams}
                </div>
                <div className="text-gray-400 text-sm">Passed Exams</div>
              </div>

              {/* Upcoming */}
              <div className="rounded-2xl border p-6 group hover:border-yellow-500/50 transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-yellow-400" />
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {upcomingCount}
                </div>
                <div className="text-gray-400 text-sm">Upcoming Exams</div>
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-6">
              {/* Performance Chart */}
              <div className="rounded-2xl border p-6" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Performance Trend
                    </h3>
                    <p className="text-gray-400 text-sm">Your score progression over time</p>
                  </div>
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="exam" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 17, 26, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border p-6" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Recent Activity
                    </h3>
                    <p className="text-gray-400 text-sm">Your latest exam completions</p>
                  </div>
                  <History className="w-6 h-6 text-purple-400" />
                </div>
                <div className="space-y-3">
                  {completedExams.slice(0, 3).map((exam) => (
                    <div 
                      key={exam.id}
                      className="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 hover:border-blue-500/50 hover:bg-white/5"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        exam.status === 'pending' 
                          ? 'bg-yellow-500/20' 
                          : exam.score && exam.score >= 85 
                            ? 'bg-green-500/20' 
                            : exam.score && exam.score >= 70 
                              ? 'bg-blue-500/20' 
                              : 'bg-red-500/20'
                      }`}>
                        <Trophy className={`w-5 h-5 ${
                          exam.status === 'pending' 
                            ? 'text-yellow-400' 
                            : exam.score && exam.score >= 85 
                              ? 'text-green-400' 
                              : exam.score && exam.score >= 70 
                                ? 'text-blue-400' 
                                : 'text-red-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {exam.name}
                        </div>
                        <div className="text-gray-400 text-xs">{exam.date}</div>
                      </div>
                      {exam.status === 'graded' ? (
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-lg text-sm mb-1 ${
                            exam.score && exam.score >= 85 ? 'bg-green-500/20 text-green-400' : 
                            exam.score && exam.score >= 70 ? 'bg-blue-500/20 text-blue-400' : 
                            'bg-red-500/20 text-red-400'
                          }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {exam.score}%
                          </div>
                          <div className="text-gray-500 text-xs">
                            {exam.correctAnswers}/{exam.totalQuestions}
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-lg text-sm bg-yellow-500/20 text-yellow-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Pending
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upcoming Exams Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white text-2xl mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Upcoming Exams
                  </h2>
                  <p className="text-gray-400 text-sm">Exams scheduled in the next 7 days</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                {upcomingExams.map((exam) => (
                  <CountdownCard key={exam.id} exam={exam} />
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Countdown Timer Card Component
function CountdownCard({ exam }: { exam: UpcomingExam }) {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = exam.startTime.getTime() - now;

      if (distance < 0) {
        // Exam has started
        setIsActive(true);
        const elapsed = Math.abs(distance);
        setTimeLeft({
          days: 0,
          hours: Math.floor(elapsed / (1000 * 60 * 60)),
          minutes: Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((elapsed % (1000 * 60)) / 1000)
        });
      } else {
        setIsActive(false);
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [exam.startTime]);

  return (
    <div
      className={`rounded-2xl border p-6 group transition-all duration-300 ${
        isActive ? 'border-green-500/50 shadow-lg shadow-green-500/20' : 'hover:border-blue-500/50'
      }`}
      style={{
        backgroundColor: isActive ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(10px)',
        borderColor: isActive ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`mb-1 text-lg transition ${
            isActive ? 'text-green-400' : 'text-white group-hover:text-blue-400'
          }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            {exam.subject}
          </h3>
          <p className="text-gray-400 text-sm">{exam.instructor}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isActive ? 'bg-green-500/20 animate-pulse' : 'bg-blue-500/20'
        }`}>
          <Calendar className={`w-5 h-5 ${isActive ? 'text-green-400' : 'text-blue-400'}`} />
        </div>
      </div>

      {/* Active Badge */}
      {isActive && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            EXAM ACTIVE NOW
          </span>
        </div>
      )}

      {/* Info */}
      <div className="flex items-center gap-4 mb-4 p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <Clock className="w-4 h-4" />
          <span>{exam.duration}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <FileText className="w-4 h-4" />
          <span>{exam.questions} questions</span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-4">
        <div className="text-gray-400 text-xs mb-2">
          {isActive ? 'Time Elapsed:' : 'Starts in:'}
        </div>
        <div className="grid grid-cols-4 gap-2">
          <div className={`text-center p-2 rounded-lg ${
            isActive ? 'bg-green-500/10' : 'bg-blue-500/10'
          }`}>
            <div className="text-white mb-1 text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="text-gray-500 text-xs">Days</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${
            isActive ? 'bg-green-500/10' : 'bg-blue-500/10'
          }`}>
            <div className="text-white mb-1 text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="text-gray-500 text-xs">Hrs</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${
            isActive ? 'bg-green-500/10' : 'bg-blue-500/10'
          }`}>
            <div className="text-white mb-1 text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="text-gray-500 text-xs">Min</div>
          </div>
          <div className={`text-center p-2 rounded-lg ${
            isActive ? 'bg-green-500/10' : 'bg-blue-500/10'
          }`}>
            <div className="text-white mb-1 text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="text-gray-500 text-xs">Sec</div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {isActive ? (
        <button
          onClick={() => navigate(`/student/permissions/${exam.id}`)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/30"
        >
          <PlayCircle className="w-5 h-5" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Join Now</span>
        </button>
      ) : (
        <button
          disabled
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition cursor-not-allowed bg-gray-500/20 text-gray-400 border"
          style={{ borderColor: 'rgba(100, 116, 139, 0.3)' }}
        >
          <Lock className="w-4 h-4" />
          <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Starts Soon</span>
        </button>
      )}
    </div>
  );
}