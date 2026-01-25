"use client";

import Image from "next/image";
import { MailIcon, PhoneIcon } from "lucide-react";

import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { SectionContent } from "@/components/ui/section-content";
import siteContent from "@/config/site-content.json";
import Link from "next/link";
import type { FeaturedTeamContent } from "@/config/site-content";

const defaultData = siteContent.featuredTeam;

interface FeaturedTeamProps {
	data?: FeaturedTeamContent;
}

function TeamCard({
	member,
}: Readonly<{
	member: (typeof defaultData.items)[0];
}>) {
	return (
		<div className="group flex flex-col items-center p-6 bg-card rounded-xl border transition-all hover:shadow-md">
			<div className="relative h-32 w-32 mb-4">
				<Image
					src={member.photo}
					alt={`Foto de ${member.name}`}
					fill
					sizes="(max-width: 768px) 50vw, 20vw"
					className="object-cover rounded-full ring-4 ring-muted/30 group-hover:ring-primary/20 transition-all"
				/>
			</div>
			<h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
			<p className="text-sm text-primary font-medium mb-4">{member.role}</p>
			<div className="flex flex-col gap-2 w-full mt-auto">
				<Link
					href={`mailto:${member.email}`}
					className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<MailIcon className="size-4" />
					<span className="truncate">{member.email}</span>
				</Link>
				<Link
					href={`tel:${member.phone}`}
					className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
				>
					<PhoneIcon className="size-4" />
					<span>{member.phone}</span>
				</Link>
			</div>
		</div>
	);
}

function FeaturedTeamCarousel({ items }: { items: (typeof defaultData.items) }) {
	const plugin = Autoplay({ delay: 7000, stopOnInteraction: false });

	return (
		<div className="relative">
			<Carousel
				plugins={[plugin]}
				opts={{ loop: true }}
				className="w-full"
			>
				<CarouselContent className="-ml-4">
					{items.map((member) => (
						<CarouselItem
							key={member.id}
							className="pl-4 basis-full sm:basis-1/2"
						>
							<TeamCard member={member} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

function FeaturedTeamGrid({ items }: { items: (typeof defaultData.items) }) {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			{items.map((member) => (
				<TeamCard key={member.id} member={member} />
			))}
		</div>
	);
}

export function FeaturedTeam({
	data,
	title: propTitle,
	subtitle: propSubtitle,
}: FeaturedTeamProps & {
	title?: string;
	subtitle?: string;
} = {}) {
	const { items, title, subtitle } = { ...defaultData, ...data };

	return (
		<SectionContent
			id="equipo"
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			background="background"
		>
			{/* Featured Team Carousel (Mobile/Tablet) */}
			<div className="block lg:hidden">
				<FeaturedTeamCarousel items={items} />
			</div>

			{/* Featured Team Grid (Desktop) */}
			<div className="hidden lg:block">
				<FeaturedTeamGrid items={items} />
			</div>
		</SectionContent>
	);
}
