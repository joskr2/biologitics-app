"use client";

import Image from "next/image";
import Link from "next/link";

import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { SectionContent } from "@/components/ui/section-content";
import siteContent from "@/config/site-content.json";
import type { FeaturedClientsContent } from "@/config/site-content";

const defaultData = siteContent.featuredClients;

interface FeaturedClientsProps {
	data?: FeaturedClientsContent;
}

function ClientCard({
	client,
}: Readonly<{
	client: (typeof defaultData.items)[0];
}>) {
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

function FeaturedClientsCarousel({ items }: { items: (typeof defaultData.items) }) {
	const plugin = Autoplay({ delay: 7000, stopOnInteraction: false });

	return (
		<div className="relative">
			<Carousel
				plugins={[plugin]}
				opts={{ loop: true }}
				className="w-full"
			>
				<CarouselContent className="-ml-2">
					{items.map((client) => (
						<CarouselItem
							key={client.id}
							className="pl-2 basis-1/2 md:basis-1/3"
						>
							<ClientCard client={client} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

function FeaturedClientsGrid({ items }: { items: (typeof defaultData.items) }) {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
			{items.map((client) => (
				<ClientCard key={client.id} client={client} />
			))}
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
	const { items, title, subtitle, buttonText, buttonHref } = {
		...defaultData,
		...data,
	};

	return (
		<SectionContent
			id="clientes"
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			background="muted/30"
		>
			{/* Featured Clients Carousel (Mobile/Tablet) */}
			<div className="block lg:hidden">
				<FeaturedClientsCarousel items={items} />
			</div>

			{/* Featured Clients Grid (Desktop) */}
			<div className="hidden lg:block">
				<FeaturedClientsGrid items={items} />
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
