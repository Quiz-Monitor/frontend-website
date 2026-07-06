import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, AlertTriangle, Download, Filter, Search, Brain } from 'lucide-react';
import { StudentDetailModal } from './StudentDetailModal';

const mockResults = [
  {
    id: 'student-1',
    name: 'Emma Rodriguez',
    email: 'emma.r@university.edu',
    score: 94,
    timeSpent: '58 min',
    status: 'clean',
    violations: []
  },
  {
    id: 'student-2',
    name: 'James Chen',
    email: 'james.c@university.edu',
    score: 87,
    timeSpent: '60 min',
    status: 'clean',
    violations: []
  },
  {
    id: 'student-3',
    name: 'Sarah Mitchell',
    email: 'sarah.m@university.edu',
    score: 72,
    timeSpent: '59 min',
    status: 'flagged',
    violations: [
      { time: '10:15 AM', type: 'critical', message: 'Mobile Phone Detected' },
      { time: '10:23 AM', type: 'critical', message: 'Left Seat - No Face Detected' },
      { time: '10:35 AM', type: 'warning', message: 'Multiple Faces Detected' }
    ]
  },
  {
    id: 'student-4',
    name: 'Michael Patel',
    email: 'michael.p@university.edu',
    score: 91,
    timeSpent: '57 min',
    status: 'clean',
    violations: []
  },
  {
    id: 'student-5',
    name: 'Lisa Anderson',
    email: 'lisa.a@university.edu',
    score: 78,
    timeSpent: '60 min',
    status: 'flagged',
    violations: [
      { time: '10:42 AM', type: 'warning', message: 'Looking Away - Gaze Aversion' },
      { time: '10:48 AM', type: 'warning', message: 'Excessive Background Noise' }
    ]
  },
  {
    id: 'student-6',
    name: 'David Kim',
    email: 'david.k@university.edu',
    score: 89,
    timeSpent: '56 min',
    status: 'clean',
    violations: []
  },
  {
    id: 'student-7',
    name: 'Rachel Green',
    email: 'rachel.g@university.edu',
    score: 65,
    timeSpent: '60 min',
    status: 'flagged',
    violations: [
      { time: '10:18 AM', type: 'critical', message: 'Tab Switch Detected' },
      { time: '10:25 AM', type: 'critical', message: 'Tab Switch Detected' },
      { time: '10:39 AM', type: 'critical', message: 'Mobile Phone Detected' }
    ]
  },
  {
    id: 'student-8',
    name: 'Tom Wilson',
    email: 'tom.w@university.edu',
    score: 96,
    timeSpent: '54 min',
    status: 'clean',
    violations: []
  }
];

export function ResultsLogs() {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'clean' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResults = mockResults.filter(student => {
    const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const cleanCount = mockResults.filter(s => s.status === 'clean').length;
  const flaggedCount = mockResults.filter(s => s.status === 'flagged').length;
  const avgScore = Math.round(mockResults.reduce((sum, s) => sum + s.score, 0) / mockResults.length);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/instructor')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <img src="/logo.svg" className="w-6 h-6" alt="Logo" />
              <span className="text-blue-900 font-orbitron tracking-wider">RAQEEB</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Calculus Midterm Exam - Results</h1>
          <p className="text-gray-600">November 20, 2025 • 10:00 AM</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-1">Total Students</p>
            <p className="text-gray-900">{mockResults.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-1">Average Score</p>
            <p className="text-gray-900">{avgScore}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-1">Clean Status</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900">{cleanCount}</p>
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <p className="text-gray-600 mb-1">Flagged</p>
            <div className="flex items-center gap-2">
              <p className="text-gray-900">{flaggedCount}</p>
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === 'all' 
                    ? 'bg-blue-900 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus('clean')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === 'clean' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Clean
              </button>
              <button
                onClick={() => setFilterStatus('flagged')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterStatus === 'flagged' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Flagged
              </button>
            </div>

          </div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-gray-700">Student Name</th>
                  <th className="px-6 py-4 text-left text-gray-700">Email</th>
                  <th className="px-6 py-4 text-left text-gray-700">Score</th>
                  <th className="px-6 py-4 text-left text-gray-700">Time Spent</th>
                  <th className="px-6 py-4 text-left text-gray-700">Integrity Status</th>
                  <th className="px-6 py-4 text-left text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredResults.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition ${
                      index === filteredResults.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 text-gray-600">{student.email}</td>
                    <td className="px-6 py-4">
                      <span className={`${
                        student.score >= 90 ? 'text-green-600' :
                        student.score >= 70 ? 'text-blue-900' :
                        'text-red-600'
                      }`}>
                        {student.score}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{student.timeSpent}</td>
                    <td className="px-6 py-4">
                      {student.status === 'clean' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span>Clean</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Flagged ({student.violations.length})</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-900 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
