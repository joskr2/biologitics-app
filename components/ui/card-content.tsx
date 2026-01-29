"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export interface CardListItem {
	label: string;
	secondary?: string;
}

export interface CardContentProps {
	image: string;
	imageAlt: string;
	title: string;
	description: string;
	items?: CardListItem[];
	buttonText?: string;
	buttonHref?: string;
	imageType?: "logo" | "photo";
	onAction?: () => void;
}

export function CardContent({
	image,
	imageAlt,
	title,
	description,
	items,
	buttonText = "Saber más",
	buttonHref,
	imageType = "logo",
	onAction,
}: Readonly<CardContentProps>) {
	const handleAction = () => {
		if (onAction) {
			onAction();
		}
	};

	const imageClassName =
		imageType === "logo"
			? "object-contain grayscale transition-all duration-500 group-hover:grayscale-0"
			: "object-cover transition-transform duration-300 hover:scale-105";

	return (
		<div className="group relative h-full overflow-hidden rounded-2xl border bg-card transition-all hover:shadow-lg">
			<div className="flex h-full flex-col">
				<div
					className={`relative shrink-0 ${
						imageType === "logo" ? "h-32 items-center justify-center bg-muted/30 p-8" : "aspect-16/10 overflow-hidden bg-muted"
					}`}
				>
					<div
						className={`relative ${
							imageType === "logo" ? "h-16 w-40" : "h-full w-full"
						}`}
					>
						<Image src={image} alt={imageAlt} fill sizes="(max-width: 768px) 50vw, 20vw" className={imageClassName} />
					</div>
					<div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50 transform scale-x-0 transition-transform duration-500 group-hover:scale-x-100" />
				</div>

				<div className="flex flex-1 flex-col p-6">
					<h3 className="text-xl font-bold text-card-foreground mb-2">{title}</h3>
					<p className="text-sm text-muted-foreground mb-4 flex-1">{description}</p>

					{items && items.length > 0 && (
						<div className="mb-6">
							<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
								{imageType === "logo" ? "Productos Destacados" : "Características"}
							</p>
							<div className="space-y-2">
								{items.map((item, index) => (
									<div key={`item-${index}-${item.label}`} className="flex items-center gap-2 text-sm">
										<span className="size-1.5 rounded-full bg-primary shrink-0" />
										<span className="text-foreground font-medium">{item.label}</span>
										{item.secondary && (
											<span className="text-muted-foreground text-xs">- {item.secondary}</span>
										)}
									</div>
								))}
							</div>
						</div>
					)}

					{buttonHref ? (
						<Button variant="outline" size="sm" className="w-full">
							<Link href={buttonHref}>{buttonText}</Link>
						</Button>
					) : (
						<Button variant="outline" size="sm" className="w-full gap-2" onClick={handleAction}>
							{buttonText}
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
