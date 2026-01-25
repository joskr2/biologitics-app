import dynamic from "next/dynamic";
import { getLandingData } from "@/app/lib/db";
import { FeaturedBrands } from "@/components/ui/featured-brands";
import { FeaturedClients } from "@/components/ui/featured-clients";
import { FeaturedProducts } from "@/components/ui/featured-products";
import { FeaturedTeam } from "@/components/ui/featured-team";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Hero } from "@/components/ui/hero";

// Lazy load ContactForm - it uses react-hook-form and zod which add significant bundle size
const ContactForm = dynamic(
	() => import("@/components/ui/contact-form").then((mod) => mod.ContactForm),
	{
		loading: () => (
			<section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
				<div className="animate-pulse space-y-4">
					<div className="h-8 bg-muted rounded w-1/3" />
					<div className="h-12 bg-muted rounded" />
					<div className="h-12 bg-muted rounded" />
					<div className="h-32 bg-muted rounded" />
				</div>
			</section>
		),
	},
);

// ISR: Cache page for 60 seconds, then revalidate in background
export const revalidate = 60;

export default async function Page() {
	const data = await getLandingData();

	return (
		<>
			<Header data={data.header} />
			<Hero data={data.hero} />
			<FeaturedProducts data={data.featuredProducts} />
			<FeaturedBrands data={data.featuredBrands} />
			<FeaturedClients data={data.featuredClients} />
			<FeaturedTeam data={data.featuredTeam} />
			<ContactForm />
			<Footer data={data.footer} />
		</>
	);
}
