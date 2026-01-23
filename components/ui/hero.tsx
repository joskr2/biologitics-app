"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	useCarousel,
} from "@/components/ui/carousel";
import Image from "next/image";

type SlideLayout = "left" | "center" | "right";

interface HeroSlide {
	image: string;
	imageAlt: string;
	title: string;
	highlight: string;
	description: string;
	layout: SlideLayout;
	ctaPrimary: { text: string; href: string };
	ctaSecondary?: { text: string; href: string };
}

interface SocialProofItem {
	value: string;
	label: string;
}

const heroSlides: HeroSlide[] = [
	{
		image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f138?q=80&w=2070&auto=format&fit=crop",
		imageAlt: "Laboratorio científico moderno",
		title: "Equipamiento de Laboratorio",
		highlight: "de Alta Precisión",
		description:
			"Proveedores oficiales de microscopios, centrífugas y equipos de análisis para laboratorios de investigación, educación y producción.",
		layout: "left",
		ctaPrimary: { text: "Ver Catálogo", href: "#productos" },
		ctaSecondary: { text: "Contáctanos", href: "#contacto" },
	},
	{
		image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop",
		imageAlt: "Equipo médico científico",
		title: "Soluciones Integrales para",
		highlight: "Laboratorios",
		description:
			"Importación y distribución de equipos científicos de las marcas más reconocidas a nivel mundial.",
		layout: "center",
		ctaPrimary: { text: "Solicitar Cotización", href: "#contacto" },
	},
	{
		image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2070&auto=format&fit=crop",
		imageAlt: "Investigación científica",
		title: "Tecnología de Punta para",
		highlight: "Investigación",
		description:
			"Apoyamos el avance científico proporcionando equipos confiables y soporte técnico especializado.",
		layout: "right",
		ctaPrimary: { text: "Explorar Productos", href: "#productos" },
		ctaSecondary: { text: "Nuestro Proceso", href: "#proceso" },
	},
];

const socialProof: SocialProofItem[] = [
	{ value: "500+", label: "Clientes satisfechos" },
	{ value: "15+", label: "Años de experiencia" },
	{ value: "50+", label: "Marcas representadas" },
	{ value: "24/7", label: "Soporte técnico" },
];

const overlayStyles: Record<SlideLayout, string> = {
	left: "bg-gradient-to-r from-black/85 via-black/60 to-black/30 md:from-black/80 md:via-black/50 md:to-black/15",
	center: "bg-gradient-to-b from-black/40 via-black/70 to-black/50 md:bg-gradient-to-b md:from-black/40 md:via-black/60 md:to-black/50",
	right: "bg-gradient-to-l from-black/85 via-black/60 to-black/30 md:from-black/80 md:via-black/50 md:to-black/15",
};

function HeroSlideContent({ slide }: Readonly<{ slide: HeroSlide }>) {
	return (
		<div className="relative h-[85vh] min-h-125 max-h-200 flex items-center">
			{/* Background Image */}
			<div className="absolute inset-0 z-0">
				<Image
					src={slide.image}
					alt={slide.imageAlt}
					fill
					sizes="100vw"
					className="object-cover"
					priority
				/>
				<div className={`absolute inset-0 ${overlayStyles[slide.layout]}`} />
			</div>

			{/* Content */}
			<div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-16 pb-24 max-w-7xl mx-auto">
				<div
					className={`
						flex flex-col gap-5 text-white text-center
						${slide.layout === "left" ? "md:text-left md:items-start" : ""}
						${slide.layout === "center" ? "md:text-center md:items-center" : ""}
						${slide.layout === "right" ? "md:text-right md:items-end" : ""}
					`}
				>
					<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl/tight font-bold tracking-tight text-white drop-shadow-lg">
						{slide.title}{" "}
						<span className="text-primary-foreground">{slide.highlight}</span>
					</h1>
					<p className="text-base sm:text-lg md:text-xl/relaxed max-w-2xl text-white/90 drop-shadow-md">
						{slide.description}
					</p>
					<div
						className={`
							flex flex-col sm:flex-row gap-3 mt-2
							${slide.layout === "left" ? "md:justify-start" : ""}
							${slide.layout === "center" ? "md:justify-center" : ""}
							${slide.layout === "right" ? "md:justify-end" : ""}
						`}
					>
						<Button
							variant="default"
							size="lg"
							className="shadow-lg hover:shadow-xl transition-shadow"
						>
							<a href={slide.ctaPrimary.href}>{slide.ctaPrimary.text}</a>
						</Button>
						{slide.ctaSecondary && (
							<Button
								variant="outline"
								size="lg"
								className="border-white/50 bg-white/10 text-white hover:bg-white/20"
							>
								<a href={slide.ctaSecondary.href}>{slide.ctaSecondary.text}</a>
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

function HeroIndicators() {
	const { api } = useCarousel();
	const [selectedIndex, setSelectedIndex] = useState(0);

	useEffect(() => {
		if (!api) return;

		const onSelect = () => {
			setSelectedIndex(api.selectedScrollSnap());
		};

		api.on("select", onSelect);
		onSelect();

		return () => {
			api.off("select", onSelect);
		};
	}, [api]);

	return (
		<div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
			{heroSlides.map((_, index) => (
				<button
					key={index}
					type="button"
					className={`w-3 h-3 rounded-full border-2 border-white/60 transition-all ${
						index === selectedIndex
							? "bg-white scale-125"
							: "bg-transparent hover:border-white"
					}`}
					aria-label={`Ir al slide ${index + 1}`}
					onClick={() => api?.scrollTo(index)}
				/>
			))}
		</div>
	);
}

function Hero() {
	return (
		<section id="hero" className="relative bg-background">
			<Carousel
				opts={{ loop: true }}
				className="h-full"
			>
				<CarouselContent className="h-full ml-0">
					{heroSlides.map((slide, index) => (
						<CarouselItem key={index} className="pl-0 h-full">
							<HeroSlideContent slide={slide} />
						</CarouselItem>
					))}
				</CarouselContent>
				<HeroIndicators />
			</Carousel>

			{/* Social Proof Stats */}
			<div className="bg-muted/50 border-t py-6 sm:py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{socialProof.map((item, index) => (
							<div
								key={index}
								className="text-center px-4 py-3 rounded-lg bg-background/50 sm:bg-transparent"
							>
								<div className="text-2xl sm:text-3xl font-bold text-primary">{item.value}</div>
								<div className="text-xs sm:text-sm text-muted-foreground">{item.label}</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export { Hero };
