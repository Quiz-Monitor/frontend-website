import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SaaSLandingPage } from './components/SaaSLandingPage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { SignUpStep1 } from './components/SignUpStep1';
import { SignUpStep2 } from './components/SignUpStep2';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { InstructorDashboard } from './components/InstructorDashboard';
import { MyExamsPage } from './components/MyExamsPage';
import { MyExamsListPage } from './components/MyExamsListPage';
import { InstructorSettingsPage } from './components/InstructorSettingsPage';
import { ExamCreationWizardV2 } from './components/ExamCreationWizardV2';
import { ResultsLogs } from './components/ResultsLogs';
import { ResultsDatabasePage } from './components/ResultsDatabasePage';
import { ExamStudentsListPage } from './components/ExamStudentsListPage';
import { StudentResultDetailPage } from './components/StudentResultDetailPage';
import { InstructorReviewExamPage } from './components/InstructorReviewExamPage';
import { StudentDashboard } from './components/StudentDashboard';
import { StudentMyExamsPage } from './components/StudentMyExamsPage';
import { StudentHistoryPage } from './components/StudentHistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { StudentCodeEntry } from './components/StudentCodeEntry';
import { StudentWaitingRoom } from './components/StudentWaitingRoom';
import { ExamPermissionsCheck } from './components/ExamPermissionsCheck';
import { ExamInterface } from './components/ExamInterface';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SaaSLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<SignUpStep1 />} />
        <Route path="/signup/role-selection" element={<SignUpStep2 />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/instructor" element={<InstructorDashboard />} />
        <Route path="/instructor/exams" element={<MyExamsPage />} />
        <Route path="/instructor/my-exams" element={<MyExamsListPage />} />
        <Route path="/instructor/settings" element={<InstructorSettingsPage />} />
        <Route path="/instructor/create-exam" element={<ExamCreationWizardV2 />} />
        <Route path="/instructor/results/:examId" element={<ResultsLogs />} />
        <Route path="/instructor/results" element={<ResultsDatabasePage />} />
        <Route path="/instructor/results-database" element={<ResultsDatabasePage />} />
        <Route path="/instructor/exam-results/:examId" element={<ExamStudentsListPage />} />
        <Route path="/instructor/student-result/:examId/:studentId" element={<StudentResultDetailPage />} />
        <Route path="/instructor/review-exam/:examId/:studentId" element={<InstructorReviewExamPage />} />
        <Route path="/instructor/profile" element={<ProfilePage userRole="instructor" />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/profile" element={<ProfilePage userRole="student" />} />
        <Route path="/student/code-entry" element={<StudentCodeEntry />} />
        <Route path="/student/waiting/:examId" element={<StudentWaitingRoom />} />
        <Route path="/student/permissions/:examId" element={<ExamPermissionsCheck />} />
        <Route path="/student/exam/:examId" element={<ExamInterface />} />
        <Route path="/student/my-exams" element={<StudentMyExamsPage />} />
        <Route path="/student/history" element={<StudentHistoryPage />} />
      </Routes>
    </Router>
  );
}
