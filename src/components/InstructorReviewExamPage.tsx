import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Award, AlertTriangle, CheckCircle, XCircle, User, Brain, 
  FileText, LayoutDashboard, Database, Settings, HelpCircle, LogOut, Eye, 
  EyeOff, MonitorOff, Users as UsersIcon, Volume2, Send, Save, Edit3
} from 'lucide-react';

// Mock data for students with pending status
const studentsData = {
  'student-2': {
    name: 'Sarah Anderson',
    email: 'sarah.anderson@university.edu',
    studentId: 'STD-2024-002',
    status: 'pending', // pending or graded
    originalScore: 88,
    adjustedScore: 88
  },
  'student-3': {
    name: 'David Martinez',
    email: 'david.martinez@university.edu',
    studentId: 'STD-2024-003',
    status: 'pending',
    originalScore: 84,
    adjustedScore: 84
  },
  'student-5': {
    name: 'James Wilson',
    email: 'james.wilson@university.edu',
    studentId: 'STD-2024-005',
    status: 'pending',
    originalScore: 68,
    adjustedScore: 68
  }
};

// Mock exam questions with AI flags
const examQuestions = [
  { 
    id: 1, 
    question: 'What is the primary purpose of a neural network activation function?', 
    correctAnswer: 'To introduce non-linearity',
    studentAnswer: 'To introduce non-linearity',
    isCorrect: true,
    points: 4,
    flags: [] // No flags for this question
  },
  { 
    id: 2, 
    question: 'Which optimization algorithm is most commonly used in deep learning?', 
    correctAnswer: 'Adam',
    studentAnswer: 'Adam',
    isCorrect: true,
    points: 4,
    flags: [] 
  },
  { 
    id: 3, 
    question: 'What does CNN stand for in deep learning?', 
    correctAnswer: 'Convolutional Neural Network',
    studentAnswer: 'Convolutional Neural Network',
    isCorrect: true,
    points: 4,
    flags: [] 
  },
  { 
    id: 4, 
    question: 'What is backpropagation used for?', 
    correctAnswer: 'Training neural networks',
    studentAnswer: 'Training neural networks',
    isCorrect: true,
    points: 4,
    flags: [
      {
        type: 'tab_switch',
        severity: 'medium',
        timestamp: '10:45:12 AM',
        description: 'Student switched to another tab during this question',
        icon: Eye
      }
    ]
  },
  { 
    id: 5, 
    question: 'Which layer is typically used for image recognition tasks?', 
    correctAnswer: 'Convolutional Layer',
    studentAnswer: 'Recurrent Layer',
    isCorrect: false,
    points: 4,
    flags: [] 
  },
  { 
    id: 6, 
    question: 'What is the purpose of dropout in neural networks?', 
    correctAnswer: 'To prevent overfitting',
    studentAnswer: 'To prevent overfitting',
    isCorrect: true,
    points: 4,
    flags: [] 
  },
  { 
    id: 7, 
    question: 'What does ReLU stand for?', 
    correctAnswer: 'Rectified Linear Unit',
    studentAnswer: 'Rectified Linear Unit',
    isCorrect: true,
    points: 4,
    flags: [] 
  },
  { 
    id: 8, 
    question: 'Which metric is used to evaluate classification models?', 
    correctAnswer: 'Accuracy',
    studentAnswer: 'Accuracy',
    isCorrect: true,
    points: 4,
    flags: [
      {
        type: 'face_not_detected',
        severity: 'high',
        timestamp: '10:52:30 AM',
        description: 'Face not detected for 15 seconds during this question',
        icon: EyeOff
      }
    ]
  }
];

