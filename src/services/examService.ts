import { API_BASE_URL } from '../config/api';
import { fetchWithAuth } from '../config/apiClient';

export interface CreateExamRequest {
  title: string;
  description: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  cameraRequired: boolean;
  tabSwitchingDetection: boolean;
  eyeTrackingEnabled: boolean;
  multiplePersonDetection: boolean;
  maxTabSwitches: number;
  maxEyeAwaySeconds: number;
}

export interface Exam {
  examId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  examCode: string;
}

export interface JoinExamRequest {
  examCode: string;
}

export interface JoinExamResponse {
  examId: number;
  title: string;
  attemptId: number;
}

export interface StudentExam {
  examId: number;
  examTitle: string;
  examCode: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  questionCount: number;
  instructorName: string;
  examStatus: string;
}

export interface Choice {
  choiceId: number;
  text: string;
  isCorrect: boolean;
  orderNumber: number;
}

export interface Question {
  questionId: number;
  questionType: string;
  questionText: string;
  questionImageUrl: string | null;
  points: number;
  orderNumber: number;
  isRequired: boolean;
  choices: Choice[];
}

export interface StartExamRequest {
  examId: number;
}

export interface StartExamResponse {
  attemptId: number;
  startTime: string;
  exam: {
    title: string;
    durationMinutes: number;
    totalQuestions: number;
  };
  firstQuestion: Question;
}

export interface SubmitAnswerRequest {
  questionId: number;
  selectedChoices: number[];
  answerText: string;
  startedAt: string;
  answeredAt: string;
  timeSpentSeconds: number;
}

export interface ExamAttemptQuestionsResponse {
  attemptId: number;
  examId: number;
  examTitle: string;
  startedAt: string;
  durationMinutes: number;
  totalQuestions: number;
  questions: Question[];
}

export interface BulkAnswerRequest {
  answers: SubmitAnswerRequest[];
}

export interface BulkAnswerResponse {
  score: number;
  totalPoints: number;
  percentage: number;
}

export interface CreateExamResponse {
  examId: number;
  examCode: string;
  isPublished: boolean;
  title: string;
  description: string;
  durationMinutes: number;
  startTime: string;
  endTime: string;
  cameraRequired: boolean;
  tabSwitchingDetection: boolean;
  eyeTrackingEnabled: boolean;
  multiplePersonDetection: boolean;
  maxTabSwitches: number;
  maxEyeAwaySeconds: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddQuestionChoice {
  choiceId: number;
  text: string;
  isCorrect: boolean;
  orderNumber: number;
}

export enum ExamQuestionType {
  McqSingle = 'mcq_single',
  McqMultiple = 'mcq_multiple',
  TrueFalse = 'true_false',
  ShortAnswer = 'short_answer',
  Essay = 'essay',
}

export interface AddQuestionRequest {
  questionType: ExamQuestionType;
  questionText: string;
  questionImageUrl: string;
  points: number;
  orderNumber: number;
  isRequired: boolean;
  choices: AddQuestionChoice[];
}



async function handleError(response: Response): Promise<never> {
  let message = 'Request failed. Please try again.';

  try {
    const data = await response.json();
    if (typeof data === 'string') {
      message = data;
    } else if (data?.message) {
      message = data.message;
    } else if (data?.errors) {
      if (typeof data.errors === 'string') {
        message = data.errors;
      } else {
        const allErrors = Object.values(data.errors).flat() as unknown[];
        const firstError = allErrors[0];
        if (typeof firstError === 'string') {
          message = firstError;
        }
      }
    }
  } catch {
    // ignore response parse errors
  }

  throw new Error(message);
}

export async function createExam(input: CreateExamRequest): Promise<CreateExamResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams`, {
    method: 'POST',
    // headers handled by fetchWithAuth
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as CreateExamResponse;
}

export async function addExamQuestion(examId: number, input: AddQuestionRequest): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams/${examId}/questions`, {
    method: 'POST',
    // headers handled by fetchWithAuth
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await handleError(response);
  }
}

