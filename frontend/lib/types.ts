export interface Merchant {
	id: string
	razonSocial: string
	telefono: string
	correoElectronico: string
	fechaRegistro: string
	cantidadEstablecimientos: number
	estado: "Activo" | "Inactivo"
}

export interface PaginationState {
	currentPage: number
	itemsPerPage: number
	totalItems: number
	totalPages: number
}

export interface TableFilters {
	search: string
	status: "all" | "Activo" | "Inactivo"
}
