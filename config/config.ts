const API: { baseURL: string } = {
	// @ts-expect-error vite
	baseURL: import.meta.env.VITE_API as string,
} as const

const main = {
	navLinks: [
		["navigation_main_bar.pages.main", "/"],
		["navigation_main_bar.pages.support", "/support"],
		["navigation_main_bar.pages.about_us", "/about-us"],
	],
	howToInstallPictures: {
		IOS: ["/images/pwa/ios/1.jpeg", "/images/pwa/ios/2.jpeg", "/images/pwa/ios/3.jpeg"],
	},
	languages: [
		["ru", "🇷🇺 Русский"],
		["kz", "🇰🇿 Қазақ тілі"],
		["en-US", "🇬🇧 English"],
	],
} as const

export { API, main }
