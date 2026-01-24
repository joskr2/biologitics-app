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
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader>
					<CardTitle>Bienvenido/a</CardTitle>
					<CardDescription>Ingresa tus credenciales</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={action}>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="email">Correo</FieldLabel>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="correo@example.com"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="password">Contraseña</FieldLabel>
								<Input id="password" name="password" type="password" required />
							</Field>
							{state.error && (
								<p className="text-sm text-red-500">{state.error}</p>
							)}
							<Field>
								<Button type="submit" disabled={isPending} className="w-full">
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
