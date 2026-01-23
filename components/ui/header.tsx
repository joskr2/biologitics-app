"use client";

import { MenuIcon, MoonIcon, SunIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
	{ href: "#productos", label: "Productos", title: "Ver catálogo de equipos" },
	{ href: "#proceso", label: "Proceso", title: "Nuestro proceso de compra" },
	{ href: "#equipo", label: "Equipo", title: "Nuestro equipo" },
	{ href: "#testimonios", label: "Testimonios", title: "Testimonios de clientes" },
	{ href: "#faq", label: "FAQ", title: "Preguntas frecuentes" },
	{ href: "#contacto", label: "Contacto", title: "Contactar" },
];

function Header({ className }: React.ComponentProps<"header">) {
	const { theme, setTheme } = useTheme();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isDark = theme === "dark";

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const handleNavClick = () => {
		setIsMobileMenuOpen(false);
	};


	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isMobileMenuOpen) {
				setIsMobileMenuOpen(false);
			}
		};
		globalThis.addEventListener("keydown", handleKeyDown);
		return () => globalThis.removeEventListener("keydown", handleKeyDown);
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
					className,
				)}
			>
				<div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
						<Link
							href="/"
							className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary rounded-lg"
						>
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
								B
							</div>
							<div className="hidden sm:flex flex-col">
								<span className="font-semibold text-sm">Biologistics</span>
								<span className="text-xs text-muted-foreground">
									Venta de Equipos Científicos
								</span>
							</div>
						</Link>

						<nav
							className="hidden md:flex items-center gap-6"
							aria-label="Navegación principal"
						>
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary relative pb-1 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:scale-x-0 after:transition-transform hover:after:scale-x-100"
									title={item.title}
								>
									{item.label}
								</Link>
							))}
						</nav>

						<div className="flex items-center gap-2">
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
								onClick={toggleMobileMenu}
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
									<Link href="#contacto">Solicitar Cotización</Link>
								</Button>
							</div>
						</div>
					</div>
				</header>

			<dialog
				id="mobile-menu"
				className={cn(
					"fixed inset-x-0 top-16 bottom-0 z-40 bg-background md:hidden",
					"transform transition-transform duration-300 ease-in-out",
					isMobileMenuOpen ? "translate-x-0" : "translate-x-full",
				)}
				aria-modal="true"
				aria-label="Menú de navegación"
				aria-hidden={!isMobileMenuOpen}
			>
				<nav
					className="flex flex-col gap-1 p-4"
					aria-label="Navegación principal móvil"
				>
					{navItems.map((item) => (
						<a
							key={item.href}
							href={item.href}
							className="rounded-lg px-4 py-3 text-lg font-medium text-foreground transition-colors hover:bg-accent hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
							title={item.title}
							onClick={handleNavClick}
						>
							{item.label}
						</a>
					))}
				</nav>
				<div className="border-t p-4">
					<Button variant="default" className="w-full">
						<Link href="#contacto" onClick={handleNavClick}>
							Solicitar Cotización
						</Link>
					</Button>
				</div>
			</dialog>

			{isMobileMenuOpen && (
				<div
					className="fixed inset-0 top-16 z-30 bg-black/50 md:hidden"
					onClick={handleNavClick}
					aria-hidden="true"
				/>
			)}
		</>
	);
}

export { Header };
