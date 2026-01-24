"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
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
	// Map nav titles to section keys
	const getSectionKey = (title: string): string => {
		const keyMap: Record<string, string> = {
			Header: "header",
			Hero: "hero",
			Productos: "featuredProducts",
			Marcas: "featuredBrands",
			Clientes: "featuredClients",
			Equipo: "featuredTeam",
			Footer: "footer",
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
						<Collapsible
							key={item.title}
							open={Boolean(isActive)}
							className="group/collapsible"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger>
									<div
										className={cn(
											"flex w-full items-center gap-2 rounded-md p-2 text-left text-sm",
											"h-8 ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
											"active:bg-sidebar-accent active:text-sidebar-accent-foreground",
											"focus-visible:outline-hidden focus-visible:ring-2",
											"cursor-pointer select-none [&_svg]:size-4 [&_svg]:shrink-0",
											isActive ? "bg-accent" : "",
										)}
									>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
										<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
									</div>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<SidebarMenuSub>
										{item.items?.map((subItem) => (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													className={isActive ? "bg-accent" : ""}
													onClick={() => onSectionChange?.(sectionKey)}
													style={{ cursor: "pointer" }}
												>
													<span>{subItem.title}</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								</CollapsibleContent>
							</SidebarMenuItem>
						</Collapsible>
					);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
