// System
import React from 'react'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { useRoutes } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import type { RouteObject } from 'react-router-dom'
import './i18.js'
import { ThemeProvider } from '@/Components/theme-provder.js'
// Layouts
import PWALayout from './Layouts/pwa.js'

// Pages
import Main from './Pages/Main'
import Login from './Pages/Authentication/Login.js'
import Register from './Pages/Authentication/Register'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile.js'
import PetPage from './Pages/Pet.js'
import AddPetPage from './Pages/PetAdd.js'
import IndexPage from './Pages/Index.js'
import SupportPage from './Pages/Support.js'
import WebLayout from './Layouts/web.js'

export default function App() {

	const loginPage = '/auth/login'

	const routes: RouteObject[] = [
		{
			path: '/auth',
			children: [
				{
					path: '/auth/login',
					element: <Login />,
				},
				{
					path: '/auth/register',
					element: <Register />,
				},
			]
		},
		{
			path: '/support',
			element: <WebLayout><SupportPage /></WebLayout>
		},
		{
			path: '/',
			element: <WebLayout><IndexPage /></WebLayout>
		},
		{
			path: '/pwa',
			element: <PWALayout><Main /></PWALayout>,
		},
		{
			path: '/pwa/profile',
			element: <PWALayout><Profile /></PWALayout>,
		},
		{
			path: '/pwa/pets',
			element: <PWALayout><PetPage /></PWALayout>,
		},
		{
			path: '/pwa/settings',
			element: <PWALayout><Settings /></PWALayout>,
		},
		{
			path: '/pwa/pets/add',
			element: <RequireAuth loginPath={loginPage}><PWALayout>
				<AddPetPage /></PWALayout></RequireAuth>,
		}
	]

	const router = useRoutes(routes)

	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<LazyMotion features={domAnimation}>
				<AuthProvider authType="localstorage" authName="_auth">
					{router}
				</AuthProvider>
			</LazyMotion>
		</ThemeProvider>
	)
}
