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
	SidebarMenuButton,
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
	return (
		<SidebarGroup>
			<SidebarGroupLabel>Secciones</SidebarGroupLabel>
			<SidebarMenu>
				{items.map((item: NavItem) => (
					<Collapsible
						key={item.title}
						defaultOpen={item.isActive}
						className="group/collapsible"
					>
						<SidebarMenuItem>
							<CollapsibleTrigger>
								<SidebarMenuButton tooltip={item.title}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
									<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
								</SidebarMenuButton>
							</CollapsibleTrigger>
							<CollapsibleContent>
								<SidebarMenuSub>
									{item.items?.map((subItem) => {
										const sectionKey = item.title
											.toLowerCase()
											.replace(/\s+/g, "");
										const isActive = activeSection === sectionKey;

										return (
											<SidebarMenuSubItem key={subItem.title}>
												<SidebarMenuSubButton
													className={isActive ? "bg-accent" : ""}
													onClick={() => onSectionChange?.(sectionKey)}
													style={{ cursor: "pointer" }}
												>
													<span>{subItem.title}</span>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										);
									})}
								</SidebarMenuSub>
							</CollapsibleContent>
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
