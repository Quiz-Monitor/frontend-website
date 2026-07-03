import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, Search, Filter, Plus, LayoutDashboard, Database, Users, Shield,
  Settings, HelpCircle, LogOut, Brain, Calendar, Clock, Users as UsersIcon,
  AlertTriangle, CheckCircle, Radio, Eye, Edit, Trash2, Copy, MoreVertical,
  TrendingUp, Award, History, Loader2
} from 'lucide-react';
import { getMyExams, Exam } from '../services/examService';
import { toast } from 'sonner';
import { InstructorSidebar } from './InstructorSidebar';

// Removed static examsList

export function MyExamsListPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getMyExams();
        setExams(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to fetch exams');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getExamStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now < start) return 'scheduled';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  const filteredExams = exams.filter(exam => {
    const status = getExamStatus(exam.startTime, exam.endTime);
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.examCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || status === filterStatus;
    return matchesSearch && matchesFilter;
  });

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
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-400">Loading your exams...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredExams.map((exam) => {
                  const status = getExamStatus(exam.startTime, exam.endTime);
                  const startDate = new Date(exam.startTime);
                  
                  return (
                    <div 
                      key={exam.examId}
                      className="rounded-2xl border p-6 group hover:border-blue-500/50 transition-all duration-300 cursor-pointer"
                      style={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.03)',
                        backdropFilter: 'blur(10px)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                      }}
                      onClick={() => {
                        if (status === 'completed') {
                          navigate(`/instructor/results/${exam.examId}`);
                        } else {
                          navigate(`/instructor/exam-results/${exam.examId}`);
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
                            <span className={`px-3 py-1 rounded-lg text-xs border ${getStatusColor(status)}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              {status.toUpperCase()}
                            </span>
                            <span className="text-gray-400 text-sm">{exam.examCode}</span>
                          </div>
                        </div>
                        <button className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {exam.description || 'No description provided.'}
                      </p>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}>
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <div>
                            <div className="text-gray-400 text-xs">Date</div>
                            <div className="text-white text-sm">{startDate.toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-purple-400" />
                          <div>
                            <div className="text-gray-400 text-xs">Time</div>
                            <div className="text-white text-sm">{startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <UsersIcon className="w-5 h-5 text-green-400" />
                          <div>
                            <div className="text-gray-400 text-xs">Duration</div>
                            <div className="text-white text-sm">{exam.durationMinutes} min</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-yellow-400" />
                          <div>
                            <div className="text-gray-400 text-xs">Exam ID</div>
                            <div className="text-white text-sm">#{exam.examId}</div>
                          </div>
                        </div>
                      </div>

                      {/* Active Exam Stats */}
                      {status === 'active' && (
                        <div className="mb-4 p-4 rounded-xl border" style={{ 
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderColor: 'rgba(16, 185, 129, 0.3)'
                        }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-green-400 text-sm flex items-center gap-2">
                              <Radio className="w-4 h-4 animate-pulse" />
                              Live Now
                            </span>
                            <span className="text-white text-sm">Monitor participation in real-time</span>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {(status === 'scheduled' || status === 'completed') && (
                          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 transition border border-blue-500/30">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">{status === 'completed' ? 'View Results' : 'View Details'}</span>
                          </button>
                        )}
                        {status === 'active' && (
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
                  );
                })}
              </div>
            )}

            {!isLoading && filteredExams.length === 0 && (
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
