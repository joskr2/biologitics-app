// app/actions/admin.ts
"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { saveLandingData } from "@/app/lib/db";
import type { SiteContent } from "@/config/site-content";

// --- LOGIN ---
export async function loginAction(
	_prevState: { success: boolean; error?: string },
	formData: FormData,
) {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	// Credenciales hardcodeadas - puedes cambiarlas o usar variables de entorno
	const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@biologistics.com";
	const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "biologistics2024";

	if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
		const cookieStore = await cookies();
		cookieStore.set("admin_session", "true", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24, // 24 horas
			path: "/",
		});
		return { success: true };
	}

	return { success: false, error: "Credenciales inválidas" };
}

// --- LOGOUT ---
export async function logoutAction() {
	const cookieStore = await cookies();
	cookieStore.delete("admin_session");
}

// --- GUARDAR DATOS ---
export async function saveDashboardData(
	_prevState: { success: boolean; message?: string; error?: string },
	formData: FormData,
) {
	const jsonContent = formData.get("jsonContent") as string;

	if (!jsonContent) {
		return { success: false, error: "No se recibieron datos" };
	}

	try {
		const parsedData: SiteContent = JSON.parse(jsonContent);
		const result = await saveLandingData(parsedData);

		if (result.success) {
			revalidatePath("/");
			return { success: true, message: "¡Cambios guardados exitosamente!" };
		}

		return { success: false, error: result.error };
	} catch (error) {
		console.error("Parse error:", error);
		return { success: false, error: "Error al procesar los datos" };
	}
}

// --- VERIFICAR SESIÓN ---
export async function checkSession(): Promise<boolean> {
	const cookieStore = await cookies();
	return cookieStore.get("admin_session")?.value === "true";
}
