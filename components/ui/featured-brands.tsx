"use client";

import Link from "next/link";

import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";
import siteContent from "@/config/site-content.json";
import type { FeaturedBrandsContent } from "@/config/site-content";

const defaultData = siteContent.featuredBrands;

interface FeaturedBrandsProps {
	data?: FeaturedBrandsContent;
}

type BrandCardProps = Readonly<{
	brand: (typeof defaultData.items)[0];
}>;

function BrandCard({ brand }: BrandCardProps) {
	const itemsList: CardListItem[] = brand.bestSellers.map((product) => ({
		label: product.name,
		secondary: product.category ?? "",
	}));

	return (
		<div className="h-full">
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

function FeaturedBrandsCarousel({ items }: { items: (typeof defaultData.items) }) {
	const plugin = Autoplay({ delay: 7000, stopOnInteraction: false });

	return (
		<div className="relative">
			<Carousel
				plugins={[plugin]}
				opts={{ loop: true }}
				className="w-full"
			>
				<CarouselContent className="-ml-4">
					{items.map((brand) => (
						<CarouselItem
							key={brand.id}
							className="pl-4 basis-full sm:basis-1/2"
						>
							<BrandCard brand={brand} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

function FeaturedBrandsGrid({ items }: { items: (typeof defaultData.items) }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{items.map((brand) => (
				<BrandCard key={brand.id} brand={brand} />
			))}
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
		items: (typeof defaultData.items)[0][];
		title: string;
		subtitle: string;
		buttonText: string;
		buttonHref: string;
	};
	const { items, title, subtitle, buttonText, buttonHref } = merged;

	return (
		<SectionContent
			id="marcas"
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			background="muted/30"
		>
			{/* Featured Brands Carousel (Mobile/Tablet) */}
			<div className="block lg:hidden">
				<FeaturedBrandsCarousel items={items} />
			</div>

			{/* Featured Brands Grid (Desktop) */}
			<div className="hidden lg:block">
				<FeaturedBrandsGrid items={items} />
			</div>

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
