"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";

interface BrandProduct {
	name: string;
	category: string;
}

interface Brand {
	id: string;
	name: string;
	logo: string;
	description: string;
	bestSellers: BrandProduct[];
	href: string;
}

interface FeaturedBrandsProps {
	title?: string;
	subtitle?: string;
	buttonText?: string;
}

const brands: Brand[] = [
	{
		id: "zeiss",
		name: "Zeiss",
		logo: "zeiss.svg",
		description:
			"Líder mundial en óptica de precisión, ofreciendo soluciones innovadoras para microscopía, fotografía y tecnología de medición.",
		bestSellers: [
			{ name: "Microscopios Compound", category: "Laboratorio" },
			{ name: "Lentes Objetivo", category: "Óptica" },
			{ name: "Sistemas de Imagen", category: "Digital" },
		],
		href: "/marcas/zeiss",
	},
	{
		id: "Thermo",
		name: "Thermo Fisher",
		logo: "thermo-fisher.svg",
		description:
			"Proveedor líder de equipamiento científico y servicios de laboratorio para investigación y producción farmacéutica.",
		bestSellers: [
			{ name: "Centrífugas", category: "Procesamiento" },
			{ name: "Congeladores Ultra", category: "Refrigeración" },
			{ name: "Incubadoras", category: "Cultivos" },
		],
		href: "/marcas/thermo-fisher",
	},
	{
		id: "eppendorf",
		name: "Eppendorf",
		logo: "eppendorf.svg",
		description:
			"Especialistas en equipamiento de laboratorio para pipeteo, separación, mezcla y procesamiento de muestras.",
		bestSellers: [
			{ name: "Pipetas Automáticas", category: "Liquid Handling" },
			{ name: "Microcentrífugas", category: "Procesamiento" },
			{ name: "Termocicladores", category: "PCR" },
		],
		href: "/marcas/eppendorf",
	},
	{
		id: "olympus",
		name: "Olympus",
		logo: "olympus.svg",
		description:
			"Pioneros en tecnología de microscopía y endoscopía con más de 100 años de experiencia en innovación óptica.",
		bestSellers: [
			{ name: "Microscopios Inversos", category: "Cultura Celular" },
			{ name: "Sistemas de Fluoroscencia", category: "Imagen" },
			{ name: "Cámaras Digitales", category: "Documentación" },
		],
		href: "/marcas/olympus",
	},
];

function BrandCard({ brand }: Readonly<{ brand: Brand }>) {
	const items: CardListItem[] = brand.bestSellers.map((product) => ({
		label: product.name,
		secondary: product.category,
	}));

	return (
		<div className="h-full">
			<CardContent
				image={brand.logo}
				imageAlt={`Logo de ${brand.name}`}
				title={brand.name}
				description={brand.description}
				items={items}
				buttonText="Saber más"
				buttonHref={brand.href}
				imageType="logo"
			/>
		</div>
	);
}

export function FeaturedBrands({
	title = "Marcas Representadas",
	subtitle = "Representamos a las marcas más reconocidas del mundo en equipamiento científico",
	buttonText = "Ver todas las marcas",
}: Readonly<FeaturedBrandsProps>) {
	return (
		<SectionContent id="marcas" title={title} subtitle={subtitle} background="muted/30">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{brands.map((brand) => (
					<BrandCard key={brand.id} brand={brand} />
				))}
			</div>

			<div className="mt-10 text-center">
				<Button variant="default" size="lg">
					<Link href="/marcas">{buttonText}</Link>
				</Button>
			</div>
		</SectionContent>
	);
}
