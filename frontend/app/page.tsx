// app/page.tsx   (ó pages/index.tsx si usas Pages Router)
"use client"

import { useState, useEffect } from "react"
import LoginForm from "@/components/login-form"
import HomePage from "@/components/home-page"

export default function Page() {
	const [isAuthed, setIsAuthed] = useState<boolean | null>(null)

	useEffect(() => {
		const hasToken = !!document.cookie.match(/(?:^|; )token=([^;]+)/)
		setIsAuthed(hasToken)
	}, [])

	if (isAuthed === null) return null

	return isAuthed
		? <HomePage />
		: <LoginForm />
}
