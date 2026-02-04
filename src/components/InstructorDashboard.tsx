import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Calendar, Users, Brain, FileText, BarChart3, 
  LayoutDashboard, Database, Settings, 
  Search, Bell, Copy, AlertTriangle, CheckCircle,
  Activity, TrendingUp, Clock, Radio, Shield, HelpCircle, LogOut,
  Eye, Award, Zap, Target, TrendingDown, ChevronRight, PlayCircle, History
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';

const performanceData = [
  { name: 'Mon', exams: 12, students: 145, violations: 3 },
  { name: 'Tue', exams: 19, students: 198, violations: 5 },
  { name: 'Wed', exams: 15, students: 167, violations: 2 },
  { name: 'Thu', exams: 22, students: 221, violations: 7 },
  { name: 'Fri', exams: 18, students: 189, violations: 4 },
  { name: 'Sat', exams: 8, students: 95, violations: 1 },
  { name: 'Sun', exams: 5, students: 67, violations: 0 }
];

const recentExams = [
  { id: 1, title: 'Advanced Mathematics - Final Exam', students: 45, status: 'active', time: '2 hrs left', violations: 2, completion: 78 },
  { id: 2, title: 'Introduction to Physics', students: 38, status: 'scheduled', time: 'Tomorrow 9:00 AM', violations: 0, completion: 0 },
  { id: 3, title: 'Computer Science Fundamentals', students: 52, status: 'completed', time: '2 hours ago', violations: 1, completion: 100 },
  { id: 4, title: 'Data Structures & Algorithms', students: 41, status: 'completed', time: '1 day ago', violations: 7, completion: 100 }
];

const liveActivities = [
  { student: 'Michael Johnson', action: 'submitted exam', time: '2s ago', type: 'success' },
  { student: 'Sarah Anderson', action: 'AI detected face not visible', time: '5s ago', type: 'warning' },
  { student: 'David Martinez', action: 'started exam', time: '12s ago', type: 'info' },
  { student: 'Emily Thompson', action: 'answered question 15/25', time: '18s ago', type: 'info' },
  { student: 'James Wilson', action: 'tab switch detected', time: '25s ago', type: 'warning' },
  { student: 'Sophia Lee', action: 'submitted exam', time: '32s ago', type: 'success' }
];

