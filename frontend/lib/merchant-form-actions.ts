"use server"

import { merchantFormSchema, type MerchantFormState } from "./merchant-form-validation"
import { apiPrivate } from "./config/apiPrivate"

export async function createMerchantAction(
	prevState: MerchantFormState | undefined,
	formData: FormData
): Promise<MerchantFormState> {
	const parsed = merchantFormSchema.safeParse({
		razonSocial: formData.get("razonSocial"),
		departamento: formData.get("departamento"),
		ciudad: formData.get("ciudad"),
		telefono: formData.get("telefono") || undefined,
		correoElectronico: formData.get("correoElectronico") || undefined,
		fechaRegistro: formData.get("fechaRegistro"),
		poseeEstablecimientos: formData.get("poseeEstablecimientos") === "on",
	})
	if (!parsed.success) {
		return { errors: parsed.error.flatten().fieldErrors }
	}

	const payload = {
		nombre: parsed.data.razonSocial,
		idMunicipio: Number(parsed.data.ciudad),
		telefono: parsed.data.telefono,
		correoElectronico: parsed.data.correoElectronico,
		fechaRegistro: parsed.data.fechaRegistro,
		estado: parsed.data.poseeEstablecimientos ? "A" : "I",
	}

	try {
		const res = await apiPrivate.post("/api/comerciantes", payload)
		// tu GlobalExceptionHandler devuelve { success, message, data, validationErrors }
		if (res.data.success) {
			return { success: true, message: res.data.message }
		}
		// validación servidor
		return { errors: res.data.data.validationErrors }
	} catch (err: any) {
		if (err.response?.data?.validationErrors) {
			return { errors: err.response.data.validationErrors }
		}
		const msg = err.response?.data?.message || "Error de servidor. Intenta más tarde."
		return { errors: { _form: [msg] } }
	}
}


export async function updateMerchantAction(
	merchantId: string,
	prevState: MerchantFormState | undefined,
	formData: FormData
): Promise<MerchantFormState> {
	const parsed = merchantFormSchema.safeParse({
		razonSocial: formData.get("razonSocial"),
		departamento: formData.get("departamento"),
		ciudad: formData.get("ciudad"),
		telefono: formData.get("telefono") || undefined,
		correoElectronico: formData.get("correoElectronico") || undefined,
		fechaRegistro: formData.get("fechaRegistro"),
		poseeEstablecimientos: formData.get("poseeEstablecimientos") === "on",
	})
	if (!parsed.success) {
		return { errors: parsed.error.flatten().fieldErrors }
	}

	const payload = {
		nombre: parsed.data.razonSocial,
		idMunicipio: Number(parsed.data.ciudad),
		telefono: parsed.data.telefono,
		correoElectronico: parsed.data.correoElectronico,
		fechaRegistro: parsed.data.fechaRegistro,
		estado: parsed.data.poseeEstablecimientos ? "A" : "I",
	}

	try {
		const res = await apiPrivate.put(`/api/comerciantes/${merchantId}`, payload)
		if (res.data.success) {
			return { success: true, message: res.data.message }
		}
		return { errors: res.data.data.validationErrors }
	} catch (err: any) {
		if (err.response?.data?.validationErrors) {
			return { errors: err.response.data.validationErrors }
		}
		const msg = err.response?.data?.message || "Error de servidor. Intenta más tarde."
		return { errors: { _form: [msg] } }
	}
}
