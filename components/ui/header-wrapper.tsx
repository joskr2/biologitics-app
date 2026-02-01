"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Header } from "@/components/ui/header";
import { useSiteContent } from "@/lib/hooks/use-site-content";

export function HeaderWrapper() {
	const pathname = usePathname();
	const isAdminRoute = pathname.startsWith("/admin");
	const { data, loading } = useSiteContent();

	if (isAdminRoute) {
		return null;
	}

	return (
		<Suspense fallback={null}>
			{loading ? null : <Header data={data?.header} />}
		</Suspense>
	);
}
