import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Navigate to reset password page
    navigate('/reset-password');
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 pointer-events-none" />
      <div className="fixed top-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 mb-12 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ExamGuard AI
            </span>
          </button>

          {/* Glass Card Container */}
          <div 
            className="backdrop-blur-xl rounded-3xl p-8 relative"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* 3D Lock Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-3xl blur-2xl" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <KeyRound className="w-12 h-12 text-cyan-400" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-white mb-2">Trouble Logging In?</h1>
              <p className="text-gray-400 leading-relaxed">
                Enter your email and we'll send you a recovery link to reset your password.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@university.edu"
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                      focusedField === 'email' 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                        : 'border-white/10'
                    }`}
                  />
                </div>
                <p className="text-gray-500 mt-2">
                  We'll send you a secure link to reset your password
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition"
              >
                Send Recovery Link
              </button>
            </form>

            {/* Back to Login */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-white transition"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Right Side: Visual */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
        <div className="relative w-full max-w-2xl" style={{ height: 'fit-content' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1757051424787-72dff216e1f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXR1cmlzdGljJTIwbG9jayUyMGtleSUyMDNEfGVufDF8fHx8MTc2NDMzMjk4Mnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Security Lock"
            className="relative rounded-3xl opacity-80"
          />
        </div>
      </div>
    </div>
  );
}