"use client";

import { ReactNode } from "react";
import { motion, MotionProps } from "motion/react";
import { cn } from "@/lib/utils";

type AnimationType =
	| "fade-in"
	| "fade-in-up"
	| "fade-in-down"
	| "fade-in-left"
	| "fade-in-right"
	| "zoom-in"
	| "slide-up"
	| "blur-in";

interface AnimatedSectionProps extends Omit<MotionProps, "initial"> {
	children: ReactNode;
	className?: string;
	animation?: AnimationType;
	delay?: number;
	viewportMargin?: string;
}

const animations: Record<AnimationType, MotionProps> = {
	"fade-in": {
		initial: { opacity: 0 },
		whileInView: { opacity: 1 },
		viewport: { once: true },
	},
	"fade-in-up": {
		initial: { opacity: 0, y: 50 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true },
	},
	"fade-in-down": {
		initial: { opacity: 0, y: -50 },
		whileInView: { opacity: 1, y: 0 },
		viewport: { once: true },
	},
	"fade-in-left": {
		initial: { opacity: 0, x: -50 },
		whileInView: { opacity: 1, x: 0 },
		viewport: { once: true },
	},
	"fade-in-right": {
		initial: { opacity: 0, x: 50 },
		whileInView: { opacity: 1, x: 0 },
		viewport: { once: true },
	},
	"zoom-in": {
		initial: { opacity: 0, scale: 0.8 },
		whileInView: { opacity: 1, scale: 1 },
		viewport: { once: true },
	},
	"slide-up": {
		initial: { y: 100 },
		whileInView: { y: 0 },
		viewport: { once: true },
	},
	"blur-in": {
		initial: { opacity: 0, filter: "blur(10px)" },
		whileInView: { opacity: 1, filter: "blur(0px)" },
		viewport: { once: true },
	},
};

export function AnimatedSection({
	children,
	className,
	animation = "fade-in-up",
	delay = 0,
	viewportMargin = "-50px",
	transition = { duration: 0.6, ease: "easeOut" },
	...props
}: Readonly<AnimatedSectionProps>) {
	const motionProps: MotionProps = {
		...animations[animation],
		transition: { ...transition, delay },
		viewport: { margin: viewportMargin },
		...props,
	};

	return (
		<motion.div className={cn(className)} {...motionProps}>
			{children}
		</motion.div>
	);
}

// Staggered animation wrapper for lists
interface StaggeredListProps {
	children: ReactNode[];
	className?: string;
	animation?: AnimationType;
	staggerDelay?: number;
}

export function StaggeredList({
	children,
	className,
	animation = "fade-in-up",
	staggerDelay = 0.1,
}: Readonly<StaggeredListProps>) {
	return (
		<div className={cn("flex flex-wrap gap-4", className)}>
			{children.map((child, index) => (
				<AnimatedSection
					key={index}
					animation={animation}
					delay={staggerDelay * index}
					className="flex-1 min-w-[200px]"
				>
					{child}
				</AnimatedSection>
			))}
		</div>
	);
}

// Card reveal animation
interface RevealCardProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function RevealCard({
	children,
	className,
	delay = 0,
}: Readonly<RevealCardProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay, ease: "easeOut" }}
			className={cn(className)}
		>
			{children}
		</motion.div>
	);
}

// Hero text animation
interface HeroTextProps {
	children: ReactNode;
	className?: string;
	delay?: number;
}

export function HeroText({ children, className, delay = 0 }: Readonly<HeroTextProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
			animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
			transition={{ duration: 0.8, delay, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
