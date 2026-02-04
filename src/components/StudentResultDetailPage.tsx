import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Calendar, Award, AlertTriangle, CheckCircle,
  XCircle, User, Brain, FileText, LayoutDashboard, Database,
  Shield, Settings, HelpCircle, LogOut, Eye, EyeOff, MonitorOff,
  Users as UsersIcon, Volume2
} from 'lucide-react';

const studentData = {
  'student-1': {
    name: 'Michael Johnson',
    email: 'michael.johnson@university.edu',
    studentId: 'STD-2024-001',
    startTime: '10:00:00 AM',
    submitTime: '11:05:23 AM',
    duration: '65 min 23 sec',
    score: 92,
    totalQuestions: 25,
    correctAnswers: 23,
    wrongAnswers: 2,
    flags: []
  },
  'student-2': {
    name: 'Sarah Anderson',
    email: 'sarah.anderson@university.edu',
    studentId: 'STD-2024-002',
    startTime: '10:02:15 AM',
    submitTime: '11:12:40 AM',
    duration: '70 min 25 sec',
    score: 88,
    totalQuestions: 25,
    correctAnswers: 22,
    wrongAnswers: 3,
    flags: [
      {
        id: 1,
        type: 'tab_switch',
        severity: 'medium',
        timestamp: '10:45:12 AM',
        description: 'Student switched to another tab',
        icon: Eye
      }
    ]
  },
  'student-3': {
    name: 'David Martinez',
    email: 'david.martinez@university.edu',
    studentId: 'STD-2024-003',
    startTime: '10:01:30 AM',
    submitTime: '11:15:45 AM',
    duration: '74 min 15 sec',
    score: 84,
    totalQuestions: 25,
    correctAnswers: 21,
    wrongAnswers: 4,
    flags: [
      {
        id: 1,
        type: 'face_not_detected',
        severity: 'high',
        timestamp: '10:25:30 AM',
        description: 'Face not detected for 15 seconds',
        icon: EyeOff
      },
      {
        id: 2,
        type: 'multiple_faces',
        severity: 'high',
        timestamp: '10:42:18 AM',
        description: 'Multiple faces detected in frame',
        icon: UsersIcon
      }
    ]
  },
  'student-4': {
    name: 'Emily Thompson',
    email: 'emily.thompson@university.edu',
    studentId: 'STD-2024-004',
    startTime: '10:08:00 AM',
    submitTime: '11:10:00 AM',
    duration: '62 min 00 sec',
    score: 76,
    totalQuestions: 25,
    correctAnswers: 19,
    wrongAnswers: 6,
    flags: []
  },
  'student-5': {
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    studentId: 'STD-2024-005',
    startTime: '10:03:20 AM',
    submitTime: '11:10:15 AM',
    duration: '67 min 55 sec',
    score: 68,
    totalQuestions: 25,
    correctAnswers: 17,
    wrongAnswers: 8,
    flags: [
      {
        id: 1,
        type: 'screen_off',
        severity: 'high',
        timestamp: '10:15:45 AM',
        description: 'Camera turned off for 8 seconds',
        icon: MonitorOff
      },
      {
        id: 2,
        type: 'audio_detected',
        severity: 'medium',
        timestamp: '10:35:20 AM',
        description: 'Unusual audio detected in background',
        icon: Volume2
      },
      {
        id: 3,
        type: 'tab_switch',
        severity: 'medium',
        timestamp: '10:58:10 AM',
        description: 'Student switched to another tab',
        icon: Eye
      }
    ]
  },
  'student-6': {
    name: 'Sophia Lee',
    email: 'sophia.lee@university.edu',
    studentId: 'STD-2024-006',
    startTime: '10:12:00 AM',
    submitTime: '11:18:00 AM',
    duration: '66 min 00 sec',
    score: 96,
    totalQuestions: 25,
    correctAnswers: 24,
    wrongAnswers: 1,
    flags: []
  },
  'student-7': {
    name: 'Daniel Brown',
    email: 'daniel.brown@university.edu',
    studentId: 'STD-2024-007',
    startTime: '10:15:00 AM',
    submitTime: '11:25:00 AM',
    duration: '70 min 00 sec',
    score: 80,
    totalQuestions: 25,
    correctAnswers: 20,
    wrongAnswers: 5,
    flags: [
      {
        id: 1,
        type: 'tab_switch',
        severity: 'medium',
        timestamp: '10:48:30 AM',
        description: 'Student switched to another tab',
        icon: Eye
      }
    ]
  },
  'student-8': {
    name: 'Olivia Davis',
    email: 'olivia.davis@university.edu',
    studentId: 'STD-2024-008',
    startTime: '10:18:00 AM',
    submitTime: '11:22:00 AM',
    duration: '64 min 00 sec',
    score: 72,
    totalQuestions: 25,
    correctAnswers: 18,
    wrongAnswers: 7,
    flags: [
      {
        id: 1,
        type: 'face_not_detected',
        severity: 'high',
        timestamp: '10:55:15 AM',
        description: 'Face not detected for 12 seconds',
        icon: EyeOff
      },
      {
        id: 2,
        type: 'tab_switch',
        severity: 'medium',
        timestamp: '11:08:45 AM',
        description: 'Student switched to another tab',
        icon: Eye
      }
    ]
  }
};

