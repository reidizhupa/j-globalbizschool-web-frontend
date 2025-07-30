"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const Instructors = () => {
	const instructors = [
		{
			name: "Dr. Sarah L. Birchley",
			role: "Business School Director, Instructor, Coach",
			image: "/img/instructors/sarah-birchley.jpg",
		},
		{
			name: "Nathan DeWitt",
			role: "Instructor",
			image: "/img/instructors/nathan-dewitt.jpg",
		},
		{
			name: "Graham Lenz",
			role: "Coach, Success Supporter",
			image: "/img/instructors/graham-lenz.avif",
		},
		{
			name: "Mizuho Shimada",
			role: "Community Coach",
			image: "/img/instructors/mizuho-shimada.avif",
		},
		{
			name: "Ikem Okoboshi",
			role: "Coach, Success Supporter",
			image: "/img/instructors/ikem-okoboshi.png",
		},
		{
			name: "Hisako Miyamori",
			role: "Coach, Success Supporter",
			image: "/img/instructors/hisako-miyamori.avif",
		},
	];

	return (
		<section className="py-12 px-4 bg-white">
			<div className="max-w-7xl mx-auto">
				<h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">In addition, instructors with specialized knowledge will support you!</h2>

				<Swiper
					modules={[Autoplay]}
					spaceBetween={24}
					slidesPerView={1}
					breakpoints={{
						640: { slidesPerView: 2 },
						768: { slidesPerView: 3 },
						1024: { slidesPerView: 4 },
						1280: { slidesPerView: 6 },
					}}
					autoplay={{
						delay: 2500,
						disableOnInteraction: false,
					}}
					loop={true}
					className="pb-4"
				>
					{instructors.map((instructor, index) => (
						<SwiperSlide key={index}>
							<div className="flex flex-col items-center w-full">
								<div className="mb-4 w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
									<img src={instructor.image} alt={instructor.name} className="w-full h-full object-cover" />
								</div>
								<h3 className="text-lg font-semibold text-gray-800 text-center">{instructor.name}</h3>
								<p className="text-sm text-gray-600 mt-1 text-center">{instructor.role}</p>
							</div>
						</SwiperSlide>
					))}
				</Swiper>
			</div>
		</section>
	);
};

export default Instructors;
