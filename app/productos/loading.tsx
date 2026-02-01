import { GridSkeleton } from "@/components/ui/loading";

export default function ProductsLoading() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Hero skeleton */}
				<section className="py-12 lg:py-24">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center max-w-3xl mx-auto space-y-6">
							<Skeleton className="h-12 w-3/4 mx-auto" />
							<Skeleton className="h-6 w-full mx-auto" />
						</div>
					</div>
				</section>

				{/* Products grid skeleton */}
				<section className="py-16 lg:py-3">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<GridSkeleton count={6} showImage={true} lines={3} />
					</div>
				</section>

				{/* CTA skeleton */}
				<section className="py-16 lg:py-24 bg-muted/30">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<Skeleton className="h-8 w-64 mx-auto mb-4" />
						<Skeleton className="h-5 w-96 mx-auto mb-8" />
					</div>
				</section>
			</main>
		</div>
	);
}

function Skeleton({ className }: { className?: string }) {
	return (
		<div className={`animate-pulse rounded-md bg-muted ${className || ""}`} />
	);
}
