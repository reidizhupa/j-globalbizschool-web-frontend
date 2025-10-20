"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import Image from "next/image";
import { FaCheckCircle, FaClock, FaLaptop, FaEnvelope, FaMapMarkerAlt, FaCalendarAlt, FaExclamationTriangle, FaArrowLeft } from "react-icons/fa";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";
import { Link } from "@/i18n/navigation";
import "react-phone-input-2/lib/style.css";

import PhoneInput from "react-phone-input-2";

export default function FreeCoachingPage() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		message: "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});

	const [step, setStep] = useState(1);

	// Step 2
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
	const [selectedTime, setSelectedTime] = useState<string | null>(null);
	const [times, setTimes] = useState<string[]>([]);
	const [loading, setLoading] = useState(false);

	const next = () => setStep((prev) => prev + 1);
	const prev = () => setStep((prev) => prev - 1);

	// Fetch available slots
	useEffect(() => {
		if (!selectedDate) return;

		const dayStr = format(selectedDate, "yyyy-MM-dd");

		setLoading(true);
		fetch("/api/free-coaching/available-slots", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ date: dayStr }),
		})
			.then(async (res) => {
				const text = await res.text();
				return text ? JSON.parse(text) : { availableSlots: [] };
			})
			.then((data) => setTimes(data.availableSlots || []))
			.catch(() => setTimes([]))
			.finally(() => setLoading(false));
	}, [selectedDate]);

	// Step 3: Submit and open Google Calendar
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!selectedDate || !selectedTime) return alert("Please select date and time first.");

		const bookingData = {
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			phone: formData.phone,
			message: formData.message,
			date: format(selectedDate, "yyyy-MM-dd"),
			time: selectedTime,
		};

		try {
			setLoading(true);

			const res = await fetch("/api/free-coaching/book", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(bookingData),
			});

			const data = await res.json();
			if (data.error) throw new Error(data.error);

			next();
		} catch (err: any) {
			alert("Booking failed: " + err.message);
		} finally {
			setLoading(false);
		}
	};

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
				<AnimatePresence mode="wait">
					{/* Step 1: Intro */}
					{step === 1 && (
						<motion.div key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.4 }} className="max-w-7xl mx-auto">
							<div className="grid lg:grid-cols-7 gap-8 lg:gap-12">
								{/* Left: Hero & Info */}
								<div className="lg:col-span-4 space-y-8">
									<div className="relative h-72 sm:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
										<Image src="/img/free-coaching.avif" alt="Online coaching session" fill className="object-cover" priority />
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
									</div>

									<div className="space-y-6">
										{/* Important Notice */}
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

										{/* Coach Intro */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
											<div className="space-y-4">
												<h3 className="font-semibold text-gray-900 text-lg">Meet Your Coach</h3>
												<p className="text-gray-700 leading-relaxed">
													Our bilingual coach, <strong className="text-blue-600">Jon</strong>, specializes in helping professionals develop intercultural business skills. This is a no-pressure session, we&apos;re here to help, not to sell.
												</p>
											</div>
										</div>

										{/* Session Details */}
										<div className="bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 shadow-sm">
											<div className="space-y-4">
												<h3 className="font-semibold text-gray-900 text-lg">What to Expect</h3>
												<ul className="space-y-3 text-gray-700">
													{["Discussion of your current work situation, goals, and challenges", "Identification of skills needed for global business success in Japanese companies", "Interactive mind mapping session to organize your ideas", "Personalized Individual Learning Journey guide with recommendations"].map((text, i) => (
														<li key={i} className="flex items-start gap-3">
															<div className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5">
																<FaCheckCircle className="w-full h-full" />
															</div>
															<span>{text}</span>
														</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								</div>

								{/* Right: Booking CTA */}
								<div className="lg:col-span-3">
									<div className="sticky top-28 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-3xl shadow-xl p-8 space-y-8">
										<div className="space-y-4 text-center">
											<h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">Free Coaching</h1>
											<p className="text-gray-600 text-lg leading-relaxed">Book your complimentary 30-minute online counselling session to start your intercultural development journey.</p>
										</div>

										<div className="space-y-4">
											<button onClick={next} className="w-full bg-gradient-to-r from-[#d74100] to-[#ff5a1f] hover:from-[#bf3a00] hover:to-[#e04e00] text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3">
												<FaCalendarAlt className="w-5 h-5" />
												Book Free Coaching
											</button>
										</div>

										<div className="pt-6 border-t border-gray-200 space-y-3 text-sm text-gray-600">
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
						</motion.div>
					)}

					{/* Step 2: Date & Time */}
					{step === 2 && (
						<motion.div key="step2" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative p-10 bg-gradient-to-br from-white/90 to-blue-50/80 backdrop-blur-md rounded-3xl shadow-xl border border-blue-100">
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold text-gray-800">
									Step 2: <span className="text-blue-600">Select Date & Time</span>
								</h2>
								<p className="text-gray-500 mt-2 text-sm sm:text-base">Pick your preferred date and time for your free coaching session.</p>
							</div>

							<div className="flex flex-col lg:flex-row gap-10 items-start">
								{/* Calendar */}
								<div className="lg:w-1/3 bg-white/70 rounded-2xl p-6 shadow-inner border border-gray-100 backdrop-blur-sm">
									<DayPicker
										mode="single"
										selected={selectedDate}
										onSelect={(date) => setSelectedDate(date || undefined)}
										disabled={{ before: new Date() }}
										className="rounded-xl text-gray-800"
										modifiersClassNames={{
											selected: "bg-blue-600 text-white rounded-lg shadow-md",
											today: "font-semibold border border-blue-300 rounded-lg",
										}}
									/>
								</div>

								{/* Time slots */}
								<div className="lg:w-2/3 relative bg-white/70 rounded-2xl p-8 shadow-inner border border-gray-100 backdrop-blur-sm min-h-[280px] flex items-center justify-center">
									{loading && (
										<div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl z-10">
											<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
										</div>
									)}

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

					{/* Step 3: Personal Info Form */}
					{step === 3 && (
						<motion.div key="step3" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative p-10 bg-white/90 rounded-3xl shadow-xl border border-gray-200 max-w-2xl mx-auto">
							<div className="text-center mb-8">
								<h2 className="text-3xl font-bold text-gray-800">
									Step 3: <span className="text-blue-600">Your Information</span>
								</h2>
								<p className="text-gray-500 mt-2 text-sm sm:text-base">Fill in your details so we can contact you and prepare for your session.</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-6">
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
									<input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
								</div>
								<input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
								<PhoneInput
									country={"jp"} // default country
									value={formData.phone}
									onChange={(phone) => setFormData({ ...formData, phone })}
									enableSearch={true} // lets user search countries
									buttonStyle={{ background: "transparent", border: "1px solid transparent", borderRadius: "50%" }}
									dropdownStyle={{ background: "transparent", border: "1px solid transparent", borderRadius: "50%" }}
									inputProps={{
										name: "phone",
										required: true,
										className: "w-full px-4 pl-13 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none",
									}}
								/>
								<textarea name="message" value={formData.message} onChange={handleChange} placeholder="Additional message (optional)" rows={4} className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none" />
								<div className="flex justify-between items-center mt-6">
									<motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={prev} type="button" className="px-6 py-3 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium shadow-sm transition-all">
										← Back
									</motion.button>

									<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" disabled={loading} className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 ${loading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"}`}>
										{loading ? "Booking..." : "Confirm Booking →"}
									</motion.button>
								</div>
							</form>
						</motion.div>
					)}

					{/* Step 4: Confirmation */}
					{step === 4 && (
						<motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.5, ease: "easeOut" }} className="relative p-12 bg-white/90 rounded-3xl shadow-xl border border-gray-200 max-w-xl mx-auto text-center space-y-8">
							<div className="flex justify-center">
								<FaCheckCircle className="w-16 h-16 text-green-500" />
							</div>
							<h2 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h2>
							<p className="text-gray-600 text-lg">
								Thank you, {formData.firstName}! Your free coaching session is scheduled for{" "}
								<strong>
									{format(selectedDate!, "MMMM dd, yyyy")} at {selectedTime}
								</strong>
								.
							</p>
							<p className="text-gray-500 text-sm">A confirmation email has been sent. You can also add this session to your Google Calendar by clicking below.</p>
							<a href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Free+Coaching+Session&dates=${format(selectedDate!, "yyyyMMdd")}T${selectedTime?.replace(":", "")}00Z/${format(selectedDate!, "yyyyMMdd")}T${selectedTime?.replace(":", "")}00Z&details=Your+free+coaching+session+with+our+expert&location=Online`} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200">
								Add to Google Calendar
							</a>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
