import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Calendar, Clock, Users, Copy, 
  MoreVertical, Edit, Copy as CopyIcon, Trash2, 
  Plus, ArrowLeft, Brain, FileText, LayoutDashboard,
  Database, Shield, Settings, HelpCircle, LogOut,
  Grid3x3, List
} from 'lucide-react';

const mockExams = [
  {
    id: 'exam-1',
    title: 'Introduction to Computer Science - Midterm',
    subject: 'Computer Science',
    code: 'XF-9022',
    date: 'Oct 25, 2025',
    duration: '90 min',
    studentsCount: 23,
    status: 'live' as const
  },
  {
    id: 'exam-2',
    title: 'Data Structures and Algorithms - Final',
    subject: 'Computer Science',
    code: 'CS-1045',
    date: 'Nov 10, 2025',
    duration: '120 min',
    studentsCount: undefined,
    status: 'draft' as const
  },
  {
    id: 'exam-3',
    title: 'Machine Learning Fundamentals - Quiz',
    subject: 'AI/ML',
    code: 'ML-7834',
    date: 'Nov 20, 2025',
    duration: '60 min',
    studentsCount: undefined,
    status: 'grading' as const
  },
  {
    id: 'exam-4',
    title: 'Neural Networks Deep Dive - Assessment',
    subject: 'AI/ML',
    code: 'NN-4521',
    date: 'Oct 15, 2025',
    duration: '75 min',
    studentsCount: 29,
    status: 'ended' as const
  },
  {
    id: 'exam-5',
    title: 'Web Development Principles - Midterm',
    subject: 'Web Development',
    code: 'WD-8832',
    date: 'Nov 5, 2025',
    duration: '90 min',
    studentsCount: undefined,
    status: 'draft' as const
  },
  {
    id: 'exam-6',
    title: 'Database Systems - Final Exam',
    subject: 'Database',
    code: 'DB-5521',
    date: 'Nov 28, 2025',
    duration: '150 min',
    studentsCount: 18,
    status: 'live' as const
  }
];

const statusConfig = {
  live: { 
    label: 'Live', 
    color: 'text-green-400', 
    bg: 'bg-green-500/20', 
    border: 'border-green-500/50',
    pulse: true
  },
  draft: { 
    label: 'Draft', 
    color: 'text-gray-400', 
    bg: 'bg-gray-500/20', 
    border: 'border-gray-500/50',
    pulse: false
  },
  grading: { 
    label: 'Grading', 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/20', 
    border: 'border-yellow-500/50',
    pulse: false
  },
  ended: { 
    label: 'Ended', 
    color: 'text-gray-400', 
    bg: 'bg-gray-500/20', 
    border: 'border-gray-500/50',
    pulse: false
  }
};

