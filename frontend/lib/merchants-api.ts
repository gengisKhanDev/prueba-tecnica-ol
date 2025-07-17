import type { Merchant } from "./types"
import { apiPrivate } from "./config/apiPrivate"
import type { MerchantFormData } from "@/lib/merchant-form-validation"

// Estructura de una respuesta paginada
export interface ApiPage<T> {
	page: number
	size: number
	totalElements: number
	totalPages: number
	offset: number
	next: string | null
	previous: string | null
	content: T[]
}

export interface ApiResponseList<T> {
	timestamp: string
	success: boolean
	data: ApiPage<T>
	message: string
}

export interface ApiResponseSingle<T> {
	timestamp: string
	success: boolean
	data: T
	message: string
}

interface ComerciantesDto {
	id: number
	nombre: string
	idMunicipio: number
	telefono: string | null
	correoElectronico: string | null
	fechaRegistro: string
	estado: string
	cantidadEstablecimientos: number
}

export async function getMerchants(
	page = 1,
	size = 10
): Promise<{
	data: Merchant[]
	total: number
	page: number
	size: number
	totalPages: number
}> {
	const backendPage = page - 1
	const res = await apiPrivate.get<ApiResponseList<ComerciantesDto>>(
		`/api/comerciantes?page=${backendPage}&size=${size}`
	)
	const dtoPage = res.data.data

	const merchants: Merchant[] = dtoPage.content.map((c) => ({
		id: String(c.id),
		razonSocial: c.nombre,
		telefono: c.telefono ? `+57 ${c.telefono}` : "",
		correoElectronico: c.correoElectronico ?? "",
		fechaRegistro: c.fechaRegistro,
		cantidadEstablecimientos: c.cantidadEstablecimientos,
		estado: c.estado === "A" ? "Activo" : "Inactivo",
	}))

	return {
		data: merchants,
		total: dtoPage.totalElements,
		page: dtoPage.page + 1,
		size: dtoPage.size,
		totalPages: dtoPage.totalPages,
	}
}

// Mapeo auxiliar para toggle y delete
function mapDtoToMerchant(c: ComerciantesDto): Merchant {
	return {
		id: String(c.id),
		razonSocial: c.nombre,
		telefono: c.telefono ? `+57 ${c.telefono}` : "",
		correoElectronico: c.correoElectronico ?? "",
		fechaRegistro: c.fechaRegistro,
		cantidadEstablecimientos: c.cantidadEstablecimientos,
		estado: c.estado === "A" ? "Activo" : "Inactivo",
	}
}

export async function toggleMerchantStatus(id: string): Promise<Merchant> {
	const res = await apiPrivate.patch<ApiResponseSingle<ComerciantesDto>>(
		`/api/comerciantes/${id}/estado`
	)
	return mapDtoToMerchant(res.data.data)
}

export async function deleteMerchant(id: string): Promise<void> {
	await apiPrivate.delete(`/api/comerciantes/${id}`)
}

export async function downloadMerchantsCSV(): Promise<string> {
	const res = await apiPrivate.get<string>(
		"/api/reportes/comerciantes",
		{
			headers: { Accept: "text/csv" },
			responseType: "text",
		}
	)
	return res.data
}

export async function getMerchantById(
	id: string
): Promise<MerchantFormData> {
	const res = await apiPrivate.get<ApiResponseSingle<ComerciantesDto>>(
		`/api/comerciantes/${id}`
	)
	const c = res.data.data

	let departamento = ""
	let ciudad = ""
	switch (c.idMunicipio) {
		case 1:
			departamento = "bogota"
			ciudad = "bogota"
			break
		case 2:
			departamento = "antioquia"
			ciudad = "medellin"
			break
		case 3:
			departamento = "valle"
			ciudad = "cali"
			break
		case 4:
			departamento = "antioquia"
			ciudad = "bello"
			break
		case 5:
			departamento = "valle"
			ciudad = "palmira"
			break
		default:
			break
	}

	return {
		razonSocial: c.nombre,
		departamento,
		ciudad,
		telefono: c.telefono ?? "",
		correoElectronico: c.correoElectronico ?? "",
		fechaRegistro: c.fechaRegistro,
		poseeEstablecimientos: c.cantidadEstablecimientos > 0,
	}
}
