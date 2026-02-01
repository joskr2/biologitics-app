"use client";

import { useCallback } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import siteContent from "@/config/site-content.json";
import type { FeaturedClientsContent, ClientItem } from "@/config/site-content";

import { SectionContent } from "@/components/ui/section-content";
import { MobileCarousel } from "@/components/ui/mobile-carousel";

const defaultData = siteContent.featuredClients;

interface FeaturedClientsProps {
	data?: FeaturedClientsContent;
}

function ClientCardMobile({ client }: Readonly<{ client: ClientItem }>) {
	return (
		<div className="flex flex-col items-center justify-center p-4 bg-card rounded-xl border h-24">
			<div className="relative h-10 w-full max-w-32">
				<Image
					src={client.logo}
					alt={`Logo de ${client.name}`}
					fill
					sizes="(max-width: 640px) 50vw, 100vw"
					className="object-contain grayscale opacity-70"
				/>
			</div>
		</div>
	);
}

function ClientCardDesktop({ client }: Readonly<{ client: ClientItem }>) {
	return (
		<div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border transition-all hover:shadow-md h-full">
			<div className="relative h-16 w-full max-w-40 mb-3">
				<Image
					src={client.logo}
					alt={`Logo de ${client.name}`}
					fill
					sizes="(max-width: 1024px) 20vw, 15vw"
					className="object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
				/>
			</div>
			<span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/30 rounded-full">
				{client.type}
			</span>
		</div>
	);
}

function DesktopCarousel({
	items,
}: Readonly<{ items: ClientItem[] }>) {
	const [emblaRef, api] = useEmblaCarousel({
		loop: true,
		align: "start",
		slidesToScroll: 1,
	});

	const scrollPrev = useCallback(() => {
		api?.scrollPrev();
	}, [api]);

	const scrollNext = useCallback(() => {
		api?.scrollNext();
	}, [api]);

	return (
		<div className="relative">
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex" style={{ gap: "16px", marginLeft: "-16px" }}>
					{items.map((client) => (
						<div
							key={client.id}
							className="min-w-0 shrink-0 grow-0 basis-1/5 pl-4"
							style={{ flexBasis: "20%" }}
						>
							<ClientCardDesktop client={client} />
						</div>
					))}
				</div>
			</div>

			{/* Navigation buttons */}
			<button
				onClick={scrollPrev}
				className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
				aria-label="Anterior"
			>
				<ChevronLeft className="w-5 h-5" />
			</button>
			<button
				onClick={scrollNext}
				className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors z-10"
				aria-label="Siguiente"
			>
				<ChevronRight className="w-5 h-5" />
			</button>
		</div>
	);
}

export function FeaturedClients({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	sectionId = "clientes",
	animationDelay = 0,
}: FeaturedClientsProps & {
	title?: string;
	subtitle?: string;
	sectionId?: string;
	animationDelay?: number;
} = {}) {
	const { items, title, subtitle } = { ...defaultData, ...data };

	return (
		<SectionContent
			id={sectionId}
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			background="muted/30"
			animationDelay={animationDelay}
		>
			{/* Mobile: Carousel */}
			<div className="lg:hidden">
				<MobileCarousel
					items={items}
					renderItem={(item) => <ClientCardMobile client={item as ClientItem} />}
					slidesPerView={2}
					gap={8}
					showNavigation={false}
				/>
			</div>

			{/* Desktop: Carousel or Grid */}
			<div className="hidden lg:block">
				{items.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">No hay clientes disponibles.</p>
					</div>
				) : items.length > 5 ? (
					<DesktopCarousel items={items} />
				) : (
					<div
						className={cn(
							"grid gap-4",
							items.length === 1
								? "max-w-md mx-auto"
								: items.length === 2
									? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
									: "grid-cols-2 lg:grid-cols-5",
						)}
					>
						{items.map((client) => (
							<ClientCardDesktop key={client.id} client={client} />
						))}
					</div>
				)}
			</div>
		</SectionContent>
	);
}
