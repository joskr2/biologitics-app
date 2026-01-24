import { useState, useEffect } from "react";

export function useIsMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => window.innerWidth < 768;

		// Set initial value
		setIsMobile(checkMobile());

		// Add event listener
		const handleResize = () => {
			setIsMobile(checkMobile());
		};

		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return isMobile;
}
