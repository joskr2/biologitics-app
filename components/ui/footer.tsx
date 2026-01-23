"use client";

import { Facebook, Instagram, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

const currentYear = new Date().getFullYear();

const companyInfo = {
	name: "Biologistics",
	description: "Venta de equipos científicos de alta calidad para laboratorios, investigación y educación.",
	email: "info@biologistics.com",
	phone: "+51 901631307",
	address: "Lima, Perú",
	whatsapp: "51901631307",
};

const footerLinks = {
	productos: [
		{ label: "Microscopios", href: "#productos", title: "Microscopios y equipos ópticos" },
		{ label: "Centrífugas", href: "#productos", title: "Centrífugas y rotores" },
		{ label: "Equipos de Análisis", href: "#productos", title: "Espectrofotómetros y cromatógrafos" },
		{ label: "Refrigeración", href: "#productos", title: "Ultracongeladores y refrigeradores" },
	],
	empresa: [
		{ label: "Nosotros", href: "#equipo", title: "Conocer nuestro equipo" },
		{ label: "Proceso", href: "#proceso", title: "Nuestro proceso de importación" },
		{ label: "Testimonios", href: "#testimonios", title: "Testimonios de clientes" },
		{ label: "FAQ", href: "#faq", title: "Preguntas frecuentes" },
	],
	legal: [
		{ label: "Términos y Condiciones", href: "#", title: "Términos y condiciones del servicio" },
		{ label: "Política de Privacidad", href: "#", title: "Política de privacidad" },
		{ label: "Política de Cookies", href: "#", title: "Política de uso de cookies" },
	],
};

const socialLinks = [
	{ name: "LinkedIn", icon: Linkedin, href: "#", title: "Visitar nuestro perfil de LinkedIn" },
	{ name: "Facebook", icon: Facebook, href: "#", title: "Visitar nuestra página de Facebook" },
	{ name: "Instagram", icon: Instagram, href: "#", title: "Seguirnos en Instagram" },
	{ name: "WhatsApp", icon: MessageCircle, href: `https://wa.me/${companyInfo.whatsapp}`, title: "Contactar por WhatsApp" },
];

function Footer() {
	return (
		<footer className="bg-gray-100 text-gray-900 dark:bg-black dark:text-white transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					<div>
						<div className="flex items-center gap-3 mb-4">
							<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xl">
								B
							</div>
							<span className="font-semibold text-xl">{companyInfo.name}</span>
						</div>
						<p className="text-gray-400 text-sm mb-4">{companyInfo.description}</p>
						<div className="flex gap-3">
							{socialLinks.map((social) => (
								<Link
									key={social.name}
									href={social.href}
									className="flex h-10 w-10 items-center justify-center rounded-full  text-gray-900  dark:text-white transition-colors hover:text-primary dark:hover:text-primary"
									aria-label={social.name}
									title={social.title}
									target="_blank"
									rel="noopener noreferrer"
									passHref
								>
									<social.icon className="size-5" aria-hidden="true" />
								</Link>
							))}
						</div>
					</div>

					<div>
						<h3 className="font-semibold text-lg mb-4">Nuestros productos destacados</h3>
						<ul className="space-y-2">
							{footerLinks.productos.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-gray-400 text-sm transition-colors hover:text-primary dark:hover:text-primary"
										title={link.title}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Empresa */}
					<div>
						<h3 className="font-semibold text-lg mb-4">Empresa</h3>
						<ul className="space-y-2">
							{footerLinks.empresa.map((link) => (
								<li key={link.label}>
									<Link
										href={link.href}
										className="text-gray-400 text-sm transition-colors hover:text-primary dark:hover:text-primary"
										title={link.title}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contacto */}
					<div>
						<h3 className="font-semibold text-lg mb-4">Contacto</h3>
						<ul className="space-y-3 text-gray-400 text-sm">
							<li className="flex items-start gap-3">
								<Mail className="size-4.5 shrink-0 mt-0.5" aria-hidden="true" />
								<Link
									href={`mailto:${companyInfo.email}`}
									className="transition-colors hover:text-primary dark:hover:text-primary"
									title="Enviar correo electrónico"
									passHref
								>
									{companyInfo.email}
								</Link>
							</li>
							<li className="flex items-start gap-3">
								<Phone className="size-4.5 shrink-0 mt-0.5" aria-hidden="true" />
								<Link
									href={`tel:${companyInfo.phone}`}
									className="transition-colors hover:text-primary dark:hover:text-primary"
									title="Llamar por teléfono"
									passHref
								>
									{companyInfo.phone}
								</Link>
							</li>
							<li className="flex items-start gap-3">
								<MapPin className="size-4.5 shrink-0 mt-0.5" aria-hidden="true" />
								<span>{companyInfo.address}</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-gray-300 dark:border-gray-800">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
						<p>
							&copy; {currentYear} {companyInfo.name}. Todos los derechos reservados.
						</p>
						<div className="flex gap-6">
							{footerLinks.legal.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									className="transition-colors hover:text-primary dark:hover:text-primary"
									title={link.title}
								>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

export { Footer };
