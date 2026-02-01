"use client";

import type { LucideIcon } from "lucide-react";

import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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

	const handleClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		sectionKey: string,
	) => {
		e.preventDefault();
		onSectionChange?.(sectionKey);
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
							<SidebarMenuButton
								isActive={isActive}
								tooltip={item.title}
								onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
									handleClick(e, sectionKey)
								}
								className={cn(
									"cursor-pointer",
									isActive &&
										"bg-sidebar-accent text-sidebar-accent-foreground",
								)}
							>
								{item.icon && <item.icon className="size-4" />}
								<span>{item.title}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
