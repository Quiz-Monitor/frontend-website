import { X, Clock, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';

interface StudentDetailModalProps {
  student: any;
  onClose: () => void;
}

export function StudentDetailModal({ student, onClose }: StudentDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-1">{student.name}</h2>
            <p className="text-gray-600">{student.email}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Performance Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-blue-900 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span>Final Score</span>
              </div>
              <div className="text-blue-900">{student.score}%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <Clock className="w-5 h-5" />
                <span>Time Spent</span>
              </div>
              <div className="text-gray-900">{student.timeSpent}</div>
            </div>
            <div className={`p-4 rounded-xl ${
              student.status === 'clean' ? 'bg-green-50' : 'bg-red-50'
            }`}>
              <div className={`flex items-center gap-2 mb-2 ${
                student.status === 'clean' ? 'text-green-700' : 'text-red-700'
              }`}>
                {student.status === 'clean' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                <span>Integrity Status</span>
              </div>
              <div className={student.status === 'clean' ? 'text-green-900' : 'text-red-900'}>
                {student.status === 'clean' ? 'Clean' : `${student.violations.length} Violations`}
              </div>
            </div>
          </div>

          {/* Violation Timeline */}
          <div>
            <h3 className="text-gray-900 mb-4">Violation Timeline</h3>
            {student.violations.length > 0 ? (
              <div className="space-y-3">
                {student.violations.map((violation: any, index: number) => (
                  <div
                    key={index}
                    className={`border-l-4 p-4 rounded-r-lg ${
                      violation.type === 'critical'
                        ? 'border-red-500 bg-red-50'
                        : 'border-yellow-500 bg-yellow-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className={`w-4 h-4 ${
                            violation.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                          <span className={`text-sm uppercase tracking-wider ${
                            violation.type === 'critical' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                            {violation.type}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-1">{violation.message}</p>
                        <p className="text-gray-600">{violation.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-900 mb-1">No Violations Detected</p>
                <p className="text-green-700">
                  This student maintained excellent exam integrity throughout the test.
                </p>
              </div>
            )}
          </div>

          {/* Question Performance (Mock Data) */}
          <div>
            <h3 className="text-gray-900 mb-4">Question Performance</h3>
            <div className="space-y-2">
              {[
                { question: 'Question 1', status: 'correct' },
                { question: 'Question 2', status: 'correct' },
                { question: 'Question 3', status: 'incorrect' },
                { question: 'Question 4', status: 'correct' },
                { question: 'Question 5', status: 'correct' }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{item.question}</span>
                  <div className={`flex items-center gap-2 ${
                    item.status === 'correct' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.status === 'correct' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        <span>Incorrect</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 px-6 py-3 border-2 border-blue-900 text-blue-900 rounded-lg hover:bg-blue-50 transition">
              Download Report
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
