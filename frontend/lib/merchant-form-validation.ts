import { z } from "zod"

export const merchantFormSchema = z.object({
	razonSocial: z
		.string()
		.min(1, { message: "La razón social es requerida" })
		.min(3, { message: "La razón social debe tener al menos 3 caracteres" })
		.max(100, { message: "La razón social no puede exceder 100 caracteres" })
		.trim(),
	departamento: z.string().min(1, { message: "El departamento es requerido" }),
	ciudad: z.string().min(1, { message: "La ciudad es requerida" }),
	telefono: z
		.string()
		.optional()
		.refine((val) => !val || /^\+?[\d\s\-$$$$]{7,15}$/.test(val), {
			message: "Formato de teléfono inválido",
		}),
	correoElectronico: z
		.string()
		.optional()
		.refine((val) => !val || z.string().email().safeParse(val).success, {
			message: "Formato de email inválido",
		}),
	fechaRegistro: z
		.string()
		.min(1, { message: "La fecha de registro es requerida" })
		.refine((val) => !isNaN(Date.parse(val)), {
			message: "Fecha inválida",
		}),
	poseeEstablecimientos: z.boolean().default(false),
})

export type MerchantFormData = z.infer<typeof merchantFormSchema>

export interface MerchantFormState {
	errors?: {
		razonSocial?: string[]
		departamento?: string[]
		ciudad?: string[]
		telefono?: string[]
		correoElectronico?: string[]
		fechaRegistro?: string[]
		poseeEstablecimientos?: string[]
		_form?: string[]
	}
	message?: string
	success?: boolean
}

export interface EstablishmentSummary {
	totalIngresos: number
	totalEmpleados: number
}
