import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
	ArrowLeft,
	User,
	Loader2,
	BookOpen,
	CheckCircle,
	AlertTriangle,
	Save,
	Send,
	Edit3,
	Lock,
	TrendingUp,
	ChevronDown,
	ChevronUp,
	Image as ImageIcon,
} from "lucide-react";
import {
	getStudentWrittenAnswers,
	gradeStudentWrittenAnswers,
	getExamResults,
	StudentWrittenAnswersResponse,
	ExamStudentResult,
} from "../services/examService";
import { toast } from "sonner";
import { InstructorSidebar } from "./InstructorSidebar";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function scoreColor(pct: number) {
	if (pct >= 90) return "#4ade80";
	if (pct >= 75) return "#60a5fa";
	if (pct >= 60) return "#facc15";
	return "#f87171";
}

function ScoreBar({ value, max }: { value: number; max: number }) {
	const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
	return (
		<div
			className="w-full h-1.5 rounded-full mt-1.5"
			style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
		>
			<div
				className="h-1.5 rounded-full transition-all duration-500"
				style={{ width: `${pct}%`, backgroundColor: scoreColor(pct) }}
			/>
		</div>
	);
}

// ─── Class Standings Panel ────────────────────────────────────────────────────

function ClassStandingsPanel({
	currentStudentId,
	results,
}: {
	currentStudentId: number;
	results: ExamStudentResult[];
}) {
	const [expanded, setExpanded] = useState(false);
	if (results.length === 0) return null;

	const sorted = [...results].sort((a, b) => b.finalScore - a.finalScore);
	const rank = sorted.findIndex((r) => r.studentId === currentStudentId) + 1;
	const current = sorted.find((r) => r.studentId === currentStudentId);
	const avg = results.reduce((s, r) => s + r.finalScore, 0) / results.length;

	return (
		<div
			className="rounded-2xl border overflow-hidden"
			style={{
				backgroundColor: "rgba(255,255,255,0.03)",
				borderColor: "rgba(255,255,255,0.08)",
			}}
		>
			<button
				onClick={() => setExpanded((v) => !v)}
				className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
			>
				<div className="flex items-center gap-3">
					<TrendingUp className="w-5 h-5 text-indigo-400" />
					<span
						className="text-white text-sm font-semibold"
						style={{ fontFamily: "Inter, sans-serif" }}
					>
						Class Standings
					</span>
					{rank > 0 && (
						<span
							className="px-2 py-0.5 rounded text-xs font-bold"
							style={{
								backgroundColor: "rgba(99,102,241,0.2)",
								color: "#818cf8",
							}}
						>
							Rank #{rank} of {results.length}
						</span>
					)}
				</div>
				{expanded ? (
					<ChevronUp className="w-4 h-4 text-gray-400" />
				) : (
					<ChevronDown className="w-4 h-4 text-gray-400" />
				)}
			</button>

			{expanded && (
				<div
					className="px-5 pb-5 border-t"
					style={{ borderColor: "rgba(255,255,255,0.06)" }}
				>
					{/* Summary row */}
					<div className="grid grid-cols-3 gap-3 mt-4 mb-4">
						{[
							{
								label: "This Student",
								value: `${current?.finalScore ?? "—"}`,
								color: "#818cf8",
							},
							{
								label: "Class Average",
								value: `${avg.toFixed(1)}`,
								color: "#60a5fa",
							},
							{
								label: "Class Rank",
								value: rank > 0 ? `#${rank}` : "—",
								color: "#4ade80",
							},
						].map(({ label, value, color }) => (
							<div
								key={label}
								className="text-center py-3 rounded-xl"
								style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
							>
								<div
									className="text-lg font-bold"
									style={{ fontFamily: "Inter, sans-serif", color }}
								>
									{value}
								</div>
								<div className="text-gray-500 text-xs mt-0.5">{label}</div>
							</div>
						))}
					</div>

					{/* Top 5 list */}
					<div className="space-y-1.5">
						{sorted.slice(0, 5).map((r, i) => {
							const isCurrent = r.studentId === currentStudentId;
							return (
								<div
									key={r.studentId}
									className="flex items-center gap-3 px-3 py-2 rounded-lg"
									style={{
										backgroundColor: isCurrent
											? "rgba(99,102,241,0.15)"
											: "rgba(255,255,255,0.03)",
										border: isCurrent
											? "1px solid rgba(99,102,241,0.3)"
											: "1px solid transparent",
									}}
								>
									<span
										className="text-xs font-bold w-6 text-center"
										style={{ color: i === 0 ? "#facc15" : "#6b7280" }}
									>
										#{i + 1}
									</span>
									<span
										className="flex-1 text-sm truncate"
										style={{
											fontFamily: "Inter, sans-serif",
											color: isCurrent ? "#a5b4fc" : "#d1d5db",
										}}
									>
										{r.studentName} {isCurrent && "(this student)"}
									</span>
									<span
										className="text-sm font-semibold"
										style={{
											color: scoreColor(r.finalScore),
											fontFamily: "Inter, sans-serif",
										}}
									>
										{r.finalScore}
									</span>
								</div>
							);
						})}
						{sorted.length > 5 && (
							<p className="text-gray-600 text-xs text-center pt-1">
								+{sorted.length - 5} more students
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function InstructorReviewExamPage() {
	const navigate = useNavigate();
	const { examId, studentId } = useParams<{
		examId: string;
		studentId: string;
	}>();

	const [data, setData] = useState<StudentWrittenAnswersResponse | null>(null);
	const [classResults, setClassResults] = useState<ExamStudentResult[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);
	const [isReadOnly, setIsReadOnly] = useState(false);
	const [scoreSummary, setScoreSummary] = useState<{
		mcqScore: number;
		manualScore: number;
		finalScore: number;
	} | null>(null);

	const [scores, setScores] = useState<Record<number, number>>({});
	const [feedbacks, setFeedbacks] = useState<Record<number, string>>({});

	// Load data
	useEffect(() => {
		if (!examId || !studentId) return;
		setIsLoading(true);

		Promise.all([
			getStudentWrittenAnswers(Number(examId), Number(studentId)),
			getExamResults(Number(examId)).catch(() => [] as ExamStudentResult[]),
		])
			.then(([answers, results]) => {
				setData(answers);
				setClassResults(results);

				const initScores: Record<number, number> = {};
				const initFeedbacks: Record<number, string> = {};
				answers.writtenAnswers.forEach((a) => {
					initScores[a.answerId] = a.score ?? 0;
					initFeedbacks[a.answerId] = a.instructorFeedback ?? "";
				});
				setScores(initScores);
				setFeedbacks(initFeedbacks);

				// Read-only if all answers are already manually graded
				const allGraded =
					answers.writtenAnswers.length > 0 &&
					answers.writtenAnswers.every((a) => a.isManuallyGraded);
				setIsReadOnly(allGraded);
			})
			.catch((err: any) => toast.error(err.message || "Failed to load data"))
			.finally(() => setIsLoading(false));
	}, [examId, studentId]);

	const buildPayload = useCallback(
		() =>
			(data?.writtenAnswers ?? []).map((a) => ({
				answerId: a.answerId,
				score: scores[a.answerId] ?? 0,
				feedback: feedbacks[a.answerId] ?? "",
			})),
		[data, scores, feedbacks],
	);

	const handleSave = async () => {
		if (!examId || !studentId) return;
		setIsSaving(true);
		try {
			const result = await gradeStudentWrittenAnswers(
				Number(examId),
				Number(studentId),
				{
					grades: buildPayload(),
				},
			);
			setScoreSummary(result.attemptScoreSummary);
			toast.success("Grades saved successfully!");
		} catch (err: any) {
			toast.error(err.message || "Failed to save grades");
		} finally {
			setIsSaving(false);
		}
	};

	const handlePublish = async () => {
		if (!examId || !studentId) return;

		// Warn if any answer has score=0 with no feedback
		const suspicious = (data?.writtenAnswers ?? []).filter(
			(a) =>
				(scores[a.answerId] ?? 0) === 0 &&
				!(feedbacks[a.answerId] ?? "").trim(),
		);
		if (suspicious.length > 0) {
			const confirm = window.confirm(
				`${suspicious.length} answer(s) have a score of 0 with no feedback. Are you sure you want to publish?`,
			);
			if (!confirm) return;
		}

		setIsPublishing(true);
		try {
			const result = await gradeStudentWrittenAnswers(
				Number(examId),
				Number(studentId),
				{
					grades: buildPayload(),
				},
			);
			const s = result.attemptScoreSummary;
			toast.success(
				`Published! Final score: ${s.finalScore} (MCQ: ${s.mcqScore} + Manual: ${s.manualScore})`,
			);
			navigate(`/instructor/exam-results/${examId}`);
		} catch (err: any) {
			toast.error(err.message || "Failed to publish");
		} finally {
			setIsPublishing(false);
		}
	};

	// Derived
	const totalAnswers = data?.writtenAnswers.length ?? 0;
	const gradedCount = data?.summary.gradedCount ?? 0;
	const ungradedCount = data?.summary.ungradedCount ?? 0;
	const totalPoints = data?.summary.totalWrittenPoints ?? 0;
	const awardedPoints = Object.values(scores).reduce((s, v) => s + v, 0);

	return (
		<div className="min-h-screen flex" style={{ backgroundColor: "#0F111A" }}>
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 pointer-events-none" />
			<div className="fixed top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
			<div className="fixed bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

			<InstructorSidebar />

			<div
				className="flex-1 relative z-10 overflow-auto flex flex-col"
				style={{
					marginLeft: "var(--sidebar-width)",
					transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
				}}
			>
				{/* Sticky header */}
				<header
					className="border-b sticky top-0 z-20"
					style={{
						backgroundColor: "rgba(15,17,26,0.97)",
						backdropFilter: "blur(20px)",
						borderColor: "rgba(255,255,255,0.1)",
					}}
				>
					<div className="px-8 py-5">
						<button
							onClick={() => navigate(`/instructor/exam-results/${examId}`)}
							className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-3"
						>
							<ArrowLeft className="w-4 h-4" />
							<span
								className="text-sm"
								style={{ fontFamily: "Inter, sans-serif" }}
							>
								Back to Student List
							</span>
						</button>

						{isLoading ? (
							<div className="flex items-center gap-4">
								<div className="w-16 h-16 rounded-xl bg-white/5 animate-pulse" />
								<div className="space-y-2">
									<div className="w-44 h-5 rounded bg-white/5 animate-pulse" />
									<div className="w-28 h-3 rounded bg-white/5 animate-pulse" />
								</div>
							</div>
						) : (
							<div className="flex items-center justify-between flex-wrap gap-4">
								{/* Student info */}
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
										<User className="w-8 h-8 text-white" />
									</div>
									<div>
										<div className="flex items-center gap-3 mb-0.5">
											<h1
												className="text-white text-2xl"
												style={{
													fontFamily: "Inter, sans-serif",
													fontWeight: 700,
												}}
											>
												{data?.studentName ?? `Student #${studentId}`}
											</h1>
											{isReadOnly ? (
												<span
													className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs"
													style={{
														backgroundColor: "rgba(34,197,94,0.15)",
														color: "#4ade80",
														border: "1px solid rgba(34,197,94,0.3)",
													}}
												>
													<CheckCircle className="w-3 h-3" /> All Graded
												</span>
											) : ungradedCount > 0 ? (
												<span
													className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs animate-pulse"
													style={{
														backgroundColor: "rgba(234,179,8,0.15)",
														color: "#facc15",
														border: "1px solid rgba(234,179,8,0.3)",
													}}
												>
													<AlertTriangle className="w-3 h-3" /> {ungradedCount}{" "}
													Ungraded
												</span>
											) : null}
										</div>
										<p
											className="text-gray-400 text-sm"
											style={{ fontFamily: "Inter, sans-serif" }}
										>
											{data?.examTitle} · Status: {data?.attemptStatus}
										</p>
									</div>
								</div>

								{/* Score summary chips */}
								<div className="flex items-center gap-3">
									{scoreSummary && (
										<>
											<div
												className="text-center px-4 py-2.5 rounded-xl"
												style={{
													backgroundColor: "rgba(59,130,246,0.15)",
													border: "1px solid rgba(59,130,246,0.25)",
												}}
											>
												<div className="text-blue-300 text-xs mb-0.5">MCQ</div>
												<div
													className="text-white font-bold"
													style={{ fontFamily: "Inter, sans-serif" }}
												>
													{scoreSummary.mcqScore}
												</div>
											</div>
											<div
												className="text-center px-4 py-2.5 rounded-xl"
												style={{
													backgroundColor: "rgba(147,51,234,0.15)",
													border: "1px solid rgba(147,51,234,0.25)",
												}}
											>
												<div className="text-purple-300 text-xs mb-0.5">
													Manual
												</div>
												<div
													className="text-white font-bold"
													style={{ fontFamily: "Inter, sans-serif" }}
												>
													{scoreSummary.manualScore}
												</div>
											</div>
											<div
												className="text-center px-4 py-2.5 rounded-xl"
												style={{
													backgroundColor: "rgba(34,197,94,0.15)",
													border: "1px solid rgba(34,197,94,0.25)",
												}}
											>
												<div className="text-green-300 text-xs mb-0.5">
													Final
												</div>
												<div
													className="text-white font-bold"
													style={{ fontFamily: "Inter, sans-serif" }}
												>
													{scoreSummary.finalScore}
												</div>
											</div>
										</>
									)}

									{/* Grading progress */}
									<div
										className="text-center px-4 py-2.5 rounded-xl"
										style={{
											backgroundColor: "rgba(255,255,255,0.05)",
											border: "1px solid rgba(255,255,255,0.1)",
										}}
									>
										<div className="text-gray-400 text-xs mb-0.5">Progress</div>
										<div
											className="text-white font-bold"
											style={{ fontFamily: "Inter, sans-serif" }}
										>
											{gradedCount}/{totalAnswers}
										</div>
									</div>
									<div
										className="text-center px-4 py-2.5 rounded-xl"
										style={{
											backgroundColor: "rgba(255,255,255,0.05)",
											border: "1px solid rgba(255,255,255,0.1)",
										}}
									>
										<div className="text-gray-400 text-xs mb-0.5">Awarded</div>
										<div
											className="text-white font-bold"
											style={{ fontFamily: "Inter, sans-serif" }}
										>
											{awardedPoints}/{totalPoints}
										</div>
									</div>

									{/* Action buttons */}
									{isReadOnly ? (
										<button
											onClick={() => setIsReadOnly(false)}
											className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition hover:opacity-80"
											style={{
												backgroundColor: "rgba(99,102,241,0.2)",
												color: "#818cf8",
												border: "1px solid rgba(99,102,241,0.4)",
												fontFamily: "Inter, sans-serif",
											}}
										>
											<Edit3 className="w-4 h-4" />
											Edit Grades
										</button>
									) : (
										<>
											<button
												id="save-grades-btn"
												onClick={handleSave}
												disabled={isSaving || isPublishing}
												className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition hover:opacity-80 disabled:opacity-50"
												style={{
													backgroundColor: "rgba(99,102,241,0.2)",
													color: "#818cf8",
													border: "1px solid rgba(99,102,241,0.4)",
													fontFamily: "Inter, sans-serif",
												}}
											>
												{isSaving ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Save className="w-4 h-4" />
												)}
												{isSaving ? "Saving…" : "Save"}
											</button>
											<button
												id="publish-grades-btn"
												onClick={handlePublish}
												disabled={isSaving || isPublishing}
												className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition hover:opacity-80 disabled:opacity-50"
												style={{
													backgroundColor: "rgba(34,197,94,0.2)",
													color: "#4ade80",
													border: "1px solid rgba(34,197,94,0.4)",
													fontFamily: "Inter, sans-serif",
												}}
											>
												{isPublishing ? (
													<Loader2 className="w-4 h-4 animate-spin" />
												) : (
													<Send className="w-4 h-4" />
												)}
												{isPublishing ? "Publishing…" : "Publish & Return"}
											</button>
										</>
									)}
								</div>
							</div>
						)}
					</div>
				</header>

				{/* Content */}
				<main className="p-8">
					{isLoading ? (
						<div className="flex items-center justify-center gap-3 py-24 text-gray-500">
							<Loader2 className="w-7 h-7 animate-spin" />
							<span style={{ fontFamily: "Inter, sans-serif" }}>
								Loading answers…
							</span>
						</div>
					) : !data || data.writtenAnswers.length === 0 ? (
						<div className="text-center py-24">
							<BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
							<p
								className="text-gray-400 text-lg"
								style={{ fontFamily: "Inter, sans-serif" }}
							>
								This student has no written answers to grade.
							</p>
							<button
								onClick={() => navigate(`/instructor/exam-results/${examId}`)}
								className="mt-4 px-5 py-2 rounded-xl text-sm transition hover:opacity-80"
								style={{
									backgroundColor: "rgba(99,102,241,0.2)",
									color: "#818cf8",
									border: "1px solid rgba(99,102,241,0.3)",
									fontFamily: "Inter, sans-serif",
								}}
							>
								Back to student list
							</button>
						</div>
					) : (
						<div className="max-w-4xl mx-auto space-y-6">
							{/* Read-only banner */}
							{isReadOnly && (
								<div
									className="flex items-center gap-3 px-5 py-3.5 rounded-xl border"
									style={{
										backgroundColor: "rgba(34,197,94,0.08)",
										borderColor: "rgba(34,197,94,0.25)",
									}}
								>
									<Lock className="w-4 h-4 text-green-400" />
									<p
										className="text-green-300 text-sm"
										style={{ fontFamily: "Inter, sans-serif" }}
									>
										All answers have been graded. Click{" "}
										<strong>Edit Grades</strong> in the header to make changes.
									</p>
								</div>
							)}

							{/* Overall progress bar */}
							<div
								className="rounded-2xl border p-5"
								style={{
									backgroundColor: "rgba(255,255,255,0.03)",
									borderColor: "rgba(255,255,255,0.08)",
								}}
							>
								<div className="flex items-center justify-between mb-2">
									<span
										className="text-gray-400 text-sm"
										style={{ fontFamily: "Inter, sans-serif" }}
									>
										Grading Progress — {gradedCount}/{totalAnswers} questions
									</span>
									<span
										className="text-white text-sm font-semibold"
										style={{ fontFamily: "Inter, sans-serif" }}
									>
										{awardedPoints} / {totalPoints} pts
									</span>
								</div>
								<ScoreBar value={awardedPoints} max={totalPoints} />
							</div>

							{/* Written answers */}
							{data.writtenAnswers
								.slice()
								.sort((a, b) => a.orderNumber - b.orderNumber)
								.map((answer, idx) => {
									const isGraded =
										answer.isManuallyGraded || scores[answer.answerId] > 0;
									const currentScore = scores[answer.answerId] ?? 0;
									const pct =
										answer.points > 0
											? (currentScore / answer.points) * 100
											: 0;

									return (
										<div
											key={answer.answerId}
											id={`answer-${answer.answerId}`}
											className="rounded-2xl border overflow-hidden"
											style={{
												backgroundColor: "rgba(255,255,255,0.03)",
												borderColor:
													isGraded && !isReadOnly
														? "rgba(34,197,94,0.25)"
														: "rgba(255,255,255,0.08)",
											}}
										>
											{/* Question header */}
											<div
												className="px-6 py-4 border-b flex items-start justify-between gap-4"
												style={{ borderColor: "rgba(255,255,255,0.06)" }}
											>
												<div className="flex-1">
													<div className="flex items-center gap-2 mb-2">
														<span
															className="text-xs px-2 py-0.5 rounded"
															style={{
																backgroundColor: "rgba(99,102,241,0.15)",
																color: "#818cf8",
																fontFamily: "Inter, sans-serif",
																fontWeight: 600,
															}}
														>
															Q{idx + 1}
														</span>
														<span className="text-gray-400 text-xs">
															{answer.points} pts
														</span>
														{isGraded && !isReadOnly && (
															<span className="text-xs text-green-400 flex items-center gap-1">
																<CheckCircle className="w-3 h-3" /> Scored
															</span>
														)}
													</div>
													<p
														className="text-white text-sm leading-relaxed"
														style={{ fontFamily: "Inter, sans-serif" }}
													>
														{answer.questionText}
													</p>
													{answer.questionImageUrl && (
														<div className="mt-3">
															<img
																src={answer.questionImageUrl}
																alt="Question image"
																className="max-w-xs rounded-lg border"
																style={{ borderColor: "rgba(255,255,255,0.1)" }}
																onError={(e) => {
																	(
																		e.currentTarget as HTMLImageElement
																	).style.display = "none";
																}}
															/>
														</div>
													)}
												</div>
												{/* Score progress ring (mini) */}
												<div className="flex-shrink-0 text-center">
													<div
														className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
														style={{
															background: `conic-gradient(${scoreColor(pct)} ${pct * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
															fontFamily: "Inter, sans-serif",
															color: scoreColor(pct),
														}}
													>
														<div
															className="w-10 h-10 rounded-full flex items-center justify-center"
															style={{ backgroundColor: "#0F111A" }}
														>
															{currentScore}
														</div>
													</div>
													<div className="text-gray-500 text-xs mt-1">
														/ {answer.points}
													</div>
												</div>
											</div>

											{/* Student answer */}
											<div
												className="px-6 py-4 border-b"
												style={{ borderColor: "rgba(255,255,255,0.06)" }}
											>
												<p
													className="text-gray-400 text-xs uppercase tracking-wider mb-2"
													style={{
														fontFamily: "Inter, sans-serif",
														fontWeight: 600,
													}}
												>
													Student Answer
												</p>
												<p
													className="text-white text-sm leading-relaxed whitespace-pre-wrap"
													style={{
														fontFamily: "Inter, sans-serif",
														color: "#ffffff",
													}}
												>
													{answer.answerText || (
														<span className="italic text-gray-600">
															No answer provided
														</span>
													)}
												</p>
												{answer.timeSpentSeconds > 0 && (
													<p className="text-gray-600 text-xs mt-2">
														Time spent:{" "}
														{Math.round(answer.timeSpentSeconds / 60)} min
													</p>
												)}
											</div>

											{/* Grading inputs */}
											<div className="px-6 py-4 grid grid-cols-2 gap-4">
												{/* Score */}
												<div>
													<label
														className="block text-gray-400 text-xs uppercase tracking-wider mb-2"
														style={{
															fontFamily: "Inter, sans-serif",
															fontWeight: 600,
														}}
													>
														Score (0 – {answer.points})
													</label>
													{isReadOnly ? (
														<div
															className="px-4 py-2.5 rounded-lg text-white text-sm"
															style={{
																backgroundColor: "rgba(255,255,255,0.04)",
																border: "1px solid rgba(255,255,255,0.08)",
															}}
														>
															{currentScore} / {answer.points}
														</div>
													) : (
														<input
															id={`score-input-${answer.answerId}`}
															type="number"
															min={0}
															max={answer.points}
															step={0.5}
															value={currentScore}
															onChange={(e) => {
																const v = parseFloat(e.target.value);
																if (!isNaN(v)) {
																	const clamped = Math.min(
																		answer.points,
																		Math.max(0, v),
																	);
																	setScores((prev) => ({
																		...prev,
																		[answer.answerId]: clamped,
																	}));
																}
															}}
															className="w-full px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none focus:border-indigo-500 transition"
															style={{
																backgroundColor: "rgba(255,255,255,0.06)",
																borderColor: "rgba(255,255,255,0.12)",
																fontFamily: "Inter, sans-serif",
															}}
														/>
													)}
												</div>

												{/* Feedback */}
												<div>
													<label
														className="block text-gray-400 text-xs uppercase tracking-wider mb-2"
														style={{
															fontFamily: "Inter, sans-serif",
															fontWeight: 600,
														}}
													>
														Instructor Feedback
													</label>
													{isReadOnly ? (
														<div
															className="px-4 py-2.5 rounded-lg text-gray-300 text-sm min-h-[44px]"
															style={{
																backgroundColor: "rgba(255,255,255,0.04)",
																border: "1px solid rgba(255,255,255,0.08)",
															}}
														>
															{feedbacks[answer.answerId] || (
																<span className="italic text-gray-600">
																	No feedback
																</span>
															)}
														</div>
													) : (
														<textarea
															id={`feedback-input-${answer.answerId}`}
															rows={2}
															value={feedbacks[answer.answerId] ?? ""}
															onChange={(e) =>
																setFeedbacks((prev) => ({
																	...prev,
																	[answer.answerId]: e.target.value,
																}))
															}
															placeholder="Optional feedback for the student…"
															className="w-full px-4 py-2.5 rounded-lg text-white text-sm border focus:outline-none focus:border-indigo-500 transition resize-none placeholder-gray-600"
															style={{
																backgroundColor: "rgba(255,255,255,0.06)",
																borderColor: "rgba(255,255,255,0.12)",
																fontFamily: "Inter, sans-serif",
															}}
														/>
													)}
												</div>
											</div>
										</div>
									);
								})}

							{/* Class standings panel */}
							<ClassStandingsPanel
								currentStudentId={Number(studentId)}
								results={classResults}
							/>

							{/* Violation details */}
							{(() => {
								const currentStudentResult = classResults.find(
									(r) => r.studentId === Number(studentId),
								);
								if (
									!currentStudentResult ||
									currentStudentResult.violations.length === 0
								)
									return null;

								return (
									<div
										className="rounded-2xl border p-6"
										style={{
											backgroundColor: "rgba(255,255,255,0.03)",
											borderColor: "rgba(255,255,255,0.08)",
										}}
									>
										<div className="flex items-center gap-3 mb-4">
											<AlertTriangle className="w-5 h-5 text-orange-400" />
											<h3
												className="text-white text-lg"
												style={{
													fontFamily: "Inter, sans-serif",
													fontWeight: 600,
												}}
											>
												Violation Details
											</h3>
										</div>

										{/* Violation counts summary — computed from the violations array so
								    counts remain accurate even if backend summary fields are wrong */}
										{(() => {
											const vs = currentStudentResult.violations;
											const countByType = (type: string) =>
												vs.filter((v) => v.violationType === type).length;
											const derivedCounts = [
												{ label: "Tab Switch",        count: countByType("tab_switch"),        color: "#f97316" },
												{ label: "Eye Away",           count: countByType("gaze_away"),         color: "#facc15" },
												{ label: "Multiple Persons",   count: countByType("multiple_persons"),  color: "#f87171" },
												{ label: "Face Missing",       count: countByType("face_missing"),      color: "#c084fc" },
												{ label: "Low Visibility",     count: countByType("low_visibility"),    color: "#60a5fa" },
												{ label: "Suspicious Object",  count: countByType("suspicious_object"), color: "#f472b6" },
											];
											return (
												<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
													{derivedCounts.map(({ label, count, color }) => (
														<div
															key={label}
															className="rounded-xl border p-4"
															style={{
																backgroundColor: "rgba(255,255,255,0.02)",
																borderColor: "rgba(255,255,255,0.08)",
															}}
														>
															<div
																className="text-gray-400 text-xs mb-1"
																style={{ fontFamily: "Inter, sans-serif" }}
															>
																{label}
															</div>
															<div
																className="text-2xl font-bold"
																style={{
																	fontFamily: "Inter, sans-serif",
																	color: count > 0 ? color : "#6b7280",
																}}
															>
																{count}
															</div>
														</div>
													))}
												</div>
											);
										})()}

										{/* Violation list */}
										<div className="space-y-3">
											{currentStudentResult.violations.map((violation) => (
												<div
													key={violation.violationId}
													className="rounded-xl border p-4"
													style={{
														backgroundColor: "rgba(255,255,255,0.02)",
														borderColor: "rgba(255,255,255,0.08)",
													}}
												>
													<div className="flex items-center gap-3 mb-2">
														<AlertTriangle className="w-4 h-4 text-orange-400" />
														<span
															className="text-white text-sm font-semibold"
															style={{ fontFamily: "Inter, sans-serif" }}
														>
															{violation.violationType}
														</span>
														<span
															className="text-gray-400 text-xs ml-auto"
															style={{ fontFamily: "Inter, sans-serif" }}
														>
															{new Date(violation.timestamp).toLocaleString()}
														</span>
													</div>
													{violation.description && (
														<p
															className="text-gray-400 text-sm"
															style={{ fontFamily: "Inter, sans-serif" }}
														>
															{violation.description}
														</p>
													)}
													{violation.screenshotUrl && (
														<div className="mt-3">
															<img
																src={violation.screenshotUrl}
																alt="Violation screenshot"
																className="rounded-lg max-h-40 object-cover border"
																style={{ borderColor: "rgba(255,255,255,0.1)" }}
															/>
														</div>
													)}
												</div>
											))}
										</div>
									</div>
								);
							})()}

							{/* Bottom action bar (convenience) */}
							{!isReadOnly && (
								<div className="flex justify-end gap-3 pt-4 pb-8">
									<button
										onClick={handleSave}
										disabled={isSaving || isPublishing}
										className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition hover:opacity-80 disabled:opacity-50"
										style={{
											backgroundColor: "rgba(99,102,241,0.2)",
											color: "#818cf8",
											border: "1px solid rgba(99,102,241,0.4)",
											fontFamily: "Inter, sans-serif",
										}}
									>
										{isSaving ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Save className="w-4 h-4" />
										)}
										{isSaving ? "Saving…" : "Save Draft"}
									</button>
									<button
										onClick={handlePublish}
										disabled={isSaving || isPublishing}
										className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition hover:opacity-80 disabled:opacity-50"
										style={{
											backgroundColor: "rgba(34,197,94,0.2)",
											color: "#4ade80",
											border: "1px solid rgba(34,197,94,0.4)",
											fontFamily: "Inter, sans-serif",
										}}
									>
										{isPublishing ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<Send className="w-4 h-4" />
										)}
										{isPublishing ? "Publishing…" : "Publish & Return"}
									</button>
								</div>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
}
