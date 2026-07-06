import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Plus,
	Calendar,
	Users,
	Brain,
	FileText,
	BarChart3,
	LayoutDashboard,
	Database,
	Settings,
	Search,
	Bell,
	Copy,
	AlertTriangle,
	CheckCircle,
	Activity,
	TrendingUp,
	Clock,
	Radio,
	Shield,
	HelpCircle,
	LogOut,
	Eye,
	Award,
	Zap,
	Target,
	TrendingDown,
	ChevronRight,
	PlayCircle,
	History,
	Loader2,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	Area,
	AreaChart,
} from "recharts";
import { InstructorSidebar } from "./InstructorSidebar";
import {
	getInstructorStatistics,
	InstructorStatisticsResponse,
	getInstructorRecentExams,
	InstructorRecentExam,
} from "../services/examService";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const performanceData = [
	{ name: "Mon", exams: 12, students: 145, violations: 3 },
	{ name: "Tue", exams: 19, students: 198, violations: 5 },
	{ name: "Wed", exams: 15, students: 167, violations: 2 },
	{ name: "Thu", exams: 22, students: 221, violations: 7 },
	{ name: "Fri", exams: 18, students: 189, violations: 4 },
	{ name: "Sat", exams: 8, students: 95, violations: 1 },
	{ name: "Sun", exams: 5, students: 67, violations: 0 },
];

const liveActivities = [
	{
		student: "Michael Johnson",
		action: "submitted exam",
		time: "2s ago",
		type: "success",
	},
	{
		student: "Sarah Anderson",
		action: "AI detected face not visible",
		time: "5s ago",
		type: "warning",
	},
	{
		student: "David Martinez",
		action: "started exam",
		time: "12s ago",
		type: "info",
	},
	{
		student: "Emily Thompson",
		action: "answered question 15/25",
		time: "18s ago",
		type: "info",
	},
	{
		student: "James Wilson",
		action: "tab switch detected",
		time: "25s ago",
		type: "warning",
	},
	{
		student: "Sophia Lee",
		action: "submitted exam",
		time: "32s ago",
		type: "success",
	},
];

