import { FeaturedBrands } from "@/components/ui/featured-brands";
import { FeaturedClients } from "@/components/ui/featured-clients";
import { FeaturedProducts } from "@/components/ui/featured-products";
import { Hero } from "@/components/ui/hero";

export default function Page() {
	return (
		<>
			<Hero />
			<FeaturedProducts />
			<FeaturedBrands />
			<FeaturedClients />
		</>
	);
}
