import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/ui/footer";
import siteContent from "@/config/site-content.json";

export const metadata: Metadata = {
	title: `Catálogo de Productos | ${siteContent.seo.title.default}`,
	description:
		"Explora nuestro catálogo de equipos científicos y de laboratorio. Microscopios, centrífugas, espectrofotómetros y más.",
	openGraph: {
		title: "Catálogo de Productos | Biologistics",
		description:
			"Explora nuestro catálogo de equipos científicos y de laboratorio. Microscopios, centrífugas, espectrofotómetros y más.",
	},
};

export default function ProductsPage() {
	const { items, title, subtitle } = siteContent.featuredProducts;

	return (
		<div className="min-h-screen flex flex-col">
			<main className="flex-1">
				{/* Hero Section */}
				<section className="relative py-20 lg:py-32 overflow-hidden">
					<div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
					<div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center max-w-3xl mx-auto">
							<h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
								{title}
							</h1>
							<p className="text-xl text-muted-foreground mb-8">{subtitle}</p>
						</div>
					</div>
				</section>

				{/* Products Grid */}
				<section className="py-16 lg:py-24">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
							{items.map((product) => {
								const itemsList = product.features.map((feature) => ({
									label: feature,
								}));

								return (
									<article
										key={product.id}
										className="group bg-background rounded-2xl border overflow-hidden hover:shadow-lg transition-all duration-300"
									>
										{/* Image */}
										<div className="relative aspect-16/10 w-full max-h-[300px] overflow-hidden bg-muted/50">
											<Image
												src={product.image}
												alt={product.title}
												fill
										className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											/>
											<div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										</div>

										{/* Content */}
										<div className="p-6">
											<h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
												{product.title}
											</h2>
											<p className="text-muted-foreground mb-4 line-clamp-3">
												{product.description}
											</p>

											{/* Features Preview */}
											<ul className="space-y-2 mb-6">
												{itemsList.slice(0, 3).map((item) => (
													<li
														key={item.label}
														className="flex items-start gap-2 text-sm"
													>
														<CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
														<span className="text-muted-foreground">
															{item.label}
														</span>
													</li>
												))}
												{itemsList.length > 3 && (
													<li className="text-sm text-muted-foreground">
														+{itemsList.length - 3} características más
													</li>
												)}
											</ul>

											{/* CTA */}
											<Button
												variant="outline"
												className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
											>
												<Link href={`/productos/${product.id}`}>
													Ver Detalles
													<ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
												</Link>
											</Button>
										</div>
									</article>
								);
							})}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 lg:py-24 bg-muted/30">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-2xl lg:text-3xl font-bold tracking-tight mb-4">
							¿No encuentras lo que buscas?
						</h2>
						<p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
							Contáctanos para conocer nuestra disponibilidad de equipos y
							solicitar cotizaciones personalizadas.
						</p>
						<Button size="lg">
							<Link href="/#contacto">Contáctanos</Link>
						</Button>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
