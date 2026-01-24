export interface NavItem {
	label: string;
	href: string;
}

export interface CtaButton {
	label: string;
	href: string;
}

export interface HeaderContent {
	logo: {
		src: string;
		alt: string;
	};
	navigation: NavItem[];
	cta: CtaButton;
}

export interface HeroSlide {
	id: string;
	type: "video" | "image";
	src: string;
	title: string;
	subtitle: string;
	cta: CtaButton;
	secondaryCta?: CtaButton;
}

export interface SocialProofItem {
	value: string;
	label: string;
}

export interface HeroContent {
	slides: HeroSlide[];
	socialProof: SocialProofItem[];
}

export interface FeatureItem {
	name: string;
	category?: string;
}

export interface ListItem {
	label: string;
	secondary?: string;
}

export interface ProductItem {
	id: string;
	title: string;
	description: string;
	image: string;
	features: string[];
}

export interface FeaturedProductsContent {
	title: string;
	subtitle: string;
	buttonText: string;
	buttonHref: string;
	items: ProductItem[];
}

export interface BrandItem {
	id: string;
	name: string;
	logo: string;
	description: string;
	bestSellers: FeatureItem[];
	href: string;
}

export interface FeaturedBrandsContent {
	title: string;
	subtitle: string;
	buttonText: string;
	buttonHref: string;
	items: BrandItem[];
}

export interface ClientItem {
	id: string;
	name: string;
	logo: string;
	type: string;
}

export interface FeaturedClientsContent {
	title: string;
	subtitle: string;
	buttonText: string;
	buttonHref: string;
	items: ClientItem[];
}

export interface FooterCompany {
	name: string;
	description: string;
	email: string;
	phone: string;
	address: string;
	whatsapp: string;
}

export interface FooterSocialLink {
	name: string;
	icon: string;
	href: string;
}

export interface FooterColumn {
	title: string;
	links: NavItem[];
}

export interface FooterLegalLink {
	label: string;
	href: string;
}

export interface FooterContent {
	company: FooterCompany;
	socialLinks: FooterSocialLink[];
	columns: FooterColumn[];
	legalLinks: FooterLegalLink[];
}

export interface SiteContent {
	header: HeaderContent;
	hero: HeroContent;
	featuredProducts: FeaturedProductsContent;
	featuredBrands: FeaturedBrandsContent;
	featuredClients: FeaturedClientsContent;
	footer: FooterContent;
}
