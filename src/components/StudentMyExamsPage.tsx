import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	FileText,
	Search,
	Filter,
	Brain,
	Home,
	History,
	User,
	LogOut,
	Calendar,
	Clock,
	Eye,
	Lock,
	PlayCircle,
	CheckCircle,
	AlertCircle,
	Target,
	Award,
	BookOpen,
} from "lucide-react";
import { StudentSidebar } from "./StudentSidebar";

const examsData = [
	{
		id: "exam-1",
		title: "Advanced Mathematics - Final Exam",
		instructor: "Dr. Sarah Johnson",
		subject: "Mathematics",
		date: "Dec 15, 2024",
		time: "10:00 AM",
		duration: "120 min",
		questions: 25,
		status: "scheduled",
		aiMonitoring: true,
	},
	{
		id: "exam-2",
		title: "Machine Learning Fundamentals",
		instructor: "Prof. Michael Chen",
		subject: "Computer Science",
		date: "Dec 18, 2024",
		time: "2:00 PM",
		duration: "90 min",
		questions: 20,
		status: "scheduled",
		aiMonitoring: true,
	},
	{
		id: "exam-3",
		title: "Web Development - Midterm",
		instructor: "Dr. Emily Parker",
		subject: "Web Development",
		date: "Dec 20, 2024",
		time: "4:00 PM",
		duration: "150 min",
		questions: 30,
		status: "scheduled",
		aiMonitoring: true,
	},
	{
		id: "exam-4",
		title: "Database Systems Quiz",
		instructor: "Prof. David Martinez",
		subject: "Computer Science",
		date: "Dec 22, 2024",
		time: "11:00 AM",
		duration: "60 min",
		questions: 15,
		status: "scheduled",
		aiMonitoring: false,
	},
];

