import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Heart, Gift, Lock, Crown } from "lucide-react";
import Home from "./features/home/Home";
import Birthday from "./features/birthday/Birthday";
import GirlfriendDay from "./features/girlfriend-day/GirlfriendDay";
import "./App.css";

function App() {
	const [currentFeature, setCurrentFeature] = useState<
		"home" | "birthday" | "girlfriend-day"
	>("home");
	const [isLocked, setIsLocked] = useState(true);
	const [pin, setPin] = useState("");
	const [showError, setShowError] = useState(false);
	const [isUnlocking, setIsUnlocking] = useState(false);

	useEffect(() => {
		// Check if today is August 1st (Girlfriend Day)
		const today = new Date();
		const isGirlfriendDay = today.getMonth() === 7 && today.getDate() === 1; // August is month 7 (0-indexed)

		if (isGirlfriendDay) {
			// Automatically show Girlfriend Day feature on August 1st
			setTimeout(() => {
				setCurrentFeature("girlfriend-day");
			}, 2000); // Show after 2 seconds
		}

		// Add scroll detection for navigation
		const handleScroll = () => {
			const nav = document.querySelector(".nav");
			if (nav) {
				if (window.scrollY > 10) {
					nav.classList.add("scrolled");
				} else {
					nav.classList.remove("scrolled");
				}
			}
		};

		const lockApp = () => {
			setIsLocked(true);
			setPin("");
			setShowError(false);
		};

		const handleVisibilityChange = () => {
			if (document.hidden) {
				lockApp();
			}
		};

		window.addEventListener("scroll", handleScroll);
		document.addEventListener("visibilitychange", handleVisibilityChange);
		window.addEventListener("blur", lockApp);
		window.addEventListener("pagehide", lockApp);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			document.removeEventListener(
				"visibilitychange",
				handleVisibilityChange,
			);
			window.removeEventListener("blur", lockApp);
			window.removeEventListener("pagehide", lockApp);
		};
	}, []);

	const handlePinInput = useCallback(
		(digit: string) => {
			if (pin.length < 6 && !showError) {
				const newPin = pin + digit;
				setPin(newPin);

				if (newPin.length === 6) {
					if (newPin === "000000") {
						setShowError(false);
						setIsUnlocking(true);
						setTimeout(() => {
							setIsLocked(false);
							setIsUnlocking(false);
						}, 550);
					} else {
						setShowError(true);
						setTimeout(() => {
							setPin("");
							setShowError(false);
						}, 1000);
					}
				}
			}
		},
		[pin, showError],
	);

	const handleDelete = useCallback(() => {
		if (showError || pin.length === 0) return;
		setPin(pin.slice(0, -1));
	}, [pin, showError]);

	useEffect(() => {
		if (!isLocked) return;

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key >= "0" && event.key <= "9") {
				handlePinInput(event.key);
				return;
			}

			if (event.key === "Backspace" || event.key === "Delete") {
				handleDelete();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [isLocked, handlePinInput, handleDelete]);

	if (isLocked) {
		return (
			<motion.div
				className="pin-screen"
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<div className="pin-bg-orb pin-bg-orb-one" />
				<div className="pin-bg-orb pin-bg-orb-two" />
				<div className="pin-bg-grid" />
				<div
					className={`pin-container ${isUnlocking ? "unlocking" : ""}`}
				>
					<motion.div
						className="pin-header"
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.2 }}
					>
						<div className="pin-header-badge">Private Space</div>
						<Lock size={36} className="pin-icon" />
						<h1>Winter Only</h1>
						<p>Masukkan 6 digit tanggal spesial kita</p>
					</motion.div>

					<motion.div
						className="pin-display"
						initial={{ scale: 0.9, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.3 }}
					>
						{[...Array(6)].map((_, i) => (
							<div
								key={i}
								className={`pin-dot ${
									i < pin.length ? "filled" : ""
								} ${showError ? "error" : ""}`}
							/>
						))}
					</motion.div>
					<div
						className={`pin-status ${showError ? "error" : "normal"}`}
						aria-live="polite"
					>
						{showError
							? "PIN salah. Coba lagi ya."
							: `${pin.length}/6 digit terisi`}
					</div>

					<motion.div
						className="pin-keypad"
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						{[...Array(9)].map((_, i) => (
							<motion.button
								key={i}
								className="pin-key"
								onClick={() =>
									handlePinInput((i + 1).toString())
								}
								aria-label={`Input digit ${i + 1}`}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.95 }}
							>
								{i + 1}
							</motion.button>
						))}
						<div className="pin-key-spacer"></div>
						<motion.button
							className="pin-key"
							onClick={() => handlePinInput("0")}
							aria-label="Input digit 0"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							0
						</motion.button>
						<motion.button
							className="pin-key delete"
							onClick={handleDelete}
							disabled={pin.length === 0 || showError}
							aria-label="Hapus digit terakhir"
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.95 }}
						>
							<svg
								width="24"
								height="24"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M3 6h18"></path>
								<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
								<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
							</svg>
						</motion.button>
					</motion.div>
					<p className="pin-footer-note">
						Tips: bisa input langsung dari keyboard juga.
					</p>
				</div>
			</motion.div>
		);
	}

	return (
		<div className="app">
			<nav className="nav">
				<motion.button
					className={`nav-button ${
						currentFeature === "home" ? "active" : ""
					}`}
					onClick={() => setCurrentFeature("home")}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Heart size={20} className="nav-icon" />
					<span>Love Story</span>
				</motion.button>
				<motion.button
					className={`nav-button ${
						currentFeature === "birthday" ? "active" : ""
					}`}
					onClick={() => setCurrentFeature("birthday")}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Gift size={20} className="nav-icon" />
					<span>Birthday 25</span>
				</motion.button>
				<motion.button
					className={`nav-button ${
						currentFeature === "girlfriend-day" ? "active" : ""
					}`}
					onClick={() => setCurrentFeature("girlfriend-day")}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Crown size={20} className="nav-icon" />
					<span>Girlfriend Day</span>
				</motion.button>
			</nav>

			<main className="main-content">
				<motion.div
					key={currentFeature}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.5 }}
				>
					{currentFeature === "home" ? (
						<Home />
					) : currentFeature === "birthday" ? (
						<Birthday />
					) : (
						<GirlfriendDay />
					)}
				</motion.div>
			</main>
		</div>
	);
}

export default App;
