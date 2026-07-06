import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Mail, Lock, User } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { register, mapUiRoleToApi } from '../services/authService';

export function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phoneNumber: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculation
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 25;
    if (/[^a-zA-Z\d]/.test(password)) strength += 25;
    
    if (strength <= 25) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 50) return { strength, label: 'Fair', color: 'bg-orange-500' };
    if (strength <= 75) return { strength, label: 'Good', color: 'bg-yellow-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      const apiRole = mapUiRoleToApi(formData.role || 'student');

      const response = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.name,
        role: apiRole,
        phoneNumber: formData.phoneNumber.trim() || null
      });

      const uiRole = response.user.role.toLowerCase() === 'instructor' ? 'instructor' : 'student';
      if (uiRole === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/student');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex overflow-hidden relative">
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/30 to-purple-900/30 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Left Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 mb-8 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition">
              <img src="/logo.svg" className="w-7 h-7" alt="Logo" />
            </div>
            <span className="text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-orbitron tracking-wider">
              RAQEEB
            </span>
          </button>

          {/* Glass Card Container */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-white mb-2">Create Your Account</h1>
              <p className="text-gray-400">Join thousands of educators and students</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
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

              {/* Role Field */}
              <div>
                <label className="block text-gray-300 mb-2">Role</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'instructor' })}
                    className={`w-full py-2 rounded-xl border text-sm transition ${
                      formData.role === 'instructor'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-cyan-400/60'
                    }`}
                  >
                    Instructor
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'student' })}
                    className={`w-full py-2 rounded-xl border text-sm transition ${
                      formData.role === 'student'
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-cyan-400/60'
                    }`}
                  >
                    Student
                  </button>
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
                    placeholder="Create a strong password"
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                      focusedField === 'password' 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                        : 'border-white/10'
                    }`}
                  />
                </div>
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-400">Password Strength</span>
                      <span className={`${
                        passwordStrength.strength <= 25 ? 'text-red-400' :
                        passwordStrength.strength <= 50 ? 'text-orange-400' :
                        passwordStrength.strength <= 75 ? 'text-yellow-400' :
                        'text-green-400'
                      }`}>{passwordStrength.label}</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${passwordStrength.strength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-gray-300 mb-2">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Re-enter your password"
                    className={`w-full pl-12 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                      focusedField === 'confirmPassword' 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                        : 'border-white/10'
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number Field (Optional) */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Phone Number <span className="text-gray-500">(optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    onFocus={() => setFocusedField('phoneNumber')}
                    onBlur={() => setFocusedField(null)}
                    placeholder="01101723376"
                    className={`w-full pl-4 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none transition ${
                      focusedField === 'phoneNumber' 
                        ? 'border-cyan-400 shadow-lg shadow-cyan-500/50' 
                        : 'border-white/10'
                    }`}
                  />
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-2">
                <input type="checkbox" required className="w-4 h-4 mt-1 rounded" />
                <label className="text-gray-400">
                  I agree to the <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">Terms of Service</span> and <span className="text-cyan-400 hover:text-cyan-300 cursor-pointer">Privacy Policy</span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl transition ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-2xl hover:shadow-blue-500/50'
                }`}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

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

      {/* Right Side: Visual */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8 relative">
        <div className="relative w-full max-w-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1664123690858-eb2ad2b13a80?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnbG93aW5nJTIwZGlnaXRhbCUyMHNoaWVsZCUyMHNlY3VyaXR5fGVufDF8fHx8MTc2NDMzMjk2Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Digital Security Shield"
            className="relative rounded-3xl opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
