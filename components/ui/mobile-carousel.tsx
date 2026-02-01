"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileCarouselProps {
	items: ReadonlyArray<{ id: string }>;
	renderItem: (item: { id: string }) => React.ReactNode;
	className?: string;
	itemClassName?: string;
	slidesPerView?: number;
	gap?: number;
	showNavigation?: boolean;
}

export function MobileCarousel({
	items,
	renderItem,
	className,
	slidesPerView = 2,
	gap = 8,
	showNavigation = true,
}: MobileCarouselProps) {
	const [emblaRef, api] = useEmblaCarousel({
		loop: true,
		align: "start",
		slidesToScroll: 1,
	});

	const scrollPrev = useCallback(() => {
		api?.scrollPrev();
	}, [api]);

	const scrollNext = useCallback(() => {
		api?.scrollNext();
	}, [api]);

	if (items.length === 0) {
		return (
			<div className="py-12 text-center">
				<p className="text-muted-foreground">No hay elementos disponibles.</p>
			</div>
		);
	}

	return (
		<div className={cn("relative", className)}>
			<div className="overflow-hidden" ref={emblaRef}>
				<div
					className="flex"
					style={{ gap: `${gap}px`, marginLeft: `-${gap}px` }}
				>
					{items.map((item) => (
						<div
							key={item.id}
							className="min-w-0 shrink-0 grow-0 basis-full pl-4"
							style={{
								flexBasis: `calc(${100 / slidesPerView}% - ${((slidesPerView - 1) * gap) / slidesPerView}px)`,
							}}
						>
							{renderItem(item)}
						</div>
					))}
				</div>
			</div>

			{/* Navigation buttons */}
			{showNavigation && (
				<div className="flex justify-center gap-2 mt-6">
					<button
						onClick={scrollPrev}
						className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
						aria-label="Anterior"
					>
						<ChevronLeft className="w-5 h-5" />
					</button>
					<button
						onClick={scrollNext}
						className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
						aria-label="Siguiente"
					>
						<ChevronRight className="w-5 h-5" />
					</button>
				</div>
			)}
		</div>
	);
}
