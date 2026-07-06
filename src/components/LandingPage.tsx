import { useNavigate } from 'react-router-dom';
import { Brain, CheckCircle, Shield, Zap } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" className="w-8 h-8" alt="Logo" />
            <span className="text-blue-900 font-orbitron tracking-wider">RAQEEB</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-blue-900 hover:bg-blue-50 rounded-lg transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-blue-900 mb-6 max-w-4xl mx-auto">
          Smart Exams with AI Integrity
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Advanced AI-powered proctoring and auto-grading for educational institutions.
          Maintain exam integrity while providing a seamless experience for students.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition shadow-lg"
          >
            Get Started Free
          </button>
          <button
            onClick={() => navigate('/student')}
            className="px-8 py-3 border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition"
          >
            Enter Exam Code
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-blue-900 mb-3">Auto-grading</h3>
            <p className="text-gray-600">
              Instantly grade multiple-choice and short-answer questions with AI-powered accuracy. Save hours of manual work.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Brain className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-blue-900 mb-3">AI Behavior Analysis</h3>
            <p className="text-gray-600">
              Real-time monitoring of student behavior with intelligent detection of suspicious activities and violations.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-900" />
            </div>
            <h3 className="text-blue-900 mb-3">Secure Environment</h3>
            <p className="text-gray-600">
              Browser lockdown, tab detection, and comprehensive logging ensure exam integrity from start to finish.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="max-w-7xl mx-auto px-6 py-16 mb-20">
        <div className="bg-blue-900 text-white rounded-2xl p-12 text-center">
          <h2 className="mb-4">Trusted by Leading Institutions</h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of educators who trust ExamGuard AI to maintain academic integrity while providing a fair testing environment.
          </p>
          <div className="flex gap-6 justify-center items-center">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>99.9% Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
