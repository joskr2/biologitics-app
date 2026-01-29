"use client";

import { useActionState, useState, useCallback } from "react";
import { motion } from "motion/react";
import { submitContactForm, type FormState } from "@/app/actions";
import { CheckCircle2, Loader2 } from "lucide-react";
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
import { Field, FieldLabel, FieldError } from "@/components/ui/field";

const initialState: FormState = {
	success: false,
	message: "",
	errors: {},
	inputs: {},
};

export function ContactForm({
	title = "Solicita Información",
	subtitle = "Completa el formulario y nuestro equipo te contactará",
}) {
	const [state, action, isPending] = useActionState(
		submitContactForm,
		initialState,
	);

	const [formKey, setFormKey] = useState(0);

	const resetForm = useCallback(() => {
		setFormKey((prev) => prev + 1);
	}, []);

	if (state.success) {
		return (
			<SectionContent id="contacto" title={title} subtitle={subtitle}>
				<div className="max-w-2xl mx-auto text-center py-12 animate-in fade-in zoom-in duration-300">
					<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
						<CheckCircle2 className="w-8 h-8" />
					</div>
					<h3 className="text-2xl font-semibold mb-4">¡Mensaje Enviado!</h3>
					<p className="text-muted-foreground mb-8">
						{state.message || "Gracias por contactarnos."}
					</p>
					<Button variant="outline" onClick={resetForm}>
						Enviar otra consulta
					</Button>
				</div>
			</SectionContent>
		);
	}

	// Key forces form re-render to reset all inputs
	return (
		<SectionContent id="contacto" title={title} subtitle={subtitle}>
			<div className="max-w-2xl mx-auto" key={formKey}>
				<form action={action} className="space-y-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4 }}
						className="grid grid-cols-1 md:grid-cols-2 gap-6"
					>
						<Field data-invalid={!!state.errors?.nombre}>
							<FieldLabel htmlFor="nombre">Nombre completo *</FieldLabel>
							<Input
								id="nombre"
								name="nombre"
								defaultValue={state.inputs?.nombre ?? ""}
								required
							/>
							{state.errors?.nombre && (
								<FieldError>{state.errors.nombre[0]}</FieldError>
							)}
						</Field>

						<Field data-invalid={!!state.errors?.email}>
							<FieldLabel htmlFor="email">Correo electrónico *</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								defaultValue={state.inputs?.email ?? ""}
								required
							/>
							{state.errors?.email && (
								<FieldError>{state.errors.email[0]}</FieldError>
							)}
						</Field>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.1 }}
						className="grid grid-cols-1 md:grid-cols-2 gap-6"
					>
						<Field data-invalid={!!state.errors?.empresa}>
							<FieldLabel htmlFor="empresa">Empresa / Institución</FieldLabel>
							<Input
								id="empresa"
								name="empresa"
								defaultValue={state.inputs?.empresa ?? ""}
							/>
							{state.errors?.empresa && (
								<FieldError>{state.errors.empresa[0]}</FieldError>
							)}
						</Field>

						<Field data-invalid={!!state.errors?.telefono}>
							<FieldLabel htmlFor="telefono">Teléfono</FieldLabel>
							<Input
								id="telefono"
								name="telefono"
								type="tel"
								defaultValue={state.inputs?.telefono ?? ""}
							/>
							{state.errors?.telefono && (
								<FieldError>{state.errors.telefono[0]}</FieldError>
							)}
						</Field>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.2 }}
					>
						<Field data-invalid={!!state.errors?.producto}>
							<FieldLabel>Producto de interés</FieldLabel>
							<Select
								name="producto"
								defaultValue={state.inputs?.producto ?? ""}
							>
								<SelectTrigger aria-invalid={!!state.errors?.producto}>
									<SelectValue placeholder="Selecciona un producto..." />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="microscopio">
										Microscopio Digital Pro
									</SelectItem>
									<SelectItem value="centrifuga">
										Centrífuga de Laboratorio
									</SelectItem>
									<SelectItem value="espectrofotometro">
										Espectrofotómetro UV-Vis
									</SelectItem>
									<SelectItem value="incubadora">
										Incubadora de Cultivos
									</SelectItem>
									<SelectItem value="autoclave">Autoclave de Mesa</SelectItem>
									<SelectItem value="otro">Otro / Cotización General</SelectItem>
								</SelectContent>
							</Select>
							{state.errors?.producto && (
								<FieldError>{state.errors.producto[0]}</FieldError>
							)}
						</Field>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.3 }}
					>
						<Field data-invalid={!!state.errors?.mensaje}>
							<FieldLabel htmlFor="mensaje">Mensaje *</FieldLabel>
							<Textarea
								id="mensaje"
								name="mensaje"
								className="min-h-32"
								defaultValue={state.inputs?.mensaje ?? ""}
								required
							/>
							{state.errors?.mensaje && (
								<FieldError>{state.errors.mensaje[0]}</FieldError>
							)}
						</Field>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.4, delay: 0.4 }}
					>
						<Button
							type="submit"
							size="lg"
							className="w-full"
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Enviando solicitud...
								</>
							) : (
								"Enviar Solicitud"
							)}
						</Button>
					</motion.div>
				</form>
			</div>
		</SectionContent>
	);
}
