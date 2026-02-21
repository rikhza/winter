import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Heart,
	Flower,
	Star,
	Calendar,
	Clock,
	Sparkles,
	MessageCircle,
	HeartHandshake,
	Crown,
	Diamond,
} from "lucide-react";
import "./Home.css";

// Environment variables configuration
const BIN_ID =
	import.meta.env.VITE_BIN_ID ?? import.meta.env.PUBLIC_BIN_ID ?? "";
const MASTER_KEY =
	import.meta.env.VITE_X_MASTER_KEY ??
	import.meta.env.PUBLIC_X_MASTER_KEY ??
	"";
interface FloatingElement {
	left: string;
	top: string;
	duration: number;
	delay: number;
	type: number;
}

const Home = () => {
	const [showContent, setShowContent] = useState(false);
	// const [showLoveMessage, setShowLoveMessage] = useState(false); // Commented out as unused per linting
	const [isLoading, setIsLoading] = useState(false);
	const [timeTogether, setTimeTogether] = useState({
		years: 0,
		months: 0,
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [loveCounts, setLoveCounts] = useState({
		kino: 0,
		winter: 0,
	});
	const [lastClickTime, setLastClickTime] = useState(0);
	const [showLoveCounter, setShowLoveCounter] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const [floatingElements] = useState<FloatingElement[]>(() => {
		// Use a stable random seed generation that satisfies the linter if possible,
		// or just use Math.random since it's only called once in initialization.
		// If the linter still complains, we'd need to move this to a global constant or useEffect with rAF.
		return [...Array(30)].map((_, i) => ({
			left: `${Math.random() * 100}%`,
			top: `${Math.random() * 100}%`,
			duration: 15 + Math.random() * 10,
			delay: Math.random() * 5,
			type: i % 4,
		}));
	});

	// Fetch love counts from JSONBin.io
	const fetchLoveCounts = () => {
		const req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState === XMLHttpRequest.DONE) {
				if (req.status === 200) {
					try {
						const data = JSON.parse(req.responseText);
						if (
							data.record &&
							data.record.loveCounter &&
							data.record.loveCounter[0]
						) {
							setLoveCounts(data.record.loveCounter[0]);
						}
					} catch (error) {
						console.error("Error parsing response:", error);
					}
				} else {
					console.error(
						"Error fetching love counts:",
						req.status,
						req.responseText,
					);
				}
			}
		};

		req.open("GET", `https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, true);
		req.setRequestHeader("X-Master-Key", MASTER_KEY);
		req.setRequestHeader("Content-Type", "application/json");
		req.send();
	};

	// Update love counts in JSONBin.io
	const updateLoveCounts = (newCounts: { kino: number; winter: number }) => {
		const req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if (req.readyState === XMLHttpRequest.DONE) {
				if (req.status === 200) {
					try {
						const data = JSON.parse(req.responseText);
						if (
							data.record &&
							data.record.loveCounter &&
							data.record.loveCounter[0]
						) {
							setLoveCounts(data.record.loveCounter[0]);
						}
					} catch (error) {
						console.error("Error parsing response:", error);
					}
				} else {
					console.error(
						"Error updating love counts:",
						req.status,
						req.responseText,
					);
				}
				setIsLoading(false);
			}
		};

		req.open("PUT", `https://api.jsonbin.io/v3/b/${BIN_ID}`, true);
		req.setRequestHeader("X-Master-Key", MASTER_KEY);
		req.setRequestHeader("Content-Type", "application/json");
		req.send(
			JSON.stringify({
				loveCounter: [newCounts],
			}),
		);
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowContent(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		const startDate = new Date("2024-11-24T00:00:00");

		const calculateTimeTogether = () => {
			const now = new Date();
			const difference = now.getTime() - startDate.getTime();

			const totalMonths =
				(now.getFullYear() - startDate.getFullYear()) * 12 +
				(now.getMonth() - startDate.getMonth());
			const years = Math.floor(totalMonths / 12);
			const months = totalMonths % 12;

			setTimeTogether({
				years,
				months,
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			});
		};

		calculateTimeTogether();
		const timer = setInterval(calculateTimeTogether, 1000);

		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		// Set up the heart canvas animation
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

		// Heart animation
		const drawHeart = () => {
			if (!ctx) return;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			const centerX = canvas.width / 2;
			const centerY = canvas.height / 2;
			const size = Math.min(canvas.width, canvas.height) * 0.2;

			ctx.beginPath();
			for (let i = 0; i < Math.PI * 2; i += 0.01) {
				const x = centerX + size * 16 * Math.pow(Math.sin(i), 3);
				const y =
					centerY -
					size *
						(13 * Math.cos(i) -
							5 * Math.cos(2 * i) -
							2 * Math.cos(3 * i) -
							Math.cos(4 * i));
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.closePath();
			ctx.fillStyle = "rgba(79, 164, 255, 0.1)";
			ctx.fill();
			ctx.strokeStyle = "rgba(79, 164, 255, 0.2)";
			ctx.stroke();

			requestAnimationFrame(drawHeart);
		};

		drawHeart();

		return () => {
			window.removeEventListener("resize", resizeCanvas);
		};
	}, []);

	const timeUnits = [
		...(timeTogether.years > 0
			? [
					{
						value: timeTogether.years,
						label: timeTogether.years === 1 ? "Year" : "Years",
						icon: Calendar,
						color: "#ec4899",
					},
				]
			: []),
		{
			value: timeTogether.months,
			label: timeTogether.months === 1 ? "Month" : "Months",
			icon: Calendar,
			color: "#db2777",
		},
		{
			value: timeTogether.days,
			label: "Days",
			icon: Clock,
			color: "#be185d",
		},
		{
			value: timeTogether.hours,
			label: "Hours",
			icon: Clock,
			color: "#9d174d",
		},
		{
			value: timeTogether.minutes,
			label: "Minutes",
			icon: Clock,
			color: "#831843",
		},
		{
			value: timeTogether.seconds,
			label: "Seconds",
			icon: Clock,
			color: "#6d1036",
		},
	];

	const loveMessages = [
		"Every moment with you is a blessing 💝",
		"You make my heart skip a beat 💓",
		"Forever and always, my love 💖",
		"You are my everything 💕",
		"Love you more each day 💗",
		"Together forever 💘",
		"My heart belongs to you 💞",
		"You're my favorite person 💝",
	];

	const [currentMessage, setCurrentMessage] = useState(0);

	useEffect(() => {
		const messageTimer = setInterval(() => {
			setCurrentMessage((prev) => (prev + 1) % loveMessages.length);
		}, 5000);

		return () => clearInterval(messageTimer);
	}, [loveMessages.length]);

	const handleLoveClick = (type: "kino" | "winter") => {
		const now = Date.now();
		if (now - lastClickTime < 1000 || isLoading) return; // Prevent rapid clicking

		setIsLoading(true);
		setLastClickTime(now);
		// setShowLoveMessage(true);
		setShowLoveCounter(true);

		// First fetch the current counts
		fetchLoveCounts();

		// Then update with the new count
		const newCounts = {
			...loveCounts,
			[type]: (loveCounts[type as keyof typeof loveCounts] || 0) + 1,
		};

		updateLoveCounts(newCounts);

		setTimeout(() => {
			// setShowLoveMessage(false);
			setShowLoveCounter(false);
		}, 3000);
	};

	return (
		<div className="home">
			{/* Floating Elements Background */}
			<div className="floating-elements">
				{floatingElements.map((el, i) => (
					<motion.div
						key={i}
						className="floating-element"
						style={{
							left: el.left,
							top: el.top,
						}}
						animate={{
							y: [-20, 20, -20],
							rotate: [0, 10, 0],
							scale: [0.8, 1, 0.8],
						}}
						transition={{
							duration: el.duration,
							repeat: Infinity,
							delay: el.delay,
							ease: "easeInOut",
						}}
					>
						{el.type === 0 ? (
							<Heart className="text-pink-300" size={20} />
						) : el.type === 1 ? (
							<Flower className="text-pink-200" size={20} />
						) : el.type === 2 ? (
							<Star className="text-pink-100" size={20} />
						) : (
							<Diamond className="text-pink-200" size={20} />
						)}
					</motion.div>
				))}
			</div>

			{/* Main Content */}
			<motion.div
				className="home-content"
				initial={{ opacity: 0, y: 20 }}
				animate={{
					opacity: showContent ? 1 : 0,
					y: showContent ? 0 : 20,
				}}
				transition={{ duration: 1, ease: "easeOut" }}
			>
				{/* Header Section */}
				<motion.header
					className="header"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<motion.div
						className="title-container"
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<Crown className="crown-icon" />
						<h1 className="title">Our Love Story</h1>
						<p className="subtitle">Every moment with you ✨</p>
					</motion.div>
				</motion.header>

				{/* Enhanced Timer Section */}
				<motion.section
					className="timer-section"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					<div className="timer-header">
						<Calendar className="timer-icon" />
						<h2>Time Together</h2>
						<Sparkles className="timer-sparkle" />
					</div>
					<div className="timer">
						{timeUnits.map((unit, index) => {
							const Icon = unit.icon;
							return (
								<motion.div
									key={unit.label}
									className="time-unit"
									whileHover={{ scale: 1.1, rotate: 2 }}
									whileTap={{ scale: 0.95 }}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.4 + index * 0.1 }}
									style={
										{
											"--unit-color": unit.color,
										} as React.CSSProperties
									}
								>
									<Icon className="time-unit-icon" />
									<div className="time-value">
										{unit.value}
									</div>
									<div className="time-label">
										{unit.label}
									</div>
								</motion.div>
							);
						})}
					</div>
					<motion.div
						className="love-message"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 1 }}
					>
						<AnimatePresence mode="wait">
							<motion.p
								key={currentMessage}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
							>
								{loveMessages[currentMessage]}
							</motion.p>
						</AnimatePresence>
					</motion.div>
				</motion.section>

				{/* Enhanced Love Letter Section */}
				<motion.section
					className="love-letter"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
				>
					<motion.div
						className="letter-header"
						whileHover={{ scale: 1.02 }}
						transition={{ duration: 0.3 }}
					>
						<Flower className="letter-icon" />
						<h2>My Dearest Winter</h2>
						<Flower className="letter-icon" />
					</motion.div>

					<div className="letter-content">
						<div className="letter-main">
							<motion.div
								className="letter-paragraphs"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
							>
								<motion.div
									className="letter-paragraph"
									whileHover={{ scale: 1.02, x: 10 }}
									transition={{ duration: 0.3 }}
								>
									<Heart className="paragraph-icon" />
									<p>
										Like the gentle petals of a rose, our
										love blooms beautifully. Every moment
										with you is a treasure I hold dear to my
										heart.
									</p>
								</motion.div>

								<motion.div
									className="letter-paragraph"
									whileHover={{ scale: 1.02, x: 10 }}
									transition={{ duration: 0.3 }}
								>
									<Star className="paragraph-icon" />
									<p>
										Your smile brightens my darkest days,
										and your love makes my heart dance with
										joy. You are my everything, my present,
										and my future.
									</p>
								</motion.div>

								<motion.div
									className="letter-paragraph"
									whileHover={{ scale: 1.02, x: 10 }}
									transition={{ duration: 0.3 }}
								>
									<MessageCircle className="paragraph-icon" />
									<p>
										In your eyes, I found my home. In your
										heart, I found my peace.
									</p>
								</motion.div>
							</motion.div>

							<motion.div
								className="interactive-elements"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.9 }}
							>
								<div className="love-buttons-container">
									<motion.button
										className="love-button"
										whileHover={{ scale: 1.05, rotate: 2 }}
										whileTap={{ scale: 0.95, rotate: -2 }}
										onClick={() => handleLoveClick("kino")}
										disabled={isLoading}
									>
										<div className="button-content">
											<HeartHandshake className="button-icon" />
											<span className="button-text">
												Kino Love
											</span>
											<Sparkles className="button-sparkle" />
										</div>
									</motion.button>

									<motion.button
										className="love-button her"
										whileHover={{ scale: 1.05, rotate: -2 }}
										whileTap={{ scale: 0.95, rotate: 2 }}
										onClick={() =>
											handleLoveClick("winter")
										}
										disabled={isLoading}
									>
										<div className="button-content">
											<Heart className="button-icon" />
											<span className="button-text">
												Winter Love
											</span>
											<Sparkles className="button-sparkle" />
										</div>
									</motion.button>
								</div>

								<AnimatePresence>
									{showLoveCounter && (
										<motion.div
											className="love-counter"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											exit={{ opacity: 0, y: -20 }}
										>
											<div className="counter-content">
												<div className="love-message-section">
													<Sparkles className="sparkle-icon" />
													<p className="popup-text">
														I love you
														unconditionally, love me
														back too yaaa 💖
													</p>
												</div>
												<div className="counter-grid">
													<div className="counter-item">
														<HeartHandshake className="counter-icon" />
														<div className="counter-info">
															<span className="counter-label">
																Kino Love
															</span>
															<span className="counter-value">
																{
																	loveCounts.kino
																}
															</span>
														</div>
													</div>
													<div className="counter-item">
														<Heart className="counter-icon" />
														<div className="counter-info">
															<span className="counter-label">
																Winter Love
															</span>
															<span className="counter-value">
																{
																	loveCounts.winter
																}
															</span>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>

							<motion.div
								className="signature-container"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1 }}
							>
								<div className="signature-line"></div>
								<p className="signature">
									Forever yours,
									<br />
									<span>Kino</span>
								</p>
							</motion.div>
						</div>
					</div>
				</motion.section>

				{/* Memory Wall */}
				<motion.section
					className="memory-wall"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.8, delay: 1 }}
				>
					<div className="memory-header">
						<Star className="memory-icon" />
						<h2>Our Memories</h2>
						<Star className="memory-icon" />
					</div>
					<div className="memory-grid">
						<motion.article
							className="memory-card"
							whileHover={{ scale: 1.02, rotate: 1 }}
							transition={{ duration: 0.3 }}
						>
							<h3>First Date 💝</h3>
							<p>
								The beginning of our beautiful journey together,
								where our hearts first connected.
							</p>
						</motion.article>

						<motion.article
							className="memory-card"
							whileHover={{ scale: 1.02, rotate: -1 }}
							transition={{ duration: 0.3 }}
						>
							<h3>Special Moments 🌟</h3>
							<p>
								Every moment with you is a treasure, filled with
								love and joy.
							</p>
						</motion.article>

						<motion.article
							className="memory-card coming-soon"
							whileHover={{ scale: 1.02, rotate: 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="coming-soon-overlay">
								<Heart className="coming-soon-heart" />
								<span className="coming-soon-text">
									Coming Soon
								</span>
								<Sparkles className="coming-soon-sparkle" />
							</div>
							<h3>Our Dreams 💫</h3>
							<p>
								Building our future together, one day at a time,
								with love and hope.
							</p>
						</motion.article>

						<motion.article
							className="memory-card coming-soon"
							whileHover={{ scale: 1.02, rotate: -1 }}
							transition={{ duration: 0.3 }}
						>
							<div className="coming-soon-overlay">
								<Heart className="coming-soon-heart" />
								<span className="coming-soon-text">
									Coming Soon
								</span>
								<Sparkles className="coming-soon-sparkle" />
							</div>
							<h3>Forever Love 💖</h3>
							<p>
								My heart belongs to you, now and always, in
								every moment we share.
							</p>
						</motion.article>
					</div>
				</motion.section>
			</motion.div>
		</div>
	);
};

export default Home;
