"use client";

import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";
import siteContent from "@/config/site-content.json";
import type { FeaturedProductsContent } from "@/config/site-content";

const defaultData = siteContent.featuredProducts;

interface FeaturedProductsProps {
	data?: FeaturedProductsContent;
}

function ProductCard({
	product,
}: Readonly<{
	product: (typeof defaultData.items)[0];
}>) {
	const itemsList: CardListItem[] = product.features.map((feature) => ({
		label: feature,
	}));

	return (
		<div className="h-full">
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

function FeaturedProductsCarousel({ items }: { items: (typeof defaultData.items) }) {
	return (
		<div className="relative">
			<Carousel
				opts={{
					loop: true,
					align: "start",
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-4">
					{items.map((product) => (
						<CarouselItem
							key={product.id}
							className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
						>
							<ProductCard product={product} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

function FeaturedProductsGrid({ items }: { items: (typeof defaultData.items) }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
			{items.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
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
			{/* Featured Products Carousel (Mobile/Tablet) */}
			<div className="block lg:hidden">
				<FeaturedProductsCarousel items={items} />
			</div>

			{/* Featured Products Grid (Desktop) */}
			<div className="hidden lg:block">
				<FeaturedProductsGrid items={items} />
			</div>

			{/* Footer with Link */}
			<div className="mt-10 text-center">
				<Button variant="default" size="lg">
					<Link href={propButtonHref ?? buttonHref}>
						{propButtonText ?? buttonText}
					</Link>
				</Button>
			</div>
		</SectionContent>
	);
}
