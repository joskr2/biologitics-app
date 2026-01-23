"use client";

import { ReactNode } from "react";

export interface SectionContentProps {
	id?: string;
	title: string;
	subtitle?: string;
	children: ReactNode;
	className?: string;
	background?: "background" | "muted/30";
}

export function SectionContent({
	id,
	title,
	subtitle,
	children,
	className = "",
	background = "background",
}: Readonly<SectionContentProps>) {
	return (
		<section
			id={id}
			className={`py-12 sm:py-16 lg:py-20 ${background === "muted/30" ? "bg-muted/30" : "bg-background"} ${className}`}
		>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-10 lg:mb-14">
					<h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">{title}</h2>
					{subtitle && (
						<p className="text-muted-foreground text-sm sm:text-base max-w-3xl mx-auto">{subtitle}</p>
					)}
				</div>
				{children}
			</div>
		</section>
	);
}
