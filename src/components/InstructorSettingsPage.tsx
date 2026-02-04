import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, Bell, CreditCard, User, Save,
  Brain, LayoutDashboard, Database, Users, FileText,
  HelpCircle, LogOut, Lock, Mail, Globe, Languages, MapPin, Eye, EyeOff, Camera, Upload
} from 'lucide-react';

export function InstructorSettingsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('settings');
  const [activeTab, setActiveTab] = useState<'general' | 'password' | 'email' | 'language' | 'notifications' | 'billing'>('general');

  // Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Email State
  const [currentEmail, setCurrentEmail] = useState('ahmed.doctor@university.edu');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');

  // Language & Region State
  const [language, setLanguage] = useState('ar');
  const [timezone, setTimezone] = useState('Africa/Cairo');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  // Notifications State
  const [examStartsEmail, setExamStartsEmail] = useState(true);
  const [examEndsEmail, setExamEndsEmail] = useState(true);
  const [studentJoinsEmail, setStudentJoinsEmail] = useState(false);
  const [violationDetectedEmail, setViolationDetectedEmail] = useState(true);
  const [resultsReadyEmail, setResultsReadyEmail] = useState(true);
  const [examCompletedEmail, setExamCompletedEmail] = useState(true);
  const [systemUpdatesEmail, setSystemUpdatesEmail] = useState(false);
  const [securityAlertsEmail, setSecurityAlertsEmail] = useState(true);

  const mainNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'exams', label: 'My Exams', icon: FileText },
    { id: 'results', label: 'Results Database', icon: Database },
  ];

  const utilityItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const settingsTabs = [
    { id: 'general', label: 'General', icon: User, description: 'Profile & preferences' },
    { id: 'password', label: 'Change Password', icon: Lock, description: 'Update your password' },
    { id: 'email', label: 'Change Email', icon: Mail, description: 'Update email address' },
    { id: 'language', label: 'Language & Region', icon: Globe, description: 'Localization settings' },
    { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & alerts' },
    { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Plans & payments' }
  ] as const;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0F111A' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Sidebar - SMALL WITH ICONS ONLY */}
      <aside className="w-[70px] flex-shrink-0 border-r relative z-10" style={{ 
        backgroundColor: 'rgba(15, 17, 26, 0.6)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(255, 255, 255, 0.08)'
      }}>
        <div className="h-full flex flex-col">
          {/* Header - Brand Logo */}
          <div className="px-3 pt-8 pb-6 flex justify-center">
            <button
              onClick={() => navigate('/')}
              className="group"
            >
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/40 transition-all duration-300">
                <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </button>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-2 pt-2">
            <div className="space-y-2">
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
                        navigate('/instructor/my-exams');
                      } else if (item.id === 'results') {
                        navigate('/instructor/results-database');
                      }
                    }}
                    className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={item.label}
                  >
                    <Icon 
                      className={`w-5 h-5 transition-all duration-200 ${
                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'
                      }`} 
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-6 h-px mx-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }} />

            {/* Utilities Section */}
            <div className="space-y-2">
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
                    className={`w-full flex items-center justify-center p-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={item.label}
                  >
                    <Icon 
                      className="w-5 h-5" 
                      strokeWidth={1.5}
                    />
                  </button>
                );
              })}
            </div>
          </nav>

          {/* User Profile Footer */}
          <div className="p-2 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-blue-500/30 transition-all">
                  <span className="text-white text-sm">DA</span>
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2" style={{ borderColor: '#0F111A' }} />
              </div>
              <button className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition" title="Logout">
                <LogOut className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-hidden flex flex-col">
        {/* Header */}
        <header className="border-b flex-shrink-0" style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          borderColor: 'rgba(255, 255, 255, 0.1)'
        }}>
          <div className="px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-blue-400" />
              <h1 className="text-white text-3xl" style={{ fontFamily: 'Inter, sans-serif' }}>
                Settings
              </h1>
            </div>
            <p className="text-gray-400 text-sm">Manage your account and platform preferences</p>
          </div>
        </header>

        {/* Settings Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Vertical Tabs */}
          <div className="w-72 border-r p-6 overflow-y-auto" style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            borderColor: 'rgba(255, 255, 255, 0.08)'
          }}>
            <div className="space-y-2">
              {settingsTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 px-4 py-4 rounded-xl transition-all duration-200 text-left ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.5} />
                    <div className="flex-1">
                      <div 
                        className={`text-sm mb-0.5 ${isActive ? 'text-white' : ''}`}
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          fontWeight: isActive ? 600 : 500
                        }}
                      >
                        {tab.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  {/* Profile Photo Section */}
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Profile Photo
                        </h3>
                        <p className="text-gray-400 text-sm">Upload or change your profile picture</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Current Photo */}
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-white/10">
                          <span className="text-white text-4xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>JD</span>
                        </div>
                        <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Camera className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Upload Buttons */}
                      <div className="flex-1">
                        <div className="space-y-3">
                          <label className="cursor-pointer">
                            <input type="file" accept="image/*" className="hidden" />
                            <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition group">
                              <Upload className="w-5 h-5" />
                              <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Upload New Photo</span>
                            </div>
                          </label>
                          <button className="w-full flex items-center gap-3 px-6 py-3 rounded-xl border border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition">
                            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Remove Photo</span>
                          </button>
                        </div>
                        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                          <p className="text-blue-400 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Recommended: Square image, at least 400x400px, max 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information Section */}
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Profile Information
                        </h3>
                        <p className="text-gray-400 text-sm">Update your personal details</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Full Name</label>
                        <input
                          type="text"
                          defaultValue="Dr. John Davis"
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">University / Institution</label>
                        <input
                          type="text"
                          defaultValue="Harvard University"
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Department</label>
                        <input
                          type="text"
                          defaultValue="Computer Science"
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button className="px-6 py-3 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30">
                      <Save className="w-5 h-5" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Change Password Tab */}
              {activeTab === 'password' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Lock className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Change Password
                        </h3>
                        <p className="text-gray-400 text-sm">Update your account password</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Current Password</label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full px-4 py-3 pr-12 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <button
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full px-4 py-3 pr-12 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <button
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-3 pr-12 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                          />
                          <button
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-lg mt-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <div className="text-blue-400 text-sm mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                          Password Requirements:
                        </div>
                        <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                          <li>At least 8 characters long</li>
                          <li>Contains uppercase and lowercase letters</li>
                          <li>Contains at least one number</li>
                          <li>Contains at least one special character</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button className="px-6 py-3 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30">
                      <Lock className="w-5 h-5" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Update Password</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Change Email Tab */}
              {activeTab === 'email' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Change Email Address
                        </h3>
                        <p className="text-gray-400 text-sm">Update your email for login and notifications</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Current Email</label>
                        <input
                          type="email"
                          value={currentEmail}
                          disabled
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-gray-500 cursor-not-allowed"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">New Email Address</label>
                        <input
                          type="email"
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          placeholder="Enter new email address"
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Confirm Password</label>
                        <input
                          type="password"
                          value={emailPassword}
                          onChange={(e) => setEmailPassword(e.target.value)}
                          placeholder="Enter your password to confirm"
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        />
                      </div>

                      <div className="p-4 rounded-lg mt-4" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }}>
                        <div className="flex gap-3">
                          <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-yellow-400 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Verification Required
                            </div>
                            <div className="text-gray-400 text-sm">
                              We'll send a verification link to your new email address. You must confirm it before the change takes effect.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button className="px-6 py-3 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30">
                      <Mail className="w-5 h-5" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Update Email</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Language & Region Tab */}
              {activeTab === 'language' && (
                <div className="space-y-6">
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Language & Region
                        </h3>
                        <p className="text-gray-400 text-sm">Customize your localization preferences</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                          <Languages className="w-4 h-4" />
                          Language
                        </label>
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                          <option value="ar" className="bg-gray-800">العربية (Arabic)</option>
                          <option value="en" className="bg-gray-800">English</option>
                          <option value="fr" className="bg-gray-800">Français (French)</option>
                          <option value="es" className="bg-gray-800">Español (Spanish)</option>
                          <option value="de" className="bg-gray-800">Deutsch (German)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Time Zone
                        </label>
                        <select
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                          <option value="Africa/Cairo" className="bg-gray-800">(GMT+2:00) Cairo</option>
                          <option value="Europe/London" className="bg-gray-800">(GMT+0:00) London</option>
                          <option value="America/New_York" className="bg-gray-800">(GMT-5:00) New York</option>
                          <option value="Asia/Dubai" className="bg-gray-800">(GMT+4:00) Dubai</option>
                          <option value="Asia/Tokyo" className="bg-gray-800">(GMT+9:00) Tokyo</option>
                          <option value="Europe/Paris" className="bg-gray-800">(GMT+1:00) Paris</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Date Format</label>
                        <select
                          value={dateFormat}
                          onChange={(e) => setDateFormat(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
                          style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
                        >
                          <option value="DD/MM/YYYY" className="bg-gray-800">DD/MM/YYYY (29/11/2025)</option>
                          <option value="MM/DD/YYYY" className="bg-gray-800">MM/DD/YYYY (11/29/2025)</option>
                          <option value="YYYY-MM-DD" className="bg-gray-800">YYYY-MM-DD (2025-11-29)</option>
                        </select>
                      </div>

                      <div className="p-4 rounded-lg mt-4" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                        <div className="flex gap-3">
                          <Globe className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="text-blue-400 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                              Preview
                            </div>
                            <div className="text-gray-400 text-sm space-y-1">
                              <div>Current time: 14:30 (GMT+2:00)</div>
                              <div>Today's date: 29/11/2025</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3">
                    <button className="px-6 py-3 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30">
                      <Save className="w-5 h-5" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Save Changes</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          Email Notifications
                        </h3>
                        <p className="text-gray-400 text-sm">Choose when you want to receive email notifications</p>
                      </div>
                    </div>

                    {/* SEND ME AN EMAIL WHEN Section */}
                    <div className="mb-6">
                      <div className="text-gray-300 text-sm mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.05em' }}>
                        SEND ME AN EMAIL WHEN:
                      </div>

                      <div className="space-y-3">
                        {/* Exam starts automatically */}
                        <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}>
                          <div className="flex-1">
                            <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Exam starts automatically
                            </div>
                          </div>
                          <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer" 
                            style={{ backgroundColor: examStartsEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                            onClick={() => setExamStartsEmail(!examStartsEmail)}
                          >
                            <span
                              className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                              style={{ transform: examStartsEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                            />
                          </div>
                        </div>

                        {/* Results ready to collect */}
                        <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}>
                          <div className="flex-1">
                            <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              There are no more exam results to collect available
                            </div>
                            <div className="text-gray-400 text-xs mt-1">(find them in the "Results & Logs" section)</div>
                          </div>
                          <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer ml-4" 
                            style={{ backgroundColor: resultsReadyEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                            onClick={() => setResultsReadyEmail(!resultsReadyEmail)}
                          >
                            <span
                              className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                              style={{ transform: resultsReadyEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                            />
                          </div>
                        </div>

                        {/* Exam ends automatically */}
                        <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}>
                          <div className="flex-1">
                            <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              Exam ends automatically
                            </div>
                          </div>
                          <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer" 
                            style={{ backgroundColor: examEndsEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                            onClick={() => setExamEndsEmail(!examEndsEmail)}
                          >
                            <span
                              className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                              style={{ transform: examEndsEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                            />
                          </div>
                        </div>

                        {/* Student joins exam */}
                        <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}>
                          <div className="flex-1">
                            <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              A student joins an exam
                            </div>
                          </div>
                          <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer" 
                            style={{ backgroundColor: studentJoinsEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                            onClick={() => setStudentJoinsEmail(!studentJoinsEmail)}
                          >
                            <span
                              className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                              style={{ transform: studentJoinsEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                            />
                          </div>
                        </div>

                        {/* Violation detected */}
                        <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}>
                          <div className="flex-1">
                            <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              AI detects a potential violation during exam
                            </div>
                          </div>
                          <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer" 
                            style={{ backgroundColor: violationDetectedEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                            onClick={() => setViolationDetectedEmail(!violationDetectedEmail)}
                          >
                            <span
                              className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                              style={{ transform: violationDetectedEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                            />
                          </div>
                        </div>

                        {/* All students complete exam */}
                        <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.02)',
                          borderColor: 'rgba(255, 255, 255, 0.08)'
                        }}>
                          <div className="flex-1">
                            <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              All students have completed the exam
                            </div>
                          </div>
                          <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer" 
                            style={{ backgroundColor: examCompletedEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                            onClick={() => setExamCompletedEmail(!examCompletedEmail)}
                          >
                            <span
                              className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                              style={{ transform: examCompletedEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* System Notifications */}
                  <div className="rounded-2xl border p-6" style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(10px)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Settings className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          System & Updates
                        </h3>
                        <p className="text-gray-400 text-sm">Stay informed about platform updates and security</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* System updates */}
                      <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.08)'
                      }}>
                        <div className="flex-1">
                          <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Platform updates and new features
                          </div>
                        </div>
                        <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer" 
                          style={{ backgroundColor: systemUpdatesEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                          onClick={() => setSystemUpdatesEmail(!systemUpdatesEmail)}
                        >
                          <span
                            className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                            style={{ transform: systemUpdatesEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                          />
                        </div>
                      </div>

                      {/* Security alerts */}
                      <div className="flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/30" style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.02)',
                        borderColor: 'rgba(255, 255, 255, 0.08)'
                      }}>
                        <div className="flex-1">
                          <div className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            Security alerts and account activity
                          </div>
                          <div className="text-gray-400 text-xs mt-1">Recommended to keep enabled</div>
                        </div>
                        <div className="relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 cursor-pointer ml-4" 
                          style={{ backgroundColor: securityAlertsEmail ? '#10b981' : 'rgba(255, 255, 255, 0.2)' }}
                          onClick={() => setSecurityAlertsEmail(!securityAlertsEmail)}
                        >
                          <span
                            className="inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-lg"
                            style={{ transform: securityAlertsEmail ? 'translateX(32px)' : 'translateX(4px)' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-3">
                    <button className="px-6 py-3 rounded-xl text-gray-400 hover:text-white border border-white/10 hover:bg-white/5 transition" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                      Cancel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white transition shadow-lg hover:shadow-green-500/30">
                      <Save className="w-5 h-5" />
                      <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Save</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Billing Tab Placeholder */}
              {activeTab === 'billing' && (
                <div className="rounded-2xl border p-8 text-center" style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(255, 255, 255, 0.1)'
                }}>
                  <CreditCard className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-white text-xl mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Billing & Subscription
                  </h3>
                  <p className="text-gray-400">Payment methods and subscription plans will be available here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}