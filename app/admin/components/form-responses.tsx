"use client";

import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface FormResponse {
	id: string;
	nombre: string;
	email: string;
	empresa?: string;
	telefono?: string;
	producto?: string;
	mensaje: string;
	fecha: string;
}

interface PaginationData {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

interface ApiResponse {
	data: FormResponse[];
	pagination: PaginationData;
}

export function FormResponses() {
	const [responses, setResponses] = useState<FormResponse[]>([]);
	const [pagination, setPagination] = useState<PaginationData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchResponses = useCallback(async (page = 1) => {
		setLoading(true);
		setError(null);

		try {
			const res = await fetch(`/api/form-responses?page=${page}`);
			if (!res.ok) {
				throw new Error("Error al cargar respuestas");
			}

			const data: ApiResponse = await res.json();
			setResponses(data.data);
			setPagination(data.pagination);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Error desconocido");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchResponses(1);
	}, [fetchResponses]);

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-PE", {
			day: "2-digit",
			month: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-12">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
				{error}
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-bold">Respuestas del Formulario</h2>
				<span className="text-sm text-muted-foreground">
					{pagination?.total || 0} respuestas en total
				</span>
			</div>

			{responses.length === 0 ? (
				<div className="text-center py-12 text-muted-foreground">
					No hay respuestas aún
				</div>
			) : (
				<>
					<div className="rounded-lg border bg-card">
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-b bg-muted/50">
										<th className="h-10 px-4 text-left align-middle font-medium">
											Fecha
										</th>
										<th className="h-10 px-4 text-left align-middle font-medium">
											Nombre
										</th>
										<th className="h-10 px-4 text-left align-middle font-medium">
											Email
										</th>
										<th className="h-10 px-4 text-left align-middle font-medium">
											Empresa
										</th>
										<th className="h-10 px-4 text-left align-middle font-medium">
											Producto
										</th>
										<th className="h-10 px-4 text-left align-middle font-medium">
											Mensaje
										</th>
									</tr>
								</thead>
								<tbody>
									{responses.map((response) => (
										<tr
											key={response.id}
											className="border-b last:border-0 hover:bg-muted/25"
										>
											<td className="p-4 align-middle whitespace-nowrap">
												{formatDate(response.fecha)}
											</td>
											<td className="p-4 align-middle">{response.nombre}</td>
											<td className="p-4 align-middle">{response.email}</td>
											<td className="p-4 align-middle">
												{response.empresa || "-"}
											</td>
											<td className="p-4 align-middle">
												{response.producto || "-"}
											</td>
											<td className="p-4 align-middle max-w-xs truncate">
												{response.mensaje}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{pagination && pagination.totalPages > 1 && (
						<div className="flex items-center justify-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => fetchResponses(pagination.page - 1)}
								disabled={!pagination.hasPrev}
							>
								Anterior
							</Button>
							<span className="text-sm text-muted-foreground">
								Página {pagination.page} de {pagination.totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={() => fetchResponses(pagination.page + 1)}
								disabled={!pagination.hasNext}
							>
								Siguiente
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
