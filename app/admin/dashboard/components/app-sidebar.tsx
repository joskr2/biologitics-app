"use client";

import {
	Footprints,
	GalleryVerticalEnd,
	Globe,
	Image,
	LayoutDashboard,
	LogOut,
	Package,
	Tags,
	UserCog,
	Users,
} from "lucide-react";
import { useEffect } from "react";
import { logoutAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
	useSidebar,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { TeamSwitcher } from "./team-switcher";

// Navigation items for admin
const navMain = [
	{
		title: "Header",
		url: "#",
		icon: LayoutDashboard,
		items: [{ title: "Logo y Navegación", url: "#header" }],
	},
	{
		title: "Hero",
		url: "#",
		icon: Image,
		items: [{ title: "Banners Principales", url: "#hero" }],
	},
	{
		title: "Productos",
		url: "#",
		icon: Package,
		items: [{ title: "Productos Destacados", url: "#products" }],
	},
	{
		title: "Marcas",
		url: "#",
		icon: Tags,
		items: [{ title: "Marcas Representadas", url: "#brands" }],
	},
	{
		title: "Clientes",
		url: "#",
		icon: Users,
		items: [{ title: "Clientes y Colaboradores", url: "#clients" }],
	},
	{
		title: "Equipo",
		url: "#",
		icon: UserCog,
		items: [{ title: "Equipo de Ventas", url: "#team" }],
	},
	{
		title: "Footer",
		url: "#",
		icon: Footprints,
		items: [{ title: "Información de Pie", url: "#footer" }],
	},
	{
		title: "SEO",
		url: "#",
		icon: Globe,
		items: [{ title: "Configuración SEO", url: "#seo" }],
	},
];

const data = {
	user: {
		name: "Administrador",
		email: "admin@biologistics.com",
		avatar: "",
	},
	teams: [
		{
			name: "Biologistics",
			logo: GalleryVerticalEnd,
			plan: "Admin",
		},
	],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	activeSection?: string;
	onSectionChange?: (section: string) => void;
	onCollapse?: (collapsed: boolean) => void;
}

export function AppSidebar({
	activeSection,
	onSectionChange,
	onCollapse,
	...props
}: AppSidebarProps) {
	const { state } = useSidebar();

	const handleLogout = async () => {
		await logoutAction();
		window.location.reload();
	};

	// Notify parent when sidebar state changes
	useEffect(() => {
		if (onCollapse) {
			onCollapse(state === "collapsed");
		}
	}, [state, onCollapse]);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					items={navMain}
					activeSection={activeSection}
					onSectionChange={onSectionChange}
				/>
			</SidebarContent>
			<SidebarFooter>
				<div className="px-3 py-2">
					<Button
						variant="ghost"
						className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
						onClick={handleLogout}
					>
						<LogOut className="h-4 w-4" />
						Cerrar Sesión
					</Button>
				</div>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
