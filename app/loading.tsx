import { Skeleton } from "@/components/ui/loading";

export default function HomeLoading() {
	return (
		<div className="min-h-screen flex flex-col">
			{/* Hero skeleton */}
			<section className="py-12 lg:py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center max-w-3xl mx-auto space-y-6">
						<Skeleton className="h-12 w-3/4 mx-auto" />
						<Skeleton className="h-6 w-full mx-auto" />
						<Skeleton className="h-6 w-2/3 mx-auto" />
					</div>
				</div>
			</section>

			{/* Features/Products skeleton */}
			<section className="py-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="space-y-8">
						<Skeleton className="h-8 w-48" />
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 6 }).map((_, i) => (
								<CardSkeleton key={`skeleton-${i}`} showImage={true} lines={3} />
							))}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

function CardSkeleton({
	showImage = true,
	lines = 3,
}: {
	showImage?: boolean;
	lines?: number;
}) {
	return (
		<div className="border rounded-lg p-4 space-y-4">
			{showImage && (
				<div className="relative aspect-16/10 bg-muted rounded-md animate-pulse" />
			)}
			<div className="space-y-2">
				<Skeleton className="h-5 w-3/4" />
				<Skeleton className="h-4 w-full" />
				{lines > 2 && <Skeleton className="h-4 w-2/3" />}
			</div>
		</div>
	);
}
