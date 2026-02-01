"use client";

import { ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher({
	teams,
}: {
	teams: {
		name: string;
		logo: React.ElementType;
		plan: string;
	}[];
}) {
	const { isMobile } = useSidebar();
	const [activeTeam, setActiveTeam] = React.useState(teams[0]);
	const [isOpen, setIsOpen] = React.useState(false);

	if (!activeTeam) {
		return null;
	}

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
					<DropdownMenuTrigger
						role="button"
						tabIndex={0}
						className="flex h-12 w-full items-center gap-2 rounded-md bg-primary/10 p-2 text-left cursor-pointer hover:bg-primary/20 transition-colors data-[state=open]:bg-primary/20 outline-none select-none"
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								setIsOpen(true);
							}
						}}
					>
						<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary/20">
							<activeTeam.logo className="size-4" />
						</div>
						<div className="grid flex-1 text-left text-sm leading-tight">
							<span className="truncate font-medium">{activeTeam.name}</span>
							<span className="truncate text-xs">{activeTeam.plan}</span>
						</div>
						<ChevronsUpDown className="ml-auto opacity-70" />
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						align="start"
						side={isMobile ? "bottom" : "right"}
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuLabel className="text-muted-foreground text-xs px-2">
								Teams
							</DropdownMenuLabel>
							{teams.map((team, index) => (
								<DropdownMenuItem
									key={`${team.name}-${index}`}
									onClick={() => {
										setActiveTeam(team);
										setIsOpen(false);
									}}
									className="gap-2 p-2"
								>
									<div className="flex size-6 items-center justify-center rounded-md border">
										<team.logo className="size-3.5 shrink-0" />
									</div>
									{team.name}
									<DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
								</DropdownMenuItem>
							))}
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem className="gap-2 p-2">
							<div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
								<Plus className="size-4" />
							</div>
							<div className="text-muted-foreground font-medium">Add team</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
