"use client"

import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible"
import type { ReactNode } from "react"

function Collapsible({ ...props }: CollapsiblePrimitive.Root.Props) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
	children,
	asChild,
	...props
}: CollapsiblePrimitive.Trigger.Props & {
	children?: ReactNode;
	asChild?: boolean;
}) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { asChild: _, ...rest } = props;
	return (
		<CollapsiblePrimitive.Trigger data-slot="collapsible-trigger" {...rest}>
			{children}
		</CollapsiblePrimitive.Trigger>
	);
}

function CollapsibleContent({ ...props }: CollapsiblePrimitive.Panel.Props) {
	return (
		<CollapsiblePrimitive.Panel data-slot="collapsible-content" {...props} />
	);
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
