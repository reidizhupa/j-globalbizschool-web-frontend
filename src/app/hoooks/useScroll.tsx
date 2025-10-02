// app/hooks/useScroll.ts
import { useState, useEffect } from "react";

export function useScroll(threshold: number = 10) {
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		let ticking = false;

		const handleScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					setScrolled(window.scrollY > threshold);
					ticking = false;
				});
				ticking = true;
			}
		};

		window.addEventListener("scroll", handleScroll);

		// Check scroll position on mount
		handleScroll();

		return () => window.removeEventListener("scroll", handleScroll);
	}, [threshold]);

	return scrolled;
}
