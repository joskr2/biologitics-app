"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	useCarousel,
} from "@/components/ui/carousel";
import Image from "next/image";
import siteContent from "@/config/site-content.json";
import type { HeroContent, HeroSlide } from "@/config/site-content";

const defaultData = siteContent.hero as HeroContent;

interface HeroProps {
	data?: HeroContent;
}

function HeroSlideContent({
	slide,
	cta,
	secondaryCta,
}: {
	slide: HeroSlide;
	cta: HeroSlide["cta"];
	secondaryCta?: HeroSlide["secondaryCta"];
}) {
	return (
		<div className="relative h-[85vh] min-h-125 max-h-200 flex items-center">
			<div className="absolute inset-0 z-0">
				{slide.type === "video" ? (
					<video
						src={slide.src}
						poster={slide.poster}
						preload="none"
						autoPlay
						loop
						muted
						playsInline
						className="w-full h-full object-cover"
					/>
				) : (
					<Image
						src={slide.src}
						alt={slide.title}
						fill
						priority
						sizes="100vw"
						className="object-cover"
					/>
				)}
				<div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-black/30 md:from-black/80 md:via-black/50 md:to-black/15" />
			</div>

			<div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 pt-16 pb-24 max-w-7xl mx-auto">
				<div className="flex flex-col gap-5 text-white text-center md:text-left md:items-start">
					<motion.h2
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl/tight font-bold tracking-tight text-white drop-shadow-lg"
					>
						{slide.title}
					</motion.h2>
					<motion.p
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
						className="text-base sm:text-lg md:text-xl/relaxed max-w-2xl text-white/90 drop-shadow-md"
					>
						{slide.subtitle}
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
						className="flex flex-col sm:flex-row gap-3 mt-2 md:justify-start"
					>
						<Link href={cta.href}>
							<Button
								variant="default"
								size="lg"
								className="shadow-lg hover:shadow-xl transition-shadow"
							>
								{cta.label}
							</Button>
						</Link>
						{secondaryCta && (
							<Link href={secondaryCta.href}>
								<Button
									variant="outline"
									size="lg"
									className="border-white/50 bg-white/10 text-white hover:bg-white/20"
								>
									{secondaryCta.label}
								</Button>
							</Link>
						)}
					</motion.div>
				</div>
			</div>
		</div>
	);
}

function HeroIndicators({ slides }: { slides: (typeof defaultData.slides)[0][] }) {
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
			{slides.map((slide, index) => (
				<button
					key={slide.id}
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

function Hero({ data }: HeroProps) {
	const { slides, socialProof } = { ...defaultData, ...data };

	return (
		<section id="hero" className="relative bg-background">
			<Carousel
				opts={{ loop: true }}
				className="h-full"
			>
				<CarouselContent className="h-full ml-0">
					{slides.map((slide) => (
						<CarouselItem key={slide.id} className="pl-0 h-full">
							<HeroSlideContent
								slide={slide}
								cta={slide.cta}
								secondaryCta={slide.secondaryCta}
							/>
						</CarouselItem>
					))}
				</CarouselContent>
				<HeroIndicators slides={slides} />
			</Carousel>

			{/* Social Proof Stats */}
			<div className="bg-muted/50 border-t py-6 sm:py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<h2 className="sr-only">Nuestra Trayectoria</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						{socialProof.map((item, index) => (
							<motion.div
								key={`${item.label}-${index}`}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="text-center px-4 py-3 rounded-lg bg-background/50 sm:bg-transparent"
							>
								<div className="text-2xl sm:text-3xl font-bold text-primary">
									{item.value}
								</div>
								<div className="text-xs sm:text-sm text-muted-foreground">
									{item.label}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export { Hero };