export async function publishExam(examId: number): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams/${examId}/publish`, {
    method: 'POST',
    // headers handled by fetchWithAuth
  });

  if (!response.ok) {
    await handleError(response);
  }
}

export async function getMyExams(): Promise<Exam[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams`, {
    method: 'GET',
    // headers handled by fetchWithAuth
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as Exam[];
}

export async function joinExam(input: JoinExamRequest): Promise<JoinExamResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams/join`, {
    method: 'POST',
    // headers handled by fetchWithAuth
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as JoinExamResponse;
}

export async function getStudentExams(): Promise<StudentExam[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/students/me/exams`, {
    method: 'GET',
    // headers handled by fetchWithAuth
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as StudentExam[];
}

export async function startExam(input: StartExamRequest): Promise<StartExamResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exam-attempts/start`, {
    method: 'POST',
    // headers handled by fetchWithAuth
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as StartExamResponse;
}

export async function submitAnswer(attemptId: number, input: SubmitAnswerRequest): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exam-attempts/${attemptId}/answers`, {
    method: 'POST',
    // headers handled by fetchWithAuth
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await handleError(response);
  }
}

export async function getExamQuestions(attemptId: number): Promise<ExamAttemptQuestionsResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exam-attempts/${attemptId}/questions`, {
    method: 'GET',
    // headers handled by fetchWithAuth
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as ExamAttemptQuestionsResponse;
}

export async function submitBulkAnswers(attemptId: number, input: BulkAnswerRequest): Promise<BulkAnswerResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exam-attempts/${attemptId}/answers/bulk`, {
    method: 'POST',
    // headers handled by fetchWithAuth
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    await handleError(response);
  }

  return (await response.json()) as BulkAnswerResponse;
}

export interface ExamStudentResult {
  studentId: number;
  studentName: string;
  finalScore: number;
  cheatingStatus: string;
  totalViolations: number;
}

export interface StudentWrittenAnswer {
  answerId: number;
  questionId: number;
  questionText: string;
  questionImageUrl: string | null;
  points: number;
  orderNumber: number;
  answerText: string;
  score: number;
  instructorFeedback: string | null;
  isManuallyGraded: boolean;
  timeSpentSeconds: number;
}

export interface StudentWrittenAnswersResponse {
  examId: number;
  examTitle: string;
  studentId: number;
  studentName: string;
  attemptId: number;
  attemptStatus: string;
  writtenAnswers: StudentWrittenAnswer[];
  summary: {
    totalWrittenQuestions: number;
    gradedCount: number;
    ungradedCount: number;
    totalWrittenPoints: number;
    awardedPoints: number;
  };
}

export interface GradeAnswerRequestItem {
  answerId: number;
  score: number;
  feedback: string;
}

export interface GradeWrittenAnswersRequest {
  grades: GradeAnswerRequestItem[];
}

export interface GradedAnswerResponseItem {
  answerId: number;
  questionId: number;
  score: number;
  feedback: string;
}

export interface GradeWrittenAnswersResponse {
  examId: number;
  studentId: number;
  attemptId: number;
  gradedAnswers: GradedAnswerResponseItem[];
  attemptScoreSummary: {
    mcqScore: number;
    manualScore: number;
    finalScore: number;
    isAttemptFullyGraded: boolean;
    attemptStatus: string;
  };
  gradedAt: string;
}

export async function getExamResults(examId: number): Promise<ExamStudentResult[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams/${examId}/results`, {
    method: 'GET',
  });
  if (!response.ok) {
    await handleError(response);
  }
  return (await response.json()) as ExamStudentResult[];
}

export async function getStudentWrittenAnswers(examId: number, studentId: number): Promise<StudentWrittenAnswersResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams/${examId}/students/${studentId}/written-answers`, {
    method: 'GET',
  });
  if (!response.ok) {
    await handleError(response);
  }
  return (await response.json()) as StudentWrittenAnswersResponse;
}

export async function gradeStudentWrittenAnswers(examId: number, studentId: number, input: GradeWrittenAnswersRequest): Promise<GradeWrittenAnswersResponse> {
  const response = await fetchWithAuth(`${API_BASE_URL}/exams/${examId}/students/${studentId}/written-answers/grade`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    await handleError(response);
  }
  return (await response.json()) as GradeWrittenAnswersResponse;
}
