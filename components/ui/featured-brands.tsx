"use client";

import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";
import { cn } from "@/lib/utils";
import siteContent from "@/config/site-content.json";
import type { FeaturedBrandsContent, BrandItem } from "@/config/site-content";

const defaultData = siteContent.featuredBrands;

interface FeaturedBrandsProps {
	data?: FeaturedBrandsContent;
}

type BrandCardProps = Readonly<{
	brand: BrandItem;
	className?: string;
}>;

function BrandCard({ brand, className }: BrandCardProps) {
	const itemsList: CardListItem[] = brand.bestSellers.map((product) => ({
		label: product.name,
		secondary: product.category ?? "",
	}));

	return (
		<div className={cn("h-full", className)}>
			<CardContent
				image={brand.logo}
				imageAlt={`Logo de ${brand.name}`}
				title={brand.name}
				description={brand.description}
				items={itemsList}
				buttonText="Saber más"
				buttonHref={brand.href}
				imageType="logo"
			/>
		</div>
	);
}

function AutoScrollCarousel({ items }: { items: BrandItem[] }) {
	const apiRef = useRef<{ scrollNext: () => void } | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleInit = useCallback((api: { scrollNext: () => void } | undefined) => {
		if (api) {
			apiRef.current = api;
		}
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
				<p className="text-muted-foreground">No hay marcas disponibles.</p>
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
							: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5",
				)}
			>
				{items.map((brand) => (
					<BrandCard key={brand.id} brand={brand} />
				))}
			</div>
		);
	}

	return (
		<div className="relative" onMouseEnter={stopInterval} onMouseLeave={startInterval}>
			<Carousel opts={{ loop: true, align: "start", watchSlides: false }} setApi={handleInit}>
				<CarouselContent className="-ml-4">
					{items.map((brand) => (
						<CarouselItem key={brand.id} className="pl-4 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
							<BrandCard brand={brand} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

export function FeaturedBrands({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	buttonText: propButtonText,
	buttonHref: propButtonHref,
}: FeaturedBrandsProps & {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
} = {}) {
	const merged = { ...defaultData, ...data } as {
		items: BrandItem[];
		title: string;
		subtitle: string;
		buttonText: string;
		buttonHref: string;
	};
	const { items, title, subtitle, buttonText, buttonHref } = merged;

	return (
		<SectionContent id="marcas" title={propTitle ?? title} subtitle={propSubtitle ?? subtitle} background="muted/30">
			<AutoScrollCarousel items={items} />
			<div className="mt-10 text-center">
				<Button variant="default" size="lg">
					<Link href={propButtonHref ?? buttonHref}>{propButtonText ?? buttonText}</Link>
				</Button>
			</div>
		</SectionContent>
	);
}
