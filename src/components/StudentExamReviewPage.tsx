import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ArrowLeft,
	BookOpen,
	CheckCircle,
	XCircle,
	MessageSquare,
	Target,
	Loader2,
	Award,
} from "lucide-react";
import { StudentSidebar } from "./StudentSidebar";
import {
	getStudentExamReview,
	StudentExamReviewResponse,
	StudentExamReviewQuestion,
} from "../services/examService";
import { toast } from "sonner";

export function StudentExamReviewPage() {
	const navigate = useNavigate();
	const { examId } = useParams<{ examId: string }>();
	const [review, setReview] = useState<StudentExamReviewResponse | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchReview() {
			if (!examId) return;
			setIsLoading(true);
			try {
				const data = await getStudentExamReview(Number(examId));
				setReview(data);
			} catch (error) {
				console.error("Failed to fetch exam review:", error);
				toast.error("Failed to load exam review");
			} finally {
				setIsLoading(false);
			}
		}
		fetchReview();
	}, [examId]);

	const getQuestionTypeLabel = (type: string) => {
		switch (type) {
			case "mcq_single":
				return "Single Choice";
			case "mcq_multiple":
				return "Multiple Choice";
			case "open_ended":
				return "Open Ended";
			default:
				return type;
		}
	};

	const getScoreColor = (score: number | null, max: number) => {
		if (score === null || max === 0) return "#6b7280";
		const percentage = (score / max) * 100;
		if (percentage >= 85) return "#22c55e";
		if (percentage >= 70) return "#3b82f6";
		return "#ef4444";
	};

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
						<div className="flex items-center gap-3 mb-4">
							<button
								onClick={() => navigate("/student/history")}
								className="flex items-center gap-2 text-gray-400 hover:text-white transition"
							>
								<ArrowLeft className="w-5 h-5" />
								<span style={{ fontFamily: "Inter, sans-serif" }}>
									Back to History
								</span>
							</button>
						</div>

						{isLoading ? (
							<div className="animate-pulse">
								<div className="w-64 h-8 bg-white/10 rounded mb-2" />
								<div className="w-48 h-4 bg-white/10 rounded" />
							</div>
						) : review ? (
							<div className="flex items-center justify-between flex-wrap gap-4">
								<div>
									<div className="flex items-center gap-3 mb-2">
										<BookOpen className="w-8 h-8 text-blue-400" />
										<h1
											className="text-white text-3xl"
											style={{
												fontFamily: "Inter, sans-serif",
												fontWeight: 600,
											}}
										>
											{review.examTitle || "Exam Review"}
										</h1>
									</div>
									<div className="flex items-center gap-4 text-gray-400 text-sm">
										<span>
											Status:{" "}
											<span className="text-green-400 font-semibold">
												{review.status || "Unknown"}
											</span>
										</span>
									</div>
								</div>

								{review.studentScore !== null && (
									<div className="flex items-center gap-6">
										<div className="text-right">
											<div className="text-gray-400 text-xs mb-1">Score</div>
											<div
												className="text-3xl text-white font-bold"
												style={{ fontFamily: "Inter, sans-serif" }}
											>
												{review.studentScore}{" "}
												<span className="text-lg text-gray-400">
													/ {review.examTotalPoints || 0}
												</span>
											</div>
										</div>
										<div
											className="w-20 h-20 rounded-2xl flex items-center justify-center border"
											style={{
												backgroundColor:
													(review.scorePercentage || 0) >= 85
														? "rgba(34, 197, 94, 0.2)"
														: (review.scorePercentage || 0) >= 70
															? "rgba(59, 130, 246, 0.2)"
															: "rgba(239, 68, 68, 0.2)",
												borderColor:
													(review.scorePercentage || 0) >= 85
														? "rgba(34, 197, 94, 0.3)"
														: (review.scorePercentage || 0) >= 70
															? "rgba(59, 130, 246, 0.3)"
															: "rgba(239, 68, 68, 0.3)",
											}}
										>
											<span
												className="text-2xl font-bold"
												style={{
													color:
														(review.scorePercentage || 0) >= 85
															? "#22c55e"
															: (review.scorePercentage || 0) >= 70
																? "#3b82f6"
																: "#ef4444",
													fontFamily: "Inter, sans-serif",
												}}
											>
												{Math.round(review.scorePercentage || 0)}%
											</span>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="text-white">
								<h2 className="text-xl">No Exam Review Available</h2>
							</div>
						)}
					</div>
				</header>

				{/* Questions */}
				<main className="flex-1 overflow-y-auto p-8">
					<div className="max-w-4xl mx-auto space-y-6">
						{isLoading ? (
							<div className="flex items-center justify-center py-16">
								<Loader2 className="w-10 h-10 animate-spin text-blue-400" />
								<span className="ml-3 text-gray-400 text-lg">
									Loading exam review...
								</span>
							</div>
						) : review && review.questions ? (
							review.questions
								.sort((a, b) => (a.orderNumber || 0) - (b.orderNumber || 0))
								.map((question, index) => (
									<QuestionCard
										key={question.questionId}
										question={question}
										index={index}
										getQuestionTypeLabel={getQuestionTypeLabel}
										getScoreColor={getScoreColor}
									/>
								))
						) : (
							<div className="text-center py-16">
								<BookOpen className="w-16 h-16 mx-auto text-gray-500 mb-4" />
								<p className="text-gray-400 text-lg">No exam review found</p>
							</div>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}

interface QuestionCardProps {
	question: StudentExamReviewQuestion;
	index: number;
	getQuestionTypeLabel: (type: string) => string;
	getScoreColor: (score: number | null, max: number) => string;
}

function QuestionCard({
	question,
	index,
	getQuestionTypeLabel,
	getScoreColor,
}: QuestionCardProps) {
	return (
		<div
			className="rounded-2xl border overflow-hidden"
			style={{
				backgroundColor: "rgba(255, 255, 255, 0.03)",
				borderColor: "rgba(255, 255, 255, 0.1)",
			}}
		>
			{/* Question Header */}
			<div
				className="px-6 py-4 border-b"
				style={{ borderColor: "rgba(255, 255, 255, 0.06)" }}
			>
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-2">
							<span
								className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-semibold"
								style={{ fontFamily: "Inter, sans-serif" }}
							>
								Q{index + 1}
							</span>
							<span
								className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-semibold"
								style={{ fontFamily: "Inter, sans-serif" }}
							>
								{getQuestionTypeLabel(question.questionType || "")}
							</span>
							<span
								className="px-3 py-1 rounded-lg bg-gray-500/20 text-gray-400 text-xs font-semibold"
								style={{ fontFamily: "Inter, sans-serif" }}
							>
								{question.points || 0} points
							</span>
						</div>
						<p
							className="text-white leading-relaxed"
							style={{ fontFamily: "Inter, sans-serif" }}
						>
							{question.questionText || "Question text not available"}
						</p>
					</div>

					{question.earnedPoints !== null && (
						<div className="text-right">
							<div className="text-gray-400 text-xs mb-1">Earned</div>
							<div
								className="text-2xl font-bold"
								style={{
									color: getScoreColor(
										question.earnedPoints,
										question.points || 0,
									),
									fontFamily: "Inter, sans-serif",
								}}
							>
								{question.earnedPoints}{" "}
								<span className="text-lg text-gray-400">
									/ {question.points || 0}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Question Content */}
			<div className="p-6 space-y-4">
				{/* Student Answer */}
				<div
					className="rounded-xl border p-4"
					style={{
						backgroundColor: "rgba(59, 130, 246, 0.05)",
						borderColor: "rgba(59, 130, 246, 0.2)",
					}}
				>
					<div className="flex items-center gap-2 mb-2">
						<BookOpen className="w-4 h-4 text-blue-400" />
						<span
							className="text-blue-400 text-xs font-semibold uppercase tracking-wider"
							style={{ fontFamily: "Inter, sans-serif" }}
						>
							Your Answer
						</span>
					</div>

					{question.choices && question.choices.length > 0 ? (
						<div className="space-y-2">
							{question.choices.map((choice) => (
								<div
									key={choice.choiceId}
									className={`flex items-center gap-3 p-3 rounded-lg border ${
										choice.isSelected
											? choice.isCorrect
												? "border-green-500/30 bg-green-500/10"
												: "border-red-500/30 bg-red-500/10"
											: choice.isCorrect
												? "border-green-500/30 bg-green-500/5"
												: "border-gray-500/20 bg-white/5"
									}`}
								>
									<div
										className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${
											choice.isSelected
												? choice.isCorrect
													? "border-green-500 bg-green-500"
													: "border-red-500 bg-red-500"
												: choice.isCorrect
													? "border-green-500"
													: "border-gray-500"
										}`}
									>
										{choice.isSelected && choice.isCorrect && (
											<CheckCircle className="w-3.5 h-3.5 text-white" />
										)}
										{choice.isSelected && !choice.isCorrect && (
											<XCircle className="w-3.5 h-3.5 text-white" />
										)}
									</div>
									<span
										className={`flex-1 ${
											choice.isSelected
												? choice.isCorrect
													? "text-green-300"
													: "text-red-300"
												: choice.isCorrect
													? "text-green-300"
													: "text-gray-300"
										}`}
										style={{ fontFamily: "Inter, sans-serif" }}
									>
										{choice.text}
									</span>
									{!choice.isSelected && choice.isCorrect && (
										<span
											className="text-green-400 text-xs font-semibold"
											style={{ fontFamily: "Inter, sans-serif" }}
										>
											Correct Answer
										</span>
									)}
									{choice.isSelected && choice.isCorrect && (
										<span
											className="text-green-400 text-xs font-semibold"
											style={{ fontFamily: "Inter, sans-serif" }}
										>
											Correct
										</span>
									)}
									{choice.isSelected && !choice.isCorrect && (
										<span
											className="text-red-400 text-xs font-semibold"
											style={{ fontFamily: "Inter, sans-serif" }}
										>
											Incorrect
										</span>
									)}
								</div>
							))}
						</div>
					) : (
						<p
							className="text-white whitespace-pre-wrap leading-relaxed"
							style={{ fontFamily: "Inter, sans-serif" }}
						>
							{question.studentAnswer || (
								<span className="italic text-gray-500">No answer provided</span>
							)}
						</p>
					)}
				</div>

				{/* Instructor Feedback */}
				{question.instructorFeedback && (
					<div
						className="rounded-xl border p-4"
						style={{
							backgroundColor: "rgba(168, 85, 247, 0.05)",
							borderColor: "rgba(168, 85, 247, 0.2)",
						}}
					>
						<div className="flex items-center gap-2 mb-2">
							<MessageSquare className="w-4 h-4 text-purple-400" />
							<span
								className="text-purple-400 text-xs font-semibold uppercase tracking-wider"
								style={{ fontFamily: "Inter, sans-serif" }}
							>
								Instructor Feedback
							</span>
						</div>
						<p
							className="text-purple-100 whitespace-pre-wrap leading-relaxed"
							style={{ fontFamily: "Inter, sans-serif" }}
						>
							{question.instructorFeedback}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
