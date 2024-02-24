// System
import React from 'react'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { useRoutes } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import type { RouteObject } from 'react-router-dom'
import './i18'
import { ThemeProvider } from '@/components/theme-provider'
// Layouts
import PWALayout from './layouts/pwa'

// pages
import Main from './pages/Main'
import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import PetPage from './pages/Pet'
import AddPetPage from './pages/PetAdd'
import IndexPage from './pages/Index'
import SupportPage from './pages/Support'
import WebLayout from './layouts/web'

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