export function InstructorDashboard() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const [stats, setStats] = useState<InstructorStatisticsResponse | null>(null);
	const [recentExams, setRecentExams] = useState<InstructorRecentExam[]>([]);
	const [isLoadingExams, setIsLoadingExams] = useState(false);

	useEffect(() => {
		async function loadStats() {
			try {
				const data = await getInstructorStatistics();
				setStats(data);
			} catch (error) {
				console.error("Failed to load instructor stats", error);
				toast.error("Failed to load statistics");
			}
		}

		async function loadRecentExams() {
			setIsLoadingExams(true);
			try {
				const data = await getInstructorRecentExams();
				setRecentExams(data);
			} catch (error) {
				console.error("Failed to load recent exams", error);
				toast.error("Failed to load recent exams");
			} finally {
				setIsLoadingExams(false);
			}
		}

		loadStats();
		loadRecentExams();
	}, []);

	return (
		<div className="min-h-screen flex" style={{ backgroundColor: "#0F111A" }}>
			{/* Animated Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
			<div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
			<div
				className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse"
				style={{ animationDelay: "1s" }}
			/>

			<InstructorSidebar />

			{/* Main Content */}
			<div
				className="flex-1 relative z-10 overflow-hidden flex flex-col"
				style={{
					marginLeft: "var(--sidebar-width)",
					transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
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
									<LayoutDashboard className="w-8 h-8 text-blue-400" />
									<h1
										className="text-white text-3xl"
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
									>
										Dashboard
									</h1>
								</div>
								<p className="text-gray-400 text-sm">
									Welcome back, {user?.fullName ?? "Instructor"}
								</p>
							</div>

							<div className="flex items-center gap-4">
								{/* Create Exam Button */}
								<button
									onClick={() => navigate("/instructor/create-exam")}
									className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition shadow-lg hover:shadow-blue-500/30"
								>
									<Plus className="w-5 h-5" />
									<span
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
									>
										Create Exam
									</span>
								</button>
							</div>
						</div>
					</div>
				</header>

				{/* Dashboard Content */}
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-7xl mx-auto space-y-6">
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
										<FileText className="w-6 h-6 text-blue-400" />
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
									{stats?.examOverview.totalExamsCreated || 0}
								</div>
								<div className="text-gray-400 text-sm">Total Exams</div>
							</div>

							{/* Active Students */}
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
										<Users className="w-6 h-6 text-purple-400" />
									</div>
									<div className="px-2 py-1 rounded-lg bg-green-500/20 border border-green-500/30">
										<div className="flex items-center gap-1 text-green-400 text-xs">
											<TrendingUp className="w-3 h-3" />
											<span>+8%</span>
										</div>
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{stats?.studentOverview.totalUniqueStudents || 0}
								</div>
								<div className="text-gray-400 text-sm">Active Students</div>
							</div>

							{/* Avg Score */}
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
											<span>+3%</span>
										</div>
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{stats?.scoreStatistics.averageScorePercentage
										? Math.round(
												stats.scoreStatistics.averageScorePercentage * 10,
											) / 10
										: 0}
									%
								</div>
								<div className="text-gray-400 text-sm">Average Score</div>
							</div>

							{/* Integrity Score */}
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
										<Shield className="w-6 h-6 text-yellow-400" />
									</div>
									<div className="px-2 py-1 rounded-lg bg-red-500/20 border border-red-500/30">
										<div className="flex items-center gap-1 text-red-400 text-xs">
											<TrendingDown className="w-3 h-3" />
											<span>-2%</span>
										</div>
									</div>
								</div>
								<div
									className="text-3xl text-white mb-1"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
								>
									{stats?.integrityStatistics.cleanAttempts || 0}
								</div>
								<div className="text-gray-400 text-sm">Clean Attempts</div>
							</div>
						</div>

						{/* Recent Exams */}
						<div
							className="rounded-2xl border p-6"
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.03)",
								backdropFilter: "blur(10px)",
								borderColor: "rgba(255, 255, 255, 0.1)",
							}}
						>
							<div className="flex items-center justify-between mb-6">
								<div>
									<h3
										className="text-white text-lg mb-1"
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
									>
										Recent Exams
									</h3>
									<p className="text-gray-400 text-sm">
										Your latest exam activities
									</p>
								</div>
								<button
									onClick={() => navigate("/instructor/my-exams")}
									className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition"
								>
									<span className="text-sm">View All</span>
									<ChevronRight className="w-4 h-4" />
								</button>
							</div>

							{isLoadingExams ? (
								<div className="flex items-center justify-center py-8">
									<Loader2 className="w-8 h-8 animate-spin text-blue-400" />
									<span className="ml-2 text-gray-400">
										Loading recent exams...
									</span>
								</div>
							) : recentExams.length === 0 ? (
								<div className="text-center py-8">
									<Calendar className="w-12 h-12 mx-auto text-gray-500 mb-3" />
									<p className="text-gray-400">No exams found</p>
								</div>
							) : (
								<div className="space-y-3">
									{recentExams.map((exam) => {
										const isCompleted = exam.completionPercent !== null;
										const scheduledDate = exam.scheduledAt
											? new Date(exam.scheduledAt)
											: null;

										return (
											<div
												key={exam.examId}
												className="flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:border-blue-500/50 hover:bg-white/5 cursor-pointer group"
												style={{
													backgroundColor: "rgba(255, 255, 255, 0.02)",
													borderColor: "rgba(255, 255, 255, 0.08)",
												}}
												onClick={() =>
													navigate(`/instructor/exam-results/${exam.examId}`)
												}
											>
												{/* Status Icon */}
												<div
													className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
														isCompleted ? "bg-gray-500/20" : "bg-blue-500/20"
													}`}
												>
													{isCompleted ? (
														<CheckCircle className="w-6 h-6 text-gray-400" />
													) : (
														<Clock className="w-6 h-6 text-blue-400" />
													)}
												</div>

												{/* Exam Info */}
												<div className="flex-1 min-w-0">
													<div
														className="text-white mb-1 group-hover:text-blue-400 transition"
														style={{
															fontFamily: "Inter, sans-serif",
															fontWeight: 500,
														}}
													>
														{exam.examName}
													</div>
													<div className="flex items-center gap-4 text-xs text-gray-400">
														<div className="flex items-center gap-1.5">
															<Users className="w-3.5 h-3.5" />
															<span>{exam.numberOfStudents} students</span>
														</div>
														{scheduledDate && (
															<div className="flex items-center gap-1.5">
																<Clock className="w-3.5 h-3.5" />
																<span>
																	{scheduledDate.toLocaleDateString()}
																</span>
															</div>
														)}
														{isCompleted &&
															exam.numberOfFlags !== null &&
															exam.numberOfFlags > 0 && (
																<div className="flex items-center gap-1.5 text-yellow-400">
																	<AlertTriangle className="w-3.5 h-3.5" />
																	<span>{exam.numberOfFlags} flags</span>
																</div>
															)}
													</div>
												</div>

												{/* Progress */}
												<div className="flex items-center gap-4">
													{isCompleted && (
														<div className="text-right">
															<div
																className="text-white text-sm mb-1"
																style={{
																	fontFamily: "Inter, sans-serif",
																	fontWeight: 600,
																}}
															>
																{Math.round(exam.completionPercent || 0)}%
															</div>
															<div className="text-gray-400 text-xs">
																Completion
															</div>
														</div>
													)}
													{isCompleted && (
														<div className="w-16 h-16">
															<svg className="transform -rotate-90 w-16 h-16">
																<circle
																	cx="32"
																	cy="32"
																	r="28"
																	stroke="rgba(255, 255, 255, 0.1)"
																	strokeWidth="6"
																	fill="none"
																/>
																<circle
																	cx="32"
																	cy="32"
																	r="28"
																	stroke="#6b7280"
																	strokeWidth="6"
																	fill="none"
																	strokeDasharray={`${(exam.completionPercent || 0) * 1.76} 176`}
																	className="transition-all duration-500"
																/>
															</svg>
														</div>
													)}
												</div>

												<ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
