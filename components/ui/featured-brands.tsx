"use client";

import Image from "next/image";

import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";
import { RevealScale } from "@/components/ui/animated-section";
import { MobileCarousel } from "@/components/ui/mobile-carousel";
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
				imageType="logo"
			/>
		</div>
	);
}

function BrandCardMobile({
	brand,
}: Readonly<{
	brand: BrandItem;
}>) {
	return (
		<div className="flex items-center justify-center p-4 bg-card rounded-xl border h-24">
			<div className="relative h-12 w-full max-w-32">
				<Image
					src={brand.logo}
					alt={`Logo de ${brand.name}`}
					fill
					sizes="(max-width: 640px) 50vw, 100vw"
					className="object-contain grayscale opacity-70"
				/>
			</div>
		</div>
	);
}

export function FeaturedBrands({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	sectionId = "marcas",
	animationDelay = 0,
}: FeaturedBrandsProps & {
	title?: string;
	subtitle?: string;
	sectionId?: string;
	animationDelay?: number;
} = {}) {
	const merged = { ...defaultData, ...data } as {
		items: BrandItem[];
		title: string;
		subtitle: string;
	};
	const { items, title, subtitle } = merged;

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
					renderItem={(item) => <BrandCardMobile brand={item as BrandItem} />}
					slidesPerView={2}
					gap={8}
					showNavigation={false}
				/>
			</div>

			{/* Desktop: Grid */}
			<div className="hidden lg:block">
				{items.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">No hay marcas disponibles.</p>
					</div>
				) : (
					<div
						className={cn(
							"grid gap-4",
							items.length === 1
								? "max-w-md mx-auto"
								: items.length === 2
									? "grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto"
									: items.length <= 4
										? "grid-cols-2 lg:grid-cols-4"
										: "grid-cols-3 lg:grid-cols-5",
						)}
					>
						{items.map((brand) => (
							<RevealScale key={brand.id} scale={0.92}>
								<BrandCard brand={brand} />
							</RevealScale>
						))}
					</div>
				)}
			</div>
		</SectionContent>
	);
}
