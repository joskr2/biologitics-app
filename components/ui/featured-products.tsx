"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";
import { RevealScale } from "@/components/ui/animated-section";
import { MobileCarousel } from "@/components/ui/mobile-carousel";
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

function ProductCardMobile({
	product,
}: Readonly<{
	product: ProductItem;
}>) {
	return (
		<Link
			href={`/productos/${product.id}`}
			className="block h-full p-3 bg-card rounded-xl border hover:shadow-md transition-shadow"
		>
			<div className="relative h-40 w-full mb-3 rounded-lg overflow-hidden">
				<Image
					src={product.image}
					alt={product.title}
					fill
					sizes="(max-width: 640px) 50vw, 100vw"
					className="object-cover"
				/>
			</div>
			<h3 className="font-semibold text-sm text-center line-clamp-2">
				{product.title}
			</h3>
		</Link>
	);
}

export function FeaturedProducts({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	buttonText: propButtonText,
	buttonHref: propButtonHref,
	sectionId = "productos",
	animationDelay = 0,
}: FeaturedProductsProps & {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
	sectionId?: string;
	animationDelay?: number;
} = {}) {
	const { items, title, subtitle, buttonText, buttonHref } = {
		...defaultData,
		...data,
	};

	return (
		<SectionContent
			id={sectionId}
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			animationDelay={animationDelay}
		>
			{/* Mobile: Carousel with 2 items */}
			<div className="lg:hidden">
				<MobileCarousel
					items={items}
					renderItem={(item) => <ProductCardMobile product={item as ProductItem} />}
					slidesPerView={2}
					gap={8}
				/>
			</div>

			{/* Desktop: Grid */}
			<div className="hidden lg:block">
				{items.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">
							No hay productos disponibles en este momento.
						</p>
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
						{items.map((product) => (
							<RevealScale
								key={product.id}
								scale={0.92}
								className={items.length <= 4 ? "xl:flex xl:flex-col" : ""}
							>
								<ProductCard product={product} />
							</RevealScale>
						))}
					</div>
				)}
			</div>

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
