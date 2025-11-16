import React from "react";
import { Calendar, RefreshCw, DollarSign, Award, Target } from "lucide-react";

export default function JBSWorkshopsBenefits() {
	const benefits = [
		{ icon: Calendar, label: "Flexible", color: "from-amber-200 to-amber-300" },
		{ icon: RefreshCw, label: "Convenient", color: "from-amber-200 to-amber-300" },
		{ icon: DollarSign, label: "Affordable", color: "from-amber-200 to-amber-300" },
		{ icon: Award, label: "Certified", color: "from-amber-200 to-amber-300" },
		{ icon: Target, label: "Goal Oriented", color: "from-amber-200 to-amber-300" },
	];

	return (
		<section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-16">
					<h2 className="text-3xl md:text-4xl font-extrabold text-[#215ca5] mb-4">Benefits ofJBS Online Workshops</h2>
				</div>

				{/* Benefits */}
				<div className="flex flex-wrap justify-center gap-6 mb-14">
					{benefits.map((benefit, i) => {
						const Icon = benefit.icon;
						const colors = [
							{ bg: "bg-blue-400", ring: "ring-sky-50" },
							{ bg: "bg-blue-300", ring: "ring-sky-50" },
							{ bg: "bg-blue-300", ring: "ring-sky-50" },
							{ bg: "bg-blue-200", ring: "ring-sky-50" },
							{ bg: "bg-blue-200", ring: "ring-sky-50" },
						];
						return (
							<div key={i} className="group flex flex-col items-center text-center transition-all hover:-translate-y-1">
								<div className={`md:w-20 md:h-20 h-10 w-10 mb-3 rounded-3xl flex items-center justify-center ${colors[i].bg} ${colors[i].ring} ring-4 shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110`}>
									<Icon className="md:w-7 md:h-7 h-5 w-5 text-white" strokeWidth={2.5} />
								</div>
								<p className="font-semibold text-gray-900 text-sm">{benefit.label}</p>
							</div>
						);
					})}
				</div>

				{/* Two Column Layout */}
				<div className="grid lg:grid-cols-2 gap-16 items-center">
					<div className="space-y-8 px-6">
						<h3 className="text-2xl font-bold text-gray-800">Flexible, Interactive & Global</h3>

						<div className="space-y-3">
							<div className="flex gap-4 items-start group">
								<div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-400 mt-2 "></div>
								<p className="text-lg text-gray-500 leading-relaxed">
									Join <span className="font-medium text-gray-700">20+ bilingual one-hour workshops weekly</span>, offered <span className="font-medium text-gray-700">morning, afternoon, and evening (Japan time)</span>.
								</p>
							</div>

							<div className="flex gap-4 items-start group">
								<div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-400 mt-2 "></div>
								<p className="text-lg text-gray-500 leading-relaxed">
									Programs cover practical global business topics in <span className="font-medium text-gray-700">2–4 workshops</span> you can attend in any order.
								</p>
							</div>

							<div className="flex gap-4 items-start group">
								<div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-400 mt-2"></div>
								<p className="text-lg text-gray-500 leading-relaxed">
									Major courses like the <span className="font-medium text-gray-700">Mini MBA</span> include <span className="font-medium text-gray-700">6 programs and 24 workshops over six months</span>.
								</p>
							</div>

							<div className="flex gap-4 items-start group">
								<div className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-400 mt-2 "></div>
								<p className="text-lg text-gray-500 leading-relaxed">
									Every session is <span className="font-medium text-gray-700">interactive, live, and bilingual</span>, with <span className="font-medium text-gray-700">attendance tracking, digital badges, and certificates</span> to boost your global career credentials.
								</p>
							</div>
						</div>
					</div>

					{/* Right Column - Calendar */}
					<div className="p-6 bg-white rounded-4xl shadow-md">
						<h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Class Schedule</h3>
						<div className="grid grid-cols-3  bg-indigo-50 mb-4 rounded-full text-center">
							<div className="py-4 font-bold text-gray-700"></div>
							<div className="py-4 font-bold text-gray-700 ">Mon-Thu</div>
							<div className="py-4 font-bold text-gray-700 ">Saturday</div>
						</div>

						<div className="">
							{[
								{ period: "Morning", time: "7-10am", monThu: 3, sat: 2 },
								{ period: "Afternoon", time: "1-5pm", monThu: 6, sat: 0 },
								{ period: "Evening", time: "7-10pm", monThu: 9, sat: 0 },
							].map((row, idx) => (
								<div key={idx} className="grid items-center rounded-full bg-white shadow-xs my-1 grid-cols-3 text-center ">
									<div className="p-4  font-semibold text-gray-900">
										<div> {row.period}</div>

										<span className="text-xs font-normal text-gray-600">{row.time}</span>
									</div>
									<div className="p-4 flex flex-col items-center justify-center">
										{row.monThu > 0 ? <div className="w-12 h-12 bg-blue-300 rounded-2xl flex items-center justify-center mb-1 text-white font-bold">{row.monThu}</div> : <span className="text-gray-400 text-xl">—</span>}
										{row.monThu > 0 ? <span className="text-xs text-gray-700">classes</span> : <span className="text-xs text-gray-700">No classes</span>}
									</div>
									<div className="p-4 flex flex-col items-center justify-center ">
										{row.sat > 0 ? <div className="w-12 h-12 bg-blue-300 rounded-2xl flex items-center justify-center mb-1 text-white font-bold">{row.monThu}</div> : <span className="text-gray-400 text-xl">—</span>}
										{row.sat > 0 ? <span className="text-xs text-gray-700">classes</span> : <span className="text-xs text-gray-700">No classes</span>}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
