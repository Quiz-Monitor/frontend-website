import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Lock, CheckCircle } from 'lucide-react';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Demo: Show success and navigate to login
    alert('Password reset successful!');
    navigate('/login');
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
            <h1 className="text-white mb-2">Create New Password</h1>
            <p className="text-gray-400">Enter your new password below</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Field */}
            <div>
              <label className="block text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Enter new password"
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                    focusedField === 'password' 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : 'border-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-gray-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Re-enter new password"
                  className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                    focusedField === 'confirmPassword' 
                      ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                      : 'border-white/10'
                  }`}
                />
              </div>
            </div>

            {/* Password Requirements */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-gray-300 mb-2">Password must contain:</p>
              <ul className="space-y-1 text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                  One number or special character
                </li>
              </ul>
            </div>

            {/* Reset Password Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition"
            >
              Reset Password
            </button>
          </form>
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