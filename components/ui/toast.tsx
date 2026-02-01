"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ToastType = "default" | "success" | "destructive" | "warning";

interface Toast {
	id: string;
	title: string;
	description?: string;
	type: ToastType;
	duration?: number;
}

interface ToastContextValue {
	toast: (options: Omit<Toast, "id">) => void;
	dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}
	return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const toast = useCallback((options: Omit<Toast, "id">) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { ...options, id }]);

		if (options.duration !== 0) {
			setTimeout(() => {
				setToasts((prev) => prev.filter((t) => t.id !== id));
			}, options.duration || 5000);
		}
	}, []);

	const dismiss = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toast, dismiss }}>
			{children}
			<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
				{toasts.map((t) => (
					<div
						key={t.id}
						className={cn(
							"flex items-start gap-3 p-4 rounded-lg shadow-lg border animate-in slide-in-from-bottom-5",
							{
								"bg-background border-border": t.type === "default",
								"bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800":
									t.type === "success",
								"bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800":
									t.type === "destructive",
								"bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800":
									t.type === "warning",
							},
						)}
					>
						<div className="flex-1">
							<p className="font-medium text-sm">{t.title}</p>
							{t.description && (
								<p className="text-sm text-muted-foreground mt-1">
									{t.description}
								</p>
							)}
						</div>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => dismiss(t.id)}
							className="shrink-0"
						>
							<X className="size-4" />
						</Button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	);
}

export function useToastNotification() {
	const { toast, dismiss } = useToast();

	const showSuccess = useCallback(
		(title: string, description?: string) => {
			toast({ title, description, type: "success" });
		},
		[toast],
	);

	const showError = useCallback(
		(title: string, description?: string) => {
			toast({ title, description, type: "destructive" });
		},
		[toast],
	);

	const showWarning = useCallback(
		(title: string, description?: string) => {
			toast({ title, description, type: "warning" });
		},
		[toast],
	);

	const showInfo = useCallback(
		(title: string, description?: string) => {
			toast({ title, description, type: "default" });
		},
		[toast],
	);

	return {
		toast,
		dismiss,
		showSuccess,
		showError,
		showWarning,
		showInfo,
	};
}
