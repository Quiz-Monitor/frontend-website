import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User } from 'lucide-react';

export function SignUpStep1() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Store data and move to step 2
    localStorage.setItem('signupData', JSON.stringify(formData));
    navigate('/signup/role-selection');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden relative" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 pointer-events-none" />
      <div className="fixed top-1/4 right-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-3 mb-8 group mx-auto justify-center"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition">
            <img src="/logo.svg" className="w-7 h-7" alt="Logo" />
          </div>
          <span className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-orbitron tracking-wider">
            RAQEEB
          </span>
        </button>

        {/* Glass Card */}
        <div 
          className="backdrop-blur-xl rounded-3xl p-8 relative"
          style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderTop: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-white mb-2">Create your free account</h1>
            <p className="text-gray-400">Get started with ExamGuard AI today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-gray-300 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                    focusedField === 'name' 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : 'border-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Email Address */}
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

            {/* Password */}
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
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                    focusedField === 'password' 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : 'border-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Next Step Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition"
            >
              Next Step
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-transparent text-gray-400">Or sign up with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign up with Google
            </button>
            <button
              type="button"
              className="w-full py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V8h11.4v16zM24 8v16h-11.4V8H24zM11.4 0v6.8H0V0h11.4zm12.6 0v6.8H12.6V0H24z"/>
              </svg>
              Sign up with Microsoft
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                Sign In
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
  );
}