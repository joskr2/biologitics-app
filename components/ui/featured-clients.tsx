"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SectionContent } from "@/components/ui/section-content";
import { cn } from "@/lib/utils";
import siteContent from "@/config/site-content.json";

const { items, title, subtitle, buttonText, buttonHref } = siteContent.featuredClients;

function ClientCard({
	client,
}: Readonly<{
	client: typeof items[0];
}>) {
	return (
		<div className="group flex flex-col items-center justify-center p-6 bg-card rounded-xl border transition-all hover:shadow-md">
			<div className="relative h-16 w-full max-w-40 mb-3">
				<Image
					src={client.logo}
					alt={`Logo de ${client.name}`}
					fill
					className="object-contain grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
				/>
			</div>
			<span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-muted/30 rounded-full">
				{client.type}
			</span>
		</div>
	);
}

export function FeaturedClients({
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
		<SectionContent
			id="clientes"
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			background="muted/30"
		>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
				{items.map((client) => (
					<ClientCard key={client.id} client={client} />
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
