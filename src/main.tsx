import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme, type ThemeOptions } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/700.css'
import { registerSW } from 'virtual:pwa-register'
import { ui } from '@config'

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

const AllyMapTheme: ThemeOptions = createTheme(ui.mui)

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
