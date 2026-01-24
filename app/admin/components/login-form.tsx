"use client";

import { Loader2 } from "lucide-react";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [state, action, isPending] = useActionState(loginAction, {
		success: false,
	});

	if (state.success) {
		if (typeof window !== "undefined") {
			window.location.reload();
		}
		return (
			<div className="flex flex-col gap-6 items-center justify-center p-10">
				<Loader2 className="h-8 w-8 animate-spin" />
				<p>Iniciando sesión...</p>
			</div>
		);
	}

	return (
		<div
			className={cn("flex flex-col gap-6 w-full max-w-md", className)}
			{...props}
		>
			<Card className="w-full shadow-lg">
				<CardHeader className="space-y-1 pb-4">
					<CardTitle className="text-2xl font-bold">Bienvenido/a</CardTitle>
					<CardDescription>
						Ingresa tus credenciales para acceder al panel de administración
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<form action={action}>
						<FieldGroup className="space-y-4">
							<Field>
								<FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="correo@example.com"
									required
									className="h-11"
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Contraseña</FieldLabel>
								<Input
									id="password"
									name="password"
									type="password"
									required
									className="h-11"
								/>
							</Field>
							{state.error && (
								<p className="text-sm text-red-500 bg-red-50 p-2 rounded">
									{state.error}
								</p>
							)}
							<Field>
								<Button
									type="submit"
									disabled={isPending}
									className="w-full h-11 text-base font-medium"
								>
									{isPending ? (
										<>
											<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											Verificando...
										</>
									) : (
										"Iniciar sesión"
									)}
								</Button>
							</Field>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