const examQuestions = [
  { id: 1, question: 'What is the primary purpose of a neural network activation function?', studentAnswer: 'To introduce non-linearity', correctAnswer: 'To introduce non-linearity', isCorrect: true },
  { id: 2, question: 'Which optimization algorithm is most commonly used in deep learning?', studentAnswer: 'Adam', correctAnswer: 'Adam', isCorrect: true },
  { id: 3, question: 'What does CNN stand for in deep learning?', studentAnswer: 'Convolutional Neural Network', correctAnswer: 'Convolutional Neural Network', isCorrect: true },
  { id: 4, question: 'What is backpropagation used for?', studentAnswer: 'Training neural networks', correctAnswer: 'Training neural networks', isCorrect: true },
  { id: 5, question: 'Which layer is typically used for image recognition tasks?', studentAnswer: 'Recurrent Layer', correctAnswer: 'Convolutional Layer', isCorrect: false },
  { id: 6, question: 'What is the purpose of dropout in neural networks?', studentAnswer: 'To prevent overfitting', correctAnswer: 'To prevent overfitting', isCorrect: true },
  { id: 7, question: 'What does ReLU stand for?', studentAnswer: 'Rectified Linear Unit', correctAnswer: 'Rectified Linear Unit', isCorrect: true },
  { id: 8, question: 'Which metric is used to evaluate classification models?', studentAnswer: 'Accuracy', correctAnswer: 'Accuracy', isCorrect: true },
  { id: 9, question: 'What is gradient descent?', studentAnswer: 'An optimization algorithm', correctAnswer: 'An optimization algorithm', isCorrect: true },
  { id: 10, question: 'What is the vanishing gradient problem?', studentAnswer: 'When gradients become too small', correctAnswer: 'When gradients become too small', isCorrect: true },
  { id: 11, question: 'Which activation function outputs values between 0 and 1?', studentAnswer: 'Sigmoid', correctAnswer: 'Sigmoid', isCorrect: true },
  { id: 12, question: 'What is transfer learning?', studentAnswer: 'Using pre-trained models', correctAnswer: 'Using pre-trained models', isCorrect: true },
  { id: 13, question: 'What does LSTM stand for?', studentAnswer: 'Long Short-Term Memory', correctAnswer: 'Long Short-Term Memory', isCorrect: true },
  { id: 14, question: 'What is the purpose of pooling layers?', studentAnswer: 'Dimensionality reduction', correctAnswer: 'Dimensionality reduction', isCorrect: true },
  { id: 15, question: 'Which loss function is used for binary classification?', studentAnswer: 'Cross-entropy', correctAnswer: 'Binary Cross-entropy', isCorrect: false },
  { id: 16, question: 'What is batch normalization?', studentAnswer: 'Normalizing layer inputs', correctAnswer: 'Normalizing layer inputs', isCorrect: true },
  { id: 17, question: 'What is the purpose of an embedding layer?', studentAnswer: 'Convert words to vectors', correctAnswer: 'Convert words to vectors', isCorrect: true },
  { id: 18, question: 'Which neural network type is best for sequence data?', studentAnswer: 'RNN', correctAnswer: 'RNN', isCorrect: true },
  { id: 19, question: 'What is data augmentation?', studentAnswer: 'Artificially expanding training data', correctAnswer: 'Artificially expanding training data', isCorrect: true },
  { id: 20, question: 'What is the learning rate in neural networks?', studentAnswer: 'Step size for gradient descent', correctAnswer: 'Step size for gradient descent', isCorrect: true },
  { id: 21, question: 'What is a GAN?', studentAnswer: 'Generative Adversarial Network', correctAnswer: 'Generative Adversarial Network', isCorrect: true },
  { id: 22, question: 'What is early stopping?', studentAnswer: 'Stopping training to prevent overfitting', correctAnswer: 'Stopping training to prevent overfitting', isCorrect: true },
  { id: 23, question: 'What is the purpose of padding in CNNs?', studentAnswer: 'Maintain spatial dimensions', correctAnswer: 'Maintain spatial dimensions', isCorrect: true },
  { id: 24, question: 'Which optimizer uses momentum?', studentAnswer: 'SGD with momentum', correctAnswer: 'SGD with momentum', isCorrect: true },
  { id: 25, question: 'What is the softmax function used for?', studentAnswer: 'Multi-class classification', correctAnswer: 'Multi-class classification', isCorrect: true }
];

