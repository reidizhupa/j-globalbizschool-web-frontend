"use client";
import Link from "next/link";

const pressItems = [
	{
		id: 1,
		name: "English Journal Online",
		subtitle: "We were featured in ALC Inc.'s online media, English Journal Online.",
		articles: [
			{
				title: "Click here to read first article",
				url: "https://ejournal.jp/article1",
				description: "",
			},
			{
				title: "Click here to read second article",
				url: "https://ejournal.jp/article2",
				description: "",
			},
		],
	},
	{
		id: 2,
		name: "KeySession",
		subtitle: "Our CEO, John, supervised an article on intercultural communication training on Keysession, a comprehensive employee training website.",
		articles: [
			{
				title: "Introduction to Intercultural Communication",
				url: "https://techcrunch.com/your-article",
				description: "How new tech is transforming modern classrooms.",
			},
			{
				title: "Overseas assignment training",
				url: "https://techcrunch.com/your-article",
				description: "Further insights on digital learning innovation.",
			},
			{
				title: "What are the tips for a successful overseas assignment?",
				url: "https://techcrunch.com/your-article",
				description: "Additional strategies for digital education growth.",
			},
		],
	},
];

export default function PressSection() {
	return (
		<section className="bg-gray-50 py-20">
			<div className="max-w-6xl mx-auto px-6">
				{/* Header */}
				<h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 text-center">Featured In</h2>
				<p className="text-lg md:text-xl text-gray-600 mb-12 text-center">Discover what top publications have said about us.</p>

				{/* Modern vertical timeline */}
				<div className="relative">
					{/* Vertical line */}
					<div className="absolute top-0 left-6 w-1 h-full bg-gray-300"></div>

					<div className="flex flex-col gap-8">
						{pressItems.map((item) => (
							<div key={item.id} className="relative pl-12 py-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all">
								{/* Dot */}
								<span className="absolute left-4 top-8 w-4 h-4 bg-blue-600 rounded-full shadow"></span>

								{/* Publication */}
								<h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
								{item.subtitle && <p className="text-gray-500 text-sm md:text-base mb-4">{item.subtitle}</p>}

								{/* Articles */}
								<ul className="flex flex-col gap-3">
									{item.articles.map((article, idx) => (
										<li key={idx}>
											<Link href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline transition flex flex-col gap-1">
												<span className="font-medium">{article.title} →</span>
												{article.description && <span className="text-gray-600 text-sm md:text-base">{article.description}</span>}
											</Link>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
