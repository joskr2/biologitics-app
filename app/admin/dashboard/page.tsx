import { getLandingData } from "@/app/lib/db";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
	const data = await getLandingData();
	return <Dashboard initialData={data} />;
}
