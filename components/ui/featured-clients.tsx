"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { SectionContent } from "@/components/ui/section-content";
import { cn } from "@/lib/utils";
import siteContent from "@/config/site-content.json";
import type { FeaturedClientsContent, ClientItem } from "@/config/site-content";

const defaultData = siteContent.featuredClients;

interface FeaturedClientsProps {
	data?: FeaturedClientsContent;
}

function ClientCard({ client }: Readonly<{ client: ClientItem }>) {
	return (
		<div className="group flex flex-col items-center justify-center p-6 bg-card rounded-xl border transition-all hover:shadow-md">
			<div className="relative h-16 w-full max-w-40 mb-3">
				<Image
					src={client.logo}
					alt={`Logo de ${client.name}`}
					fill
					sizes="(max-width: 768px) 50vw, 20vw"
					className="object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
				/>
			</div>
			<span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/30 rounded-full">
				{client.type}
			</span>
		</div>
	);
}

function AutoScrollCarousel({ items }: { items: ClientItem[] }) {
	const apiRef = useRef<{ scrollNext: () => void } | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleInit = useCallback((api: { scrollNext: () => void } | undefined) => {
		if (api) apiRef.current = api;
	}, []);

	const startInterval = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => apiRef.current?.scrollNext(), 4000);
	}, []);

	const stopInterval = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		startInterval();
		return () => stopInterval();
	}, [startInterval, stopInterval]);

	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">No hay clientes disponibles.</p>
			</div>
		);
	}

	const showAsGrid = items.length <= 5;

	if (showAsGrid) {
		return (
			<div
				className={cn(
					"grid gap-4",
					items.length === 1
						? "max-w-md mx-auto"
						: items.length === 2
							? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
							: items.length <= 4
								? "grid-cols-2 lg:grid-cols-4"
								: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
				)}
			>
				{items.map((client, index) => (
					<motion.div
						key={client.id}
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: index * 0.08 }}
					>
						<ClientCard client={client} />
					</motion.div>
				))}
			</div>
		);
	}

	return (
		<div className="relative" onMouseEnter={stopInterval} onMouseLeave={startInterval}>
			<Carousel opts={{ loop: true, align: "start", watchSlides: false }} setApi={handleInit}>
				<CarouselContent className="-ml-2">
					{items.map((client) => (
						<CarouselItem key={client.id} className="pl-2 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
							<ClientCard client={client} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

export function FeaturedClients({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	buttonText: propButtonText,
	buttonHref: propButtonHref,
}: FeaturedClientsProps & {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
} = {}) {
	const { items, title, subtitle, buttonText, buttonHref } = { ...defaultData, ...data };

	return (
		<SectionContent id="clientes" title={propTitle ?? title} subtitle={propSubtitle ?? subtitle} background="muted/30">
			<AutoScrollCarousel items={items} />
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="mt-10 text-center"
			>
				<Button variant="default" size="lg">
					<Link href={propButtonHref ?? buttonHref}>{propButtonText ?? buttonText}</Link>
				</Button>
			</motion.div>
		</SectionContent>
	);
}
