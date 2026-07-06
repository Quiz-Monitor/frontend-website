import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Monitor, Camera, Maximize2, Check, AlertTriangle, Brain } from 'lucide-react';

export function ExamPermissionsCheck() {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [permissions, setPermissions] = useState({
    screenSharing: false,
    cameraAndMic: false,
    fullscreen: false
  });

  const [isChecking, setIsChecking] = useState({
    screenSharing: false,
    cameraAndMic: false
  });

  // Check if fullscreen is active
  useEffect(() => {
    const checkFullscreen = () => {
      setPermissions(prev => ({
        ...prev,
        fullscreen: !!(
          document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).mozFullScreenElement ||
          (document as any).msFullscreenElement
        )
      }));
    };

    document.addEventListener('fullscreenchange', checkFullscreen);
    document.addEventListener('webkitfullscreenchange', checkFullscreen);
    document.addEventListener('mozfullscreenchange', checkFullscreen);
    document.addEventListener('MSFullscreenChange', checkFullscreen);

    return () => {
      document.removeEventListener('fullscreenchange', checkFullscreen);
      document.removeEventListener('webkitfullscreenchange', checkFullscreen);
      document.removeEventListener('mozfullscreenchange', checkFullscreen);
      document.removeEventListener('MSFullscreenChange', checkFullscreen);
    };
  }, []);

  const enableScreenSharing = async () => {
    setIsChecking(prev => ({ ...prev, screenSharing: true }));
    
    // Simulate permission check for demo purposes
    setTimeout(() => {
      setPermissions(prev => ({ ...prev, screenSharing: true }));
      setIsChecking(prev => ({ ...prev, screenSharing: false }));
    }, 1200);
  };

  const enableCameraAndMic = async () => {
    setIsChecking(prev => ({ ...prev, cameraAndMic: true }));
    
    // Simulate permission check for demo purposes
    setTimeout(() => {
      setPermissions(prev => ({ ...prev, cameraAndMic: true }));
      setIsChecking(prev => ({ ...prev, cameraAndMic: false }));
    }, 1200);
  };

  const enableFullscreen = () => {
    // Simulate fullscreen for demo purposes
    setTimeout(() => {
      setPermissions(prev => ({ ...prev, fullscreen: true }));
    }, 1000);
  };

  const allPermissionsGranted = permissions.screenSharing && permissions.cameraAndMic && permissions.fullscreen;

  const handleProceed = () => {
    if (allPermissionsGranted) {
      navigate(`/student/exam/${examId}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#000000' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="fixed bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <img src="/logo.svg" className="w-7 h-7" alt="Logo" />
            </div>
            <span className="text-white text-2xl font-orbitron tracking-wider" style={{ fontWeight: 600 }}>
              RAQEEB
            </span>
          </div>
        </div>

        {/* Permissions Card */}
        <div 
          className="rounded-3xl border p-10"
          style={{ 
            backgroundColor: 'rgba(30, 30, 35, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)'
          }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-white text-3xl mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Before you start
            </h1>
            <p className="text-gray-400 text-lg">
              Please enable the following requirements to start the exam:
            </p>
          </div>

          {/* Requirements List */}
          <div className="space-y-5 mb-8">
            {/* Screen Sharing */}
            <div className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-200" style={{ 
              backgroundColor: permissions.screenSharing ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderColor: permissions.screenSharing ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-4">
                {permissions.screenSharing ? (
                  <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md border-2 border-gray-600" />
                )}
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-gray-400" />
                  <span className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Screen sharing
                  </span>
                </div>
              </div>
              {!permissions.screenSharing && (
                <button
                  onClick={enableScreenSharing}
                  disabled={isChecking.screenSharing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  {isChecking.screenSharing ? 'Checking...' : 'Enable'}
                </button>
              )}
            </div>

            {/* Camera and Microphone */}
            <div className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-200" style={{ 
              backgroundColor: permissions.cameraAndMic ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderColor: permissions.cameraAndMic ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-4">
                {permissions.cameraAndMic ? (
                  <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md border-2 border-gray-600" />
                )}
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-gray-400" />
                  <span className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Camera and microphone
                  </span>
                </div>
              </div>
              {!permissions.cameraAndMic && (
                <button
                  onClick={enableCameraAndMic}
                  disabled={isChecking.cameraAndMic}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  {isChecking.cameraAndMic ? 'Checking...' : 'Enable'}
                </button>
              )}
            </div>

            {/* Fullscreen Mode */}
            <div className="flex items-center justify-between p-5 rounded-2xl border transition-all duration-200" style={{ 
              backgroundColor: permissions.fullscreen ? 'rgba(34, 197, 94, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              borderColor: permissions.fullscreen ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)'
            }}>
              <div className="flex items-center gap-4">
                {permissions.fullscreen ? (
                  <div className="w-6 h-6 rounded-md bg-green-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-md border-2 border-gray-600" />
                )}
                <div className="flex items-center gap-3">
                  <Maximize2 className="w-5 h-5 text-gray-400" />
                  <span className="text-white text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Fullscreen mode
                  </span>
                </div>
              </div>
              {!permissions.fullscreen && (
                <button
                  onClick={enableFullscreen}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white transition"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                >
                  Enable
                </button>
              )}
            </div>
          </div>

          {/* Warning Message */}
          {!allPermissionsGranted && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 mb-6">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <p className="text-yellow-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                You must enable all required permissions to proceed.
              </p>
            </div>
          )}

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!allPermissionsGranted}
            className={`w-full py-4 rounded-xl transition text-lg ${
              allPermissionsGranted
                ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg shadow-green-500/30'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            {allPermissionsGranted ? 'Start Exam' : 'Enable All Permissions to Continue'}
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Your privacy is important. All monitoring is done solely for exam integrity purposes.
          </p>
        </div>
      </div>
    </div>
  );
}