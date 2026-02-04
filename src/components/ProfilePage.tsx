import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  FileText, 
  History, 
  User, 
  LogOut,
  Camera,
  Mail,
  Globe,
  Save,
  X,
  CheckCircle,
  Database
} from 'lucide-react';

interface ProfilePageProps {
  userRole: 'student' | 'instructor';
}

export function ProfilePage({ userRole }: ProfilePageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaved, setIsSaved] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    language: 'en',
    institution: 'Stanford University',
    department: 'Computer Science'
  });

  const [tempData, setTempData] = useState({ ...profileData });
  const [hasChanges, setHasChanges] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'de', name: 'German (Deutsch)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ar', name: 'Arabic (العربية)' },
    { code: 'pt', name: 'Portuguese (Português)' },
    { code: 'ru', name: 'Russian (Русский)' },
    { code: 'hi', name: 'Hindi (हिन्दी)' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setTempData({ ...tempData, [field]: value });
    setHasChanges(true);
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setHasChanges(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setHasChanges(false);
  };

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      navigate(userRole === 'instructor' ? '/instructor' : '/student');
    } else if (tab === 'exams') {
      navigate(userRole === 'instructor' ? '/instructor/my-exams' : '/student/my-exams');
    } else if (tab === 'results' && userRole === 'instructor') {
      navigate('/instructor/results-database');
    } else if (tab === 'history' && userRole === 'student') {
      navigate('/student/history');
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Sidebar */}
      <aside 
        className="w-64 flex-shrink-0 border-r backdrop-blur-xl sticky top-0 h-screen"
        style={{ 
          backgroundColor: 'rgba(30, 34, 48, 0.6)',
          borderColor: '#2D3246'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 p-6 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              ExamGuard AI
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <div className="space-y-2">
              <button
                onClick={() => handleNavigation('dashboard')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-all"
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => handleNavigation('exams')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-all"
              >
                <FileText className="w-5 h-5" />
                <span>My Exams</span>
              </button>

              {userRole === 'instructor' ? (
                <button
                  onClick={() => handleNavigation('results')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                  <Database className="w-5 h-5" />
                  <span>Results Database</span>
                </button>
              ) : (
                <button
                  onClick={() => handleNavigation('history')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                  <History className="w-5 h-5" />
                  <span>History</span>
                </button>
              )}

              <button
                onClick={() => handleNavigation('profile')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                  boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
                }}
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </button>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t" style={{ borderColor: '#2D3246' }}>
            <button
              onClick={() => navigate('/login')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white mb-2" style={{ fontSize: '2rem', fontWeight: '600' }}>
              Profile Settings
            </h1>
            <p className="text-gray-400">Manage your account information and preferences</p>
          </div>

          {/* Success Message */}
          {isSaved && (
            <div 
              className="mb-6 p-4 rounded-xl flex items-center gap-3 backdrop-blur-xl border"
              style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                borderColor: 'rgba(34, 197, 94, 0.3)'
              }}
            >
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400">Profile updated successfully!</span>
            </div>
          )}

          {/* Profile Photo Section */}
          <div 
            className="p-8 rounded-2xl mb-6 backdrop-blur-xl border"
            style={{
              backgroundColor: 'rgba(30, 34, 48, 0.6)',
              borderColor: '#2D3246'
            }}
          >
            <h2 className="text-white mb-6" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                  style={{ fontSize: '2rem', fontWeight: '600', color: 'white' }}
                >
                  {tempData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <button 
                  className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-blue-500/50 transition"
                >
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-white mb-1">{tempData.name}</h3>
                <p className="text-gray-400 mb-3">{tempData.email}</p>
                <button className="px-4 py-2 rounded-lg border text-cyan-400 hover:bg-cyan-500/10 transition" style={{ borderColor: 'rgba(34, 211, 238, 0.3)' }}>
                  Change Photo
                </button>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div 
            className="p-8 rounded-2xl mb-6 backdrop-blur-xl border"
            style={{
              backgroundColor: 'rgba(30, 34, 48, 0.6)',
              borderColor: '#2D3246'
            }}
          >
            <h2 className="text-white mb-6" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Personal Information
            </h2>
            
            <div className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={tempData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 border focus:outline-none transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50"
                    style={{
                      backgroundColor: 'rgba(15, 17, 26, 0.8)',
                      borderColor: '#2D3246'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={tempData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 border focus:outline-none transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50"
                    style={{
                      backgroundColor: 'rgba(15, 17, 26, 0.8)',
                      borderColor: '#2D3246'
                    }}
                  />
                </div>
              </div>

              {/* Institution (Instructor Only) */}
              {userRole === 'instructor' && (
                <>
                  <div>
                    <label className="block text-gray-300 mb-2">Institution</label>
                    <input
                      type="text"
                      value={tempData.institution}
                      onChange={(e) => handleInputChange('institution', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border focus:outline-none transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50"
                      style={{
                        backgroundColor: 'rgba(15, 17, 26, 0.8)',
                        borderColor: '#2D3246'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Department</label>
                    <input
                      type="text"
                      value={tempData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl text-white placeholder-gray-500 border focus:outline-none transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50"
                      style={{
                        backgroundColor: 'rgba(15, 17, 26, 0.8)',
                        borderColor: '#2D3246'
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Language Preferences */}
          <div 
            className="p-8 rounded-2xl mb-6 backdrop-blur-xl border"
            style={{
              backgroundColor: 'rgba(30, 34, 48, 0.6)',
              borderColor: '#2D3246'
            }}
          >
            <h2 className="text-white mb-6" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              Language & Region
            </h2>
            
            <div>
              <label className="block text-gray-300 mb-2">Preferred Language</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={tempData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-white border focus:outline-none transition focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-500/50 appearance-none cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(15, 17, 26, 0.8)',
                    borderColor: '#2D3246'
                  }}
                >
                  {languages.map(lang => (
                    <option key={lang.code} value={lang.code} style={{ backgroundColor: '#1E2230' }}>
                      {lang.name}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Select your preferred language for the interface
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="flex items-center gap-4">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:shadow-xl hover:shadow-blue-500/50 transition"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl border text-gray-400 hover:text-white hover:bg-white/5 transition"
                style={{ borderColor: '#2D3246' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          {!hasChanges && (
            <div className="text-center text-gray-500">
              Make changes to your profile to see save options
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
