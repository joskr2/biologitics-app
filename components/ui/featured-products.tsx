"use client";

import { useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { motion } from "motion/react";

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
import type { FeaturedProductsContent, ProductItem } from "@/config/site-content";

const defaultData = siteContent.featuredProducts;

interface FeaturedProductsProps {
	data?: FeaturedProductsContent;
}

function ProductCard({
	product,
	className,
}: Readonly<{
	product: ProductItem;
	className?: string;
}>) {
	const itemsList: CardListItem[] = product.features.map((feature) => ({
		label: feature,
	}));

	return (
		<div className={cn("h-full", className)}>
			<CardContent
				image={product.image}
				imageAlt={product.title}
				title={product.title}
				description={product.description}
				items={itemsList}
				buttonText="Obtener más información"
				buttonHref={`/productos/${product.id}`}
				imageType="photo"
			/>
		</div>
	);
}

function FeaturedProductsCarousel({
	items,
}: {
	items: ProductItem[];
}) {
	// Si no hay productos, mostrar mensaje
	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">
					No hay productos disponibles en este momento.
				</p>
			</div>
		);
	}

	// Si hay 5 o menos, mostrar grid, si hay más de 5, carousel
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
				{items.map((product, index) => (
					<motion.div
						key={product.id}
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className={items.length <= 4 ? "xl:flex xl:flex-col" : ""}
					>
						<ProductCard product={product} />
					</motion.div>
				))}
			</div>
		);
	}

	// Más de 5 productos: carousel con auto-scroll lento (4 segundos por slide)
	return <AutoScrollCarousel items={items} />;
}

function AutoScrollCarousel({ items }: { items: ProductItem[] }) {
	const apiRef = useRef<{
		scrollNext: () => void;
	} | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleInit = useCallback((api: { scrollNext: () => void } | undefined) => {
		if (api) {
			apiRef.current = api;
		}
	}, []);

	const startInterval = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
		intervalRef.current = setInterval(() => {
			apiRef.current?.scrollNext();
		}, 4000);
	}, []);

	const stopInterval = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		startInterval();

		return () => {
			stopInterval();
		};
	}, [startInterval, stopInterval]);

	return (
		<div
			className="relative"
			onMouseEnter={stopInterval}
			onMouseLeave={startInterval}
		>
			<Carousel
				opts={{
					loop: true,
					align: "start",
					watchSlides: false,
				}}
				className="w-full"
				setApi={handleInit}
			>
				<CarouselContent className="-ml-4">
					{items.map((product) => (
						<CarouselItem
							key={product.id}
							className="pl-4 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5"
						>
							<ProductCard product={product} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

export function FeaturedProducts({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	buttonText: propButtonText,
	buttonHref: propButtonHref,
}: FeaturedProductsProps & {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
} = {}) {
	const { items, title, subtitle, buttonText, buttonHref } = {
		...defaultData,
		...data,
	};

	return (
		<SectionContent
			id="productos"
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
		>
			{/* Products display - carousel for >5 items, grid for <=5 */}
			<FeaturedProductsCarousel items={items} />
			{/* Footer with Link */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.5, delay: 0.3 }}
				className="mt-10 text-center"
			>
				<Button variant="default" size="lg">
					<Link href={propButtonHref ?? buttonHref}>
						{propButtonText ?? buttonText}
					</Link>
				</Button>
			</motion.div>
		</SectionContent>
	);
}
