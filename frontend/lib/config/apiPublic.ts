import axios, { type AxiosInstance } from "axios"

export const apiPublic: AxiosInstance = axios.create({
	baseURL: process.env.API_URL || "http://localhost:8080",
	headers: {
		"Accept-Language": "es",
		"Content-Type": "application/json",
	},
	withCredentials: false,
})
