"use client";

import Image from "next/image";
import { MailIcon, PhoneIcon } from "lucide-react";
import Link from "next/link";

import { SectionContent } from "@/components/ui/section-content";
import { RevealScale } from "@/components/ui/animated-section";
import { MobileCarousel } from "@/components/ui/mobile-carousel";
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

function TeamCardMobile({ member }: Readonly<{ member: TeamMember }>) {
	return (
		<div className="flex flex-col items-center p-4 bg-card rounded-xl border h-full">
			<div className="relative h-20 w-20 mb-3">
				<Image
					src={member.photo}
					alt={`Foto de ${member.name}`}
					fill
					sizes="(max-width: 640px) 50vw, 100vw"
					className="object-cover rounded-full"
				/>
			</div>
			<h3 className="font-semibold text-sm text-center mb-1">{member.name}</h3>
			<p className="text-xs text-primary text-center mb-2">{member.role}</p>
		</div>
	);
}

export function FeaturedTeam({
	data,
	title: propTitle,
	subtitle: propSubtitle,
	sectionId = "equipo",
	animationDelay = 0,
}: FeaturedTeamProps & {
	title?: string;
	subtitle?: string;
	sectionId?: string;
	animationDelay?: number;
} = {}) {
	const { items, title, subtitle } = { ...defaultData, ...data };

	return (
		<SectionContent
			id={sectionId}
			title={propTitle ?? title}
			subtitle={propSubtitle ?? subtitle}
			background="background"
			animationDelay={animationDelay}
		>
			{/* Mobile: Carousel */}
			<div className="lg:hidden">
				<MobileCarousel
					items={items}
					renderItem={(item) => <TeamCardMobile member={item as TeamMember} />}
					slidesPerView={2}
					gap={8}
					showNavigation={false}
				/>
			</div>

			{/* Desktop: Grid */}
			<div className="hidden lg:block">
				{items.length === 0 ? (
					<div className="py-12 text-center">
						<p className="text-muted-foreground">No hay miembros del equipo disponibles.</p>
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
										: "grid-cols-2 lg:grid-cols-5",
						)}
					>
						{items.map((member) => (
							<RevealScale key={member.id} scale={0.92}>
								<TeamCard member={member} />
							</RevealScale>
						))}
					</div>
				)}
			</div>
		</SectionContent>
	);
}
