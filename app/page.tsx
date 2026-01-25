import { cookies } from "next/headers";
import { getLandingData } from "@/app/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { FeaturedBrands } from "@/components/ui/featured-brands";
import { FeaturedClients } from "@/components/ui/featured-clients";
import { FeaturedProducts } from "@/components/ui/featured-products";
import { FeaturedTeam } from "@/components/ui/featured-team";
import { Footer } from "@/components/ui/footer";
import { Header } from "@/components/ui/header";
import { Hero } from "@/components/ui/hero";

export default async function Page() {
	// Access cookies to make this page dynamic (required for Next.js 16+ cacheComponents)
	cookies();
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
