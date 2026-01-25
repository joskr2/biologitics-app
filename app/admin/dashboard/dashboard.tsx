"use client";

import { Loader2, Save } from "lucide-react";
import { useActionState, useEffect, useState } from "react";
import { saveDashboardData } from "@/app/actions/admin";
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
import type { SiteContent } from "@/config/site-content";
import { BrandsForm } from "../components/brands-form";
import { ClientsForm } from "../components/clients-form";
import { FooterForm } from "../components/footer-form";
import { HeaderForm } from "../components/header-form";
import { HeroForm } from "../components/hero-form";
import { ProductsForm } from "../components/products-form";
import { TeamForm } from "../components/team-form";
import { AppSidebar } from "./components/app-sidebar";

interface DashboardProps {
	initialData: SiteContent;
}

export default function Dashboard({ initialData }: DashboardProps) {
	const [data, setData] = useState<SiteContent>(initialData);
	const [activeSection, _setActiveSection] = useState("header");
	const [isCollapsed, setIsCollapsed] = useState(false);
	const [saveState, saveAction, isSaving] = useActionState(saveDashboardData, {
		success: false,
		message: undefined,
		error: undefined,
	} as {
		success: boolean;
		message?: string;
		error?: string;
	});

	// Show success message after save (no reload needed)
	const [showSuccess, setShowSuccess] = useState(false);

	useEffect(() => {
		if (saveState.success) {
			setShowSuccess(true);
			// Hide success message after 3 seconds
			const timer = setTimeout(() => setShowSuccess(false), 3000);
			return () => clearTimeout(timer);
		}
	}, [saveState.success]);

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
						: activeSection;

	return (
		<SidebarProvider defaultOpen={!isCollapsed}>
			<AppSidebar
				activeSection={activeSection}
				onSectionChange={_setActiveSection}
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
					<div className="ml-auto px-4">
						<form action={saveAction}>
							<input
								type="hidden"
								name="jsonContent"
								value={JSON.stringify(data)}
							/>
							<Button
								type="submit"
								disabled={isSaving}
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
					{showSuccess && (
						<div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
							¡Cambios guardados exitosamente! La página principal se
							actualizará.
						</div>
					)}
					{saveState.error && (
						<div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
							{saveState.error}
						</div>
					)}

					<div className="flex-1 rounded-xl md:min-h-min">
						<div className="max-w-4xl mx-auto space-y-6">
							{activeSection === "header" && (
								<HeaderForm
									data={data.header}
									onChange={(val) => updateSection("header", val)}
								/>
							)}
							{activeSection === "hero" && (
								<HeroForm
									data={data.hero}
									onChange={(val) => updateSection("hero", val)}
								/>
							)}
							{activeSection === "featuredProducts" && (
								<ProductsForm
									data={data.featuredProducts}
									onChange={(val) => updateSection("featuredProducts", val)}
								/>
							)}
							{activeSection === "featuredBrands" && (
								<BrandsForm
									data={data.featuredBrands}
									onChange={(val) => updateSection("featuredBrands", val)}
								/>
							)}
							{activeSection === "featuredClients" && (
								<ClientsForm
									data={data.featuredClients}
									onChange={(val) => updateSection("featuredClients", val)}
								/>
							)}
							{activeSection === "featuredTeam" && (
								<>
									{console.log(
										"Dashboard featuredTeam data:",
										data.featuredTeam,
									)}
									<TeamForm
										data={data.featuredTeam}
										onChange={(val) => {
											console.log("TeamForm onChange:", val);
											updateSection("featuredTeam", val);
										}}
									/>
								</>
							)}
							{activeSection === "footer" && (
								<FooterForm
									data={data.footer}
									onChange={(val) => updateSection("footer", val)}
								/>
							)}
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
