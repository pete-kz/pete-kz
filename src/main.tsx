import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme, type ThemeOptions } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { registerSW } from 'virtual:pwa-register'
import { SpeedInsights } from '@vercel/speed-insights/next'

const updateSW = registerSW({
	onNeedRefresh() {
		if (window.confirm('New content available. Reload?')) {
			updateSW(true)
		}
	},
	onOfflineReady() {
		window.alert('App has been loaded.')
	},
	onRegistered() {
		console.info('Service worker registered.')
	}
})

const AllyMapTheme: ThemeOptions = createTheme({
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
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Suspense fallback={null}>
			<ThemeProvider theme={AllyMapTheme}>
				<CssBaseline />
				<SpeedInsights />
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ThemeProvider>
		</Suspense>
	</React.StrictMode>,
)
