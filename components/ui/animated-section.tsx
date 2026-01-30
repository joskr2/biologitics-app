"use client";

import { ReactNode } from "react";
import { motion, MotionProps } from "motion/react";
import Image from "next/image";
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
					className="flex-1 min-w-50"
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

// ============================================
// Apple-Style Scroll Animations
// ============================================

interface ParallaxProps {
	children: ReactNode;
	className?: string;
	speed?: number; // 0-1, lower is slower
}

export function Parallax({
	children,
	className,
	speed = 0.5,
}: Readonly<ParallaxProps>) {
	return (
		<motion.div
			className={className}
			style={{ y: 0 }}
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: false, amount: 0.3 }}
			transition={{ duration: 0.8 }}
		>
			<motion.div
				style={{ y: 0 }}
				whileInView={{ y: -20 * speed }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				viewport={{ once: false }}
			>
				{children}
			</motion.div>
		</motion.div>
	);
}

interface RevealScaleProps {
	children: ReactNode;
	className?: string;
	scale?: number; // 0.8 to 1
}

export function RevealScale({
	children,
	className,
	scale = 0.95,
}: Readonly<RevealScaleProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, scale }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.7, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

interface StickyRevealProps {
	children: ReactNode;
	className?: string;
}

export function StickyReveal({ children, className }: Readonly<StickyRevealProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 0.8, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

interface ImageRevealProps {
	src: string;
	alt: string;
	className?: string;
	sizes?: string;
}

export function ImageReveal({
	src,
	alt,
	className,
	sizes = "100vw",
}: Readonly<ImageRevealProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 1.1 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true, amount: 0.3 }}
			transition={{ duration: 1, ease: "easeOut" }}
			className={className}
		>
			<Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
		</motion.div>
	);
}

interface CounterAnimationProps {
	value: string;
	label: string;
	className?: string;
}

export function CounterAnimation({
	value,
	label,
	className,
}: Readonly<CounterAnimationProps>) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.5 }}
			className={className}
		>
			<motion.span
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				transition={{ duration: 0.3, delay: 0.2 }}
			>
				{value}
			</motion.span>
			<span className="block text-sm text-muted-foreground mt-1">{label}</span>
		</motion.div>
	);
}
