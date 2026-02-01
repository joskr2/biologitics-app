"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import { Footer } from "./footer";

export function FooterWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  );
}
