import { ArrowLeft, CheckCircle2, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { ProductItem } from "@/config/site-content";
import siteContent from "@/config/site-content.json";

interface ProductPageProps {
	params: Promise<{
		id: string;
	}>;
}

export async function generateMetadata({
	params,
}: ProductPageProps): Promise<Metadata> {
	const { id } = await params;
	const product = getProductById(id);

	if (!product) {
		return {
			title: "Producto no encontrado | Biologistics",
			description: "El producto solicitado no existe",
		};
	}

	return {
		title: `${product.title} | Biologistics`,
		description: product.description,
		openGraph: {
			title: product.title,
			description: product.description,
			images: [{ url: product.image, alt: product.title }],
		},
	};
}

function getProductById(id: string): ProductItem | undefined {
	return siteContent.featuredProducts.items.find((p) => p.id === id);
}

export async function generateStaticParams() {
	return siteContent.featuredProducts.items.map((product) => ({
		id: product.id,
	}));
}

export default async function ProductPage({ params }: ProductPageProps) {
	const { id } = await params;
	const product = getProductById(id);

	if (!product) {
		notFound();
	}

	const products = siteContent.featuredProducts.items;
	const currentIndex = products.findIndex((p) => p.id === id);
	const nextProduct = products[currentIndex + 1] || null;
	const prevProduct = products[currentIndex - 1] || null;

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Breadcrumb */}
				<nav className="border-b bg-muted/30" aria-label="Breadcrumb">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
						<ol className="flex items-center gap-2 text-sm">
							<li>
								<Link
									href="/"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Inicio
								</Link>
							</li>
							<li className="text-muted-foreground">/</li>
							<li>
								<Link
									href="#productos"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Productos
								</Link>
							</li>
							<li className="text-muted-foreground">/</li>
							<li
								className="text-foreground font-medium truncate"
								aria-current="page"
							>
								{product.title}
							</li>
						</ol>
					</div>
				</nav>

				{/* Product Hero */}
				<section className="py-12 lg:py-20">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<Link
							href="/productos"
							className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
						>
							<ArrowLeft className="size-4" />
							Volver a productos
						</Link>

						<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
							{/* Product Image */}
							<div className="relative aspect-4/3 w-full max-h-125 rounded-2xl overflow-hidden bg-muted/50 border">
								<Image
									src={product.image}
									alt={product.title}
									fill
									className="object-contain p-4"
									sizes="(max-width: 1024px) 100vw, 50vw"
									priority
								/>
							</div>

							{/* Product Info */}
							<div className="space-y-8">
								<div>
									<h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">
										{product.title}
									</h1>
									<p className="text-lg text-muted-foreground leading-relaxed">
										{product.description}
									</p>
								</div>

								{/* Features */}
								<div>
									<h2 className="text-xl font-semibold mb-4">
										Características Principales
									</h2>
									<ul className="space-y-3">
										{product.features.map((feature) => (
											<li
												key={`${feature}-${product.id}`}
												className="flex items-start gap-3"
											>
												<CheckCircle2 className="size-5 text-primary shrink-0 mt-0.5" />
												<span className="text-muted-foreground">{feature}</span>
											</li>
										))}
									</ul>
								</div>

								{/* CTA Buttons */}
								<div className="flex flex-col sm:flex-row gap-4">
									<Button size="lg">
										<Link href="#contacto">
											<Mail className="size-4 mr-2" />
											Solicitar Cotización
										</Link>
									</Button>
									<Button size="lg" variant="outline">
										<a
											href={`tel:${siteContent.footer.company.phone.replace(/\D/g, "")}`}
										>
											<Phone className="size-4 mr-2" />
											{siteContent.footer.company.phone}
										</a>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</section>

				{(prevProduct || nextProduct) && (
					<section className="py-8 border-t bg-muted/30">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
							<div className="flex justify-between items-center">
								{prevProduct ? (
									<Link
										href={`/productos/${prevProduct.id}`}
										className="flex items-center gap-3 group p-3 rounded-lg hover:bg-background transition-colors"
									>
										<ArrowLeft className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
										<div className="text-left">
											<p className="text-xs text-muted-foreground">Anterior</p>
											<p className="font-medium group-hover:text-primary transition-colors">
												{prevProduct.title}
											</p>
										</div>
									</Link>
								) : (
									<div />
								)}

								{nextProduct ? (
									<Link
										href={`/productos/${nextProduct.id}`}
										className="flex items-center gap-3 group p-3 rounded-lg hover:bg-background transition-colors"
									>
										<div className="text-right">
											<p className="text-xs text-muted-foreground">Siguiente</p>
											<p className="font-medium group-hover:text-primary transition-colors">
												{nextProduct.title}
											</p>
										</div>
										<ArrowLeft className="size-5 text-muted-foreground group-hover:text-foreground transition-colors rotate-180" />
									</Link>
								) : (
									<div />
								)}
							</div>
						</div>
					</section>
				)}

				{/* Related Products */}
				<section className="py-16 lg:py-24">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12">
							<h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-4">
								Otros Productos
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								Descubre nuestra amplia gama de equipos científicos y de
								laboratorio
							</p>
						</div>

						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
							{products
								.filter((p) => p.id !== id)
								.slice(0, 4)
								.map((relatedProduct) => (
									<Link
										key={relatedProduct.id}
										href={`/productos/${relatedProduct.id}`}
										className="group block"
									>
										<h3 className="font-semibold group-hover:text-primary transition-colors">
											{relatedProduct.title}
										</h3>
										<p className="text-sm text-muted-foreground line-clamp-2 mt-1">
											{relatedProduct.description}
										</p>
									</Link>
								))}
						</div>

						<div className="text-center mt-8">
							<Button variant="outline">
								<Link href="#productos">Ver Todos los Productos</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Contact Form Section */}
				<section id="contacto" className="py-16 lg:py-24 bg-muted/30">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div>
								<h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-4">
									¿Interesado en este producto?
								</h2>
								<p className="text-muted-foreground mb-8">
									Contáctanos para obtener más información, solicitar una
									cotización o conocer las especificaciones técnicas completas.
								</p>

								<div className="space-y-4">
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
											<Phone className="size-5" />
										</div>
										<div>
											<p className="font-medium">
												{siteContent.footer.company.phone}
											</p>
											<p className="text-sm text-muted-foreground">
												Lun - Vie: 8am - 6pm
											</p>
										</div>
									</div>

									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary">
											<Mail className="size-5" />
										</div>
										<div>
											<p className="font-medium">
												{siteContent.footer.company.email}
											</p>
											<p className="text-sm text-muted-foreground">
												Respuesta en 24 horas hábiles
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="bg-background rounded-2xl p-6 lg:p-8 border shadow-sm">
								<p className="text-center text-muted-foreground mb-4">
									Completa el formulario y nos pondremos en contacto contigo
								</p>
								<Button size="lg" className="w-full">
									<Link href="/#contacto">Ir al Formulario de Contacto</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
