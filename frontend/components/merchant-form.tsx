// components/merchant-form.tsx
"use client"

import { useState, useEffect, useActionState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle, CheckCircle, User, LogOut } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { createMerchantAction, updateMerchantAction } from "@/lib/merchant-form-actions"
import { departments, mockEstablishmentSummary } from "@/lib/locations-data"
import type { MerchantFormData } from "@/lib/merchant-form-validation"

interface MerchantFormProps {
	mode: "create" | "edit"
	merchantId?: string
	initialData?: Partial<MerchantFormData>
	onBack: () => void
}

export default function MerchantForm({
	mode,
	merchantId,
	initialData,
	onBack,
}: MerchantFormProps) {
	const router = useRouter()

	// Proteger acceso leyendo la cookie "token" y opcionalmente "email"
	const [userEmail, setUserEmail] = useState<string | null>(null)
	useEffect(() => {
		const tokenMatch = document.cookie.match(/(?:^|; )token=([^;]+)/)
		const emailMatch = document.cookie.match(/(?:^|; )email=([^;]+)/)
		if (!tokenMatch) {
			window.location.reload();
			return
		}
		if (emailMatch) {
			setUserEmail(decodeURIComponent(emailMatch[1]))
		}
	}, [router])

	// Estado del formulario
	const [selectedDepartment, setSelectedDepartment] = useState(
		initialData?.departamento || ""
	)
	const [selectedCity, setSelectedCity] = useState(initialData?.ciudad || "")
	const [selectedDate, setSelectedDate] = useState<Date | undefined>(
		initialData?.fechaRegistro ? new Date(initialData.fechaRegistro) : undefined
	)
	const [poseeEstablecimientos, setPoseeEstablecimientos] = useState(
		initialData?.poseeEstablecimientos || false
	)

	// Acción server
	const action =
		mode === "create"
			? createMerchantAction
			: updateMerchantAction.bind(null, merchantId || "")
	const [state, formAction, isPending] = useActionState(action, undefined)

	// Ciudades disponibles según departamento
	const availableCities =
		departments.find((d) => d.id === selectedDepartment)?.cities || []

	useEffect(() => {
		if (
			selectedDepartment &&
			!availableCities.find((c) => c.id === selectedCity)
		) {
			setSelectedCity("")
		}
	}, [selectedDepartment, availableCities, selectedCity])

	const handleLogout = () => {
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		window.location.reload();
	}

	const formatCurrency = (amount: number) =>
		new Intl.NumberFormat("es-CO", {
			style: "currency",
			currency: "COP",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount)

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex justify-between items-center">
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2">
							<div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
								<span className="text-white font-bold text-sm">OL</span>
							</div>
							<div className="text-sm text-gray-600">
								<div>Software &</div>
								<div>Development</div>
							</div>
						</div>
						<div className="flex space-x-1 ml-8">
							<button
								onClick={onBack}
								className="px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 text-gray-600 hover:text-gray-800"
							>
								<div className="w-2 h-2 bg-gray-400 rounded-full" />
								<span>Lista Formulario</span>
							</button>
							<div className="w-px h-6 bg-gray-300 self-center mx-2" />
							<button className="px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-2 bg-blue-100 text-blue-700">
								<div className="w-2 h-2 bg-blue-500 rounded-full" />
								<span>Crear Formulario</span>
							</button>
						</div>
					</div>
					<div className="flex items-center space-x-4">
						<div className="flex items-center space-x-2 bg-amber-100 rounded-full px-3 py-1">
							<div className="w-6 h-6 bg-amber-600 rounded-full" />
							<span className="text-sm text-amber-800">Beneficios por renovar</span>
						</div>
						<div className="flex items-center space-x-3">
							<User className="w-8 h-8 text-gray-400" />
							<div className="text-right">
								<div className="text-sm font-medium text-blue-600">¡Bienvenido!</div>
								<div className="text-xs text-gray-500">{userEmail}</div>
							</div>
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
				</div>
			</div>

			{/* Main Content */}
			<div className="p-6">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold text-gray-900 mb-6">
						{mode === "create" ? "Nuevo Comerciante" : `Empresa ${merchantId}`}
					</h1>

					<form action={formAction} className="space-y-6">
						<Card>
							<CardHeader>
								<CardTitle className="text-lg font-semibold text-blue-700">
									Datos Generales
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Razón Social */}
									<div className="space-y-2">
										<Label htmlFor="razonSocial" className="text-sm font-medium text-gray-700">
											Razón Social <span className="text-red-500">*</span>
										</Label>
										<Input
											id="razonSocial"
											name="razonSocial"
											type="text"
											placeholder="Ingresa la razón social"
											defaultValue={initialData?.razonSocial}
											disabled={isPending}
											className={cn(state?.errors?.razonSocial && "border-red-500")}
											required
										/>
										{state?.errors?.razonSocial && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.razonSocial[0]}
											</p>
										)}
									</div>

									{/* Correo Electrónico */}
									<div className="space-y-2">
										<Label htmlFor="correoElectronico" className="text-sm font-medium text-gray-700">
											Correo electrónico
										</Label>
										<Input
											id="correoElectronico"
											name="correoElectronico"
											type="email"
											placeholder="ejemplo@correo.com"
											defaultValue={initialData?.correoElectronico}
											disabled={isPending}
											className={cn(state?.errors?.correoElectronico && "border-red-500")}
										/>
										{state?.errors?.correoElectronico && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.correoElectronico[0]}
											</p>
										)}
									</div>

									{/* Departamento */}
									<div className="space-y-2">
										<Label htmlFor="departamento" className="text-sm font-medium text-gray-700">
											Departamento <span className="text-red-500">*</span>
										</Label>
										<Select
											name="departamento"
											value={selectedDepartment}
											onValueChange={setSelectedDepartment}
											disabled={isPending}
											required
										>
											<SelectTrigger className={cn(state?.errors?.departamento && "border-red-500")}>
												<SelectValue placeholder="Selecciona un departamento" />
											</SelectTrigger>
											<SelectContent>
												{departments.map((d) => (
													<SelectItem key={d.id} value={d.id}>
														{d.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{state?.errors?.departamento && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.departamento[0]}
											</p>
										)}
									</div>

									{/* Fecha de Registro */}
									<div className="space-y-2">
										<Label htmlFor="fechaRegistro" className="text-sm font-medium text-gray-700">
											Fecha de registro <span className="text-red-500">*</span>
										</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className={cn(
														"w-full justify-start text-left font-normal",
														!selectedDate && "text-muted-foreground",
														state?.errors?.fechaRegistro && "border-red-500"
													)}
													disabled={isPending}
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{selectedDate
														? format(selectedDate, "PPP", { locale: es })
														: "Selecciona una fecha"}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={selectedDate}
													onSelect={setSelectedDate}
													disabled={(date) =>
														date > new Date() || date < new Date("1900-01-01")
													}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<input
											type="hidden"
											name="fechaRegistro"
											value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
										/>
										{state?.errors?.fechaRegistro && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.fechaRegistro[0]}
											</p>
										)}
									</div>

									{/* Ciudad */}
									<div className="space-y-2">
										<Label htmlFor="ciudad" className="text-sm font-medium text-gray-700">
											Ciudad <span className="text-red-500">*</span>
										</Label>
										<Select
											name="ciudad"
											value={selectedCity}
											onValueChange={setSelectedCity}
											disabled={isPending || !selectedDepartment}
											required
										>
											<SelectTrigger className={cn(state?.errors?.ciudad && "border-red-500")}>
												<SelectValue placeholder="Selecciona una ciudad" />
											</SelectTrigger>
											<SelectContent>
												{availableCities.map((c) => (
													<SelectItem key={c.id} value={c.id}>
														{c.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{state?.errors?.ciudad && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.ciudad[0]}
											</p>
										)}
									</div>

									{/* Teléfono */}
									<div className="space-y-2">
										<Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
											Teléfono
										</Label>
										<Input
											id="telefono"
											name="telefono"
											type="tel"
											placeholder="+57 300 123 4567"
											defaultValue={initialData?.telefono}
											disabled={isPending}
											className={cn(state?.errors?.telefono && "border-red-500")}
										/>
										{state?.errors?.telefono && (
											<p className="text-sm text-red-600 flex items-center gap-1">
												<AlertCircle className="w-4 h-4" />
												{state.errors.telefono[0]}
											</p>
										)}
									</div>
								</div>

								{/* Posee establecimientos */}
								<div className="flex items-center space-x-2">
									<Checkbox
										id="poseeEstablecimientos"
										name="poseeEstablecimientos"
										checked={poseeEstablecimientos}
										onCheckedChange={(c) => setPoseeEstablecimientos(c as boolean)}
										disabled={isPending}
									/>
									<Label htmlFor="poseeEstablecimientos" className="text-sm text-gray-700 cursor-pointer">
										¿Posee establecimientos?
									</Label>
								</div>
							</CardContent>
						</Card>

						{/* Mensajes de éxito/error */}
						{state?.success && (
							<Alert className="border-green-200 bg-green-50">
								<CheckCircle className="h-4 w-4 text-green-600" />
								<AlertDescription className="text-green-800">{state.message}</AlertDescription>
							</Alert>
						)}
						{state?.errors?._form && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{state.errors._form[0]}</AlertDescription>
							</Alert>
						)}
					</form>

					{/* Footer edición */}
					{mode === "edit" && (
						<div className="mt-8 bg-blue-900 text-white p-6 rounded-lg">
							<div className="flex justify-between items-center">
								<div className="flex space-x-12">
									<div>
										<p className="text-sm text-blue-200">Total Ingresos:</p>
										<p className="text-2xl font-bold">
											{formatCurrency(mockEstablishmentSummary.totalIngresos)}
										</p>
									</div>
									<div>
										<p className="text-sm text-blue-200">Empleados:</p>
										<p className="text-2xl font-bold">
											{mockEstablishmentSummary.totalEmpleados}
										</p>
									</div>
								</div>
								<div className="flex items-center space-x-4">
									<p className="text-sm">
										Si ya ingresaste todos los datos, crea tu formulario aquí
									</p>
									<Button
										onClick={(e) => {
											e.preventDefault()
											const f = document.querySelector("form")
											if (f) formAction(new FormData(f))
										}}
										className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2"
										disabled={isPending}
									>
										{isPending ? "Enviando..." : "Enviar Formulario"}
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Footer global */}
			<div className="bg-blue-900 text-white text-center py-4 mt-8">
				<p className="text-sm">Prueba Técnica De Uso Exclusivo de OLSoftware S.A.</p>
			</div>
		</div>
	)
}
