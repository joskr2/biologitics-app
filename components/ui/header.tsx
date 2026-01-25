"use client";

import { MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HeaderContent } from "@/config/site-content";
import defaultData from "@/config/site-content.json";

interface HeaderProps {
	data?: HeaderContent;
	className?: string;
}

function Header({ data: propData, className }: HeaderProps) {
	const { theme, setTheme } = useTheme();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isDark = theme === "dark";

	const defaultHeader = defaultData.header;
	const data = propData || defaultHeader;
	const { logo, cta, navigation } = data;

	// Fallback logo values for SSR safety
	const lightLogo = (logo && logo.light) || { src: "", alt: "" };
	const darkLogo = (logo && logo.dark) || { src: "", alt: "" };
	const currentLogo = (isDark ? lightLogo : darkLogo) || { src: "", alt: "" };
	const currentAlt = (isDark ? lightLogo.alt : darkLogo.alt) || "";

	const isLogoImage = useMemo(
		() =>
			currentLogo?.src &&
			(currentLogo.src.endsWith(".svg") ||
				currentLogo.src.match(/\.(svg|png|jpg|jpeg|webp)$/i)),
		[currentLogo?.src]
	);

	const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
		const href = e.currentTarget.getAttribute("href");
		setIsMobileMenuOpen(false);

		// Handle anchor links
		if (href && href.startsWith("#")) {
			e.preventDefault();
			const targetId = href.slice(1);
			const targetElement = document.getElementById(targetId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: "smooth" });
			}
		}
		// For regular links, let Link handle navigation normally
	}, []);

	const handleMobileButtonClick = useCallback(() => {
		setIsMobileMenuOpen(false);
	}, []);

	const handleToggleMenu = useCallback(() => {
		setIsMobileMenuOpen((prev) => !prev);
	}, []);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Escape" && isMobileMenuOpen) {
				setIsMobileMenuOpen(false);
			}
		},
		[isMobileMenuOpen]
	);

	useEffect(() => {
		globalThis.addEventListener("keydown", handleKeyDown);
		return () => globalThis.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isMobileMenuOpen]);

	return (
		<>
			<Link
				href="#productos"
				className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-1/2 focus:-translate-x-1/2 focus:z-100 focus:px-6 focus:py-3 focus:bg-primary focus:text-white focus:font-semibold focus:rounded-b-lg"
			>
				Saltar al contenido principal
			</Link>

			<header
				className={cn(
					"sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
					className
				)}
			>
				<div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
					<Link
						href="/"
						className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-lg relative z-50"
					>
						{isLogoImage && currentLogo?.src ? (
							<Image
								src={currentLogo.src}
								alt={currentAlt || "Biologistics"}
								width={120}
								height={40}
								className="h-10 w-auto shrink-0"
								priority
							/>
						) : (
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shrink-0">
								{currentAlt?.charAt(0) || "B"}
							</div>
						)}
						<div className="flex flex-col">
							<span className="font-semibold text-sm">Biologistics</span>
							<span className="text-xs text-muted-foreground hidden xs:block">
								Venta de Equipos Científicos
							</span>
						</div>
					</Link>

					<nav
						className="hidden md:flex items-center gap-6"
						aria-label="Navegación principal"
					>
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href.startsWith("#") ? item.href : `#${item.href.replace("/", "")}`}
								onClick={handleNavClick}
								className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative pb-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform hover:after:scale-x-100"
							>
								{item.label}
							</Link>
						))}
					</nav>

					<div className="flex items-center gap-2 relative z-50">
						<button
							onClick={() => setTheme(isDark ? "light" : "dark")}
							className="flex h-10 w-10 items-center justify-center rounded-lg border bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							aria-label="Cambiar tema"
							type="button"
						>
							{isDark ? (
								<SunIcon className="size-5" />
							) : (
								<MoonIcon className="size-5" />
							)}
						</button>

						<Button
							variant="ghost"
							onClick={handleToggleMenu}
							className="flex h-10 w-10 items-center justify-center rounded-lg border bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80 hover:text-primary md:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
							aria-expanded={isMobileMenuOpen}
							aria-controls="mobile-menu"
							type="button"
						>
							{isMobileMenuOpen ? (
								<XIcon className="size-5" />
							) : (
								<MenuIcon className="size-5" />
							)}
						</Button>

						<div className="hidden lg:block">
							<Button variant="default" size="sm">
								<Link href={cta.href}>{cta.label}</Link>
							</Button>
						</div>
					</div>
				</div>
			</header>

			<div
				id="mobile-menu"
				className={cn(
					"fixed inset-0 z-40 bg-background md:hidden transition-transform duration-300 ease-in-out flex flex-col",
					isMobileMenuOpen ? "translate-y-0" : "translate-y-full"
				)}
				aria-hidden={!isMobileMenuOpen}
			>
				<div className="flex flex-col h-full overflow-y-auto pt-20 pb-6 px-4">
					<nav
						className="flex flex-col gap-2"
						aria-label="Navegación principal móvil"
					>
						{navigation.map((item) => (
							<Link
								key={item.href}
								href={item.href.startsWith("#") ? item.href : `#${item.href.replace("/", "")}`}
								onClick={handleNavClick}
								className="group flex items-center justify-between rounded-lg px-4 py-4 text-lg font-medium text-foreground hover:bg-accent transition-colors border-b border-border/40 last:border-0"
							>
								{item.label}
								<span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
									→
								</span>
							</Link>
						))}
					</nav>

					<div className="mt-auto pt-8">
						<Button
							variant="default"
							size="lg"
							className="w-full text-lg"
							onClick={handleMobileButtonClick}
						>
							<Link href={cta.href}>{cta.label}</Link>
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

export { Header };
