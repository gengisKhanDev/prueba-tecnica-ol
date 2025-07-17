export interface Department {
	id: string
	name: string
	cities: City[]
}

export interface City {
	id: string
	name: string
	departmentId: string
}

export const departments: Department[] = [
	{
		id: "amazonas",
		name: "Amazonas",
		cities: [
			{ id: "leticia", name: "Leticia", departmentId: "amazonas" },
			{ id: "puerto-narino", name: "Puerto Nariño", departmentId: "amazonas" },
			{ id: "alcala", name: "Alcalá", departmentId: "amazonas" },
		],
	},
	{
		id: "antioquia",
		name: "Antioquia",
		cities: [
			{ id: "medellin", name: "Medellín", departmentId: "antioquia" },
			{ id: "bello", name: "Bello", departmentId: "antioquia" },
			{ id: "itagui", name: "Itagüí", departmentId: "antioquia" },
			{ id: "envigado", name: "Envigado", departmentId: "antioquia" },
		],
	},
	{
		id: "bogota",
		name: "Bogotá D.C.",
		cities: [{ id: "bogota", name: "Bogotá", departmentId: "bogota" }],
	},
	{
		id: "valle",
		name: "Valle del Cauca",
		cities: [
			{ id: "cali", name: "Cali", departmentId: "valle" },
			{ id: "palmira", name: "Palmira", departmentId: "valle" },
			{ id: "buenaventura", name: "Buenaventura", departmentId: "valle" },
		],
	},
	{
		id: "cundinamarca",
		name: "Cundinamarca",
		cities: [
			{ id: "soacha", name: "Soacha", departmentId: "cundinamarca" },
			{ id: "girardot", name: "Girardot", departmentId: "cundinamarca" },
			{ id: "zipaquira", name: "Zipaquirá", departmentId: "cundinamarca" },
		],
	},
]

// Mock establishment data for editing mode
export const mockEstablishmentSummary = {
	totalIngresos: 100000000000, // $100.000.000.000
	totalEmpleados: 999,
}
