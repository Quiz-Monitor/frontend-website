import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Search, Filter, Plus, LayoutDashboard, Database, Users, Shield,
  Settings, HelpCircle, LogOut, Brain, Calendar, Clock, Users as UsersIcon,
  AlertTriangle, CheckCircle, Radio, Eye, Edit, Trash2, Copy, MoreVertical,
  TrendingUp, Award, History
} from 'lucide-react';

const examsList = [
  {
    id: 'exam-1',
    title: 'Advanced Mathematics - Final Exam',
    subject: 'Mathematics',
    code: 'MATH-2024',
    date: 'Dec 15, 2024',
    time: '10:00 AM',
    duration: '120 min',
    students: 45,
    status: 'scheduled',
    totalQuestions: 25,
    aiMonitoring: true,
    passScore: 60
  },
  {
    id: 'exam-2',
    title: 'Introduction to Physics - Midterm',
    subject: 'Physics',
    code: 'PHY-101',
    date: 'Dec 12, 2024',
    time: '2:00 PM',
    duration: '90 min',
    students: 38,
    status: 'active',
    totalQuestions: 20,
    aiMonitoring: true,
    passScore: 50,
    activeStudents: 32,
    completedStudents: 15
  },
  {
    id: 'exam-3',
    title: 'Computer Science Fundamentals',
    subject: 'Computer Science',
    code: 'CS-150',
    date: 'Nov 28, 2024',
    time: '9:00 AM',
    duration: '150 min',
    students: 52,
    status: 'completed',
    totalQuestions: 30,
    aiMonitoring: true,
    passScore: 70,
    resultsPublished: true,
    passRate: 96
  },
  {
    id: 'exam-4',
    title: 'Data Structures & Algorithms',
    subject: 'Computer Science',
    code: 'CS-250',
    date: 'Nov 25, 2024',
    time: '11:00 AM',
    duration: '180 min',
    students: 41,
    status: 'completed',
    totalQuestions: 35,
    aiMonitoring: true,
    passScore: 65,
    resultsPublished: false,
    passRate: 88
  },
  {
    id: 'exam-5',
    title: 'Chemistry Lab Assessment',
    subject: 'Chemistry',
    code: 'CHEM-202',
    date: 'Dec 18, 2024',
    time: '3:00 PM',
    duration: '60 min',
    students: 33,
    status: 'draft',
    totalQuestions: 15,
    aiMonitoring: false,
    passScore: 55
  },
  {
    id: 'exam-6',
    title: 'English Literature - Essay Writing',
    subject: 'English',
    code: 'ENG-301',
    date: 'Dec 20, 2024',
    time: '1:00 PM',
    duration: '120 min',
    students: 28,
    status: 'scheduled',
    totalQuestions: 10,
    aiMonitoring: true,
    passScore: 60
  }
];

export function MyExamsListPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('exams');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results Database', icon: Database },
  ];

  const utilityItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredExams = examsList.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar */}
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
                        navigate('/instructor');
                      } else if (item.id === 'exams') {
                        navigate('/instructor/my-exams');
                      } else if (item.id === 'results') {
                        navigate('/instructor/results-database');
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
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
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
                  <FileText className="w-8 h-8 text-blue-400" />
                  <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    My Exams
                  </h1>
                </div>
                <p className="text-gray-400 text-sm">Manage and monitor all your exams</p>
              </div>
              
              <button 
                onClick={() => navigate('/instructor/create-exam')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30"
              >
                <Plus className="w-5 h-5" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Create New Exam</span>
              </button>
            </div>
          </div>
        </header>

        {/* Filters Bar */}
        <div className="border-b px-8 py-4" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(255, 255, 255, 0.08)'
        }}>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search exams by title, subject, or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
              >
                <option value="all" className="bg-gray-800">All Status</option>
                <option value="active" className="bg-gray-800">Active</option>
                <option value="scheduled" className="bg-gray-800">Scheduled</option>
                <option value="completed" className="bg-gray-800">Completed</option>
                <option value="draft" className="bg-gray-800">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Exams Grid */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredExams.map((exam) => (
                <div 
                  key={exam.id}
                  className="rounded-2xl border p-6 group hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  onClick={() => {
                    if (exam.status === 'completed') {
                      navigate('/instructor/results');
                    }
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-white text-lg group-hover:text-blue-400 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {exam.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-lg text-xs border ${getStatusColor(exam.status)}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          {exam.status.toUpperCase()}
                        </span>
                        <span className="text-gray-400 text-sm">{exam.code}</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="text-gray-400 text-xs">Date</div>
                        <div className="text-white text-sm">{exam.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="text-gray-400 text-xs">Time</div>
                        <div className="text-white text-sm">{exam.time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <UsersIcon className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="text-gray-400 text-xs">Students</div>
                        <div className="text-white text-sm">{exam.students}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-yellow-400" />
                      <div>
                        <div className="text-gray-400 text-xs">Questions</div>
                        <div className="text-white text-sm">{exam.totalQuestions}</div>
                      </div>
                    </div>
                  </div>

                  {/* Active Exam Stats */}
                  {exam.status === 'active' && (
                    <div className="mb-4 p-4 rounded-xl border" style={{ 
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      borderColor: 'rgba(16, 185, 129, 0.3)'
                    }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-green-400 text-sm flex items-center gap-2">
                          <Radio className="w-4 h-4 animate-pulse" />
                          Live Now
                        </span>
                        <span className="text-white text-sm">{exam.completedStudents}/{exam.activeStudents} submitted</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(exam.completedStudents! / exam.activeStudents!) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completed Exam Stats */}
                  {exam.status === 'completed' && (
                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl" style={{ 
                        backgroundColor: (exam as any).resultsPublished ? 'rgba(16, 185, 129, 0.1)' : 'rgba(234, 179, 8, 0.1)' 
                      }}>
                        <div className="flex items-center gap-2 mb-1">
                          {(exam as any).resultsPublished ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <Clock className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="text-gray-400 text-xs">Status</span>
                        </div>
                        <div className={`text-sm ${(exam as any).resultsPublished ? 'text-green-400' : 'text-yellow-400'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {(exam as any).resultsPublished ? 'Published' : 'Pending Review'}
                        </div>
                      </div>
                      <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-green-400" />
                          <span className="text-gray-400 text-xs">Pass Rate</span>
                        </div>
                        <div className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          {exam.passRate}%
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {exam.status === 'draft' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition border border-blue-500/30">
                        <Edit className="w-4 h-4" />
                        <span className="text-sm">Edit</span>
                      </button>
                    )}
                    {(exam.status === 'scheduled' || exam.status === 'completed') && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition border border-blue-500/30">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">View Details</span>
                      </button>
                    )}
                    {exam.status === 'active' && (
                      <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 transition border border-green-500/30">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Monitor Live</span>
                      </button>
                    )}
                    <button className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredExams.length === 0 && (
              <div className="text-center py-20">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  No exams found
                </h3>
                <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                <button 
                  onClick={() => navigate('/instructor/create-exam')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Exam</span>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
