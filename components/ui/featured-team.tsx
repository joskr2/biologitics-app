"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { SectionContent } from "@/components/ui/section-content";
import { cn } from "@/lib/utils";
import siteContent from "@/config/site-content.json";
import type { FeaturedTeamContent, TeamMember } from "@/config/site-content";

const defaultData = siteContent.featuredTeam;

interface FeaturedTeamProps {
	data?: FeaturedTeamContent;
}

function TeamCard({ member }: Readonly<{ member: TeamMember }>) {
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
				<Link href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
					<MailIcon className="size-4" />
					<span className="truncate">{member.email}</span>
				</Link>
				<Link href={`tel:${member.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
					<PhoneIcon className="size-4" />
					<span>{member.phone}</span>
				</Link>
			</div>
		</div>
	);
}

function AutoScrollCarousel({ items }: { items: TeamMember[] }) {
	const apiRef = useRef<{ scrollNext: () => void } | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const handleInit = useCallback((api: { scrollNext: () => void } | undefined) => {
		if (api) apiRef.current = api;
	}, []);

	const startInterval = useCallback(() => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => apiRef.current?.scrollNext(), 4000);
	}, []);

	const stopInterval = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	useEffect(() => {
		startInterval();
		return () => stopInterval();
	}, [startInterval, stopInterval]);

	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">No hay miembros del equipo disponibles.</p>
			</div>
		);
	}

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
							: items.length <= 4
								? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
								: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
				)}
			>
				{items.map((member) => (
					<TeamCard key={member.id} member={member} />
				))}
			</div>
		);
	}

	return (
		<div className="relative" onMouseEnter={stopInterval} onMouseLeave={startInterval}>
			<Carousel opts={{ loop: true, align: "start", watchSlides: false }} setApi={handleInit}>
				<CarouselContent className="-ml-4">
					{items.map((member) => (
						<CarouselItem key={member.id} className="pl-4 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/5">
							<TeamCard member={member} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
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
		<SectionContent id="equipo" title={propTitle ?? title} subtitle={propSubtitle ?? subtitle} background="background">
			<AutoScrollCarousel items={items} />
		</SectionContent>
	);
}
