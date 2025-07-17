import { z } from "zod"

export const loginSchema = z.object({
	email: z
		.string()
		.min(1, { message: "El email es requerido" })
		.email({ message: "Formato de email inválido" })
		.max(255, { message: "Email demasiado largo" })
		.trim()
		.toLowerCase(),
	password: z
		.string()
		.min(8, { message: "La contraseña debe tener al menos 8 caracteres" })
		.max(128, { message: "Contraseña demasiado larga" }),
	acceptTerms: z.boolean().refine((val) => val === true, {
		message: "Debes aceptar los términos y condiciones",
	}),
})

export type LoginFormData = z.infer<typeof loginSchema>

export interface FormState {
	errors?: {
		email?: string[]
		password?: string[]
		acceptTerms?: string[]
		_form?: string[]
	}
	message?: string
	user?: {
		id: string
		email: string
		name: string
		role: "admin" | "user"
	}
}
