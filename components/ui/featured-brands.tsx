"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";
import siteContent from "@/config/site-content.json";

const { items, title, subtitle, buttonText, buttonHref } = siteContent.featuredBrands;

function BrandCard({
	brand,
}: Readonly<{
	brand: typeof items[0];
}>) {
	const itemsList: CardListItem[] = brand.bestSellers.map((product) => ({
		label: product.name,
		secondary: product.category,
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
	title: propTitle,
	subtitle: propSubtitle,
	buttonText: propButtonText,
	buttonHref: propButtonHref,
}: {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
} = {}) {
	return (
		<SectionContent id="marcas" title={propTitle ?? title} subtitle={propSubtitle ?? subtitle} background="muted/30">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{items.map((brand) => (
					<BrandCard key={brand.id} brand={brand} />
				))}
			</div>

			<div className="mt-10 text-center">
				<Button variant="default" size="lg">
					<Link href={propButtonHref ?? buttonHref}>{propButtonText ?? buttonText}</Link>
				</Button>
			</div>
		</SectionContent>
	);
}
