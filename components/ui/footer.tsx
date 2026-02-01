"use client";

import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import siteContent from "@/config/site-content.json";
import type { FooterContent } from "@/config/site-content";
import { cn } from "@/lib/utils";

const currentYear = new Date().getFullYear();
const defaultData = siteContent.footer;

interface FooterProps {
	data?: FooterContent;
}

function Footer({ data }: FooterProps) {
	const { company, socialLinks, columns, legalLinks } = {
		...defaultData,
		...data,
	};

	const [lightLogoError, setLightLogoError] = useState(false);
	const [darkLogoError, setDarkLogoError] = useState(false);

	const hasLightLogo = company?.logo?.light && !lightLogoError;
	const hasDarkLogo = company?.logo?.dark && !darkLogoError;

	return (
		<footer className="bg-gray-100 text-gray-900 dark:bg-black dark:text-white transition-colors">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					{/* Company Info */}
					<div>
						<div className="flex items-center gap-3 mb-4">
							{/* Light mode logo - shown only in dark backgrounds */}
							{hasLightLogo && (
								<Image
									src={company.logo.light}
									alt={`${company.name} logo`}
									width={120}
									height={40}
									className="h-10 w-auto hidden dark:block"
									onError={() => setLightLogoError(true)}
								/>
							)}
							{/* Dark mode logo - shown only in light backgrounds */}
							{hasDarkLogo && (
								<Image
									src={company.logo.dark}
									alt={`${company.name} logo`}
									width={120}
									height={40}
									className="h-10 w-auto dark:hidden"
									onError={() => setDarkLogoError(true)}
								/>
							)}
							{/* Company name - always shown */}
							<span className="font-semibold text-xl">{company.name}</span>
						</div>
						<p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
							{company?.description}
						</p>
						<div className="flex gap-3">
							{socialLinks.map((social, idx) => (
								<Link
									key={`${social.name}-${idx}`}
									href={social.href}
									className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 transition-colors hover:bg-primary dark:hover:bg-primary"
									aria-label={social.name}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Image
										src={social.icon}
										alt={social.name}
										width={20}
										height={20}
										className={cn(
											"filter dark:invert transition-opacity",
											"opacity-90 hover:opacity-100"
										)}
									/>
								</Link>
							))}
						</div>
					</div>

					{/* Dynamic Columns */}
					{columns.map((column, colIdx) => (
						<div key={`${column.title}-${colIdx}`}>
							<h3 className="font-semibold text-lg mb-4">{column.title}</h3>
							<ul className="space-y-2">
								{column.links.map((link, linkIdx) => (
									<li key={`${link.label}-${colIdx}-${linkIdx}`}>
										<Link
											href={link.href}
											className="text-gray-500 dark:text-gray-400 text-sm transition-colors hover:text-primary dark:hover:text-primary"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}

					{/* Contact */}
					<div>
						<h3 className="font-semibold text-lg mb-4">Contacto</h3>
						<ul className="space-y-3 text-gray-500 dark:text-gray-400 text-sm">
							<li className="flex items-start gap-3">
								<Mail className="size-4.5 shrink-0 mt-0.5" aria-hidden="true" />
								<Link
									href={`mailto:${company.email}`}
									className="transition-colors hover:text-primary dark:hover:text-primary"
									title="Enviar correo electrónico"
								>
									{company.email}
								</Link>
							</li>
							<li className="flex items-start gap-3">
								<Phone className="size-4.5 shrink-0 mt-0.5" aria-hidden="true" />
								<Link
									href={`tel:${company.phone}`}
									className="transition-colors hover:text-primary dark:hover:text-primary"
									title="Llamar por teléfono"
								>
									{company.phone}
								</Link>
							</li>
							<li className="flex items-start gap-3">
								<MapPin className="size-4.5 shrink-0 mt-0.5" aria-hidden="true" />
								<span>{company.address}</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar */}
				<div className="pt-8 border-t border-gray-300 dark:border-gray-800">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
						<p>
							&copy; {currentYear} {company.name}. Todos los derechos reservados.
						</p>
						<div className="flex gap-6">
							{legalLinks.map((link, idx) => (
								<Link
									key={`${link.label}-${idx}`}
									href={link.href}
									className="transition-colors hover:text-primary dark:hover:text-primary"
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
