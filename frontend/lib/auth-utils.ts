export function getTokenFromCookie(name: string): string | null {
	if (typeof document === "undefined") return null
	const match = document.cookie.match(
		new RegExp(
			"(?:^|; )" +
			name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") +
			"=([^;]*)"
		)
	)
	return match ? decodeURIComponent(match[1]) : null
}
