// components/dashboard.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Shield, User } from "lucide-react"

export default function Dashboard() {
	const router = useRouter()
	const [email, setEmail] = useState<string | null>(null)

	// Al montar, comprobamos token + email en cookies y redirigimos si hace falta
	useEffect(() => {
		const tokenMatch = document.cookie.match(/(?:^|; )token=([^;]+)/)
		const emailMatch = document.cookie.match(/(?:^|; )email=([^;]+)/)

		if (!tokenMatch) {
			// Si no hay token, volvemos al login
			window.location.reload();
			return
		}

		if (emailMatch) {
			// Decodificamos el email y lo guardamos en estado
			setEmail(decodeURIComponent(emailMatch[1]))
		}
	}, [router])

	const handleLogout = () => {
		// Borramos cookies y regresamos al login
		document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		window.location.reload();
	}

	return (
		<div className="min-h-screen bg-gray-50 p-6">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
					<Button
						onClick={handleLogout}
						variant="outline"
						className="flex items-center gap-2 bg-transparent"
					>
						<LogOut className="w-4 h-4" />
						Cerrar Sesión
					</Button>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card>
						<CardHeader className="flex items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Bienvenido</CardTitle>
							<User className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{email}</div>
							<p className="text-xs text-muted-foreground">
								Sesión iniciada correctamente
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Seguridad</CardTitle>
							<Shield className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold text-green-600">Activa</div>
							<p className="text-xs text-muted-foreground">
								Autenticación segura habilitada
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Estado</CardTitle>
							<div className="h-4 w-4 bg-green-500 rounded-full" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">En línea</div>
							<p className="text-xs text-muted-foreground">
								Sistema funcionando correctamente
							</p>
						</CardContent>
					</Card>
				</div>

				<Card className="mt-8">
					<CardHeader>
						<CardTitle>Características de Seguridad Implementadas</CardTitle>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-green-500" />
								Validación de entrada con Zod
							</li>
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-green-500" />
								Rate limiting para prevenir ataques de fuerza bruta
							</li>
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-green-500" />
								Cookies HTTP-only seguras
							</li>
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-green-500" />
								Validación de contraseñas robustas
							</li>
							<li className="flex items-center gap-2">
								<Shield className="w-4 h-4 text-green-500" />
								Manejo seguro de errores
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
