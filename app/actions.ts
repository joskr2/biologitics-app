// UBICACIÓN: app/actions.ts
'use server'

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

export async function submitContactForm(
  _prevState: FormState, 
  formData: FormData
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

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: "Mensaje enviado con éxito",
    inputs: {},
  };
}
