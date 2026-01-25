"use server";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { z } from "zod";

const formSchema = z.object({
	nombre: z.string().min(2, "El nombre es muy corto"),
	email: z.email("Email inválido"),
	empresa: z.string().optional(),
	telefono: z.string().optional(),
	producto: z.string().optional(),
	mensaje: z.string().min(10, "El mensaje es muy corto"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export type FormState = {
	success: boolean;
	message?: string;
	errors?: Record<string, string[]>;
	inputs?: Partial<FormSchemaType>;
};

interface CloudflareEnv {
	NEXT_INC_CACHE_R2_BUCKET?: {
		put: (key: string, value: Uint8Array) => Promise<void>;
	};
}

export async function submitContactForm(
	_prevState: FormState,
	formData: FormData,
): Promise<FormState> {
	const rawData = {
		nombre: formData.get("nombre") as string,
		email: formData.get("email") as string,
		empresa: formData.get("empresa") as string,
		telefono: formData.get("telefono") as string,
		producto: formData.get("producto") as string,
		mensaje: formData.get("mensaje") as string,
	};

	const validated = formSchema.safeParse(rawData);

	if (!validated.success) {
		return {
			success: false,
			errors: validated.error.flatten().fieldErrors,
			inputs: rawData,
		};
	}

	// Guardar en R2
	try {
		const { env } = (await getCloudflareContext({ async: true }).catch(() => ({
			env: undefined,
		}))) as { env: CloudflareEnv | undefined };

		if (env?.NEXT_INC_CACHE_R2_BUCKET) {
			const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
			const responseData = {
				id,
				...rawData,
				fecha: new Date().toISOString(),
			};

			const jsonString = JSON.stringify(responseData, null, 2);
			const encoder = new TextEncoder();
			const data = encoder.encode(jsonString);

			await env.NEXT_INC_CACHE_R2_BUCKET.put(`form-responses/${id}.json`, data);
		}
	} catch (error) {
		console.error("Error guardando respuesta:", error);
	}

	return {
		success: true,
		message: "Mensaje enviado con éxito",
		inputs: {},
	};
}
