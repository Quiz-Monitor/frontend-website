import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain,
  ChevronRight,
  Calendar,
  Clock,
  Shield,
  Sparkles,
  Check,
  Settings,
  FileText,
  Image as ImageIcon,
  Send,
  Paperclip,
  Plus,
  X,
  Book,
  Users,
  ListChecks,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Minus
} from 'lucide-react';

interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'long-answer';
  points: number;
  options?: string[];
}

export function ExamCreationWizardV2() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Exam Details
  const [examName, setExamName] = useState('');
  const [startDate, setStartDate] = useState('Nov 28, 2025');
  const [startTime, setStartTime] = useState('17:27');
  const [endDate, setEndDate] = useState('Dec 05, 2025');
  const [endTime, setEndTime] = useState('23:59');
  const [aiProtection, setAiProtection] = useState(true);
  const [randomizeOrder, setRandomizeOrder] = useState(false);
  
  // Step 2: Questions
  const [questions, setQuestions] = useState<Question[]>([
    { 
      id: '1', 
      text: 'Which of the following terms describes a loop that continues to execute indefinitely because its termination condition is never met?', 
      type: 'multiple-choice', 
      points: 0,
      options: ['Infinite loop', 'Nested loop', 'Recursive loop', 'Conditional loop']
    },
    { id: '2', text: 'Explain the primary difference between the **preterite** and **imperfect** tenses in Spanish', type: 'long-answer', points: 10 },
    { id: '3', text: 'Choose the correct conjugation of the verb *tener* in the present tense', type: 'multiple-choice', points: 0 },
    { id: '4', text: 'Conjugate the verb *tener* in the present subjunctive mood for the pronouns \'yo\', \'tú\', and \'nosotros\'', type: 'multiple-choice', points: 10 },
    { id: '5', text: 'Which option correctly completes the sentence', type: 'multiple-choice', points: 0 },
    { id: '6', text: 'Translate the following sentence from English to Spanish', type: 'long-answer', points: 10 },
  ]);
  const [selectedQuestionId, setSelectedQuestionId] = useState('1');
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Step 3: AI Protection Rules
  const [detectMobilePhones, setDetectMobilePhones] = useState(true);
  const [detectMultipleFaces, setDetectMultipleFaces] = useState(true);
  const [detectGaze, setDetectGaze] = useState(true);
  const [detectTabSwitching, setDetectTabSwitching] = useState(true);
  
  const steps = [
    { number: 1, label: 'Exam Details', sublabel: 'Basic information' },
    { number: 2, label: 'Add Questions', sublabel: 'Create questions' },
    { number: 3, label: 'AI Protection', sublabel: 'Configure rules' },
    { number: 4, label: 'Review', sublabel: 'Final check' }
  ];

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const multipleChoiceCount = questions.filter(q => q.type === 'multiple-choice').length;
  const longAnswerCount = questions.filter(q => q.type === 'long-answer').length;

  const addQuestion = (type: 'multiple-choice' | 'long-answer') => {
    const newQuestion: Question = {
      id: String(questions.length + 1),
      text: type === 'multiple-choice' ? 'New multiple choice question' : 'New long answer question',
      type,
      points: 5
    };
    setQuestions([...questions, newQuestion]);
    setSelectedQuestionId(newQuestion.id);
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (selectedQuestionId === id) {
      setSelectedQuestionId(questions[0]?.id || '');
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1a1d2e' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#2d3246', backgroundColor: '#1f2334' }}>
        <div className="px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <button onClick={() => navigate('/instructor')} className="hover:text-white transition">
              Dashboard
            </button>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">
              {currentStep === 1 ? 'Create New Exam' : currentStep === 2 ? 'Add Questions' : currentStep === 3 ? 'AI Protection' : 'Exam Review'}
            </span>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Steps */}
        <aside className="w-80 border-r min-h-screen p-6" style={{ backgroundColor: '#1f2334', borderColor: '#2d3246' }}>
          {/* Steps */}
          <div className="space-y-3 mb-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition ${
                  currentStep === step.number 
                    ? 'bg-purple-600 text-white' 
                    : currentStep > step.number
                    ? 'bg-gray-700/50 text-gray-300'
                    : 'bg-gray-700/30 text-gray-400'
                }`}
                onClick={() => setCurrentStep(step.number)}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    currentStep > step.number
                      ? 'bg-green-500'
                      : currentStep === step.number
                      ? 'bg-white/20'
                      : 'bg-white/10'
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-sm">{step.number}</span>
                  )}
                </div>
                <div className="flex-1">
                  <div className="text-sm">{step.label}</div>
                  <div className="text-xs opacity-70">{step.sublabel}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Questions Panel - Only show in step 2 */}
          {currentStep === 2 && (
            <div className="rounded-xl p-4 relative overflow-hidden" style={{ 
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
              border: '2px solid',
              borderColor: 'rgba(168, 85, 247, 0.5)'
            }}>
              <h3 className="text-white mb-4">Questions</h3>
              
              {/* Questions List */}
              <div className="space-y-2 mb-4">
                {questions.map((q) => (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                      selectedQuestionId === q.id 
                        ? 'bg-purple-600/30 border border-purple-400' 
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <span className={`${selectedQuestionId === q.id ? 'text-white' : 'text-gray-400'}`}>{q.id}</span>
                    <span className="text-white text-sm flex-1 truncate">{q.text.substring(0, 20)}...</span>
                    <FileText className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>

              {/* Add Question Buttons */}
              <div className="space-y-2">
                <button
                  onClick={() => addQuestion('multiple-choice')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white hover:bg-purple-800 transition"
                  style={{ backgroundColor: '#4c1d95' }}
                >
                  <Plus className="w-4 h-4" />
                  Multiple Choice
                </button>
                <button
                  onClick={() => addQuestion('long-answer')}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white hover:bg-purple-800 transition"
                  style={{ backgroundColor: '#4c1d95' }}
                >
                  <Plus className="w-4 h-4" />
                  Long Answer
                </button>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {/* Step 1: Exam Details */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h1 className="text-white text-3xl mb-2">Create New Exam</h1>
                    <p className="text-gray-400">Set up your exam with AI-powered assessment</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition"
                  >
                    Continue to Add Questions
                  </button>
                </div>

                {/* Tabs / Toggles */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ backgroundColor: '#2d3246' }}>
                    <Settings className="w-5 h-5 text-purple-400" />
                    <span className="text-white">Exam Details</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">AI Protection</span>
                    <button
                      onClick={() => setAiProtection(!aiProtection)}
                      className={`w-12 h-6 rounded-full transition relative ${
                        aiProtection ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                          aiProtection ? 'left-6' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-300">Randomize Order</span>
                    <button
                      onClick={() => setRandomizeOrder(!randomizeOrder)}
                      className={`w-12 h-6 rounded-full transition relative ${
                        randomizeOrder ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                          randomizeOrder ? 'left-6' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="rounded-xl p-8 space-y-6" style={{ backgroundColor: '#242838' }}>
                  {/* Exam Name */}
                  <div>
                    <label className="block text-gray-300 mb-2">Exam Name</label>
                    <input
                      type="text"
                      value={examName}
                      onChange={(e) => setExamName(e.target.value)}
                      placeholder="Enter exam name"
                      className="w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 border focus:outline-none focus:border-purple-500 transition"
                      style={{ backgroundColor: '#1a1d2e', borderColor: '#2d3246' }}
                    />
                  </div>

                  {/* Date & Time Row */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Start Date & Time */}
                    <div>
                      <label className="block text-gray-300 mb-2">Start Date & Time</label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <input
                            type="text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-white border focus:outline-none focus:border-purple-500 transition"
                            style={{ backgroundColor: '#1a1d2e', borderColor: '#2d3246' }}
                          />
                        </div>
                        <div className="w-32 relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                          <input
                            type="text"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-white border focus:outline-none focus:border-purple-500 transition"
                            style={{ backgroundColor: '#1a1d2e', borderColor: '#2d3246' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* End Date & Time */}
                    <div>
                      <label className="block text-gray-300 mb-2">End Date & Time</label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                          <input
                            type="text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-white border focus:outline-none focus:border-purple-500 transition"
                            style={{ backgroundColor: '#1a1d2e', borderColor: '#2d3246' }}
                          />
                        </div>
                        <div className="w-32 relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                          <input
                            type="text"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg text-white border focus:outline-none focus:border-purple-500 transition"
                            style={{ backgroundColor: '#1a1d2e', borderColor: '#2d3246' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Questions */}
          {currentStep === 2 && (
            <div className="flex-1 p-8">
              <div className="max-w-4xl mx-auto">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <h1 className="text-white text-3xl mb-2">Add Questions</h1>
                      <p className="text-gray-400">Create and manage your exam questions</p>
                    </div>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition"
                    >
                      Next Step
                    </button>
                  </div>

                  {/* Current Question Editor */}
                  {selectedQuestion && (
                    <div className="rounded-xl p-6" style={{ backgroundColor: '#242838' }}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-500 rounded-full" />
                            <div className="w-1 h-1 bg-gray-500 rounded-full" />
                            <div className="w-1 h-1 bg-gray-500 rounded-full" />
                          </div>
                          <h3 className="text-white">Question {selectedQuestion.id}</h3>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-purple-700 transition">
                            <Sparkles className="w-4 h-4" />
                            Perfection
                          </button>
                          <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1.5 hover:bg-blue-700 transition">
                            <ImageIcon className="w-4 h-4" />
                            Add Image
                          </button>
                          
                          {/* Points Counter */}
                          <div className="flex items-center gap-2 bg-gray-700/30 rounded-lg px-1.5">
                            <button className="p-1.5 hover:bg-white/10 rounded transition text-gray-400">
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="text-white min-w-[2ch] text-center">{selectedQuestion.points}</span>
                            <button className="p-1.5 hover:bg-white/10 rounded transition text-gray-400">
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => deleteQuestion(selectedQuestion.id)}
                            className="p-1.5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Formatting Toolbar */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b" style={{ borderColor: '#2d3246' }}>
                        <button className="p-2 hover:bg-white/10 rounded transition">
                          <Bold className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded transition">
                          <Italic className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded transition">
                          <Underline className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="w-px h-6 bg-gray-600 mx-2" />
                        <button className="p-2 hover:bg-white/10 rounded transition">
                          <Heading1 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded transition">
                          <Heading2 className="w-4 h-4 text-gray-400" />
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-2 text-sm">
                          <button className="px-3 py-1 bg-purple-600/20 text-purple-400 rounded">Raw</button>
                          <button className="px-3 py-1 text-gray-400 hover:bg-white/5 rounded transition">Split</button>
                          <button className="px-3 py-1 text-gray-400 hover:bg-white/5 rounded transition">Preview</button>
                        </div>
                      </div>

                      {/* Question Text Area */}
                      <textarea
                        value={selectedQuestion.text}
                        onChange={(e) => {
                          setQuestions(questions.map(q => 
                            q.id === selectedQuestion.id ? { ...q, text: e.target.value } : q
                          ));
                        }}
                        className="w-full px-0 py-2 bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none leading-relaxed mb-6"
                        rows={4}
                        placeholder="Enter your question here..."
                      />

                      {/* Multiple Choice Options */}
                      {selectedQuestion.type === 'multiple-choice' && selectedQuestion.options && (
                        <div className="space-y-3 mb-4">
                          {selectedQuestion.options.map((option, index) => (
                            <div key={index} className="flex items-center gap-3 group">
                              <input
                                type="radio"
                                name={`question-${selectedQuestion.id}`}
                                checked={index === 0}
                                className="w-5 h-5 accent-purple-600"
                                readOnly
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...selectedQuestion.options!];
                                  newOptions[index] = e.target.value;
                                  setQuestions(questions.map(q => 
                                    q.id === selectedQuestion.id ? { ...q, options: newOptions } : q
                                  ));
                                }}
                                className="flex-1 px-4 py-3 bg-gray-700/30 text-white rounded-lg border border-transparent hover:border-gray-600 focus:border-purple-500 focus:outline-none transition"
                              />
                              <button
                                onClick={() => {
                                  const newOptions = selectedQuestion.options!.filter((_, i) => i !== index);
                                  setQuestions(questions.map(q => 
                                    q.id === selectedQuestion.id ? { ...q, options: newOptions } : q
                                  ));
                                }}
                                className="p-2 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-lg transition"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          
                          <button
                            onClick={() => {
                              const newOptions = [...(selectedQuestion.options || []), 'New option'];
                              setQuestions(questions.map(q => 
                                q.id === selectedQuestion.id ? { ...q, options: newOptions } : q
                              ));
                            }}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition text-sm"
                          >
                            <Plus className="w-4 h-4" />
                            Add Option
                          </button>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}

          {/* Step 3: AI Protection */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h1 className="text-white text-3xl mb-2">AI Proctoring Rules</h1>
                    <p className="text-gray-400">Configure automatic behavior monitoring settings</p>
                  </div>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition"
                  >
                    Next Step
                  </button>
                </div>

                {/* AI Protection Rules */}
                <div className="space-y-4">
                  {/* Detect Mobile Phones */}
                  <div className="rounded-xl p-6" style={{ backgroundColor: '#292f40' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white mb-1">Detect Mobile Phones</h3>
                        <p className="text-gray-400 text-sm">Alert when a mobile device is detected in frame</p>
                      </div>
                      <button
                        onClick={() => setDetectMobilePhones(!detectMobilePhones)}
                        className={`w-12 h-6 rounded-full transition relative ${
                          detectMobilePhones ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            detectMobilePhones ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Detect Multiple Faces */}
                  <div className="rounded-xl p-6" style={{ backgroundColor: '#292f40' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white mb-1">Detect Multiple Faces</h3>
                        <p className="text-gray-400 text-sm">Flag when more than one person is detected</p>
                      </div>
                      <button
                        onClick={() => setDetectMultipleFaces(!detectMultipleFaces)}
                        className={`w-12 h-6 rounded-full transition relative ${
                          detectMultipleFaces ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            detectMultipleFaces ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Detect Gaze / Looking Away */}
                  <div className="rounded-xl p-6" style={{ backgroundColor: '#292f40' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white mb-1">Detect Gaze / Looking Away</h3>
                        <p className="text-gray-400 text-sm">Monitor eye movement and attention patterns</p>
                      </div>
                      <button
                        onClick={() => setDetectGaze(!detectGaze)}
                        className={`w-12 h-6 rounded-full transition relative ${
                          detectGaze ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            detectGaze ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Disable Browser Tab Switching */}
                  <div className="rounded-xl p-6" style={{ backgroundColor: '#292f40' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white mb-1">Disable Browser Tab Switching</h3>
                        <p className="text-gray-400 text-sm">Detect and log when student leaves exam tab</p>
                      </div>
                      <button
                        onClick={() => setDetectTabSwitching(!detectTabSwitching)}
                        className={`w-12 h-6 rounded-full transition relative ${
                          detectTabSwitching ? 'bg-purple-600' : 'bg-gray-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${
                            detectTabSwitching ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-white border border-white/20 hover:bg-white/5 transition"
                    style={{ backgroundColor: '#242838' }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <path d="M10 18L4 12L10 6L11.4 7.45L7.85 11H20V13H7.85L11.4 16.55L10 18Z" fill="white" />
                    </svg>
                    Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="p-8">
              <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                  <h1 className="text-white text-3xl mb-2">Exam Review</h1>
                  <p className="text-gray-400">Review and update your exam before publishing</p>
                </div>

                {/* Exam Title & Status */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white text-2xl">{examName || 'Spanish demo'}</h2>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
                    <Check className="w-5 h-5" />
                    Ready to Publish
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Exam Schedule */}
                  <div className="rounded-xl p-6 border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <h3 className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Exam Schedule</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          Start Time
                        </div>
                        <div className="text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{startDate}, {startTime}</div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                          <Clock className="w-4 h-4" />
                          End Time
                        </div>
                        <div className="text-white" style={{ fontFamily: 'Inter, sans-serif' }}>{endDate}, {endTime}</div>
                      </div>
                    </div>
                  </div>

                  {/* Exam Settings */}
                  <div className="rounded-xl p-6 border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                    <div className="flex items-center gap-2 mb-4">
                      <Settings className="w-5 h-5 text-purple-400" />
                      <h3 className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Exam Settings</h3>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <Sparkles className="w-4 h-4" />
                        Randomize Order
                      </div>
                      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                        randomizeOrder ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-700/30 text-gray-400 border border-gray-700/50'
                      }`}>
                        {randomizeOrder ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Enabled</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span className="text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Disabled</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Questions Overview */}
                <div className="rounded-xl p-6 mb-6 border border-white/10" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center gap-2 mb-6">
                    <ListChecks className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Questions Overview</h3>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Total Questions</div>
                      <div className="text-white text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{questions.length}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Multiple Choice</div>
                      <div className="text-white text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{multipleChoiceCount}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                      <div className="text-gray-400 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Long Answer</div>
                      <div className="text-white text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{longAnswerCount}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-400/30">
                      <div className="text-blue-400 text-sm mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Total Points</div>
                      <div className="text-blue-400 text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{totalPoints}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 bg-gray-700/50 rounded-full mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: '100%' }} />
                  </div>

                  {/* Questions List */}
                  <div className="space-y-3">
                    {questions.map((q, index) => (
                      <div
                        key={q.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-white/10 hover:bg-white/5 transition"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center flex-shrink-0" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{q.text}</div>
                          <div className="text-sm text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {q.type === 'multiple-choice' ? 'Multiple Choice' : 'Long Answer'}
                          </div>
                        </div>
                        <div className="px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-lg">
                          <span className="text-blue-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>{q.points} pts</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-white border border-white/20 hover:bg-white/5 transition"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <path d="M10 18L4 12L10 6L11.4 7.45L7.85 11H20V13H7.85L11.4 16.55L10 18Z" fill="white" />
                    </svg>
                    Back
                  </button>
                  <button
                    onClick={() => navigate('/instructor')}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    <Send className="w-5 h-5" />
                    Publish Exam
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}