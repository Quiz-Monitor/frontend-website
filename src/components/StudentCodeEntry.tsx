import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LogIn, Shield } from 'lucide-react';

export function StudentCodeEntry() {
  const navigate = useNavigate();
  const [examCode, setExamCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (examCode.trim()) {
      // For demo purposes, route to waiting room
      navigate(`/student/waiting/exam-${Date.now()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <Brain className="w-7 h-7 text-blue-900" />
            </div>
          </div>
          <h1 className="text-white mb-2">ExamGuard AI</h1>
          <p className="text-blue-100">Student Exam Portal</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-900 mb-2 text-center">Enter Exam Code</h2>
          <p className="text-gray-600 text-center mb-8">
            Please enter the code provided by your instructor
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={examCode}
                onChange={(e) => setExamCode(e.target.value.toUpperCase())}
                placeholder="XX-0000"
                maxLength={7}
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-xl text-center text-gray-900 tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                style={{ fontSize: '1.5rem' }}
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition shadow-lg"
            >
              <LogIn className="w-5 h-5" />
              Join Exam
            </button>
          </form>

          {/* Quick Access (Demo) */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-center mb-3">Demo Quick Access</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setExamCode('XF-9022')}
                className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition"
              >
                XF-9022
              </button>
              <button
                onClick={() => setExamCode('CS-1045')}
                className="px-4 py-2 bg-blue-50 text-blue-900 rounded-lg hover:bg-blue-100 transition"
              >
                CS-1045
              </button>
            </div>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-2 text-white mb-2">
            <Shield className="w-4 h-4" />
            <span>Secure Exam Environment</span>
          </div>
          <p className="text-blue-100">
            This exam uses AI proctoring. Please ensure you're in a quiet, well-lit space.
          </p>
        </div>
      </div>
    </div>
  );
}
