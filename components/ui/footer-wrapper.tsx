"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "./footer";
import { useSiteContent } from "@/lib/hooks/use-site-content";

export function FooterWrapper() {
	const pathname = usePathname();
	const isAdminRoute = pathname.startsWith("/admin");
	const { data, loading } = useSiteContent();

	if (isAdminRoute) {
		return null;
	}

	return (
		<Suspense fallback={null}>
			{loading ? null : <Footer data={data ?? undefined} />}
		</Suspense>
	);
}
