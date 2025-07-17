import { apiPublic } from "./config/apiPublic"

export interface LoginResponse {
	token: string
	email: string
}

export async function loginApi(
	email: string,
	password: string
): Promise<LoginResponse> {
	const { data } = await apiPublic.post<LoginResponse>("/auth/login", {
		email,
		password,
	})
	return data
}