export function InstructorReviewExamPage() {
  const navigate = useNavigate();
  const { examId, studentId } = useParams();
  const [activeSection, setActiveSection] = useState('results');
  const [questionScores, setQuestionScores] = useState<Record<number, number>>(
    examQuestions.reduce((acc, q) => ({ ...acc, [q.id]: q.isCorrect ? q.points : 0 }), {})
  );
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const student = studentsData[studentId as keyof typeof studentsData];

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

  const totalScore = Object.values(questionScores).reduce((sum, score) => sum + score, 0);
  const maxScore = examQuestions.reduce((sum, q) => sum + q.points, 0);
  const percentageScore = Math.round((totalScore / maxScore) * 100);

  const handleScoreChange = (questionId: number, newScore: number) => {
    const question = examQuestions.find(q => q.id === questionId);
    if (question && newScore >= 0 && newScore <= question.points) {
      setQuestionScores(prev => ({ ...prev, [questionId]: newScore }));
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Changes saved successfully!');
  };

  const handlePublishResults = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPublishing(false);
    alert('Results published successfully! Student can now view their grade.');
    navigate(`/instructor/exam-results/${examId}`);
  };

  const totalFlags = examQuestions.reduce((sum, q) => sum + q.flags.length, 0);

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
        {/* Sticky Header */}
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {student?.name}
                    </h1>
                    {student?.status === 'pending' && (
                      <div className="px-3 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/50">
                        <span className="text-yellow-400 text-sm uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Pending Review
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{student?.email}</span>
                    <span>•</span>
                    <span>ID: {student?.studentId}</span>
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-gray-400 text-sm mb-1">Adjusted Score</div>
                  <div className={`text-4xl ${
                    percentageScore >= 90 ? 'text-green-400' :
                    percentageScore >= 80 ? 'text-blue-400' :
                    percentageScore >= 70 ? 'text-yellow-400' :
                    'text-orange-400'
                  }`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    {percentageScore}%
                  </div>
                  <div className="text-gray-400 text-sm">
                    {totalScore} / {maxScore} points
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Alert Banner if there are flags */}
            {totalFlags > 0 && (
              <div className="mb-6 rounded-2xl border p-6" style={{ 
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                backdropFilter: 'blur(10px)',
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center">
                    <AlertTriangle className="w-7 h-7 text-red-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-red-400 text-lg mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      {totalFlags} AI Violation{totalFlags > 1 ? 's' : ''} Detected
                    </h3>
                    <p className="text-gray-300">
                      Review each question carefully and adjust scores as needed based on the AI violations detected during the exam.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Questions Review */}
            <div className="space-y-4">
              {examQuestions.map((question, index) => {
                const currentScore = questionScores[question.id];
                const hasFlags = question.flags.length > 0;

                return (
                  <div
                    key={question.id}
                    className="rounded-2xl border bg-white/[0.02] border-white/10"
                    style={{ 
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <div className="p-6">
                      {/* Question Header */}
                      <div className="flex gap-4 items-start mb-4">
                        {/* Question Number Badge */}
                        <div 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border-2 ${
                            question.isCorrect
                              ? 'bg-green-500/20 border-green-500/50'
                              : 'bg-red-500/20 border-red-500/50'
                          }`}
                        >
                          <span 
                            className={question.isCorrect ? 'text-green-400' : 'text-red-400'} 
                            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
                          >
                            {question.id}
                          </span>
                        </div>

                        {/* Question Text */}
                        <div className="flex-1">
                          <p className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                            {question.question}
                          </p>
                        </div>

                        {/* Score Badge */}
                        <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                          <span className="text-blue-400 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                            {currentScore}/{question.points} pts
                          </span>
                        </div>
                      </div>

                      {/* Answers */}
                      <div className="grid md:grid-cols-2 gap-4 ml-14">
                        {/* Student Answer */}
                        <div className={`p-4 rounded-xl border ${
                          question.isCorrect 
                            ? 'bg-green-500/10 border-green-500/30' 
                            : 'bg-red-500/10 border-red-500/30'
                        }`}>
                          <div className="flex items-center gap-2 mb-2">
                            {question.isCorrect ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Student Answer
                            </span>
                          </div>
                          <p className={question.isCorrect ? 'text-green-300' : 'text-red-300'} style={{ fontFamily: 'Inter, sans-serif' }}>
                            {question.studentAnswer}
                          </p>
                        </div>

                        {/* Correct Answer */}
                        <div className="p-4 rounded-xl border bg-blue-500/10 border-blue-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-400 text-xs uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                              Correct Answer
                            </span>
                          </div>
                          <p className="text-blue-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {question.correctAnswer}
                          </p>
                        </div>
                      </div>

                      {/* Score Adjustment - Show for all questions */}
                      <div className="mt-4 ml-14 flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/10">
                        <span className="text-gray-300 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Adjust Score:
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleScoreChange(question.id, Math.max(0, currentScore - 1))}
                            disabled={currentScore === 0}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            −
                          </button>
                          <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-400/30 min-w-[80px] text-center">
                            <span className="text-blue-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                              {currentScore}/{question.points}
                            </span>
                          </div>
                          <button
                            onClick={() => handleScoreChange(question.id, Math.min(question.points, currentScore + 1))}
                            disabled={currentScore === question.points}
                            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex items-center gap-4">
              <button
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-500/20 border border-blue-500/50 text-blue-400 hover:bg-blue-500/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </span>
              </button>
              <button
                onClick={handlePublishResults}
                disabled={isPublishing}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {isPublishing ? 'Publishing...' : 'Publish Results to Student'}
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}