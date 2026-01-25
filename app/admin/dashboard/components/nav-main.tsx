"use client";

import type { LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface NavItem {
	title: string;
	url?: string;
	icon?: LucideIcon;
	isActive?: boolean;
	items?: {
		title: string;
		url?: string;
	}[];
}

interface NavMainProps {
	items: NavItem[];
	activeSection?: string;
	onSectionChange?: (section: string) => void;
}

export function NavMain({
	items,
	activeSection,
	onSectionChange,
}: NavMainProps) {
	const getSectionKey = (title: string): string => {
		const keyMap: Record<string, string> = {
			Header: "header",
			Hero: "hero",
			Productos: "featuredProducts",
			Marcas: "featuredBrands",
			Clientes: "featuredClients",
			Equipo: "featuredTeam",
			Respuestas: "responses",
			Footer: "footer",
			SEO: "seo",
		};
		return keyMap[title] || title.toLowerCase().replace(/\s+/g, "");
	};

	return (
		<SidebarGroup>
			<SidebarGroupLabel>Secciones</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item: NavItem) => {
					const sectionKey = getSectionKey(item.title);
					const isActive = activeSection === sectionKey;

					return (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuSub>
								<SidebarMenuSubItem key={item.title}>
									<SidebarMenuSubButton
										className={isActive ? "bg-accent" : ""}
										onClick={() => onSectionChange?.(sectionKey)}
										style={{ cursor: "pointer" }}
									>
										{item.icon && <item.icon className="mr-2 h-4 w-4" />}
										<span>{item.title}</span>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							</SidebarMenuSub>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
