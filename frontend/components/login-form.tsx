"use client"

import { useActionState } from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, AlertCircle } from "lucide-react"
import { loginAction } from "@/lib/auth-actions"

export default function LoginForm() {
	const [state, action, isPending] = useActionState(loginAction, undefined)
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)

	useEffect(() => {
		if (state?.message === "success" && state.token) {
			document.cookie = `token=${state.token}; path=/; max-age=${60 * 60 * 24}`

			window.location.reload();
		}
	}, [state, router])

	return (
		<div className="min-h-screen flex items-center justify-center relative">
			{/* Fondo difuminado */}
			<div
				className="absolute inset-0 bg-cover bg-center bg-no-repeat"
				style={{
					backgroundImage: "url(/images/login-bg.png)",
					filter: "blur(2px)",
				}}
			/>
			<div className="absolute inset-0 bg-black/30" />

			{/* Header */}
			<div className="absolute top-0 left-0 right-0 flex justify-between items-center p-6 z-10">
				<div className="flex items-center space-x-2">
					<div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
						<span className="text-white font-bold text-sm">OL</span>
					</div>
					<span className="text-white text-sm">Software &</span>
					<span className="text-white text-sm">Development</span>
				</div>
				<div className="flex items-center space-x-2 bg-black/20 rounded-full px-3 py-1">
					<div className="w-6 h-6 bg-amber-600 rounded-full" />
					<span className="text-white text-sm">Beneficios por renovar</span>
				</div>
			</div>

			{/* Card de login */}
			<Card className="w-full max-w-md mx-4 relative z-10 shadow-2xl">
				<CardHeader className="text-center pb-4">
					<CardTitle className="text-xl font-semibold text-gray-800">
						Debes iniciar sesión para acceder a la plataforma
					</CardTitle>
					<p className="text-sm text-gray-600 mt-2">
						Digita tu documento de identidad del propietario o representante legal y la contraseña
					</p>
				</CardHeader>

				<CardContent className="space-y-4">
					<form action={action} className="space-y-4">
						{/* Campo email */}
						<div className="space-y-2">
							<Label htmlFor="email" className="text-sm font-medium text-gray-700">
								Documento
							</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="Ingresa tu email"
								className="w-full"
								disabled={isPending}
								autoComplete="email"
								required
							/>
							{state?.errors?.email && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="w-4 h-4" />
									{state.errors.email[0]}
								</p>
							)}
						</div>

						{/* Campo contraseña */}
						<div className="space-y-2">
							<Label htmlFor="password" className="text-sm font-medium text-gray-700">
								Contraseña
							</Label>
							<div className="relative">
								<Input
									id="password"
									name="password"
									type={showPassword ? "text" : "password"}
									placeholder="Ingresa tu contraseña"
									className="w-full pr-10"
									disabled={isPending}
									autoComplete="current-password"
									required
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center"
									onClick={() => setShowPassword(!showPassword)}
									disabled={isPending}
								>
									{showPassword ? (
										<EyeOff className="h-4 w-4 text-gray-400" />
									) : (
										<Eye className="h-4 w-4 text-gray-400" />
									)}
								</button>
							</div>
							{state?.errors?.password && (
								<p className="text-sm text-red-600 flex items-center gap-1">
									<AlertCircle className="w-4 h-4" />
									{state.errors.password[0]}
								</p>
							)}
						</div>

						{/* Checkbox de términos */}
						<div className="flex items-center space-x-2">
							<Checkbox id="acceptTerms" name="acceptTerms" disabled={isPending} required />
							<Label htmlFor="acceptTerms" className="text-sm text-gray-600 cursor-pointer">
								Acepto términos y condiciones
							</Label>
						</div>
						{state?.errors?.acceptTerms && (
							<p className="text-sm text-red-600 flex items-center gap-1">
								<AlertCircle className="w-4 h-4" />
								{state.errors.acceptTerms[0]}
							</p>
						)}

						{/* Error general */}
						{state?.errors?._form && (
							<Alert variant="destructive">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{state.errors._form[0]}</AlertDescription>
							</Alert>
						)}

						{/* Credenciales de prueba */}
						<div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
							<p className="font-medium mb-1">Credenciales de prueba:</p>
							<p>Admin: admin@admin.com / Password123</p>
							<p>Usuario: aux@aux.com / Password123</p>
						</div>

						{/* Botón enviar */}
						<Button
							type="submit"
							className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
							disabled={isPending}
						>
							{isPending ? "Iniciando sesión..." : "Iniciar sesión"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
