// config/apiPrivate.ts
import axios from "axios"
import { getTokenFromCookie } from "@/lib/auth-utils"

export const apiPrivate = axios.create({
	baseURL: process.env.API_URL || "http://localhost:8080",
	headers: { "Accept-Language": "es" },
})

apiPrivate.interceptors.request.use((config) => {
	const token = getTokenFromCookie("token")
	if (token) {
		config.headers = config.headers ?? {}
		config.headers["Authorization"] = `Bearer ${token}`
	}
	return config
})
