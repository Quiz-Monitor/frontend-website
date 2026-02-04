import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Brain, Clock, CheckCircle, Camera, Mic, Maximize } from 'lucide-react';

export function StudentWaitingRoom() {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  // Mock exam start time (5 minutes from now for demo)
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 5,
    seconds: 0
  });

  const [systemChecks, setSystemChecks] = useState({
    camera: false,
    microphone: false,
    connection: false,
    fullscreen: false
  });

  useEffect(() => {
    // Simulate system checks
    const checkTimeout = setTimeout(() => {
      setSystemChecks({ camera: true, microphone: true, connection: true, fullscreen: true });
    }, 1500);

    // Countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => {
      clearTimeout(checkTimeout);
      clearInterval(timer);
    };
  }, []);

  const allChecksComplete = Object.values(systemChecks).every(check => check);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Brain className="w-6 h-6 text-white" />
            <span className="text-white">ExamGuard AI</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          <h1 className="text-gray-900 mb-3">Calculus Midterm Exam</h1>
          <p className="text-gray-600 mb-8">December 5, 2025 • 10:00 AM</p>

          {/* Countdown Timer */}
          <div className="mb-12">
            <p className="text-gray-600 mb-4">Exam starts in:</p>
            <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-blue-900 mb-1" style={{ fontSize: '2.5rem' }}>
                  {String(timeRemaining.days).padStart(2, '0')}
                </div>
                <div className="text-gray-600">Days</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-blue-900 mb-1" style={{ fontSize: '2.5rem' }}>
                  {String(timeRemaining.hours).padStart(2, '0')}
                </div>
                <div className="text-gray-600">Hours</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-blue-900 mb-1" style={{ fontSize: '2.5rem' }}>
                  {String(timeRemaining.minutes).padStart(2, '0')}
                </div>
                <div className="text-gray-600">Minutes</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-blue-900 mb-1" style={{ fontSize: '2.5rem' }}>
                  {String(timeRemaining.seconds).padStart(2, '0')}
                </div>
                <div className="text-gray-600">Seconds</div>
              </div>
            </div>
          </div>

          {/* System Checks */}
          <div className="mb-8">
            <h3 className="text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3 max-w-md mx-auto">
              <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                systemChecks.camera 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <Camera className={`w-5 h-5 ${
                    systemChecks.camera ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="text-gray-700">Camera Access</span>
                </div>
                {systemChecks.camera ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse" />
                )}
              </div>



              <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                systemChecks.connection 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <Clock className={`w-5 h-5 ${
                    systemChecks.connection ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="text-gray-700">Connection Stable</span>
                </div>
                {systemChecks.connection ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse" />
                )}
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                systemChecks.fullscreen 
                  ? 'border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}>
                <div className="flex items-center gap-3">
                  <Maximize className={`w-5 h-5 ${
                    systemChecks.fullscreen ? 'text-green-600' : 'text-gray-400'
                  }`} />
                  <span className="text-gray-700">Forced Fullscreen Mode</span>
                </div>
                {systemChecks.fullscreen ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* Start Button (Demo) */}
          {allChecksComplete && (
            <div className="pt-6 border-t border-gray-200">
              <button
                onClick={() => navigate(`/student/permissions/${examId}`)}
                className="px-8 py-4 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition shadow-lg"
              >
                Start Exam Now (Demo)
              </button>
              <p className="text-gray-500 mt-3">
                For demo purposes, you can start the exam immediately
              </p>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-left">
            <h3 className="text-gray-900 mb-3">Important Instructions</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Ensure you are in a quiet, well-lit environment</li>
              <li>• Keep your face visible to the camera at all times</li>
              <li>• Do not leave your seat during the exam</li>
              <li>• Close all unnecessary browser tabs and applications</li>
              <li>• Keep your phone away from your workspace</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}