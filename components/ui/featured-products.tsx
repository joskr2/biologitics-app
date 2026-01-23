"use client";

import Link from "next/link";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { CardContent, CardListItem } from "@/components/ui/card-content";
import { SectionContent } from "@/components/ui/section-content";

interface Product {
	id: string;
	title: string;
	description: string;
	image: string;
	features: string[];
	price?: string;
}

interface FeaturedProductsProps {
	title?: string;
	subtitle?: string;
	buttonText?: string;
	buttonHref?: string;
}

// Productos destacados (5 para el carousel)
const featuredProducts: Product[] = [
	{
		id: "microscopio-digital",
		title: "Microscopio Digital Pro",
		description:
			"Microscopio de alta resolución con cámara digital integrada para captura de imágenes y video.",
		image:
			"https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600&h=400&fit=crop&auto=format&q=75",
		features: [
			"Zoom 40x-1600x",
			"Cámara 12MP integrada",
			"Pantalla LCD 7\"",
			"Software de análisis",
		],
	},
	{
		id: "centrifuga-clinica",
		title: "Centrífuga de Laboratorio",
		description:
			"Centrífuga de alta velocidad para análisis clínicos e investigación biomédica.",
		image:
			"https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop&auto=format&q=75",
		features: [
			"Velocidad 15,000 RPM",
			"Capacidad 6 x 50ml",
			"Control digital",
			"Sistema de seguridad",
		],
	},
	{
		id: "espectrofotometro",
		title: "Espectrofotómetro UV-Vis",
		description:
			"Equipo de análisis espectrofotométrico para determinación de concentración de muestras.",
		image:
			"https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&h=400&fit=crop&auto=format&q=75",
		features: [
			"Rango 190-1100nm",
			"Ancho de banda 2nm",
			"Pantalla táctil",
			"Conectividad USB",
		],
	},
	{
		id: "incubadora",
		title: "Incubadora de Cultivos",
		description:
			"Incubadora con control preciso de temperatura y humedad para cultivos celulares.",
		image:
			"https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop&auto=format&q=75",
		features: [
			"Temp. 20°C-60°C",
			"Humedad controlada",
			"Capacidad 150L",
			"Puerta interior de vidrio",
		],
	},
	{
		id: "autoclave",
		title: "Autoclave de Mesa",
		description:
			"Esterilizador por vapor de alta presión para laboratorios y consultorios.",
		image:
			"https://images.unsplash.com/photo-1581093458791-9d42e3c7c3a8?w=600&h=400&fit=crop&auto=format&q=75",
		features: [
			"Capacidad 24L",
			"Ciclo rápido 45min",
			"Sistema de seguridad",
			"Impresora opcional",
		],
	},
];

function ProductCard({
	product,
}: Readonly<{
	product: Product;
}>) {
	const items: CardListItem[] = product.features.map((feature) => ({
		label: feature,
	}));

	const handleAction = () => {
		console.log(`Producto: ${product.title}`);
		console.log(`ID: ${product.id}`);
		console.log(`Descripción: ${product.description}`);
		console.log("---");
	};

	return (
		<div className="h-full">
			<CardContent
				image={product.image}
				imageAlt={product.title}
				title={product.title}
				description={product.description}
				items={items}
				buttonText="Obtener más información"
				buttonHref={`/productos/${product.id}`}
				imageType="photo"
				onAction={handleAction}
			/>
		</div>
	);
}

function FeaturedProductsCarousel() {
	return (
		<div className="relative">
			<Carousel
				opts={{
					loop: true,
					align: "start",
				}}
				className="w-full"
			>
				<CarouselContent className="-ml-4">
					{featuredProducts.map((product) => (
						<CarouselItem
							key={product.id}
							className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
						>
							<ProductCard product={product} />
						</CarouselItem>
					))}
				</CarouselContent>
			</Carousel>
		</div>
	);
}

function FeaturedProductsGrid() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
			{featuredProducts.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}

export function FeaturedProducts({
	title = "Nuestros Productos Destacados",
	subtitle = "Equipamiento científico de las mejores marcas internacionales para laboratorios e instituciones de investigación",
	buttonText = "Ver todos los productos",
	buttonHref = "/productos",
}: Readonly<FeaturedProductsProps>) {
	return (
		<SectionContent id="productos" title={title} subtitle={subtitle}>
			{/* Featured Products Carousel (Mobile/Tablet) */}
			<div className="block lg:hidden">
				<FeaturedProductsCarousel />
			</div>

			{/* Featured Products Grid (Desktop) */}
			<div className="hidden lg:block">
				<FeaturedProductsGrid />
			</div>

			{/* Footer with Link */}
			<div className="mt-10 text-center">
				<Button variant="default" size="lg">
					<Link href={buttonHref}>{buttonText}</Link>
				</Button>
			</div>
		</SectionContent>
	);
}
