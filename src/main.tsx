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

const updateSW = registerSW({
	onNeedRefresh() {
		if (confirm('New content available. Reload?')) {
			console.log('updated!')
			updateSW(true)
		}
	},
	onOfflineReady() {
		console.log('offline ready')
	},
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
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</ThemeProvider>
		</Suspense>
	</React.StrictMode>,
)
