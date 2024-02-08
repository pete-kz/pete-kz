import { type ThemeOptions } from '@mui/material'

const API: { baseURL: string } = { baseURL: 'https://pete-api-yklft.ondigitalocean.app' } //http://localhost:3000

const main = {
    navLinks: [['navigation_main_bar.pages.main', '/'], ['navigation_main_bar.pages.contacts', '/contacts'], ['navigation_main_bar.pages.about_us', '/about']],
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

interface uiType {
    mui: ThemeOptions
}

const ui: uiType = {
    mui: {
        palette: {
            mode: 'dark',
            primary: {
                main: '#6750a4',
    
            },
            secondary: {
                main: '#625b71',
                
            },
            error: {
                main: '#b3271e'
            },
            background: {
                default: '#fef7ff',
                paper: '#fef7ff'
            },
            text: {
                primary: '#1d1b20',
                secondary: '#49454f'
            }
        },
        shape: {
            borderRadius: 15,
        },
    }
}
export { API, main, ui }