export function StudentMyExamsPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterStatus, setFilterStatus] = useState("all");

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled":
				return "bg-blue-500/20 text-blue-400 border-blue-500/30";
			case "waiting":
				return "bg-blue-500/20 text-blue-400 border-blue-500/30";
			case "active":
				return "bg-green-500/20 text-green-400 border-green-500/30";
			case "completed":
				return "bg-gray-500/20 text-gray-400 border-gray-500/30";
			default:
				return "bg-gray-500/20 text-gray-400 border-gray-500/30";
		}
	};

	const filteredExams = examsData.filter((exam) => {
		const matchesSearch =
			exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			exam.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
			exam.instructor.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesFilter =
			filterStatus === "all" || exam.status === filterStatus;
		return matchesSearch && matchesFilter;
	});

	return (
		<div className="min-h-screen flex" style={{ backgroundColor: "#0F111A" }}>
			{/* Animated Background */}
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
			<div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
			<div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

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
									<FileText className="w-8 h-8 text-blue-400" />
									<h1
										className="text-white text-3xl"
										style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
									>
										My Exams
									</h1>
								</div>
								<p className="text-gray-400 text-sm">
									View all your upcoming and scheduled exams
								</p>
							</div>
						</div>
					</div>
				</header>

				{/* Filters Bar */}
				<div
					className="border-b px-8 py-4"
					style={{
						backgroundColor: "rgba(255, 255, 255, 0.02)",
						borderColor: "rgba(255, 255, 255, 0.08)",
					}}
				>
					<div className="flex items-center gap-4">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
							<input
								type="text"
								placeholder="Search exams..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-12 pr-4 py-3 rounded-xl border bg-white/5 text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none transition"
								style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
							/>
						</div>

						<div className="flex items-center gap-2">
							<Filter className="w-5 h-5 text-gray-400" />
							<select
								value={filterStatus}
								onChange={(e) => setFilterStatus(e.target.value)}
								className="px-4 py-3 rounded-xl border bg-white/5 text-white focus:border-blue-500 focus:outline-none transition cursor-pointer"
								style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
							>
								<option value="all" className="bg-gray-800">
									All Status
								</option>
								<option value="scheduled" className="bg-gray-800">
									Scheduled
								</option>
								<option value="active" className="bg-gray-800">
									Active
								</option>
								<option value="completed" className="bg-gray-800">
									Completed
								</option>
							</select>
						</div>
					</div>
				</div>

				{/* Exams Grid */}
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-7xl mx-auto">
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{filteredExams.map((exam) => (
								<div
									key={exam.id}
									className="rounded-2xl border p-6 group hover:border-blue-500/50 transition-all duration-300"
									style={{
										backgroundColor: "rgba(255, 255, 255, 0.03)",
										backdropFilter: "blur(10px)",
										borderColor: "rgba(255, 255, 255, 0.1)",
									}}
								>
									{/* Header */}
									<div className="flex items-start justify-between mb-4">
										<div className="flex-1">
											<h3
												className="text-white text-lg mb-2 group-hover:text-blue-400 transition"
												style={{
													fontFamily: "Inter, sans-serif",
													fontWeight: 600,
												}}
											>
												{exam.title}
											</h3>
											<div className="flex items-center gap-3 mb-2">
												<span
													className={`px-3 py-1 rounded-lg text-xs border ${getStatusColor(exam.status)}`}
													style={{
														fontFamily: "Inter, sans-serif",
														fontWeight: 500,
													}}
												>
													{exam.status.toUpperCase()}
												</span>
												{exam.aiMonitoring && (
													<div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30">
														<Eye className="w-3.5 h-3.5 text-purple-400" />
														<span className="text-purple-400 text-xs">
															AI Monitoring
														</span>
													</div>
												)}
											</div>
											<p className="text-gray-400 text-sm">{exam.instructor}</p>
										</div>
									</div>

									{/* Info Grid */}
									<div
										className="grid grid-cols-2 gap-4 mb-4 p-4 rounded-xl"
										style={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
									>
										<div className="flex items-center gap-3">
											<Calendar className="w-5 h-5 text-blue-400" />
											<div>
												<div className="text-gray-400 text-xs">Date</div>
												<div className="text-white text-sm">{exam.date}</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<Clock className="w-5 h-5 text-purple-400" />
											<div>
												<div className="text-gray-400 text-xs">Time</div>
												<div className="text-white text-sm">{exam.time}</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<Target className="w-5 h-5 text-green-400" />
											<div>
												<div className="text-gray-400 text-xs">Duration</div>
												<div className="text-white text-sm">
													{exam.duration}
												</div>
											</div>
										</div>
										<div className="flex items-center gap-3">
											<BookOpen className="w-5 h-5 text-yellow-400" />
											<div>
												<div className="text-gray-400 text-xs">Questions</div>
												<div className="text-white text-sm">
													{exam.questions}
												</div>
											</div>
										</div>
									</div>

									{/* Action Button */}
									<button
										disabled={exam.status === "scheduled"}
										className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition ${
											exam.status === "scheduled"
												? "bg-gray-500/20 text-gray-400 border cursor-not-allowed"
												: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/30"
										}`}
										style={
											exam.status === "scheduled"
												? { borderColor: "rgba(100, 116, 139, 0.3)" }
												: {}
										}
										onClick={() => {
											if (exam.status !== "scheduled") {
												navigate(`/student/exam/${exam.id}`);
											}
										}}
									>
										{exam.status === "scheduled" ? (
											<>
												<Lock className="w-5 h-5" />
												<span
													style={{
														fontFamily: "Inter, sans-serif",
														fontWeight: 500,
													}}
												>
													Not Started Yet
												</span>
											</>
										) : (
											<>
												<PlayCircle className="w-5 h-5" />
												<span
													style={{
														fontFamily: "Inter, sans-serif",
														fontWeight: 500,
													}}
												>
													{exam.status === "active"
														? "Resume Exam"
														: "Start Exam"}
												</span>
											</>
										)}
									</button>
								</div>
							))}
						</div>

						{filteredExams.length === 0 && (
							<div className="text-center py-20">
								<FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
								<h3
									className="text-white text-xl mb-2"
									style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
								>
									No exams found
								</h3>
								<p className="text-gray-400">
									Try adjusting your search or filters
								</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
