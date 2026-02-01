"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		console.error("Global error:", error);
	}, [error]);

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4">
			<div className="max-w-md w-full text-center space-y-6">
				<div className="flex justify-center">
					<div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
						<AlertCircle className="w-8 h-8 text-destructive" />
					</div>
				</div>

				<div className="space-y-2">
					<h1 className="text-2xl font-bold text-foreground">Algo salio mal</h1>
					<p className="text-muted-foreground">
						Ha ocurrido un error inesperado. Por favor, intenta recargar la
						pagina o vuelve al inicio.
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

				<div className="flex gap-3 justify-center">
					<Button
						variant="outline"
						onClick={() => {
							globalThis.window.location.href = "/";
						}}
					>
						<Home className="w-4 h-4 mr-2" />
						Volver al inicio
					</Button>
					<Button variant="default" onClick={reset}>
						<RefreshCw className="w-4 h-4 mr-2" />
						Recargar pagina
					</Button>
				</div>
			</div>
		</div>
	);
}
