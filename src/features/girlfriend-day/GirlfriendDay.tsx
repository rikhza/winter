import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Heart,
	Star,
	Sparkles,
	HeartHandshake,
	Crown,
	Infinity,
	Target,
	ArrowRight,
	ArrowLeft,
} from "lucide-react";
import "./GirlfriendDay.css";

const GirlfriendDay = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [showContent, setShowContent] = useState(false);
	const [showSpecialMessage, setShowSpecialMessage] = useState(false);
	const [heartCount, setHeartCount] = useState(0);
	const [showFinalSurprise, setShowFinalSurprise] = useState(false);
	const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
	const [showBucketList, setShowBucketList] = useState(false);
	const [completedGoals, setCompletedGoals] = useState<number[]>([1]); // Winter ke Jepang is pre-completed
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const getTimeBasedMessage = () => {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) {
			return "Good morning, my beautiful Winter! Starting this special day with thoughts of you fills my heart with joy.";
		} else if (hour >= 12 && hour < 17) {
			return "Good afternoon, my love! The sun shines brighter because you exist in my world.";
		} else if (hour >= 17 && hour < 21) {
			return "Good evening, my darling! As the day winds down, my love for you only grows stronger.";
		} else {
			return "Good night, my precious Winter! Even in dreams, you are the star that guides my heart.";
		}
	};

	const bucketListGoals = [
		{
			id: 1,
			title: "Winter ke Jepang",
			description: "First step of her life",
			icon: "🗾",
			category: "New Career",
			color: "#3b82f6",
			status: "completed",
			date: "2024",
		},
		{
			id: 2,
			title: "Kino lulus wisuda",
			description: "Merayakan kelulusan",
			icon: "🎓",
			category: "Education",
			color: "#10b981",
			status: "in-progress",
			date: "2025",
		},
		{
			id: 3,
			title: "Winter fokus kerjaannya",
			description: "Membangun karir",
			icon: "💼",
			category: "Career",
			color: "#f59e0b",
			status: "in-progress",
			date: "2026",
		},
		{
			id: 4,
			title: "Kino fokus kerjaannya juga",
			description: "Membangun masa depan",
			icon: "🚀",
			category: "Career",
			color: "#8b5cf6",
			status: "in-progress",
			date: "2026",
		},
		{
			id: 5,
			title: "Kino ke Aussie",
			description: "Petualangan di Australia",
			icon: "🦘",
			category: "Career",
			color: "#ef4444",
			status: "planned",
			date: "2027",
		},
		{
			id: 6,
			title: "Winter ikut ke Aussie",
			description: "Bersama-sama menjelajahi Australia",
			icon: "✈️",
			category: "Travel",
			color: "#06b6d4",
			status: "planned",
			date: "2028-2029",
		},
		{
			id: 7,
			title: "Winter together",
			description: "Selalu bersama dalam setiap langkah",
			icon: "💑",
			category: "Love",
			color: "#ec4899",
			status: "ongoing",
			date: "Always",
		},
		{
			id: 8,
			title: "Sama winter keliling dunia",
			description: "Melihat keindahan dunia berdua",
			icon: "🌍",
			category: "Travel",
			color: "#84cc16",
			status: "dream",
			date: "Future",
		},
		{
			id: 9,
			title: "Sama winter nikah",
			description: "Memulai babak baru kehidupan",
			icon: "💒",
			category: "Love",
			color: "#f97316",
			status: "dream",
			date: "Future",
		},
		{
			id: 10,
			title: "Sama winter nikmatin dunia berdua",
			description: "Menikmati hidup dengan penuh cinta",
			icon: "✨",
			category: "Life",
			color: "#a855f7",
			status: "dream",
			date: "Forever",
		},
	];

	const steps = [
		{
			id: 0,
			title: "My Dearest Winter",
			subtitle: "August 1st - Girlfriend Day",
			message: getTimeBasedMessage(),
			icon: Crown,
			color: "#ec4899",
		},
		{
			id: 1,
			title: "Endless Love",
			subtitle: "My Heart Belongs to You",
			message:
				"I love you more than words can express. You are my everything, my present, and my future.",
			icon: Infinity,
			color: "#db2777",
		},
		{
			id: 2,
			title: "Beautiful Soul",
			subtitle: "You Make Me Complete",
			message:
				"Your smile brightens my darkest days. Your love makes my heart dance with joy.",
			icon: Star,
			color: "#be185d",
		},
		{
			id: 3,
			title: "Forever Yours",
			subtitle: "Together Always",
			message:
				"I promise to love you endlessly, to be there for you always, and to cherish every moment we share.",
			icon: HeartHandshake,
			color: "#9d174d",
		},
		{
			id: 4,
			title: "My Everything",
			subtitle: "You Are My World",
			message:
				"In your eyes, I found my home. In your heart, I found my peace. You are my everything.",
			icon: Target,
			color: "#831843",
		},
	];

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowContent(true);
		}, 1000);

		// Show welcome message after content loads
		const welcomeTimer = setTimeout(() => {
			setShowWelcomeMessage(true);
		}, 2000);

		return () => {
			clearTimeout(timer);
			clearTimeout(welcomeTimer);
		};
	}, []);

	useEffect(() => {
		const hasOverlay =
			showBucketList || showWelcomeMessage || showFinalSurprise;
		document.body.style.overflow = hasOverlay ? "hidden" : "";

		const handleEscapeKey = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			if (showBucketList) {
				setShowBucketList(false);
			} else if (showFinalSurprise) {
				setShowFinalSurprise(false);
			} else if (showWelcomeMessage) {
				setShowWelcomeMessage(false);
			}
		};

		window.addEventListener("keydown", handleEscapeKey);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", handleEscapeKey);
		};
	}, [showBucketList, showWelcomeMessage, showFinalSurprise]);

	useEffect(() => {
		// Set up the floating hearts canvas animation
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const resizeCanvas = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);

		// Create floating hearts
		const hearts: Array<{
			x: number;
			y: number;
			size: number;
			speed: number;
			opacity: number;
			rotation: number;
		}> = [];

		for (let i = 0; i < 50; i++) {
			hearts.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				size: Math.random() * 20 + 10,
				speed: Math.random() * 2 + 1,
				opacity: Math.random() * 0.5 + 0.3,
				rotation: Math.random() * 360,
			});
		}

		const animateHearts = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			hearts.forEach((heart) => {
				ctx.save();
				ctx.translate(heart.x, heart.y);
				ctx.rotate((heart.rotation * Math.PI) / 180);
				ctx.globalAlpha = heart.opacity;

				// Draw heart
				ctx.beginPath();
				const size = heart.size;
				ctx.moveTo(0, -size / 2);
				ctx.bezierCurveTo(
					-size / 2,
					-size,
					-size,
					-size / 2,
					0,
					size / 2,
				);
				ctx.bezierCurveTo(
					size,
					-size / 2,
					size / 2,
					-size,
					0,
					-size / 2,
				);
				ctx.fillStyle = "#ec4899";
				ctx.fill();

				ctx.restore();

				// Update position
				heart.y -= heart.speed;
				heart.rotation += 0.5;

				if (heart.y < -heart.size) {
					heart.y = canvas.height + heart.size;
					heart.x = Math.random() * canvas.width;
				}
			});

			requestAnimationFrame(animateHearts);
		};

		animateHearts();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	const handleNext = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			setShowFinalSurprise(true);
			// Trigger confetti animation
			triggerConfetti();
		}
	};

	const triggerConfetti = () => {
		// Create confetti effect
		for (let i = 0; i < 100; i++) {
			setTimeout(() => {
				const confetti = document.createElement("div");
				confetti.className = "confetti-piece";
				confetti.style.left = Math.random() * 100 + "%";
				confetti.style.animationDelay = Math.random() * 3 + "s";
				confetti.style.backgroundColor = [
					"#ec4899",
					"#fbbf24",
					"#db2777",
					"#8b5cf6",
					"#06b6d4",
				][Math.floor(Math.random() * 5)];
				document.body.appendChild(confetti);

				setTimeout(() => {
					document.body.removeChild(confetti);
				}, 4000);
			}, i * 20);
		}
	};

	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const handleHeartClick = () => {
		setHeartCount((prev) => {
			const newCount = prev + 1;
			if (newCount >= 10 && !showSpecialMessage) {
				setShowSpecialMessage(true);
				setTimeout(() => setShowSpecialMessage(false), 5000);
			}
			if (newCount >= 100) {
				// Special achievement unlocked!
				setShowSpecialMessage(true);
				setTimeout(() => setShowSpecialMessage(false), 8000);
			}
			return newCount;
		});
	};

	const toggleGoalCompletion = (goalId: number) => {
		setCompletedGoals((prev) => {
			const newCompleted = prev.includes(goalId)
				? prev.filter((id) => id !== goalId)
				: [...prev, goalId];

			// Check if all goals are completed
			if (newCompleted.length === bucketListGoals.length) {
				// Trigger celebration
				setTimeout(() => {
					triggerConfetti();
					setShowSpecialMessage(true);
					setTimeout(() => setShowSpecialMessage(false), 8000);
				}, 500);
			}

			return newCompleted;
		});
	};

	const getCompletionPercentage = () => {
		return Math.round(
			(completedGoals.length / bucketListGoals.length) * 100,
		);
	};

	const currentStepData = steps[currentStep];
	const Icon = currentStepData.icon;
	const completionPercentage = getCompletionPercentage();

	return (
		<div className="girlfriend-day gd2-page">
			<canvas ref={canvasRef} className="floating-hearts-canvas" />
			<div className="gd2-noise" />

			<motion.div
				className="girlfriend-day-content gd2-content"
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: showContent ? 1 : 0,
					y: showContent ? 0 : 20,
				}}
				transition={{ duration: 1, ease: "easeOut" }}
			>
				<header className="gd2-hero">
					<div className="gd2-hero-badge">
						<Crown size={16} />
						<span>Girlfriend Day Special</span>
					</div>
					<h1>For My Dearest Winter</h1>
					<p>
						A little journey of words, promises, and dreams we will
						make real together.
					</p>
					<button
						className="gd2-love-pill"
						onClick={handleHeartClick}
						aria-label="Send love"
					>
						<Heart size={16} />
						<span>{heartCount} Love taps</span>
					</button>
				</header>

				<motion.section
					className="gd2-step"
					key={currentStep}
					initial={{ opacity: 0, x: 30 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -30 }}
					transition={{ duration: 0.5 }}
				>
					<article className="gd2-step-card">
						<div className="gd2-step-top">
							<div className="gd2-icon-ring">
								<Icon className="gd2-step-icon" />
							</div>
							<div className="gd2-step-meta">
								<span>{`Step ${currentStep + 1} / ${steps.length}`}</span>
								<div className="gd2-step-progress">
									<motion.div
										className="gd2-step-progress-fill"
										initial={{ width: 0 }}
										animate={{
											width: `${((currentStep + 1) / steps.length) * 100}%`,
										}}
										transition={{ duration: 0.4 }}
									/>
								</div>
							</div>
						</div>

						<h2>{currentStepData.title}</h2>
						<h3>{currentStepData.subtitle}</h3>
						<p>{currentStepData.message}</p>
					</article>

					<nav className="gd2-nav">
						<motion.button
							className="gd2-nav-btn ghost"
							onClick={handlePrevious}
							disabled={currentStep === 0}
							whileTap={{ scale: 0.97 }}
						>
							<ArrowLeft size={18} />
							<span>Previous</span>
						</motion.button>

						<div className="gd2-indicators">
							{steps.map((step, index) => (
								<button
									key={step.id}
									type="button"
									className={`gd2-dot ${
										index === currentStep ? "active" : ""
									}`}
									onClick={() => setCurrentStep(index)}
									aria-label={`Go to step ${index + 1}`}
								/>
							))}
						</div>

						<motion.button
							className="gd2-nav-btn solid"
							onClick={handleNext}
							whileTap={{ scale: 0.97 }}
						>
							<span>
								{currentStep === steps.length - 1
									? "Open Surprise"
									: "Next"}
							</span>
							<ArrowRight size={18} />
						</motion.button>
					</nav>
				</motion.section>

				<section className="gd2-panels">
					<button
						className="gd2-bucket-btn"
						onClick={() => setShowBucketList(true)}
					>
						<div>
							<Target size={18} />
							<span>Open Our Bucket List</span>
						</div>
						<strong>{completionPercentage}%</strong>
					</button>
					<div className="gd2-stats">
						<div>
							<HeartHandshake size={16} />
							<span>{completedGoals.length} goals checked</span>
						</div>
						<div>
							<Sparkles size={16} />
							<span>{bucketListGoals.length} dreams total</span>
						</div>
					</div>
				</section>
			</motion.div>

			<AnimatePresence>
				{showBucketList && (
					<motion.div
						className="gd2-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowBucketList(false)}
					>
						<motion.div
							className="gd2-panel"
							initial={{ y: 30, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							exit={{ y: 30, opacity: 0 }}
							onClick={(event) => event.stopPropagation()}
						>
							<div className="gd2-panel-head">
								<div>
									<h2>Our Bucket List Together</h2>
									<p>Tap any card to mark progress.</p>
								</div>
								<button
									className="gd2-close"
									onClick={() => setShowBucketList(false)}
									aria-label="Close bucket list"
								>
									×
								</button>
							</div>

							<div className="gd2-progress-row">
								<div className="gd2-progress-bar">
									<motion.div
										className="gd2-progress-fill"
										initial={{ width: 0 }}
										animate={{
											width: `${completionPercentage}%`,
										}}
									/>
								</div>
								<span>{completionPercentage}% complete</span>
							</div>

							<div className="gd2-goals-grid">
								{bucketListGoals.map((goal) => {
									const checked = completedGoals.includes(
										goal.id,
									);
									return (
										<motion.article
											key={goal.id}
											className={`gd2-goal ${
												checked ? "done" : ""
											}`}
											onClick={() =>
												toggleGoalCompletion(goal.id)
											}
											onKeyDown={(event) => {
												if (
													event.key === "Enter" ||
													event.key === " "
												) {
													event.preventDefault();
													toggleGoalCompletion(
														goal.id,
													);
												}
											}}
											tabIndex={0}
											role="button"
											whileHover={{ y: -2 }}
										>
											<div
												className="gd2-goal-icon"
												style={{
													backgroundColor: goal.color,
												}}
											>
												{goal.icon}
											</div>
											<div className="gd2-goal-main">
												<h4>{goal.title}</h4>
												<p>{goal.description}</p>
											</div>
											<div className="gd2-goal-meta">
												<span>{goal.date}</span>
												<em>{goal.category}</em>
											</div>
											<div className="gd2-check">
												{checked ? "✓" : ""}
											</div>
										</motion.article>
									);
								})}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showSpecialMessage && (
					<motion.div
						className="gd2-toast"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<Heart size={18} />
						<p>
							{completedGoals.length === bucketListGoals.length
								? "All goals checked! We are unstoppable together. 💖"
								: heartCount >= 100
									? "100 love taps unlocked! You are my forever favorite. 👑"
									: "I love you endlessly, Winter! 💖"}
						</p>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showWelcomeMessage && (
					<motion.div
						className="gd2-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowWelcomeMessage(false)}
					>
						<motion.div
							className="gd2-panel gd2-panel-center"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={(event) => event.stopPropagation()}
						>
							<button
								className="gd2-close"
								onClick={() => setShowWelcomeMessage(false)}
								aria-label="Close welcome message"
							>
								×
							</button>
							<Crown className="gd2-crown" />
							<h2>Happy Girlfriend Day, Winter! 👑</h2>
							<p>
								Today is all about you, my love. You deserve all
								the love in the world.
							</p>
							<button
								className="gd2-primary"
								onClick={() => setShowWelcomeMessage(false)}
							>
								Start My Special Day
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showFinalSurprise && (
					<motion.div
						className="gd2-overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowFinalSurprise(false)}
					>
						<motion.div
							className="gd2-panel gd2-panel-center"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onClick={(event) => event.stopPropagation()}
						>
							<button
								className="gd2-close"
								onClick={() => setShowFinalSurprise(false)}
								aria-label="Close final surprise"
							>
								×
							</button>
							<Crown className="gd2-crown" />
							<h2>One More Gift For You</h2>
							<div className="gd2-flower-row">
								<motion.span
									animate={{ y: [-4, 4, -4] }}
									transition={{
										duration: 3,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									🌸
								</motion.span>
								<motion.span
									animate={{ y: [4, -4, 4] }}
									transition={{
										duration: 3.2,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									🌹
								</motion.span>
								<motion.span
									animate={{ y: [-3, 5, -3] }}
									transition={{
										duration: 3.4,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									🌺
								</motion.span>
								<motion.span
									animate={{ y: [5, -3, 5] }}
									transition={{
										duration: 3.6,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									🌷
								</motion.span>
								<motion.span
									animate={{ y: [-2, 6, -2] }}
									transition={{
										duration: 3.8,
										repeat: Number.POSITIVE_INFINITY,
									}}
								>
									🌼
								</motion.span>
							</div>
							<p>
								These flowers represent my endless love for you,
								now and always.
							</p>
							<p className="gd2-sign">With love, Kino</p>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default GirlfriendDay;
