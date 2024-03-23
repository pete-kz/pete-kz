// @ts-expect-error vite 
const API: { baseURL: string } = { baseURL: import.meta.env.VITE_API as string } as const

const main = {
    navLinks: [['navigation_main_bar.pages.main', '/'], ['navigation_main_bar.pages.support', '/support'], ['navigation_main_bar.pages.about_us', '/about-us']],
    howToInstallPictures: {
        IOS: [{ original: '/images/pwa/ios/1.jpeg' }, { original: '/images/pwa/ios/2.jpeg' }, { original: '/images/pwa/ios/3.jpeg' }]
    },
    languages: [
        ['ru', '🇷🇺 Русский'], 
        ['kz', '🇰🇿 Қазақ тілі'], 
        ['en-US', '🇬🇧 English']
    ]
} as const

export { API, main }
