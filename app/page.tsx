import { getLandingData } from "@/app/lib/db";
import { ContactForm } from "@/components/ui/contact-form";
import { FeaturedBrands } from "@/components/ui/featured-brands";
import { FeaturedClients } from "@/components/ui/featured-clients";
import { FeaturedProducts } from "@/components/ui/featured-products";
import { FeaturedTeam } from "@/components/ui/featured-team";
import { Hero } from "@/components/ui/hero";

export default async function Page() {
	const data = await getLandingData();

	return (
		<>
			<Hero data={data.hero} />
			<FeaturedProducts data={data.featuredProducts} />
			<FeaturedBrands data={data.featuredBrands} />
			<FeaturedClients data={data.featuredClients} />
			<FeaturedTeam data={data.featuredTeam} />
			<ContactForm />
		</>
	);
}
