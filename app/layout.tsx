import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import {
	LocalBusinessSchema,
	OrganizationSchema,
	WebSiteSchema,
} from "@/components/seo/organization-schema";
import { HeaderWrapper } from "@/components/ui/header-wrapper";
import { ThemeProvider } from "@/components/ui/theme-provider";
import siteContent from "@/config/site-content.json";
import { FooterWrapper } from "@/components/ui/footer-wrapper";

const roboto = Roboto({
	subsets: ["latin"],
	weight: ["400", "500", "700", "900"],
	variable: "--font-sans",
	display: "swap",
});

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
	display: "swap",
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
	display: "swap",
});

const seo = siteContent.seo;

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: seo.themeColors.map((c) => ({
		media: c.media,
		color: c.color,
	})),
};

export const metadata: Metadata = {
	metadataBase: new URL(seo.metadataBase),

	title: seo.title,
	description: seo.description,

	keywords: seo.keywords,

	authors: seo.authors,
	creator: seo.creator,

	robots: {
		index: seo.robots.index,
		follow: seo.robots.follow,
		googleBot: seo.robots.googleBot
			? {
					index: seo.robots.googleBot.index,
					follow: seo.robots.googleBot.follow,
					"max-video-preview": seo.robots.googleBot["max-video-preview"] as
						| number
						| undefined,
					"max-image-preview": seo.robots.googleBot["max-image-preview"] as
						| "large"
						| "none"
						| "standard"
						| undefined,
					"max-snippet": seo.robots.googleBot["max-snippet"] as
						| number
						| undefined,
				}
			: undefined,
	},

	alternates: {
		canonical: seo.canonicalUrl,
	},

	openGraph: seo.openGraph as Metadata["openGraph"],

	twitter: seo.twitter,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
			<head>
				{/* SEO Structured Data */}
				<OrganizationSchema metadata={metadata} />
				<LocalBusinessSchema />
				<WebSiteSchema />
			</head>
			<body
				className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
			>
				<Suspense fallback={null}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<HeaderWrapper />
						{children}
						<FooterWrapper />
					</ThemeProvider>
				</Suspense>
			</body>
		</html>
	);
}