export function MyExamsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('exams');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results Database', icon: Database },
  ];

  const utilityItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const filteredExams = mockExams.filter(exam => {
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || exam.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCopyCode = (code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setActiveMenu(null);
  };

  const handleMenuAction = (action: string, examId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`${action} exam:`, examId);
    setActiveMenu(null);
    // Add your action handlers here
  };

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
                      if (item.id === 'dashboard') {
                        navigate('/instructor');
                      } else if (item.id === 'exams') {
                        navigate('/instructor/exams');
                      } else if (item.id === 'results') {
                        navigate('/instructor/results-database');
                      } else if (item.id === 'reports') {
                        navigate('/instructor/integrity-reports');
                      }
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
                      className={`text-sm ${isActive ? '' : ''}`}
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: isActive ? 600 : 400
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 h-px" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

            {/* Utilities Section */}
            <div className="space-y-1">
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
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      strokeWidth={1.5}
                    />
                    <span 
                      className="text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
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
      <div className="flex-1 relative z-10">
        {/* Header */}
        <header className="border-b" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="px-8 py-6">
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Exam Repository
                </h1>
                <p className="text-gray-400 text-sm">Manage and organize all your exams</p>
              </div>
              
              <button
                onClick={() => navigate('/instructor/create-exam')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-purple-500/30"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Exam</span>
              </button>
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, subject, or code..."
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
                  <option value="all">All Exams</option>
                  <option value="draft">Draft</option>
                  <option value="live">Active</option>
                  <option value="grading">Grading</option>
                  <option value="ended">Ended</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Exams List */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Bar & View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6 text-sm">
                <div className="text-gray-400">
                  <span className="text-white">{filteredExams.length}</span> exams found
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="text-gray-400">
                  <span className="text-green-400">{mockExams.filter(e => e.status === 'live').length}</span> active
                </div>
                <div className="text-gray-400">
                  <span className="text-gray-400">{mockExams.filter(e => e.status === 'draft').length}</span> drafts
                </div>
                <div className="text-gray-400">
                  <span className="text-yellow-400">{mockExams.filter(e => e.status === 'grading').length}</span> in grading
                </div>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-xl border" style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span className="text-sm">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <List className="w-4 h-4" />
                  <span className="text-sm">List</span>
                </button>
              </div>
            </div>

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map((exam) => {
                  const status = statusConfig[exam.status];
                  return (
                    <div
                      key={exam.id}
                      onClick={() => navigate(`/instructor/results/${exam.id}`)}
                      className="group rounded-2xl p-6 border cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      {/* Header - Status & Menu */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.bg} ${status.border}`}>
                          {status.pulse && (
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          )}
                          <span className={`text-xs ${status.color}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            {status.label}
                          </span>
                        </div>

                        {/* Three-dot Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === exam.id ? null : exam.id);
                            }}
                            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenu === exam.id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenu(null);
                                }}
                              />
                              <div 
                                className="absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-20"
                                style={{
                                  backgroundColor: 'rgba(15, 17, 26, 0.95)',
                                  backdropFilter: 'blur(20px)',
                                  borderColor: 'rgba(255, 255, 255, 0.1)'
                                }}
                              >
                                <button
                                  onClick={(e) => handleMenuAction('edit', exam.id, e)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition text-left rounded-t-xl"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Edit</span>
                                </button>
                                <button
                                  onClick={(e) => handleMenuAction('duplicate', exam.id, e)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 transition text-left"
                                >
                                  <CopyIcon className="w-4 h-4" />
                                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Duplicate</span>
                                </button>
                                <div className="h-px mx-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                                <button
                                  onClick={(e) => handleMenuAction('delete', exam.id, e)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 transition text-left rounded-b-xl"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-white text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition min-h-[3.5rem]" 
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                      >
                        {exam.title}
                      </h3>

                      {/* Subject Badge */}
                      <div className="inline-flex px-3 py-1 rounded-full text-xs border mb-4" style={{
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderColor: 'rgba(59, 130, 246, 0.3)',
                        color: '#60a5fa'
                      }}>
                        {exam.subject}
                      </div>

                      {/* Metadata */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="w-4 h-4" strokeWidth={1.5} />
                          <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {exam.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="w-4 h-4" strokeWidth={1.5} />
                          <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {exam.duration}
                          </span>
                        </div>
                        {exam.studentsCount !== undefined && (
                          <div className="flex items-center gap-2 text-gray-400">
                            <Users className="w-4 h-4" strokeWidth={1.5} />
                            <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {exam.studentsCount} {exam.status === 'live' ? 'taking now' : exam.status === 'ended' ? 'completed' : 'students'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Exam Code */}
                      <div className="flex items-center justify-between gap-2 px-4 py-2 rounded-lg border" style={{
                        backgroundColor: 'rgba(147, 51, 234, 0.1)',
                        borderColor: 'rgba(147, 51, 234, 0.3)'
                      }}>
                        <span className="text-purple-400 tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {exam.code}
                        </span>
                        <button
                          onClick={(e) => handleCopyCode(exam.code, e)}
                          className="p-1 rounded hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
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
                      Date & Time
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Students
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Status
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Exam Code
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Actions
                    </span>
                  </div>
                </div>

                {/* Table Body */}
                <div>
                  {filteredExams.map((exam, index) => {
                    const status = statusConfig[exam.status];
                    return (
                      <div
                        key={exam.id}
                        onClick={() => navigate(`/instructor/results/${exam.id}`)}
                        className={`grid grid-cols-12 gap-4 px-6 py-3.5 cursor-pointer transition-all duration-200 hover:bg-white/5 group ${
                          index !== filteredExams.length - 1 ? 'border-b' : ''
                        }`}
                        style={{
                          borderColor: 'rgba(255, 255, 255, 0.05)'
                        }}
                      >
                        {/* Title & Subject Column */}
                        <div className="col-span-4 flex flex-col gap-1.5">
                          <h3 
                            className="text-white text-sm truncate group-hover:text-blue-400 transition" 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                          >
                            {exam.title}
                          </h3>
                          <div className="inline-flex w-fit px-2 py-0.5 rounded-full text-xs border" style={{
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderColor: 'rgba(59, 130, 246, 0.3)',
                            color: '#60a5fa'
                          }}>
                            {exam.subject}
                          </div>
                        </div>

                        {/* Date & Time Column */}
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

                        {/* Students Column */}
                        <div className="col-span-1 flex items-center">
                          {exam.studentsCount !== undefined ? (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
                                <Users className="w-4 h-4 text-blue-400" strokeWidth={1.5} />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                                  {exam.studentsCount}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {exam.status === 'live' ? 'taking' : exam.status === 'ended' ? 'done' : 'enrolled'}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                              No students
                            </span>
                          )}
                        </div>

                        {/* Status Column */}
                        <div className="col-span-1 flex items-center">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${status.bg} ${status.border} w-full justify-center`}>
                            {status.pulse && (
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                            )}
                            <span className={`text-xs ${status.color}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              {status.label}
                            </span>
                          </div>
                        </div>

                        {/* Exam Code Column */}
                        <div className="col-span-2 flex items-center">
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border w-full" style={{
                            backgroundColor: 'rgba(147, 51, 234, 0.1)',
                            borderColor: 'rgba(147, 51, 234, 0.3)'
                          }}>
                            <span className="text-purple-400 tracking-wider flex-1 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              {exam.code}
                            </span>
                            <button
                              onClick={(e) => handleCopyCode(exam.code, e)}
                              className="p-1 rounded hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition flex-shrink-0"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Actions Column */}
                        <div className="col-span-2 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMenuAction('edit', exam.id, e);
                            }}
                            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white transition"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span className="text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>Edit</span>
                          </button>
                          
                          {/* Three-dot Menu */}
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenu(activeMenu === exam.id ? null : exam.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {activeMenu === exam.id && (
                              <>
                                <div 
                                  className="fixed inset-0 z-10" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenu(null);
                                  }}
                                />
                                <div 
                                  className="absolute right-0 top-full mt-2 w-44 rounded-xl border shadow-xl z-20"
                                  style={{
                                    backgroundColor: 'rgba(15, 17, 26, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    borderColor: 'rgba(255, 255, 255, 0.1)'
                                  }}
                                >
                                  <button
                                    onClick={(e) => handleMenuAction('duplicate', exam.id, e)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-white hover:bg-white/10 transition text-left rounded-t-xl"
                                  >
                                    <CopyIcon className="w-4 h-4" />
                                    <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Duplicate</span>
                                  </button>
                                  <div className="h-px mx-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                                  <button
                                    onClick={(e) => handleMenuAction('delete', exam.id, e)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition text-left rounded-b-xl"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Delete</span>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredExams.length === 0 && (
              <div className="text-center py-20">
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
                  <FileText className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-white text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  No exams found
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Get started by creating your first exam'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => navigate('/instructor/create-exam')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Your First Exam</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}