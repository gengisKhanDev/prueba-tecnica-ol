"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
	Edit,
	Trash2,
	Download,
	Plus,
	LogOut,
	User,
	CheckCircle,
	XCircle,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import {
	getMerchants,
	toggleMerchantStatus,
	deleteMerchant,
	downloadMerchantsCSV,
	getMerchantById,
} from "@/lib/merchants-api"
import type { Merchant, PaginationState } from "@/lib/types"
import MerchantForm from "./merchant-form"
import type { MerchantFormData } from "@/lib/merchant-form-validation"

export default function HomePage() {
	const router = useRouter()

	// Protege la ruta: si no hay token, vuelve al login (/)
	useEffect(() => {
		const hasToken = !!document.cookie.match(/(?:^|; )token=[^;]+/)
		if (!hasToken) window.location.reload();
	}, [router])

	const [merchants, setMerchants] = useState<Merchant[]>([])
	const [loading, setLoading] = useState(true)
	const [pagination, setPagination] = useState<PaginationState>({
		currentPage: 1,
		itemsPerPage: 10,
		totalItems: 0,
		totalPages: 0,
	})
	const [activeTab, setActiveTab] = useState<"lista" | "crear">("lista")
	const [currentView, setCurrentView] = useState<"list" | "create" | "edit">("list")
	const [editingMerchantId, setEditingMerchantId] = useState<string | null>(null)
	const [editData, setEditData] = useState<MerchantFormData | null>(null)

	useEffect(() => {
		loadMerchants()
	}, [pagination.currentPage, pagination.itemsPerPage])

	useEffect(() => {
		if (currentView === "edit" && editingMerchantId) {
			(async () => {
				try {
					const m = await getMerchantById(editingMerchantId)
					setEditData({
						razonSocial: m.razonSocial,
						departamento: m.departamento,
						ciudad: m.ciudad,
						telefono: m.telefono,
						correoElectronico: m.correoElectronico,
						fechaRegistro: m.fechaRegistro,
						poseeEstablecimientos: m.poseeEstablecimientos,
					})
				} catch (e) {
					console.error("Error cargando comerciante:", e)
				}
			})()
		}
	}, [currentView, editingMerchantId])


	const loadMerchants = async () => {
		setLoading(true)
		try {
			const result = await getMerchants(pagination.currentPage, pagination.itemsPerPage)
			setMerchants(result.data)
			setPagination((prev) => ({
				...prev,
				totalItems: result.total,
				totalPages: result.totalPages,
			}))
		} catch (error) {
			console.error("Error loading merchants:", error)
		} finally {
			setLoading(false)
		}
	}

	const handleStatusToggle = async (id: string) => {
		try {
			await toggleMerchantStatus(id)
			loadMerchants()
		} catch (error) {
			console.error("Error toggling status:", error)
		}
	}

	const handleDelete = async (id: string) => {
		try {
			await deleteMerchant(id)
			loadMerchants()
		} catch (error) {
			console.error("Error deleting merchant:", error)
		}
	}

	const handleDownloadCSV = async () => {
		try {
			const csvContent = await downloadMerchantsCSV()
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
			const link = document.createElement("a")
			const url = URL.createObjectURL(blob)
			link.setAttribute("href", url)
			link.setAttribute("download", "comerciantes_reporte.csv")
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} catch (error) {
			console.error("Error downloading CSV:", error)
		}
	}

	const handleLogout = () => {
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		window.location.reload();
	}

	const handlePageChange = (page: number) => {
		setPagination((prev) => ({ ...prev, currentPage: page }))
	}

	const handleItemsPerPageChange = (value: string) => {
		setPagination((prev) => ({
			...prev,
			itemsPerPage: Number(value),
			currentPage: 1,
		}))
	}

	const handleCreateNew = () => {
		setActiveTab("crear")
		setCurrentView("create")
	}

	const handleEdit = (merchantId: string) => {
		setEditingMerchantId(merchantId)
		setCurrentView("edit")
	}

	const handleBackToList = () => {
		setActiveTab("lista")
		setCurrentView("list")
		setEditingMerchantId(null)
	}

	if (currentView === "create") {
		return <MerchantForm mode="create" onBack={handleBackToList} />
	}

	if (currentView === "edit" && editingMerchantId) {
		// muestra un loader mientras llega editData
		if (!editData) {
			return <div>Cargando datos del comerciante...</div>
		}
		return (
			<MerchantForm
				mode="edit"
				merchantId={editingMerchantId}
				initialData={editData}
				onBack={handleBackToList}
			/>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex justify-between items-center">
					{/* Logo y tabs */}
					<div className="flex items-center space-x-8">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
								<span className="text-white font-bold text-sm">OL</span>
							</div>
							<div className="text-sm text-gray-600">
								<div>Software &</div>
								<div>Development</div>
							</div>
						</div>
						<button
							onClick={handleBackToList}
							className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${activeTab === "lista"
								? "bg-blue-100 text-blue-700"
								: "text-gray-600 hover:text-gray-800"
								}`}
						>
							<div className="w-2 h-2 bg-blue-500 rounded-full" />
							<span>Lista Formulario</span>
						</button>
						<button
							onClick={handleCreateNew}
							className={`px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 ${activeTab === "crear"
								? "bg-blue-100 text-blue-700"
								: "text-gray-600 hover:text-gray-800"
								}`}
						>
							<Plus className="w-4 h-4" />
							<span>Crear Formulario</span>
						</button>
					</div>
					{/* Botón logout */}
					<Button
						onClick={handleLogout}
						variant="ghost"
						size="sm"
						className="text-gray-500 hover:text-gray-700"
					>
						<LogOut className="w-4 h-4" />
					</Button>
				</div>
			</div>

			{/* Contenido principal */}
			<div className="p-6 max-w-7xl mx-auto space-y-6">
				{/* Acciones superior */}
				<div className="flex justify-between items-center">
					<h1 className="text-2xl font-bold text-gray-900">
						Lista Formularios Creados
					</h1>
					<div className="flex space-x-3">
						<Button onClick={handleCreateNew} className="bg-pink-500 hover:bg-pink-600 text-white">
							<Plus className="w-4 h-4 mr-2" />
							Crear Formulario Nuevo
						</Button>
						<Button
							onClick={handleDownloadCSV}
							variant="outline"
							className="border-pink-200 text-pink-600 hover:bg-pink-50"
						>
							<Download className="w-4 h-4 mr-2" />
							Descargar CSV
						</Button>
					</div>
				</div>

				{/* Tabla */}
				<Card>
					<CardContent className="p-0">
						<Table>
							<TableHeader>
								<TableRow className="bg-blue-500">
									<TableHead className="text-white">Razón Social</TableHead>
									<TableHead className="text-white">Teléfono</TableHead>
									<TableHead className="text-white">Correo Electrónico</TableHead>
									<TableHead className="text-white">Fecha Registro</TableHead>
									<TableHead className="text-white"># Establecimientos</TableHead>
									<TableHead className="text-white">Estado</TableHead>
									<TableHead className="text-white">Acciones</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{loading ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-8">
											Cargando...
										</TableCell>
									</TableRow>
								) : merchants.length === 0 ? (
									<TableRow>
										<TableCell colSpan={7} className="text-center py-8">
											No hay comerciantes registrados
										</TableCell>
									</TableRow>
								) : (
									merchants.map((m) => (
										<TableRow key={m.id} className="hover:bg-gray-50">
											<TableCell className="font-medium">{m.razonSocial}</TableCell>
											<TableCell>{m.telefono}</TableCell>
											<TableCell>{m.correoElectronico}</TableCell>
											<TableCell>{m.fechaRegistro}</TableCell>
											<TableCell className="text-center">
												{m.cantidadEstablecimientos}
											</TableCell>
											<TableCell>
												<Badge
													variant={m.estado === "Activo" ? "default" : "secondary"}
												>
													{m.estado}
												</Badge>
											</TableCell>
											<TableCell>
												<div className="flex space-x-2">
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleEdit(m.id)}
													>
														<Edit className="w-4 h-4" />
													</Button>
													<Button
														size="sm"
														variant="ghost"
														onClick={() => handleStatusToggle(m.id)}
													>
														{m.estado === "Activo" ? (
															<XCircle className="w-4 h-4 text-red-600" />
														) : (
															<CheckCircle className="w-4 h-4 text-green-600" />
														)}
													</Button>
													<AlertDialog>
														<AlertDialogTrigger asChild>
															<Button size="sm" variant="ghost">
																<Trash2 className="w-4 h-4" />
															</Button>
														</AlertDialogTrigger>
														<AlertDialogContent>
															<AlertDialogHeader>
																<AlertDialogTitle>
																	¿Eliminar comerciante?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	Esta acción no se puede deshacer.
																</AlertDialogDescription>
															</AlertDialogHeader>
															<AlertDialogFooter>
																<AlertDialogCancel>Cancelar</AlertDialogCancel>
																<AlertDialogAction
																	onClick={() => handleDelete(m.id)}
																>
																	Eliminar
																</AlertDialogAction>
															</AlertDialogFooter>
														</AlertDialogContent>
													</AlertDialog>
												</div>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				{/* Paginación */}
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<span>Items:</span>
						<Select
							value={String(pagination.itemsPerPage)}
							onValueChange={handleItemsPerPageChange}
						>
							<SelectTrigger className="w-16">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="5">5</SelectItem>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="15">15</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.currentPage - 1)}
							disabled={pagination.currentPage === 1}
						>
							<ChevronLeft />
						</Button>
						{Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
							(page) => (
								<Button
									key={page}
									variant={
										page === pagination.currentPage ? "default" : "outline"
									}
									size="sm"
									onClick={() => handlePageChange(page)}
								>
									{page}
								</Button>
							)
						)}
						<Button
							variant="outline"
							size="sm"
							onClick={() => handlePageChange(pagination.currentPage + 1)}
							disabled={pagination.currentPage === pagination.totalPages}
						>
							<ChevronRight />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
