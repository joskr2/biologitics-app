import { Metadata } from "next";

interface OrganizationSchemaProps {
	metadata: Metadata;
}

function getBaseUrl(metadata: Metadata): string {
	if (!metadata.metadataBase) {
		return "https://www.biologistics.pe";
	}
	return typeof metadata.metadataBase === "string"
		? metadata.metadataBase
		: metadata.metadataBase.origin;
}

export function OrganizationSchema({ metadata }: Readonly<OrganizationSchemaProps>) {
	const baseUrl = getBaseUrl(metadata);

	const organization = {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Biologistics",
		url: baseUrl,
		logo: `${baseUrl}/logo.png`,
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+51901631307",
			contactType: "customer service",
			availableLanguage: ["Spanish"],
		},
		sameAs: [
			"https://www.facebook.com/biologistics",
			"https://www.instagram.com/biologistics",
			"https://www.linkedin.com/company/biologistics",
		],
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
		/>
	);
}

export function LocalBusinessSchema() {
	const localBusiness = {
		"@context": "https://schema.org",
		"@type": "MedicalBusiness",
		name: "Biologistics",
		description: "Importación y venta de equipos científicos de alta gama para laboratorios en Perú",
		address: {
			"@type": "PostalAddress",
			addressCountry: "PE",
			addressLocality: "Lima",
		},
		priceRange: "$$$",
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
		/>
	);
}

export function WebSiteSchema() {
	const website = {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: "Biologistics",
		url: "https://www.biologistics.pe",
		potentialAction: {
			"@type": "SearchAction",
			target: {
				"@type": "EntryPoint",
				urlTemplate: "https://www.biologistics.pe/productos?q={search_term_string}",
			},
			"query-input": "required name=search_term_string",
		},
	};

	return (
		<script
			type="application/ld+json"
			dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
		/>
	);
}
