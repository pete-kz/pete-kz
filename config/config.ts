const API: { baseURL: string } = { baseURL: 'https://api.pete.kz' }

const main = {
    navLinks: [['navigation_main_bar.pages.main', '/'], ['navigation_main_bar.pages.support', '/support'], ['navigation_main_bar.pages.about_us', '/about-us']],
    howToInstallPictures: {
        IOS: [{ original: '/images/pwa/ios/1.jpeg' }, { original: '/images/pwa/ios/2.jpeg' }, { original: '/images/pwa/ios/3.jpeg' }]
    },
    languages: [
        ['ru', '🇷🇺 Русский'], 
        ['kk', '🇰🇿 Қазақ тілі'], 
        ['en-US', '🇬🇧 English']
    ]
}

export { API, main }
