"use client";

import { AlertCircle, ArrowLeft, Package, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ProductError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const router = useRouter();

	useEffect(() => {
		console.error("Product page error:", error);
	}, [error]);

	const handleRetry = () => {
		reset();
	};

	const handleGoBack = () => {
		router.back();
	};

	const handleGoProducts = () => {
		router.push("/productos");
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
						Error al cargar el producto
					</h1>
					<p className="text-muted-foreground">
						No pudimos cargar la informacion del producto. Por favor, reintenta
						o vuelve a la lista de productos.
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
						onClick={handleGoProducts}
						className="sm:w-auto w-full"
					>
						<Package className="w-4 h-4 mr-2" />
						Ver productos
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
