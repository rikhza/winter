import { useState, useEffect, useRef } from "react";
import { Heart, Music, Flower, Flame, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import YouTube from "react-youtube";
import "./Birthday.css";

const Birthday = () => {
	const [showContent, setShowContent] = useState(false);
	const [isPlaying, setIsPlaying] = useState(true);
	const [cardOpened, setCardOpened] = useState(false);
	const [showLetter, setShowLetter] = useState(false);
	const [showCake, setShowCake] = useState(false);
	const [showFlowers, setShowFlowers] = useState(false);
	const [candlesBlown, setCandlesBlown] = useState(false);
	const [blowingCandle, setBlowingCandle] = useState(false);
	const [micPermission, setMicPermission] = useState(false);
	const [blowStrength, setBlowStrength] = useState(0);

	const playerRef = useRef<any>(null);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowContent(true);
		}, 1000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (cardOpened) {
			const letterTimer = setTimeout(() => {
				setShowLetter(true);
			}, 500);

			const cakeTimer = setTimeout(() => {
				setShowCake(true);
			}, 2000);

			const flowersTimer = setTimeout(() => {
				setShowFlowers(true);
			}, 3000);

			return () => {
				clearTimeout(letterTimer);
				clearTimeout(cakeTimer);
				clearTimeout(flowersTimer);
			};
		}
	}, [cardOpened]);

	// YouTube player options
	const opts = {
		height: "0", // Hide the player
		width: "0", // Hide the player
		playerVars: {
			autoplay: 1, // Autoplay the video
			loop: 1, // Loop the video
			playlist: "9boiT64sm0Q", // Required for looping a single video
		},
	};

	// Handle when the YouTube player is ready
	const onReady = (event: any) => {
		playerRef.current = event.target;
		playerRef.current.playVideo(); // Start playing the video
	};

	// Toggle music play/pause
	const toggleMusic = () => {
		if (playerRef.current) {
			if (isPlaying) {
				playerRef.current.pauseVideo();
			} else {
				playerRef.current.playVideo();
			}
			setIsPlaying(!isPlaying);
		}
	};

	const openCard = () => {
		setCardOpened(true);
	};

	const requestMicPermission = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			setMicPermission(true);

			// Set up audio analysis
			const audioContext = new AudioContext();
			const analyser = audioContext.createAnalyser();
			const source = audioContext.createMediaStreamSource(stream);
			source.connect(analyser);

			analyser.fftSize = 256;
			const bufferLength = analyser.frequencyBinCount;
			const dataArray = new Uint8Array(bufferLength);

			// Start monitoring microphone input
			const checkMicVolume = () => {
				if (!candlesBlown) {
					analyser.getByteFrequencyData(dataArray);

					// Calculate average volume
					let sum = 0;
					for (let i = 0; i < bufferLength; i++) {
						sum += dataArray[i];
					}
					const average = sum / bufferLength;
					setBlowStrength(average);

					// If blow is strong enough, blow out candles
					if (average > 50) {
						setBlowingCandle(true);
						setTimeout(() => {
							setCandlesBlown(true);
						}, 1000);
					}

					if (!candlesBlown) {
						requestAnimationFrame(checkMicVolume);
					}
				}
			};

			checkMicVolume();

			// Set up media recorder (not used but keeps the stream active)
			const micRecorder = new MediaRecorder(stream);
			micRecorder.start();
		} catch (err) {
			console.error("Error accessing microphone:", err);
		}
	};

	return (
		<div className="birthday-container">
			{/* YouTube Player */}
			<YouTube videoId="9boiT64sm0Q" opts={opts} onReady={onReady} />

			{/* Music Control */}
			<motion.button
				onClick={toggleMusic}
				className="music-control"
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
			>
				<Music size={20} />
			</motion.button>

			{/* Main Content */}
			<section className="birthday-content">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{
						opacity: showContent ? 1 : 0,
						y: showContent ? 0 : 20,
					}}
					transition={{ duration: 1, ease: "easeOut" }}
					className="w-full max-w-md mx-auto"
				>
					{/* Birthday Card */}
					{!cardOpened ? (
						<motion.div
							className="relative mx-auto bg-gradient-to-r from-pink-400 to-purple-500 rounded-xl shadow-2xl overflow-hidden cursor-pointer"
							style={{ aspectRatio: "3/4", maxWidth: "300px" }}
							onClick={openCard}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.98 }}
						>
							<div className="absolute inset-0 bg-white/10 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-white">
								<motion.div
									initial={{ scale: 0.8, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={{ delay: 0.3, duration: 0.5 }}
								>
									<Gift size={60} className="mb-4" />
								</motion.div>

								<motion.h2
									className="text-2xl font-bold mb-2 text-center"
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.5, duration: 0.5 }}
								>
									ciee ciee
								</motion.h2>

								<motion.p
									className="text-sm text-center opacity-90"
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.7, duration: 0.5 }}
								>
									buka letter ini ❤️
								</motion.p>

								<motion.div
									className="absolute bottom-4 w-full flex justify-center"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 1, duration: 0.5 }}
								>
									<Heart
										className="text-white animate-pulse"
										fill="white"
										size={24}
									/>
								</motion.div>
							</div>

							{/* Decorative elements */}
							<div className="absolute top-0 left-0 w-20 h-20 bg-pink-300 rounded-full opacity-30 transform -translate-x-10 -translate-y-10"></div>
							<div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-300 rounded-full opacity-30 transform translate-x-16 translate-y-16"></div>
						</motion.div>
					) : (
						<AnimatePresence>
							{/* Letter */}
							{showLetter && (
								<motion.div
									className="bg-white rounded-xl shadow-xl p-6 mx-auto mb-12"
									initial={{ opacity: 0, y: 50, scale: 0.9 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									transition={{
										duration: 0.6,
										ease: "easeOut",
									}}
								>
									<div className="text-center">
										<motion.h1
											className="text-3xl md:text-4xl font-bold text-pink-600 mb-4"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.2,
												duration: 0.5,
											}}
										>
											Happy Birthday!
										</motion.h1>

										<motion.p
											className="text-lg text-gray-700 mb-4"
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												delay: 0.3,
												duration: 0.5,
											}}
										>
											ini bukan kata2 AI kok, jadi kamu
											baca yaa HAHAHA
										</motion.p>

										<motion.div
											className="text-left space-y-4"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{
												delay: 0.4,
												duration: 0.5,
											}}
										>
											<p className="text-gray-800">
												my dearest Winter! 🎉
											</p>
											<p className="text-gray-800">
												selamat ulang tahun ke 25 yaa ❤️
											</p>
											<p className="text-gray-800">
												aku bener-bener bersyukur bisa
												ketemu sama kamu. kamu udah jadi
												part of me. tiap hari aku makin
												sayang.
											</p>
											<p className="text-gray-800">
												aku bakal selalu ada buat kamu,
												aku bakal terus perjuangin.
											</p>
											<p className="text-gray-800">
												di ulang tahun kamu yang spesial
												ini, semoga semua impian dan
												harapan kamu bisa terwujud ya
												sayang, apapun wish kamu 🌟
											</p>
											<p className="text-gray-800">
												I love you to the moon and back!
											</p>
											<p className="text-gray-800">
												Yours forever ❤️
											</p>
											<p className="text-gray-800 font-medium">
												Kino
											</p>
										</motion.div>
									</div>
								</motion.div>
							)}

							{/* Cake Section */}
							{showCake && (
								<motion.div
									className="mt-8 mx-auto"
									initial={{ opacity: 0, y: 50 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.6,
										ease: "easeOut",
									}}
									style={{ maxWidth: "300px" }}
								>
									{/* Cake */}
									<div className="relative">
										<div className="bg-yellow-200 rounded-t-3xl h-32 w-full relative overflow-hidden">
											{/* Cake frosting */}
											<div className="absolute top-0 left-0 right-0 h-8 bg-pink-300 rounded-t-3xl">
												<div className="flex justify-around">
													{[...Array(8)].map(
														(_, i) => (
															<div
																key={i}
																className="w-6 h-6 bg-pink-300 rounded-full transform translate-y-3"
															></div>
														),
													)}
												</div>
											</div>

											{/* Cake decorations */}
											<div className="absolute top-12 left-0 right-0 flex justify-around">
												{[...Array(3)].map((_, i) => (
													<div
														key={i}
														className="w-4 h-4 bg-pink-400 rounded-full"
													></div>
												))}
											</div>
											<div className="absolute top-20 left-0 right-0 flex justify-around">
												{[...Array(4)].map((_, i) => (
													<div
														key={i}
														className="w-3 h-3 bg-purple-400 rounded-full"
													></div>
												))}
											</div>
										</div>

										{/* Cake base */}
										<div className="bg-yellow-300 h-8 w-full rounded-b-lg"></div>
										<div className="bg-yellow-100 h-4 w-full rounded-b-lg"></div>

										{/* Candles */}
										<div className="absolute top-0 left-0 right-0 flex justify-center space-x-8 transform -translate-y-12">
											{/* Candle 1 */}
											<div className="relative">
												<div className="w-4 h-16 bg-gradient-to-b from-pink-300 to-pink-500 rounded-t-full"></div>
												{!candlesBlown && (
													<div
														className={`absolute -top-6 left-0 right-0 mx-auto w-6 h-8 ${
															blowingCandle
																? "blow-animation"
																: "animate-flicker"
														}`}
													>
														<Flame
															size={24}
															className="text-yellow-500"
															fill="#eab308"
														/>
													</div>
												)}
											</div>

											{/* Candle 2 */}
											<div className="relative">
												<div className="w-4 h-16 bg-gradient-to-b from-purple-300 to-purple-500 rounded-t-full"></div>
												{!candlesBlown && (
													<div
														className={`absolute -top-6 left-0 right-0 mx-auto w-6 h-8 ${
															blowingCandle
																? "blow-animation"
																: "animate-flicker"
														}`}
													>
														<Flame
															size={24}
															className="text-yellow-500"
															fill="#eab308"
														/>
													</div>
												)}
											</div>
										</div>

										{/* Cake plate */}
										<div className="bg-gray-100 h-2 w-full mt-1 rounded-full"></div>
									</div>

									{/* Blow instruction */}
									{showCake &&
										!candlesBlown &&
										!micPermission && (
											<motion.div
												className="mt-8 text-center"
												initial={{ opacity: 0, y: 20 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													delay: 0.3,
													duration: 0.5,
												}}
											>
												<motion.button
													onClick={
														requestMicPermission
													}
													className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-all duration-300"
													whileHover={{ scale: 1.05 }}
													whileTap={{ scale: 0.95 }}
												>
													Blow the candles! 🎂
												</motion.button>
												<p className="text-sm text-gray-600 mt-2">
													(allow microphone access nya
													sayang)
												</p>
											</motion.div>
										)}

									{showCake &&
										!candlesBlown &&
										micPermission && (
											<motion.div
												className="mt-8 text-center"
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												transition={{ duration: 0.5 }}
											>
												<p className="text-lg font-medium text-pink-600 animate-pulse">
													Blow into your microphone!
													💨
												</p>
												<div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
													<motion.div
														className="bg-pink-600 h-2.5 rounded-full"
														style={{
															width: `${Math.min(
																blowStrength *
																	2,
																100,
															)}%`,
														}}
														transition={{
															duration: 0.3,
														}}
													></motion.div>
												</div>
											</motion.div>
										)}

									{candlesBlown && (
										<motion.div
											className="mt-8 text-center"
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ duration: 0.5 }}
										>
											<p className="text-lg font-medium text-pink-600">
												Yay! Happy 25nd Birthday! 🎉
											</p>
										</motion.div>
									)}
								</motion.div>
							)}

							{/* Flowers Section */}
							{showFlowers && (
								<motion.div
									className="relative flex justify-center mt-8"
									initial={{ scale: 0.8, rotateX: 15 }}
									animate={{ scale: 1, rotateX: 15 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									style={{
										transformStyle: "preserve-3d",
										perspective: "1000px",
									}}
								>
									<div className="bucket-container">
										{/* Bucket base */}
										<div className="bucket-base"></div>

										{/* Bucket pattern */}
										<div className="bucket-pattern">
											{[...Array(8)].map((_, i) => (
												<div
													key={i}
													className="bucket-pattern-line"
												/>
											))}
										</div>

										{/* Metallic shine effect */}
										<div className="bucket-shine"></div>

										{/* 3D Flowers */}
										<div className="flower-container">
											{[...Array(5)].map((_, i) => (
												<motion.div
													key={i}
													className="flower"
													initial={{
														y: -20,
														rotateX: 0,
													}}
													animate={{
														y: [-20, -15, -20],
														rotateX: [0, 5, 0],
														rotateY: [0, 10, 0],
													}}
													transition={{
														duration: 3,
														delay: i * 0.2,
														repeat: Infinity,
														ease: "easeInOut",
													}}
													style={{
														left: `${20 + i * 15}%`,
														transform: `translateZ(${
															20 + i * 5
														}px)`,
													}}
												>
													<Flower
														size={32}
														className={`${
															i % 2 === 0
																? "flower-pink"
																: "flower-purple"
														}`}
													/>
												</motion.div>
											))}
										</div>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					)}
				</motion.div>

				{/* Floating hearts background */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
								opacity: 0.2 + Math.random() * 0.3,
							}}
							animate={{
								y: [-20, 20, -20],
								rotate: [0, 10, 0],
								scale: [0.8, 1, 0.8],
							}}
							transition={{
								duration: 15 + Math.random() * 10,
								repeat: Infinity,
								delay: Math.random() * 5,
								ease: "easeInOut",
							}}
						>
							<Heart fill="#ec4899" size={20} />
						</motion.div>
					))}
				</div>
			</section>
		</div>
	);
};

export default Birthday;
