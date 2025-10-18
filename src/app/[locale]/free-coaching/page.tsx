"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Image from "next/image";
import { FaCheckCircle, FaClock, FaLaptop, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaExclamationTriangle, FaArrowLeft, FaLock, FaClipboardList, FaUser, FaComment } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";

export default function FreeCoachingPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		next();
	};

	const [step, setStep] = useState(1);

	// Step 2
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [times, setTimes] = useState<string[]>([]);
	const [loading, setLoading] = useState(false); // <-- new loading state

	const next = () => setStep((prev) => prev + 1);
	const prev = () => setStep((prev) => prev - 1);

	// Fetch available time slots when date changes
	useEffect(() => {
		if (!selectedDate) return;

		// Use date-fns to get the date in local time (JST in your case)
		const dayStr = format(selectedDate, "yyyy-MM-dd");

		fetch("/api/free-coaching/available-slots", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ date: dayStr }),
		})
			.then(async (res) => {
				const text = await res.text(); // get raw response
				console.log("Raw response from server:", text);

				return text ? JSON.parse(text) : { slots: [] };
			})
			.then((data) => {
				console.log("Parsed JSON:", data);
				setTimes(data.availableSlots || []); // make sure it matches server response
			})
			.catch((err) => {
				console.error("Error fetching slots:", err);
				setTimes([]); // fallback
			});
	}, [selectedDate]);

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-16">
			<header className="fixed top-0 left-0 right-0 z-50 mx-auto flex w-full items-center justify-between px-6 py-2 transition-colors duration-300 bg-white shadow-md">
				<div className="max-w-7xl flex w-full items-center justify-between mx-auto">
					<Link href="/" className="flex items-center">
						<Image src="/logo.avif" alt="Prebuilt UI Logo" width={120} height={40} className="h-auto w-24 sm:w-32 md:w-32 object-contain" priority />
					</Link>
					<div className="flex items-center space-x-4">
						<LanguageSwitcher />
					</div>
				</div>
			</header>
			<div className="max-w-7xl w-full space-y-10 mt-20">
				{/* Steps */}
				<AnimatePresence mode="wait">
					{step === 1 && (
						<motion.div key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }} className="max-w-7xl mx-auto">
							<div className="grid lg:grid-cols-7 gap-8 lg:gap-12">
								{/* Left side: Image and details */}
								<div className="lg:col-span-4 space-y-8">
									{/* Hero Image */}
									<div className="relative h-72 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
										<Image src="/img/free-coaching.avif" alt="Online coaching session" fill className="object-cover" priority />
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
									</div>

									{/* Information Cards */}
									<div className="space-y-6">
										{/* Important Notice Card */}
										<div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 lg:p-8">
											<div className="flex items-start gap-3">
												<div className="flex-shrink-0 w-6 h-6 text-orange-600 mt-0.5">
													<FaExclamationTriangle className="w-full h-full" />
												</div>
												<div className="space-y-3">
													<h3 className="font-semibold text-orange-900 text-lg">Important Notice</h3>
													<p className="text-orange-800 leading-relaxed">
														Please schedule appointments at least <strong>3 hours in the future</strong> to ensure proper preparation time.
													</p>
												</div>
											</div>
										</div>

										{/* Coach Introduction Card */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
											<div className="space-y-4">
												<h3 className="font-semibold text-gray-900 text-lg">Meet Your Coach</h3>
												<p className="text-gray-700 leading-relaxed">
													Our bilingual coach, <strong className="text-blue-600">Jon</strong>, specializes in helping professionals develop intercultural business skills. This is a no-pressure session, we&aposre here to help, not to sell.
												</p>
											</div>
										</div>

										{/* Session Details Card */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
											<div className="space-y-4">
												<h3 className="font-semibold text-gray-900 text-lg">What to Expect</h3>
												<ul className="space-y-3 text-gray-700">
													<li className="flex items-start gap-3">
														<div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
															<FaCheckCircle className="w-full h-full" />
														</div>
														<span>Discussion of your current work situation, goals, and challenges</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
															<FaCheckCircle className="w-full h-full" />
														</div>
														<span>Identification of skills needed for global business success in Japanese companies</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
															<FaCheckCircle className="w-full h-full" />
														</div>
														<span>Interactive mind mapping session to organize your ideas</span>
													</li>
													<li className="flex items-start gap-3">
														<div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
															<FaCheckCircle className="w-full h-full" />
														</div>
														<span>Personalized Individual Learning Journey guide with recommendations</span>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Right side: Sticky booking card */}
								<div className="lg:col-span-3">
									<div className="sticky top-28 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl  transition-all duration-300 p-8 space-y-8">
										{/* Header */}
										<div className="space-y-4 text-center">
											<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Free Coaching</h1>

											<p className="text-gray-600 text-lg leading-relaxed">Book your complimentary 30-minute online counselling session to start your intercultural development journey.</p>
										</div>

										{/* Features */}
										<div className="space-y-4">
											<div className="flex flex-col sm:flex-row gap-3 justify-center">
												<span className="bg-blue-50 text-blue-700 font-medium px-5 py-2 rounded-2xl flex items-center justify-center gap-2 flex-1">
													<FaClock className="w-4 h-4" />
													30 minutes
												</span>
												<span className="bg-blue-50 text-blue-700 font-medium px-5 py-2 rounded-2xl flex items-center justify-center gap-2 flex-1">
													<FaLaptop className="w-4 h-4" />
													Available Online
												</span>
											</div>
										</div>

										{/* CTA Button */}
										<div className="space-y-4">
											<button onClick={next} className="w-full bg-gradient-to-r from-[#d74100] to-[#ff5a1f] hover:from-[#bf3a00] hover:to-[#e04e00] text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
												<FaCalendarAlt className="w-5 h-5" />
												Book Free Coaching
											</button>
										</div>

										{/* Contact Info */}
										<div className="pt-6 border-t border-gray-200">
											<div className="space-y-3 text-sm text-gray-600">
												<div className="flex items-center justify-center gap-3">
													<FaEnvelope className="w-4 h-4 text-gray-400" />
													<span>support@j-global.com</span>
												</div>
												<div className="flex items-center justify-center gap-3">
													<FaMapMarkerAlt className="w-4 h-4 text-gray-400" />
													<span>Based in Tokyo, Japan</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					)}

					{step === 2 && (
						<motion.div key="step2" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative p-10 bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100">
							{/* Header */}
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold text-gray-800">
									Step 2: <span className="text-blue-600">Select Date & Time</span>
								</h2>
								<p className="text-gray-500 mt-2 text-sm sm:text-base">Pick your preferred date and time for your free coaching session.</p>
							</div>

							{/* Content Layout */}
							<div className="flex flex-col lg:flex-row gap-10 items-start">
								{/* Calendar Section */}
								<div className="lg:w-1/3 bg-white/70 rounded-2xl p-6 shadow-inner border border-gray-100 backdrop-blur-sm">
									<DayPicker
										mode="single"
										selected={selectedDate}
										onSelect={(date) => {
											setSelectedDate(date);
											if (!date) return;

											setLoading(true);

											// Use date-fns to format date in JST
											const dayStr = format(date, "yyyy-MM-dd");

											fetch("/api/free-coaching/available-slots", {
												method: "POST",
												headers: { "Content-Type": "application/json" },
												body: JSON.stringify({ date: dayStr }),
											})
												.then(async (res) => {
													const text = await res.text(); // get raw response
													console.log("Raw response from server:", text);

													// parse JSON safely
													return text ? JSON.parse(text) : { availableSlots: [] };
												})
												.then((data) => {
													console.log("Parsed JSON:", data);
													setTimes(data.availableSlots || []); // use API response field
												})
												.catch((err) => {
													console.error("Error fetching slots:", err);
													setTimes([]); // fallback
												})
												.finally(() => setLoading(false));
										}}
										disabled={{ before: new Date() }}
										className="rounded-xl text-gray-800"
										modifiersClassNames={{
											selected: "bg-blue-600 text-white rounded-lg shadow-md",
											today: "font-semibold border border-blue-300 rounded-lg",
										}}
									/>
								</div>

								{/* Time Slots Section */}
								<div className="lg:w-2/3 relative bg-white/70 rounded-2xl p-8 shadow-inner border border-gray-100 backdrop-blur-sm min-h-[280px] flex items-center justify-center">
									{/* Loader */}
									{loading && (
										<div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl z-10">
											<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
										</div>
									)}

									{/* Time Slot Display */}
									{!loading && selectedDate ? (
										<div className="w-full space-y-6">
											{!times || times.length === 0 ? (
												<p className="text-gray-500 text-center text-lg">No available slots for this day</p>
											) : (
												<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
													{times.map((time, index) => (
														<motion.button key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setSelectedTime(time)} className={`px-4 py-3 rounded-xl border font-medium transition-all duration-300 text-sm sm:text-base ${selectedTime === time ? "bg-blue-600 text-white shadow-lg" : "bg-white/80 border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}>
															{time}
														</motion.button>
													))}
												</div>
											)}
										</div>
									) : (
										!loading && <p className="text-gray-500 text-center text-lg">Select a date to see available time slots</p>
									)}
								</div>
							</div>

							{/* Navigation */}
							<div className="flex justify-between items-center mt-10">
								<motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={prev} className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium shadow-sm transition-all">
									← Back
								</motion.button>

								<motion.button whileHover={selectedDate && selectedTime ? { scale: 1.05 } : {}} whileTap={selectedDate && selectedTime ? { scale: 0.95 } : {}} onClick={next} disabled={!selectedDate || !selectedTime} className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${selectedDate && selectedTime ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}>
									Next →
								</motion.button>
							</div>
						</motion.div>
					)}

					{step === 3 && (
						<motion.div key="step3" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative max-w-7xl mx-auto p-10 bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100">
							<form onSubmit={handleSubmit} className="space-y-10">
								{/* Header */}
								<div className="flex items-center gap-3 mb-8">
									<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">3</div>
									<div>
										<h2 className="text-3xl font-bold text-gray-900">
											Your <span className="text-blue-600">Information</span>
										</h2>
										<p className="text-gray-500 text-sm mt-1">Please fill out your details to confirm your session.</p>
									</div>
								</div>

								<div className="flex flex-col lg:flex-row gap-10">
									{/* Left - Form */}
									<div className="lg:w-2/3 space-y-8">
										{/* Personal Information */}
										<div className="bg-white/70 rounded-2xl p-8 shadow-inner border border-gray-100 backdrop-blur-sm">
											<h3 className="font-semibold text-gray-900 text-lg mb-6 flex items-center gap-2">
												<FaUser className="w-5 h-5 text-blue-600" />
												Personal Information
											</h3>

											<div className="grid sm:grid-cols-2 gap-6">
												<div className="space-y-2">
													<label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
														First Name *
													</label>
													<input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200" />
												</div>
												<div className="space-y-2">
													<label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
														Last Name *
													</label>
													<input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200" />
												</div>
											</div>
										</div>

										{/* Contact Information */}
										<div className="bg-white/70 rounded-2xl p-8 shadow-inner border border-gray-100 backdrop-blur-sm">
											<h3 className="font-semibold text-gray-900 text-lg mb-6 flex items-center gap-2">
												<FaEnvelope className="w-5 h-5 text-blue-600" />
												Contact Information
											</h3>

											<div className="grid sm:grid-cols-2 gap-6">
												<div className="space-y-2">
													<label htmlFor="email" className="block text-sm font-medium text-gray-700">
														Email Address *
													</label>
													<input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="your@email.com" className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200" />
												</div>
												<div className="space-y-2">
													<label htmlFor="phone" className="block text-sm font-medium text-gray-700">
														Phone Number
													</label>
													<input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 123-4567" className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200" />
												</div>
											</div>
										</div>

										{/* Additional Information */}
										<div className="bg-white/70 rounded-2xl p-8 shadow-inner border border-gray-100 backdrop-blur-sm">
											<h3 className="font-semibold text-gray-900 text-lg mb-6 flex items-center gap-2">
												<FaComment className="w-5 h-5 text-blue-600" />
												Additional Information
											</h3>
											<div className="space-y-2">
												<label htmlFor="message" className="block text-sm font-medium text-gray-700">
													Message (Optional)
												</label>
												<textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} placeholder="Tell us about your goals or questions..." className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white/80 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 resize-none" />
												<p className="text-sm text-gray-500">This helps your coach prepare for your session.</p>
											</div>
										</div>
									</div>

									{/* Right - Summary Sidebar */}
									<div className="lg:w-1/3 space-y-6">
										{/* Booking Summary */}
										<div className="bg-white/80 rounded-2xl p-6 shadow-inner border border-gray-100 backdrop-blur-sm">
											<h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center gap-2">
												<FaClipboardList className="w-5 h-5 text-blue-600" />
												Booking Summary
											</h3>
											<div className="space-y-4 text-sm">
												<div className="flex justify-between border-b border-gray-200 pb-2">
													<span className="text-gray-600">Service</span>
													<span className="font-semibold text-gray-900">Free Coaching</span>
												</div>
												<div className="flex justify-between border-b border-gray-200 pb-2">
													<span className="text-gray-600">Duration</span>
													<span className="font-semibold text-gray-900">30 minutes</span>
												</div>
												{selectedDate && (
													<div className="flex justify-between border-b border-gray-200 pb-2">
														<span className="text-gray-600">Date</span>
														<span className="font-semibold text-gray-900">{format(selectedDate, "MMM d, yyyy")}</span>
													</div>
												)}
												{selectedTime && (
													<div className="flex justify-between border-b border-gray-200 pb-2">
														<span className="text-gray-600">Time</span>
														<span className="font-semibold text-gray-900">{selectedTime}</span>
													</div>
												)}
												<div className="flex justify-between">
													<span className="text-gray-600">Price</span>
													<span className="font-bold text-green-600 text-lg">FREE</span>
												</div>
											</div>
										</div>

										{/* Security Notice */}
										<div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200 p-5">
											<div className="flex items-start gap-3">
												<FaLock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
												<div>
													<h4 className="font-semibold text-blue-900">Secure & Confidential</h4>
													<p className="text-blue-800 text-sm mt-1">Your information is protected and used only for your coaching session.</p>
												</div>
											</div>
										</div>

										{/* Support Info */}
										<div className="bg-white/80 rounded-2xl border border-gray-100 p-5 shadow-inner backdrop-blur-sm">
											<div className="space-y-3 text-sm">
												<div className="flex items-center gap-3 text-gray-600">
													<FaEnvelope className="w-4 h-4 text-gray-400" />
													<span>support@j-global.com</span>
												</div>
												<div className="flex items-center gap-3 text-gray-600">
													<FaClock className="w-4 h-4 text-gray-400" />
													<span>Response within 24 hours</span>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Sticky Navigation */}
								<div className="fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 py-4 shadow-lg flex justify-between items-center px-6 z-50">
									<button onClick={prev} type="button" className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition">
										<FaArrowLeft className="w-4 h-4" />
										Back
									</button>
									<button type="submit" className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200">
										<FaCheckCircle className="w-5 h-5" />
										Confirm Booking
									</button>
								</div>
							</form>
						</motion.div>
					)}

					{/* Step 4 */}
					{step === 4 && (
						<motion.div key="step4" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }} className="text-center">
							<div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-8 md:p-10 space-y-6">
								<div className="w-32 h-32 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
									<FaCheckCircle className="w-16 h-16" />
								</div>
								<h2 className="text-2xl font-semibold text-green-600 mb-2">Booking Confirmed!</h2>
								<p className="text-gray-700">
									Thank you <strong>{formData.firstName}</strong>! We’ve received your booking for <strong>{format(selectedDate || new Date(), "MMMM d, yyyy")}</strong> at <strong>{selectedTime}</strong>.
								</p>
								<p className="mt-4 text-gray-600">You’ll receive a confirmation email with your online meeting link soon.</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
