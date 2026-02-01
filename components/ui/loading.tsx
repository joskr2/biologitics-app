"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
	className?: string;
	size?: "sm" | "md" | "lg";
	text?: string;
}

export function Loading({
	className,
	size = "md",
	text,
}: Readonly<LoadingProps>) {
	const sizeClasses = {
		sm: "size-4",
		md: "size-8",
		lg: "size-12",
	};

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3 p-8",
				className,
			)}
		>
			<Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
			{text && <p className="text-muted-foreground text-sm">{text}</p>}
		</div>
	);
}

interface SkeletonProps {
	className?: string;
}

export function Skeleton({ className }: Readonly<SkeletonProps>) {
	return (
		<div
			className={cn(
				"animate-pulse rounded-md bg-muted",
				className,
			)}
		/>
	);
}

interface CardSkeletonProps {
	showImage?: boolean;
	lines?: number;
}

export function CardSkeleton({ showImage = true, lines = 3 }: CardSkeletonProps) {
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

interface GridSkeletonProps {
	count?: number;
	showImage?: boolean;
	lines?: number;
	className?: string;
}

export function GridSkeleton({
	count = 6,
	showImage = true,
	lines = 3,
	className,
}: Readonly<GridSkeletonProps>) {
	return (
		<div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
			{Array.from({ length: count }).map((_, i) => (
				<CardSkeleton key={`grid-skeleton-${i}`} showImage={showImage} lines={lines} />
			))}
		</div>
	);
}
