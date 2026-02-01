import { z } from "zod";

/**
 * Brand validation schema
 */
export const brandSchema = z.object({
	name: z.string().min(1, "El nombre es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
	logo: z.string().optional().default(""),
	website: z.string().url("URL inválida").optional().or(z.literal("")),
	order: z.number().int().optional().default(0),
});

export type BrandInput = z.infer<typeof brandSchema>;

/**
 * Product validation schema
 */
export const productSchema = z.object({
	title: z.string().min(1, "El título es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
	image: z.string().min(1, "La imagen es requerida"),
	features: z.array(z.string()).optional().default([]),
	specs: z.unknown().optional().default({}),
	category: z.string().optional().default(""),
	price: z
		.number()
		.positive("El precio debe ser positivo")
		.optional()
		.nullable(),
	inStock: z.boolean().optional().default(true),
	order: z.number().int().optional().default(0),
});

export type ProductInput = z.infer<typeof productSchema>;

/**
 * Client validation schema
 */
export const clientSchema = z.object({
	name: z.string().min(1, "El nombre es requerido"),
	description: z.string().min(1, "La descripción es requerida"),
	logo: z.string().optional().default(""),
	website: z.string().url("URL inválida").optional().or(z.literal("")),
	order: z.number().int().optional().default(0),
});

export type ClientInput = z.infer<typeof clientSchema>;

/**
 * Team member validation schema
 */
export const teamMemberSchema = z.object({
	name: z.string().min(1, "El nombre es requerido"),
	role: z.string().min(1, "El rol es requerido"),
	bio: z.string().min(1, "La biografía es requerida"),
	photo: z.string().optional().default(""),
	email: z.string().email("Email inválido").optional().or(z.literal("")),
	order: z.number().int().optional().default(0),
	social: z
		.object({
			linkedin: z.string().optional(),
			twitter: z.string().optional(),
		})
		.optional()
		.default({}),
});

export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

/**
 * Validation result type
 */
export interface ValidationResult {
	valid: boolean;
	error?: string;
	data?: unknown;
}

/**
 * Validate data against a Zod schema
 */
export function validateSchema<T>(
	schema: z.ZodSchema<T>,
	data: unknown,
): ValidationResult {
	const result = schema.safeParse(data);

	if (result.success) {
		return { valid: true, data: result.data };
	}

	const firstError = result.error.issues[0];
	return {
		valid: false,
		error: firstError
			? `${firstError.path.join(".")}: ${firstError.message}`
			: "Validation error",
	};
}

/**
 * Resource-specific validation helpers
 */
export const validations = {
	brand: (data: unknown) => validateSchema(brandSchema, data),
	product: (data: unknown) => validateSchema(productSchema, data),
	client: (data: unknown) => validateSchema(clientSchema, data),
	teamMember: (data: unknown) => validateSchema(teamMemberSchema, data),
};
