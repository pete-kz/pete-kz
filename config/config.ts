const API: { baseURL: string } = { baseURL: 'https://api.pete.kz' }

const main = {
    navLinks: [['navigation_main_bar.pages.main', '/'], ['navigation_main_bar.pages.support', '/support'], ['navigation_main_bar.pages.about_us', '/about-us']],
    howToInstallPictures: {
        IOS: [{ original: '/images/pwa/ios/1.jpeg' }, { original: '/images/pwa/ios/2.jpeg' }, { original: '/images/pwa/ios/3.jpeg' }]
    },
    bottomPWABar: {
        pages: [
            ['bottom_pwa_bar.pages.profile', '/pwa/profile'], 
            ['bottom_pwa_bar.pages.home', '/pwa'], 
            ['bottom_pwa_bar.pages.settings', '/pwa/settings']
        ], 
    },
    languages: [
        ['ru', '🇷🇺 Русский'], 
        ['kz', '🇰🇿 Қазақ тілі'], 
        ['en', '🇬🇧 English']
    ]
}

export { API, main }
