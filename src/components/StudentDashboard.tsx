import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Brain,
	Home,
	FileText,
	History,
	User,
	LogOut,
	Calendar,
	Clock,
	Trophy,
	Eye,
	Lock,
	Target,
	BookOpen,
	Award,
	TrendingUp,
	PlayCircle,
	CheckCircle,
	AlertCircle,
	Zap,
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { StudentSidebar } from "./StudentSidebar";
import {
	joinExam,
	getStudentExams,
	getStudentStatistics,
	getStudentSubmittedExams,
	StudentExam,
	StudentStatisticsResponse,
	StudentSubmittedExam,
} from "../services/examService";
import { toast } from "sonner";

// Types moved to examService.ts



const performanceData = [
	{ exam: "Exam 1", score: 65 },
	{ exam: "Exam 2", score: 72 },
	{ exam: "Exam 3", score: 78 },
	{ exam: "Exam 4", score: 85 },
	{ exam: "Exam 5", score: 92 },
	{ exam: "Exam 6", score: 95 },
];

export function StudentDashboard() {
	const navigate = useNavigate();
	const [activeSection, setActiveSection] = useState("dashboard");
	const [examCode, setExamCode] = useState("");
	const [isJoining, setIsJoining] = useState(false);



	const [studentExams, setStudentExams] = useState<StudentExam[]>([]);
	const [statistics, setStatistics] = useState<StudentStatisticsResponse | null>(null);
	const [recentActivity, setRecentActivity] = useState<StudentSubmittedExam[]>([]);
	const [isLoadingExams, setIsLoadingExams] = useState(true);

	const fetchDashboardData = async () => {
		try {
			setIsLoadingExams(true);
			const [exams, stats, submitted] = await Promise.all([
				getStudentExams(),
				getStudentStatistics(),
				getStudentSubmittedExams()
			]);
			setStudentExams(exams);
			setStatistics(stats);
			setRecentActivity(submitted.exams);
		} catch (error) {
			toast.error("Failed to load dashboard data");
		} finally {
			setIsLoadingExams(false);
		}
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const handleJoinExam = async () => {
		if (!examCode.trim()) {
			toast.error("Please enter an exam code");
			return;
		}

		try {
			setIsJoining(true);
			const result = await joinExam({ examCode: examCode.trim() });
			toast.success(`Successfully joined: ${result.title}`);

			// Save attemptId to localStorage
			const savedAttempts = JSON.parse(
				localStorage.getItem("exam_attempts") || "{}",
			);
			savedAttempts[result.examId] = result.attemptId;
			localStorage.setItem("exam_attempts", JSON.stringify(savedAttempts));

			// Refresh the exams list and clear input
			setExamCode("");
			await fetchDashboardData();
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to join exam",
			);
		} finally {
			setIsJoining(false);
		}
	};



	// Calculate stats
	const totalExams = statistics?.overview.totalExamsSubmitted || 0;
	const avgScore = statistics?.scoreStatistics.averageScorePercentage ? Math.round(statistics.scoreStatistics.averageScorePercentage) : 0;
	const passedExams = recentActivity.filter(
		(exam) => exam.gradingStatus === "graded" && (exam.scorePercentage || 0) >= 50
	).length;
	const upcomingCount = studentExams.length;

	return (
		<div className="min-h-screen flex" style={{ backgroundColor: "#0F111A" }}>
			{/* Animated Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
			<div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
			<div
				className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"
				style={{ animationDelay: "1s" }}
			/>

			<StudentSidebar />

			{/* Main Content */}
			<div 
				className="flex-1 relative z-10 overflow-hidden flex flex-col"
				style={{ 
					marginLeft: 'var(--sidebar-width)',
					transition: 'margin-left 0.25s cubic-bezier(0.4,0,0.2,1)'
				}}
			>
				{/* Header */}
				<header
					className="border-b flex-shrink-0"
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.03)",
						backdropFilter: "blur(10px)",
						borderColor: "rgba(255, 255, 255, 0.1)",
					}}
				>
					<div className="px-8 py-6">
						<div className="flex items-center justify-between">
							<div>
								<div className="flex items-center gap-3 mb-2">
									<Home className="w-8 h-8 text-blue-400" />
									<h1
										className="text-white text-3xl"
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
									>
										Dashboard
									</h1>
								</div>
								<p className="text-gray-400 text-sm">
									Welcome back, Michael Anderson
								</p>
							</div>

							<div className="flex items-center gap-4">
								<div className="px-4 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10">
									<div className="flex items-center gap-2">
										<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
										<span
											className="text-green-400 text-sm"
											style={{
												fontFamily: "Inter, sans-serif",
												fontWeight: 500,
											}}
										>
											Online
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</header>

				{/* Dashboard Content */}
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-7xl mx-auto space-y-6">
						{/* Join Exam Card */}
						<div
							className="rounded-2xl border p-6"
							style={{
								backgroundColor: "rgba(59, 130, 246, 0.1)",
								backdropFilter: "blur(10px)",
								borderColor: "rgba(59, 130, 246, 0.3)",
							}}
						>
							<div className="flex items-center gap-6">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-2">
										<PlayCircle className="w-6 h-6 text-blue-400" />
										<h2
											className="text-white text-xl"
											style={{
												fontFamily: "Inter, sans-serif",
												fontWeight: 600,
											}}
										>
											Have an exam code?
										</h2>
									</div>
									<p className="text-blue-200 text-sm">
										Enter your exam code to join an active or upcoming exam
									</p>
								</div>
								<div className="flex gap-3">
									<input
										type="text"
										value={examCode}
										onChange={(e) => setExamCode(e.target.value)}
										placeholder="Enter Code (e.g. XF-9022)"
										className="px-6 py-3 rounded-xl text-white placeholder-gray-500 border bg-white/10 focus:outline-none focus:border-blue-400 transition w-64"
										style={{ borderColor: "rgba(255, 255, 255, 0.2)" }}
										onKeyPress={(e) => e.key === "Enter" && handleJoinExam()}
									/>
									<button
										onClick={handleJoinExam}
										disabled={isJoining}
										className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
									>
										{isJoining ? (
											<>
												<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
												Joining...
											</>
										) : (
											"Join Exam"
										)}
									</button>
								</div>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-4 gap-6">
							{/* Total Exams */}
							<div
								className="rounded-2xl border p-6 group hover:border-blue-500/50 transition-all duration-300"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.03)",
									backdropFilter: "blur(10px)",
									borderColor: "rgba(255, 255, 255, 0.1)",
								}}
							>
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
										<BookOpen className="w-6 h-6 text-blue-400" />
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{totalExams}
								</div>
								<div className="text-gray-400 text-sm">Completed Exams</div>
							</div>

							{/* Average Score */}
							<div
								className="rounded-2xl border p-6 group hover:border-green-500/50 transition-all duration-300"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.03)",
									backdropFilter: "blur(10px)",
									borderColor: "rgba(255, 255, 255, 0.1)",
								}}
							>
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
										<Award className="w-6 h-6 text-green-400" />
									</div>
									<div className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
										<div className="flex items-center gap-1 text-green-400 text-xs">
											<TrendingUp className="w-3 h-3" />
											<span>+12%</span>
										</div>
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{avgScore}%
								</div>
								<div className="text-gray-400 text-sm">Average Score</div>
							</div>

							{/* Passed Exams */}
							<div
								className="rounded-2xl border p-6 group hover:border-purple-500/50 transition-all duration-300"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.03)",
									backdropFilter: "blur(10px)",
									borderColor: "rgba(255, 255, 255, 0.1)",
								}}
							>
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
										<CheckCircle className="w-6 h-6 text-purple-400" />
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{passedExams}/{totalExams}
								</div>
								<div className="text-gray-400 text-sm">Passed Exams</div>
							</div>

							{/* Upcoming */}
							<div
								className="rounded-2xl border p-6 group hover:border-yellow-500/50 transition-all duration-300"
								style={{
									backgroundColor: "rgba(255, 255, 255, 0.03)",
									backdropFilter: "blur(10px)",
									borderColor: "rgba(255, 255, 255, 0.1)",
								}}
							>
								<div className="flex items-start justify-between mb-4">
									<div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
										<Clock className="w-6 h-6 text-yellow-400" />
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{upcomingCount}
								</div>
								<div className="text-gray-400 text-sm">Upcoming Exams</div>
							</div>
						</div>


						{/* Upcoming Exams Section */}
						<div>
							<div className="flex items-center justify-between mb-6">
								<div>
									<h2
										className="text-white text-2xl mb-1"
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
									>
										Upcoming Exams
									</h2>
									<p className="text-gray-400 text-sm">
										Exams scheduled in the next 7 days
									</p>
								</div>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{isLoadingExams ? (
									Array.from({ length: 3 }).map((_, i) => (
										<div
											key={i}
											className="h-[400px] rounded-2xl bg-white/5 animate-pulse"
										/>
									))
								) : studentExams.length > 0 ? (
									studentExams.map((exam) => (
										<CountdownCard key={exam.examCode} exam={exam} />
									))
								) : (
									<div className="col-span-full py-12 text-center rounded-2xl border border-dashed border-white/10">
										<BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-4" />
										<h3 className="text-white text-lg font-medium">
											No exams found
										</h3>
										<p className="text-gray-400">
											You don't have any upcoming or active exams.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}

// Countdown Timer Card Component
function CountdownCard({ exam }: { exam: StudentExam }) {
	const navigate = useNavigate();
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [isActive, setIsActive] = useState(false);

	const startTime = new Date(exam.startTime);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date().getTime();
			const distance = startTime.getTime() - now;

			const statusActive =
				exam.examStatus === "active" || exam.examStatus === "in_progress";
			if (distance < 0 || statusActive) {
				// Exam has started or is marked active by backend
				setIsActive(true);
				const elapsed = Math.abs(distance);
				setTimeLeft({
					days: Math.floor(elapsed / (1000 * 60 * 60 * 24)),
					hours: Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
					minutes: Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60)),
					seconds: Math.floor((elapsed % (1000 * 60)) / 1000),
				});
			} else {
				setIsActive(false);
				setTimeLeft({
					days: Math.floor(distance / (1000 * 60 * 60 * 24)),
					hours: Math.floor(
						(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
					),
					minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
					seconds: Math.floor((distance % (1000 * 60)) / 1000),
				});
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [exam.startTime]);

	const isWaiting = exam.examStatus === "waiting";
	const isGraded = exam.examStatus === "graded";
	const isSubmitted = exam.examStatus === "submitted";
	const isInProgress =
		exam.examStatus === "in_progress" || exam.examStatus === "active";

	return (
		<div
			className={`rounded-2xl border p-6 group transition-all duration-300 ${
				isInProgress
					? "border-green-500/50 shadow-lg shadow-green-500/20"
					: isGraded
						? "border-purple-500/50 hover:border-purple-500"
						: isSubmitted
							? "border-yellow-500/50"
							: "hover:border-blue-500/50"
			}`}
			style={{
				backgroundColor: isInProgress
					? "rgba(34, 197, 94, 0.05)"
					: isGraded
						? "rgba(168, 85, 247, 0.05)"
						: isSubmitted
							? "rgba(234, 179, 8, 0.05)"
							: "rgba(255, 255, 255, 0.03)",
				backdropFilter: "blur(10px)",
				borderColor: isInProgress
					? "rgba(34, 197, 94, 0.3)"
					: isGraded
						? "rgba(168, 85, 247, 0.3)"
						: isSubmitted
							? "rgba(234, 179, 8, 0.3)"
							: "rgba(255, 255, 255, 0.1)",
			}}
		>
			{/* Header */}
			<div className="flex items-start justify-between mb-4">
				<div className="flex-1">
					<h3
						className={`mb-1 text-lg transition ${
							isActive
								? "text-green-400"
								: "text-white group-hover:text-blue-400"
						}`}
						style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
					>
						{exam.examTitle}
					</h3>
					<p className="text-gray-400 text-sm">{exam.instructorName}</p>
				</div>
				<div
					className={`w-10 h-10 rounded-lg flex items-center justify-center ${
						isInProgress
							? "bg-green-500/20 animate-pulse"
							: isGraded
								? "bg-purple-500/20"
								: "bg-blue-500/20"
					}`}
				>
					<Calendar
						className={`w-5 h-5 ${
							isInProgress
								? "text-green-400"
								: isGraded
									? "text-purple-400"
									: "text-blue-400"
						}`}
					/>
				</div>
			</div>

			{/* Exam Code Badge */}
			<div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
				<span className="text-gray-400 text-xs">Code:</span>
				<span className="text-blue-400 text-xs font-mono font-bold tracking-wider">
					{exam.examCode}
				</span>
			</div>

			{/* Status Badges */}
			{isInProgress && (
				<div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30">
					<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
					<span
						className="text-green-400 text-sm"
						style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
					>
						EXAM ACTIVE NOW
					</span>
				</div>
			)}

			{isGraded && (
				<div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
					<CheckCircle className="w-4 h-4 text-purple-400" />
					<span
						className="text-purple-400 text-sm"
						style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
					>
						RESULTS AVAILABLE
					</span>
				</div>
			)}

			{isSubmitted && (
				<div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
					<AlertCircle className="w-4 h-4 text-yellow-400" />
					<span
						className="text-yellow-400 text-sm"
						style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
					>
						AWAITING GRADING
					</span>
				</div>
			)}

			{isWaiting && !isActive && (
				<div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
					<Clock className="w-4 h-4 text-blue-400" />
					<span
						className="text-blue-400 text-sm"
						style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
					>
						WAITING FOR START
					</span>
				</div>
			)}

			{/* Info */}
			<div
				className="flex items-center gap-4 mb-4 p-3 rounded-xl"
				style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
			>
				<div className="flex items-center gap-2 text-gray-400 text-xs">
					<Clock className="w-4 h-4" />
					<span>{exam.durationMinutes} min</span>
				</div>
				<div className="flex items-center gap-2 text-gray-400 text-xs">
					<FileText className="w-4 h-4" />
					<span>{exam.questionCount} questions</span>
				</div>
			</div>

			{/* Countdown Timer (only for waiting / in_progress — not submitted or graded) */}
			{!isGraded && !isSubmitted && (
				<div className="mb-4">
					<div className="text-gray-400 text-xs mb-2">
						{isInProgress ? "Time Elapsed:" : "Starts in:"}
					</div>
					<div className="grid grid-cols-4 gap-2">
						<div
							className={`text-center p-2 rounded-lg ${
								isInProgress ? "bg-green-500/10" : "bg-blue-500/10"
							}`}
						>
							<div
								className="text-white mb-1 text-2xl"
								style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
							>
								{String(timeLeft.days).padStart(2, "0")}
							</div>
							<div className="text-gray-500 text-xs">Days</div>
						</div>
						<div
							className={`text-center p-2 rounded-lg ${
								isInProgress ? "bg-green-500/10" : "bg-blue-500/10"
							}`}
						>
							<div
								className="text-white mb-1 text-2xl"
								style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
							>
								{String(timeLeft.hours).padStart(2, "0")}
							</div>
							<div className="text-gray-500 text-xs">Hrs</div>
						</div>
						<div
							className={`text-center p-2 rounded-lg ${
								isInProgress ? "bg-green-500/10" : "bg-blue-500/10"
							}`}
						>
							<div
								className="text-white mb-1 text-2xl"
								style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
							>
								{String(timeLeft.minutes).padStart(2, "0")}
							</div>
							<div className="text-gray-500 text-xs">Min</div>
						</div>
						<div
							className={`text-center p-2 rounded-lg ${
								isInProgress ? "bg-green-500/10" : "bg-blue-500/10"
							}`}
						>
							<div
								className="text-white mb-1 text-2xl"
								style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
							>
								{String(timeLeft.seconds).padStart(2, "0")}
							</div>
							<div className="text-gray-500 text-xs">Sec</div>
						</div>
					</div>
				</div>
			)}

			{/* Action Button */}
			{isInProgress || isWaiting ? (
				<button
					onClick={() => {
						navigate(`/student/exam/${exam.examId}`);
					}}
					className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition shadow-lg ${
						isWaiting
							? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-blue-500/20"
							: "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-green-500/20"
					}`}
				>
					<PlayCircle className="w-5 h-5" />
					<span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
						{isWaiting ? "Start Exam" : "Resume / Start Exam"}
					</span>
				</button>
			) : isGraded ? (
				<button
					onClick={() => navigate(`/student/history/${exam.examId}`)}
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/20"
				>
					<Award className="w-5 h-5" />
					<span style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
						View Results
					</span>
				</button>
			) : isSubmitted ? (
				<button
					disabled
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition cursor-not-allowed bg-yellow-500/10 text-yellow-400 border border-yellow-500/30"
				>
					<AlertCircle className="w-4 h-4" />
					<span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
						Awaiting Instructor Grading
					</span>
				</button>
			) : (
				<button
					disabled
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition cursor-not-allowed bg-gray-500/20 text-gray-400 border"
					style={{ borderColor: "rgba(100, 116, 139, 0.3)" }}
				>
					<Lock className="w-4 h-4" />
					<span style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
						Not Available
					</span>
				</button>
			)}
		</div>
	);
}
