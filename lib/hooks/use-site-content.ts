"use client";

import { useEffect, useState } from "react";
import type { SiteContent } from "@/config/site-content";

export function useSiteContent() {
	const [data, setData] = useState<SiteContent | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchSiteContent() {
			try {
				const response = await fetch("/api/site-content");
				if (!response.ok) throw new Error("Failed to fetch");
				const result = await response.json();
				setData(result as SiteContent);
			} catch (err) {
				setError(err instanceof Error ? err : new Error("Unknown error"));
			} finally {
				setLoading(false);
			}
		}

		fetchSiteContent();
	}, []);

	return { data, loading, error };
}
