"use client";

import {
	AlertCircle,
	ArrowLeft,
	LayoutDashboard,
	RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		console.error("Admin error:", error);
	}, [error]);

	const handleRetry = () => {
		reset();
	};

	const handleGoHome = () => {
		router.push("/admin");
	};

	const handleGoBack = () => {
		router.back();
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="max-w-lg w-full text-center space-y-6">
				<div className="flex justify-center">
					<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-foreground">
						Error en el panel de administracion
					</h1>
					<p className="text-muted-foreground">
						Ha ocurrido un error al cargar esta seccion. Puedes reintentar o
						volver al panel principal.
					</p>
				</div>

				{error.message && process.env.NODE_ENV === "development" && (
					<div className="p-4 rounded-lg bg-muted/50 text-left text-sm overflow-auto">
						<p className="font-medium mb-2">Error:</p>
						<p className="text-muted-foreground wrap-break-words">
							{error.message}
						</p>
						{error.stack && (
							<pre className="mt-2 text-xs text-muted-foreground overflow-auto max-h-40">
								{error.stack}
							</pre>
						)}
						{error.digest && (
							<p className="mt-2 text-xs text-muted-foreground">
								ID del error: {error.digest}
							</p>
						)}
					</div>
				)}

				<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
					<Button
						variant="outline"
						onClick={handleGoBack}
						className="sm:w-auto w-full"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Volver atras
					</Button>
					<Button
						variant="outline"
						onClick={handleGoHome}
						className="sm:w-auto w-full"
					>
						<LayoutDashboard className="w-4 h-4 mr-2" />
						Panel principal
					</Button>
					<Button
						variant="default"
						onClick={handleRetry}
						className="sm:w-auto w-full"
					>
						<RefreshCw className="w-4 h-4 mr-2" />
						Reintentar
					</Button>
				</div>
			</div>
		</div>
	);
}
