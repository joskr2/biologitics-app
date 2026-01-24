import { cookies } from "next/headers";
import { getLandingData } from "@/app/lib/db";
import { LoginForm } from "./components/login-form";
import Dashboard from "./dashboard/dashboard";

export const runtime = "edge";

export default async function AdminPage() {
	const cookieStore = await cookies();
	const isLoggedIn = cookieStore.get("admin_session")?.value === "true";

	// Si no está logueado, mostrar formulario de login
	if (!isLoggedIn) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<LoginForm />
			</div>
		);
	}

	// Si está logueado, cargar datos y mostrar dashboard
	const data = await getLandingData();
	return <Dashboard initialData={data} />;
}
