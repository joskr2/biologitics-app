"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/ui/header";

export function HeaderWrapper() {
	const pathname = usePathname();
	const isAdminRoute = pathname.startsWith("/admin");

	if (isAdminRoute) {
		return null;
	}

	return (
		<Suspense fallback={null}>
			<Header />
		</Suspense>
	);
}
