"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SectionContent } from "@/components/ui/section-content";
import {
	Field,
	FieldLabel,
	FieldError,
	FieldContent,
} from "@/components/ui/field";

const formSchema = z.object({
	nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
	email: z.email("Ingresa un correo electrónico válido"),
	empresa: z.string().optional(),
	telefono: z.string().optional(),
	producto: z.string().optional(),
	mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

type FormValues = z.infer<typeof formSchema>;

function zodResolver(schema: typeof formSchema) {
	return async (values: Record<string, unknown>) => {
		const result = await schema.safeParseAsync(values);
		if (result.success) {
			return { values: result.data, errors: {} };
		}
		const errors: Record<string, { message?: string }> = {};
		for (const issue of result.error.issues) {
			const path = issue.path.join(".");
			if (path) {
				errors[path] = { message: issue.message };
			}
		}
		return { values: {}, errors };
	};
}

export function ContactForm({
	title = "Solicita Información",
	subtitle = "Completa el formulario y nuestro equipo te contactará en menos de 24 horas",
}: {
	title?: string;
	subtitle?: string;
} = {}) {
	const [isSubmitted, setIsSubmitted] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			nombre: "",
			email: "",
			empresa: "",
			telefono: "",
			producto: "",
			mensaje: "",
		},
	});

	const onSubmit = async (data: FormValues) => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		console.log(data);
		setIsSubmitted(true);
	};

	if (isSubmitted) {
		return (
			<SectionContent id="contacto" title={title} subtitle={subtitle}>
				<div className="max-w-2xl mx-auto text-center py-12">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
						<svg
							className="w-8 h-8"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
					<h3 className="text-2xl font-semibold mb-4">¡Mensaje Enviado!</h3>
					<p className="text-muted-foreground mb-8">
						Gracias por tu interés. Nuestro equipo revisará tu solicitud y te
						contactará en menos de 24 horas.
					</p>
					<Button variant="outline" onClick={() => setIsSubmitted(false)}>
						Enviar otra consulta
					</Button>
				</div>
			</SectionContent>
		);
	}

	return (
		<SectionContent id="contacto" title={title} subtitle={subtitle}>
			<div className="max-w-2xl mx-auto">
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Controller
							control={form.control}
							name="nombre"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor={field.name}>Nombre completo *</FieldLabel>
									<Input {...field} id={field.name} aria-invalid={!!fieldState.error} />
									{fieldState.error && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="email"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor={field.name}>Correo electrónico *</FieldLabel>
									<Input
										{...field}
										id={field.name}
										type="email"
										aria-invalid={!!fieldState.error}
									/>
									{fieldState.error && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<Controller
							control={form.control}
							name="empresa"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor={field.name}>Empresa / Institución</FieldLabel>
									<Input {...field} id={field.name} />
									{fieldState.error && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
						<Controller
							control={form.control}
							name="telefono"
							render={({ field, fieldState }) => (
								<Field data-invalid={!!fieldState.error}>
									<FieldLabel htmlFor={field.name}>Teléfono</FieldLabel>
									<Input {...field} id={field.name} type="tel" />
									{fieldState.error && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</div>

					<Controller
						control={form.control}
						name="producto"
						render={({ field, fieldState }) => (
							<Field orientation="responsive" data-invalid={!!fieldState.error}>
								<FieldContent>
									<FieldLabel htmlFor={field.name}>Producto de interés</FieldLabel>
									{fieldState.error && <FieldError errors={[fieldState.error]} />}
								</FieldContent>
								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger id={field.name} aria-invalid={!!fieldState.error}>
										<SelectValue placeholder="Selecciona un producto..." />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="microscopio">Microscopio Digital Pro</SelectItem>
										<SelectItem value="centrifuga">Centrífuga de Laboratorio</SelectItem>
										<SelectItem value="espectrofotometro">Espectrofotómetro UV-Vis</SelectItem>
										<SelectItem value="incubadora">Incubadora de Cultivos</SelectItem>
										<SelectItem value="autoclave">Autoclave de Mesa</SelectItem>
										<SelectItem value="otro">Otro / Cotización General</SelectItem>
									</SelectContent>
								</Select>
							</Field>
						)}
					/>

					<Controller
						control={form.control}
						name="mensaje"
						render={({ field, fieldState }) => (
							<Field data-invalid={!!fieldState.error}>
								<FieldLabel htmlFor={field.name}>Mensaje *</FieldLabel>
								<Textarea
									{...field}
									id={field.name}
									aria-invalid={!!fieldState.error}
									className="min-h-30"
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Button type="submit" size="lg" className="w-full">
						Enviar Solicitud
					</Button>
				</form>
			</div>
		</SectionContent>
	);
}
