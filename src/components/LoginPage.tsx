import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { login } from '../services/authService';

export function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });

      const role = response.user.role?.toLowerCase();
      if (role === 'instructor' || role === 'educator') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden relative" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

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
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-white mb-2">Welcome Back</h1>
              <p className="text-gray-400">Secure access to your exams</p>
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
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-300 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                      focusedField === 'password' 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                        : 'border-white/10'
                    }`}
                  />
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-cyan-400 hover:text-cyan-300 transition"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl transition ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-blue-500/50'
                }`}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </form>



            {/* Register Link */}
            <div className="mt-6 pt-6 border-t border-white/10 text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="text-cyan-400 hover:text-cyan-300 transition"
                >
                  Create Account
                </button>
              </p>
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
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1761740533449-b8d4385e60b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMDNEJTIwZGlnaXRhbCUyMG5ldHdvcmt8ZW58MXx8fHwxNzY0MzMyOTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Digital Network"
            className="relative rounded-3xl opacity-80"
          />
        </div>
      </div>
    </div>
  );
}