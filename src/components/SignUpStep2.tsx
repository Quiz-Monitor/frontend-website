import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Building2, GraduationCap } from 'lucide-react';
import { register, mapUiRoleToApi } from '../services/authService';

export function SignUpStep2() {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
   const [loadingRole, setLoadingRole] = useState<'educator' | 'student' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoleSelect = async (role: 'educator' | 'student') => {
    setError(null);
    setLoadingRole(role);

    try {
      const stored = localStorage.getItem('signupData');
      if (!stored) {
        navigate('/signup');
        return;
      }

      const signupData = JSON.parse(stored) as {
        name: string;
        email: string;
        password: string;
      };

      const apiRole = mapUiRoleToApi(role);

      const response = await register({
        email: signupData.email,
        password: signupData.password,
        fullName: signupData.name,
        role: apiRole,
        phoneNumber: null,
      });

      localStorage.removeItem('signupData');

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
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden relative" style={{ backgroundColor: '#0F111A' }}>
      {/* Subtle background glow */}
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="w-full max-w-6xl relative z-10">
        {/* Headline */}
        <div className="text-center mb-16">
          <h2 className="text-white mb-3" style={{ fontSize: '2.5rem', fontWeight: '700' }}>Choose Your Role</h2>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Educator Card */}
          <button
            onClick={() => handleRoleSelect('educator')}
            disabled={loadingRole === 'educator'}
            onMouseEnter={() => setHoveredCard('educator')}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative p-10 text-left transition-all duration-300 backdrop-blur-xl rounded-2xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              border: hoveredCard === 'educator' ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: hoveredCard === 'educator' 
                ? '0 0 30px rgba(99, 102, 241, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Badge */}
            <div className="absolute top-6 right-6">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                No school approval needed!
              </div>
            </div>

            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: hoveredCard === 'educator' ? 'rgba(99, 102, 241, 0.15)' : '#2D3246'
                }}
              >
                <Building2 className="w-12 h-12 text-blue-400" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white text-center mb-3" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              Educator
            </h3>

            {/* Subtitle */}
            <p className="text-center mb-8" style={{ color: '#9CA3AF', fontSize: '1rem' }}>
              Create and manage exams, analyze student performance.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}></div>
                <span className="text-white">Create AI-powered exams</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}></div>
                <span className="text-white">Automated grading</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}></div>
                <span className="text-white">Advanced analytics</span>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            {hoveredCard === 'educator' && (
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                  borderRadius: '16px'
                }} 
              />
            )}
          </button>

          {/* Student Card */}
          <button
            onClick={() => handleRoleSelect('student')}
            disabled={loadingRole === 'student'}
            onMouseEnter={() => setHoveredCard('student')}
            onMouseLeave={() => setHoveredCard(null)}
            className="relative p-10 text-left transition-all duration-300 backdrop-blur-xl rounded-2xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              border: hoveredCard === 'student' ? '1px solid rgba(139, 92, 246, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: hoveredCard === 'student' 
                ? '0 0 30px rgba(139, 92, 246, 0.3), 0 25px 50px -12px rgba(0, 0, 0, 0.25)' 
                : '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
            }}
          >
            {/* Badge */}
            <div className="absolute top-6 right-6">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full" style={{ fontSize: '0.75rem', fontWeight: '700' }}>
                No school approval needed!
              </div>
            </div>

            {/* Icon */}
            <div className="mb-8 flex justify-center">
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  backgroundColor: hoveredCard === 'student' ? 'rgba(139, 92, 246, 0.15)' : '#2D3246'
                }}
              >
                <GraduationCap className="w-12 h-12 text-purple-400" strokeWidth={1.5} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-white text-center mb-3" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              Student
            </h3>

            {/* Subtitle */}
            <p className="text-center mb-8" style={{ color: '#9CA3AF', fontSize: '1rem' }}>
              Take exams, review your scores, and track your progress.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}></div>
                <span className="text-white">Easy-to-use interface</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}></div>
                <span className="text-white">Instant feedback</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)' }}></div>
                <span className="text-white">Performance tracking</span>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            {hoveredCard === 'student' && (
              <div 
                className="absolute inset-0 pointer-events-none" 
                style={{ 
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
                  borderRadius: '16px'
                }} 
              />
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 text-center text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-gray-400 hover:text-white transition"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}