export function StudentResultDetailPage() {
  const navigate = useNavigate();
  const { examId, studentId } = useParams();
  const [activeSection, setActiveSection] = useState('results');

  const student = studentData[studentId as keyof typeof studentData];

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results Database', icon: Database },
  ];

  const utilityItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const severityConfig = {
    high: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/50' },
    medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/50' },
    low: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/50' }
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
      <div className="flex-1 relative z-10 overflow-y-auto">
        {/* Header */}
        <header className="border-b sticky top-0 z-20" style={{ 
          backgroundColor: 'rgba(15, 17, 26, 0.95)',
          backdropFilter: 'blur(20px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="px-8 py-6">
            {/* Back Button */}
            <button
              onClick={() => navigate(`/instructor/exam-results/${examId}`)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>Back to Student List</span>
            </button>

            {/* Student Info Header */}
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-white text-3xl mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {student?.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{student?.email}</span>
                  <span>•</span>
                  <span>ID: {student?.studentId}</span>
                </div>
              </div>
              <div className={`flex items-center justify-center w-24 h-24 rounded-2xl border-4 ${
                student?.score >= 90 ? 'bg-green-500/20 border-green-500/50' :
                student?.score >= 80 ? 'bg-blue-500/20 border-blue-500/50' :
                student?.score >= 70 ? 'bg-yellow-500/20 border-yellow-500/50' :
                'bg-orange-500/20 border-orange-500/50'
              }`}>
                <div className="text-center">
                  <div className={`text-4xl ${
                    student?.score >= 90 ? 'text-green-400' :
                    student?.score >= 80 ? 'text-blue-400' :
                    student?.score >= 70 ? 'text-yellow-400' :
                    'text-orange-400'
                  }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {student?.score}
                  </div>
                  <div className="text-xs text-gray-400">SCORE</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Start Time */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Clock className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Started At</div>
                    <div className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {student?.startTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Time */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Submitted At</div>
                    <div className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {student?.submitTime}
                    </div>
                  </div>
                </div>
              </div>

              {/* Duration */}
              <div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Award className="w-7 h-7 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Total Duration</div>
                    <div className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {student?.duration}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Violation Flags */}
            {student?.flags && student.flags.length > 0 && (
              <div className="rounded-2xl border p-6 mb-8" style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      AI Violation Flags ({student.flags.length})
                    </h2>
                    <p className="text-gray-400 text-sm">Suspicious activities detected during the exam</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {student.flags.map((flag) => {
                    const severity = severityConfig[flag.severity as keyof typeof severityConfig];
                    const Icon = flag.icon;
                    return (
                      <div
                        key={flag.id}
                        className={`flex items-center gap-4 p-4 rounded-xl border ${severity.bg} ${severity.border}`}
                      >
                        <div className={`w-12 h-12 rounded-lg ${severity.bg} border ${severity.border} flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${severity.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className={`${severity.color}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              {flag.description}
                            </h3>
                            <div className={`px-2 py-1 rounded-md text-xs uppercase ${severity.bg} ${severity.color} border ${severity.border}`}>
                              {flag.severity}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{flag.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Questions & Answers */}
            <div className="rounded-2xl border p-6" style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              borderColor: 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-white text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Questions & Answers
                    </h2>
                    <p className="text-gray-400 text-sm">Detailed breakdown of all exam questions</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/50">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {student?.correctAnswers} Correct
                    </span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50">
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {student?.wrongAnswers} Wrong
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {examQuestions.map((q, index) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      q.isCorrect
                        ? 'bg-green-500/5 border-green-500/30 hover:bg-green-500/10'
                        : 'bg-red-500/5 border-red-500/30 hover:bg-red-500/10'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Question Number */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        q.isCorrect
                          ? 'bg-green-500/20 border-2 border-green-500/50'
                          : 'bg-red-500/20 border-2 border-red-500/50'
                      }`}>
                        <span className={`text-sm ${q.isCorrect ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          {index + 1}
                        </span>
                      </div>

                      {/* Question Content */}
                      <div className="flex-1">
                        <p className="text-white text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {q.question}
                        </p>
                        
                        <div className="space-y-1.5">
                          {/* Student Answer */}
                          <div className={`flex items-center gap-2 p-2 rounded-lg ${
                            q.isCorrect ? 'bg-green-500/10' : 'bg-red-500/10'
                          }`}>
                            <span className="text-gray-400 text-xs min-w-[100px]">Student Answer:</span>
                            <span className={`text-sm ${q.isCorrect ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              {q.studentAnswer}
                            </span>
                          </div>

                          {/* Correct Answer if wrong */}
                          {!q.isCorrect && (
                            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
                              <span className="text-gray-400 text-xs min-w-[100px]">Correct Answer:</span>
                              <span className="text-green-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                                {q.correctAnswer}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Status Icon */}
                      <div className="flex-shrink-0">
                        {q.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-400" />
                        )}
                      </div>
                    </div>
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