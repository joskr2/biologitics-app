import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { ThemeProvider } from "@/components/ui/theme-provider";

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

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	themeColor: [
		{ media: "(prefers-color-scheme: light)", color: "#ffffff" },
		{ media: "(prefers-color-scheme: dark)", color: "#000000" },
	],
};

export const metadata: Metadata = {
	// Reemplaza esto con tu dominio real cuando lo tengas (ej: https://biologistics.pe)
	// Si no lo pones, las imágenes de compartir en redes sociales fallarán.
	metadataBase: new URL("http://localhost:3000"),

	title: {
		default: "Biologistics - Venta de Equipos Científicos en Perú",
		template: "%s | Biologistics", // Permite títulos dinámicos en otras páginas
	},

	description:
		"Importación y venta de equipos científicos de alta gama para laboratorios en Perú. Microscopios, centrífugas, incubadoras y equipamiento médico certificado.",

	keywords: [
		"equipos científicos",
		"laboratorio perú",
		"venta de microscopios",
		"equipamiento médico",
		"biologistics",
		"insumos laboratorio",
	],

	authors: [{ name: "Biologistics Perú" }],
	creator: "Biologistics S.A.C.",

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	alternates: {
		canonical: "/",
	},

	// Para compartir en Facebook / LinkedIn / WhatsApp
	openGraph: {
		type: "website",
		locale: "es_PE",
		url: "https://www.biologistics.pe", // Tu URL real
		title: "Biologistics - Tecnología para tu Laboratorio",
		description:
			"Venta e importación de equipos científicos garantizados en Perú.",
		siteName: "Biologistics",
		images: [
			{
				url: "/og-image.jpg", // Asegúrate de crear esta imagen en public/
				width: 1200,
				height: 630,
				alt: "Equipos de Laboratorio Biologistics",
			},
		],
	},

	// Para compartir en Twitter/X
	twitter: {
		card: "summary_large_image",
		title: "Biologistics Perú",
		description: "Equipos científicos y de laboratorio al mejor precio.",
		images: ["/og-image.jpg"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="es" suppressHydrationWarning>
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
						<Header />
						{children}
						<Footer />
					</ThemeProvider>
				</Suspense>
			</body>
		</html>
	);
}
