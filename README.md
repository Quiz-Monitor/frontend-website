# ExamGuard AI

**AI-Powered Exam Proctoring Platform**

A modern, privacy-first online exam proctoring solution that ensures academic integrity using advanced AI monitoring while respecting student privacy. Built for educators and institutions who need reliable, secure remote examination capabilities.

## About

ExamGuard AI is a comprehensive exam management and proctoring platform designed for educational institutions, universities, and individual educators. The platform provides two distinct experiences:

- **Instructors** can create exams, configure AI proctoring rules, monitor exam sessions, and review detailed results and analytics.
- **Students** can join exams via unique codes, complete assessments in a secure environment, and track their exam history.

### Key Value Propositions

- **99.8% Detection Accuracy** - Advanced machine learning algorithms detect suspicious behavior in real-time
- **Privacy-First Approach** - All monitoring is conducted solely for exam integrity purposes
- **Military-Grade Security** - End-to-end encryption with GDPR, FERPA, and SOC 2 compliance
- **Advanced Analytics** - Deep insights into exam performance, integrity scores, and behavioral patterns

## Features

### For Instructors

| Feature | Description |
|---------|-------------|
| **Dashboard** | Overview of active exams, recent results, and key metrics |
| **Exam Creation Wizard** | Step-by-step exam builder with question management |
| **AI Protection Settings** | Configure proctoring rules and monitoring intensity |
| **Results Database** | Comprehensive exam results with filtering and search |
| **Student Review** | Detailed view of individual student submissions and flagged incidents |
| **Settings & Profile** | Account management and preferences |

### For Students

| Feature | Description |
|---------|-------------|
| **Dashboard** | View upcoming and available exams |
| **Code Entry** | Join exams using unique access codes |
| **Permissions Check** | Guided setup for camera, microphone, and screen sharing |
| **Waiting Room** | Pre-exam staging area |
| **Exam Interface** | Clean, distraction-free exam-taking experience |
| **History** | Track past exams and results |

### AI Proctoring Capabilities

- **Facial Recognition** - Verify student identity throughout the exam
- **Screen Monitoring** - Track screen activity and detect unauthorized applications
- **Live Webcam** - Continuous video monitoring during exam sessions
- **Browser Lockdown** - Prevent tab switching and external browsing
- **Behavior Analysis** - AI-powered detection of suspicious patterns
- **Focus Detection** - Monitor attention and engagement levels
- **Mobile Phone Detection** - Alert when mobile devices are detected in frame
- **Multiple Face Detection** - Flag when more than one person is detected
- **Gaze Tracking** - Monitor eye movement and attention patterns

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type-safe JavaScript |
| **Vite** | Build tool and dev server |
| **React Router DOM** | Client-side routing |
| **Tailwind CSS** | Utility-first styling |
| **Radix UI** | Accessible component primitives |
| **Recharts** | Data visualization and charts |
| **Lucide React** | Icon library |
| **React Hook Form** | Form state management |
| **class-variance-authority** | Component variant management |

## Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Capstone Project"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Project Structure

```
Capstone Project/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Reusable UI components (buttons, cards, etc.)
│   │   ├── figma/           # Figma-exported components
│   │   ├── InstructorDashboard.tsx
│   │   ├── StudentDashboard.tsx
│   │   ├── ExamCreationWizardV2.tsx
│   │   ├── ExamInterface.tsx
│   │   ├── ExamPermissionsCheck.tsx
│   │   └── ...              # Other page components
│   ├── imports/             # Additional imported components
│   ├── styles/              # Global styles
│   ├── guidelines/          # Development guidelines
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Base styles
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── package.json             # Dependencies and scripts
└── README.md                # This file
```

## Application Routes

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | SaaSLandingPage | Marketing landing page |
| `/login` | LoginPage | User authentication |
| `/register` | RegisterPage | New user registration |
| `/signup` | SignUpStep1 | Registration step 1 |
| `/signup/role-selection` | SignUpStep2 | Role selection |
| `/forgot-password` | ForgotPasswordPage | Password recovery |
| `/reset-password` | ResetPasswordPage | Password reset |

### Instructor Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/instructor` | InstructorDashboard | Main dashboard |
| `/instructor/exams` | MyExamsPage | Exam management |
| `/instructor/my-exams` | MyExamsListPage | Exam list view |
| `/instructor/create-exam` | ExamCreationWizardV2 | Create new exam |
| `/instructor/settings` | InstructorSettingsPage | Account settings |
| `/instructor/results` | ResultsDatabasePage | All results |
| `/instructor/results/:examId` | ResultsLogs | Exam-specific logs |
| `/instructor/exam-results/:examId` | ExamStudentsListPage | Students who took exam |
| `/instructor/student-result/:examId/:studentId` | StudentResultDetailPage | Individual result |
| `/instructor/review-exam/:examId/:studentId` | InstructorReviewExamPage | Review submission |
| `/instructor/profile` | ProfilePage | Instructor profile |

### Student Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/student` | StudentDashboard | Main dashboard |
| `/student/code-entry` | StudentCodeEntry | Enter exam code |
| `/student/waiting/:examId` | StudentWaitingRoom | Pre-exam waiting |
| `/student/permissions/:examId` | ExamPermissionsCheck | Setup permissions |
| `/student/exam/:examId` | ExamInterface | Take exam |
| `/student/my-exams` | StudentMyExamsPage | View exams |
| `/student/history` | StudentHistoryPage | Past exams |
| `/student/profile` | ProfilePage | Student profile |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |

## Design

This project was originally designed in Figma. The original design file can be found at:
https://www.figma.com/design/nSyamXDuj17eYkl7DlKTs5/Capstone-Project

## License

This project is private and proprietary.

---

Built with React + TypeScript + Vite
