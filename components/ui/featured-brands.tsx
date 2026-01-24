"use client";

import Link from "next/link";

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
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{items.map((brand) => (
					<BrandCard key={brand.id} brand={brand} />
				))}
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
