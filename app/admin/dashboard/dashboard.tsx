"use client";

import { Loader2, Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { saveDashboardData } from "@/app/actions/admin";
import { AnimatedSection } from "@/components/ui/animated-section";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useToastNotification } from "@/components/ui/toast";
import type { SiteContent } from "@/config/site-content";
import { BrandsForm } from "../components/brands-form";
import { ClientsForm } from "../components/clients-form";
import { FooterForm } from "../components/footer-form";
import { FormResponses } from "../components/form-responses";
import { HeaderForm } from "../components/header-form";
import { HeroForm } from "../components/hero-form";
import { ProductsForm } from "../components/products-form";
import { SEOForm } from "../components/seo-form";
import { TeamForm } from "../components/team-form";
import { AppSidebar } from "./components/app-sidebar";

interface DashboardProps {
	initialData: SiteContent;
}

export default function Dashboard({ initialData }: DashboardProps) {
	const [data, setData] = useState<SiteContent>(initialData);
	const [activeSection, setActiveSection] = useState("header");
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [heroValid, setHeroValid] = useState(true);
	const [saveState, saveAction, isSaving] = useActionState(saveDashboardData, {
		success: false,
		message: undefined,
		error: undefined,
	} as {
		success: boolean;
		message?: string;
		error?: string;
	});

	const { showSuccess: showToastSuccess, showError: showToastError } =
		useToastNotification();

	// Show success/error messages via toast
	useEffect(() => {
		if (saveState.success) {
			showToastSuccess("Guardado", "Los cambios se guardaron correctamente");
		} else if (saveState.error) {
			showToastError("Error", saveState.error);
		}
	}, [saveState.success, saveState.error, showToastSuccess, showToastError]);

	const updateSection = (
		sectionKey: keyof SiteContent,
		sectionData: unknown,
	) => {
		setData((prev) => ({
			...prev,
			[sectionKey]: sectionData,
		}));
	};

	const sectionTitle =
		activeSection === "featuredProducts"
			? "Productos"
			: activeSection === "featuredBrands"
				? "Marcas"
				: activeSection === "featuredClients"
					? "Clientes"
					: activeSection === "featuredTeam"
						? "Equipo"
						: activeSection === "responses"
							? "Respuestas"
							: activeSection;

	// Disable save button if hero section is invalid
	const isSaveDisabled = isSaving || (activeSection === "hero" && !heroValid);

	return (
		<SidebarProvider defaultOpen={!isCollapsed}>
			<AppSidebar
				activeSection={activeSection}
				onSectionChange={setActiveSection}
				onCollapse={setIsCollapsed}
			/>
			<SidebarInset className="z-0">
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 border-b bg-white relative z-10">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger
							className="-ml-1"
							onClick={() => setIsCollapsed(!isCollapsed)}
						/>
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage className="capitalize">
										{sectionTitle}
									</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
					<div className="ml-auto px-4 flex items-center gap-2">
						{!heroValid && activeSection === "hero" && (
							<span className="text-xs text-amber-600 hidden sm:inline">
								Completa los posters de video para guardar
							</span>
						)}
						<form action={saveAction}>
							<input
								type="hidden"
								name="jsonContent"
								value={JSON.stringify(data)}
							/>
							<Button
								type="submit"
								disabled={isSaveDisabled}
								size="sm"
								className="gap-2"
							>
								{isSaving ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{isSaving ? "Guardando..." : "Guardar"}
							</Button>
						</form>
					</div>
				</header>

				<div className="flex flex-1 flex-col gap-4 p-4 pt-0 bg-gray-50/50 relative z-0">
					<div className="flex-1 rounded-xl md:min-h-min">
						<div className="max-w-4xl mx-auto space-y-6">
							<AnimatedSection animation="fade-in-up" delay={0.1}>
								{activeSection === "header" && (
									<HeaderForm
										data={data.header}
										onChange={(val) => updateSection("header", val)}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.2}>
								{activeSection === "hero" && (
									<HeroForm
										data={data.hero}
										onChange={(val) => updateSection("hero", val)}
										onValidate={setHeroValid}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.3}>
								{activeSection === "featuredProducts" && (
									<ProductsForm
										data={data.featuredProducts}
										onChange={(val) => updateSection("featuredProducts", val)}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.4}>
								{activeSection === "featuredBrands" && (
									<BrandsForm
										data={data.featuredBrands}
										onChange={(val) => updateSection("featuredBrands", val)}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.5}>
								{activeSection === "featuredClients" && (
									<ClientsForm
										data={data.featuredClients}
										onChange={(val) => updateSection("featuredClients", val)}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.6}>
								{activeSection === "featuredTeam" && (
									<TeamForm
										data={data.featuredTeam}
										onChange={(val) => {
											updateSection("featuredTeam", val);
										}}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.7}>
								{activeSection === "responses" && <FormResponses />}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.8}>
								{activeSection === "footer" && (
									<FooterForm
										data={data.footer}
										onChange={(val) => updateSection("footer", val)}
									/>
								)}
							</AnimatedSection>

							<AnimatedSection animation="fade-in-up" delay={0.9}>
								{activeSection === "seo" && (
									<SEOForm
										data={data.seo}
										onChange={(val) => updateSection("seo", val)}
									/>
								)}
							</AnimatedSection>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