export function InstructorDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results Database', icon: Database },
  ];

  const utilityItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

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
            <button
              onClick={() => navigate('/')}
              className="group"
            >
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
                      if (item.id === 'exams') {
                        navigate('/instructor/my-exams');
                      } else if (item.id === 'results') {
                        navigate('/instructor/results-database');
                      } else if (item.id === 'dashboard') {
                        navigate('/instructor');
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

            {/* Divider */}
            <div className="my-6 h-px mx-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

            {/* Utilities Section */}
            <div className="space-y-2">
              {utilityItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (item.id === 'settings') {
                        navigate('/instructor/settings');
                      }
                    }}
                    className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={item.label}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      strokeWidth={1.5}
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
                  <span className="text-white text-sm">JD</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: '#0F111A' }} />
              </div>
              <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition" title="Logout">
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
                  <LayoutDashboard className="w-8 h-8 text-blue-400" />
                  <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Dashboard
                  </h1>
                </div>
                <p className="text-gray-400 text-sm">Welcome back, Dr. John Davis</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search exams, students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition w-80"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                  />
                </div>

                {/* Notifications */}
                <button className="relative p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
                    3
                  </div>
                </button>

                {/* Create Exam Button */}
                <button 
                  onClick={() => navigate('/instructor/create-exam')}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30"
                >
                  <Plus className="w-5 h-5" />
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Create Exam</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
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
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12%</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  94
                </div>
                <div className="text-gray-400 text-sm">Total Exams</div>
              </div>

              {/* Active Students */}
              <div className="rounded-2xl border p-6 group hover:border-purple-500/50 transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
                    <div className="flex items-center gap-1 text-green-400 text-xs">
                      <TrendingUp className="w-3 h-3" />
                      <span>+8%</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  1,284
                </div>
                <div className="text-gray-400 text-sm">Active Students</div>
              </div>

              {/* Avg Score */}
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
                      <span>+3%</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  87.5%
                </div>
                <div className="text-gray-400 text-sm">Average Score</div>
              </div>

              {/* Integrity Score */}
              <div className="rounded-2xl border p-6 group hover:border-yellow-500/50 transition-all duration-300" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30">
                    <div className="flex items-center gap-1 text-red-400 text-xs">
                      <TrendingDown className="w-3 h-3" />
                      <span>-2%</span>
                    </div>
                  </div>
                </div>
                <div className="text-3xl text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  94.2%
                </div>
                <div className="text-gray-400 text-sm">Integrity Score</div>
              </div>
            </div>

            {/* Charts Row */}
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
                      Weekly Activity
                    </h3>
                    <p className="text-gray-400 text-sm">Exams and student participation</p>
                  </div>
                  <BarChart3 className="w-6 h-6 text-blue-400" />
                </div>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorExams" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 17, 26, 0.95)', 
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                    />
                    <Area type="monotone" dataKey="students" stroke="#a855f7" fillOpacity={1} fill="url(#colorStudents)" />
                    <Area type="monotone" dataKey="exams" stroke="#3b82f6" fillOpacity={1} fill="url(#colorExams)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Live Activity Feed */}
              <div className="rounded-2xl border p-6" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Live Activity
                    </h3>
                    <p className="text-gray-400 text-sm">Real-time exam monitoring</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-green-400 text-sm">Live</span>
                  </div>
                </div>
                <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                  {liveActivities.map((activity, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 hover:border-blue-500/50 hover:bg-white/5"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.08)'
                      }}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'success' ? 'bg-green-500/20' :
                        activity.type === 'warning' ? 'bg-yellow-500/20' :
                        'bg-blue-500/20'
                      }`}>
                        {activity.type === 'success' ? <CheckCircle className="w-4 h-4 text-green-400" /> :
                         activity.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-yellow-400" /> :
                         <Activity className="w-4 h-4 text-blue-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {activity.student}
                        </div>
                        <div className="text-gray-400 text-xs">{activity.action}</div>
                      </div>
                      <div className="text-gray-500 text-xs flex-shrink-0">{activity.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Exams */}
            <div className="rounded-2xl border p-6" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-white text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Recent Exams
                  </h3>
                  <p className="text-gray-400 text-sm">Your latest exam activities</p>
                </div>
                <button 
                  onClick={() => navigate('/instructor/my-exams')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
                >
                  <span className="text-sm">View All</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {recentExams.map((exam) => (
                  <div 
                    key={exam.id}
                    className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/50 hover:bg-white/5 cursor-pointer group"
                    style={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderColor: 'rgba(255, 255, 255, 0.08)'
                    }}
                    onClick={() => navigate('/instructor/results')}
                  >
                    {/* Status Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      exam.status === 'active' ? 'bg-green-500/20' :
                      exam.status === 'scheduled' ? 'bg-blue-500/20' :
                      'bg-gray-500/20'
                    }`}>
                      {exam.status === 'active' ? <Radio className="w-6 h-6 text-green-400 animate-pulse" /> :
                       exam.status === 'scheduled' ? <Clock className="w-6 h-6 text-blue-400" /> :
                       <CheckCircle className="w-6 h-6 text-gray-400" />}
                    </div>

                    {/* Exam Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-white mb-1 group-hover:text-blue-400 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                        {exam.title}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          <span>{exam.students} students</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{exam.time}</span>
                        </div>
                        {exam.violations > 0 && (
                          <div className="flex items-center gap-1.5 text-yellow-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{exam.violations} flags</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {exam.completion}%
                        </div>
                        <div className="text-gray-400 text-xs">Completion</div>
                      </div>
                      <div className="w-16 h-16">
                        <svg className="transform -rotate-90 w-16 h-16">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="rgba(255, 255, 255, 0.1)"
                            strokeWidth="6"
                            fill="none"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke={exam.status === 'active' ? '#10b981' : exam.status === 'scheduled' ? '#3b82f6' : '#6b7280'}
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${exam.completion * 1.76} 176`}
                            className="transition-all duration-500"
                          />
                        </svg>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
