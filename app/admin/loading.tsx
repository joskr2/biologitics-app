import { Skeleton } from "@/components/ui/loading";

export default function AdminLoading() {
	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1 p-6 lg:p-8 space-y-8">
				{/* Header skeleton */}
				<div className="space-y-2">
					<Skeleton className="h-8 w-48" />
					<Skeleton className="h-5 w-72" />
				</div>

				{/* Dashboard cards skeleton */}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={`admin-skeleton-card-${i}-${i * 17}`}
							className="rounded-lg border p-6 space-y-4"
						>
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-16" />
						</div>
					))}
				</div>

				{/* Forms skeleton */}
				<div className="space-y-6">
					<Skeleton className="h-6 w-64" />
					<div className="border rounded-lg p-6 space-y-6">
						<div className="grid grid-cols-2 gap-4">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</div>
						<Skeleton className="h-64 w-full" />
					</div>
				</div>
			</main>
		</div>
	);
}
