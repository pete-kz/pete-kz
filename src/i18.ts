import i18n from 'i18next'
import HttpBackend from 'i18next-http-backend'
import detector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

i18n
	.use(HttpBackend)
	.use(detector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'ru',
		debug: false,
		detection: {
			// options for language detection - you can add more configurations here
		},
		backend: {
			loadPath: '/locales/{{lng}}.json', // corrected path
		},
		interpolation: {
			escapeValue: false, // not needed for React as it escapes by default
		},
	})

export default i18n
