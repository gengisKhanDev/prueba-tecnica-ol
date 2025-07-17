"use server"

import { loginSchema, type FormState } from "./validation"
import { loginApi } from "./auth-context"


export async function loginAction(
	prevState: FormState | undefined,
	formData: FormData
): Promise<FormState & { token?: string; email?: string }> {
	// 1) Validar con Zod
	const parsed = loginSchema.safeParse({
		email: formData.get("email"),
		password: formData.get("password"),
		acceptTerms: formData.get("acceptTerms") === "on",
	})
	if (!parsed.success) {
		return { errors: parsed.error.flatten().fieldErrors }
	}

	const { email, password } = parsed.data

	try {
		// 2) Llamada real al backend
		const { token, email: returnedEmail } = await loginApi(email, password)

		// 3) Devolver token + email al cliente
		return {
			message: "success",
			token,
			email: returnedEmail,
		}
	} catch (err: any) {
		const msg =
			err.response?.data?.message ||
			err.response?.statusText ||
			"Error al iniciar sesión"
		return {
			errors: { _form: [msg] },
		}
	}
}
