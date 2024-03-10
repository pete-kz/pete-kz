// System
import React from 'react'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { useRoutes } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import type { RouteObject } from 'react-router-dom'
import './i18'
import { ThemeProvider } from '@/components/theme-provider'
// Layouts
import PwaLayout from './layouts/pwa'
import AuthLayout from './layouts/auth'
import WebLayout from './layouts/web'

// pages
import Main from './pages/Main'
import Login from './pages/Authentication/Login'
import Register from './pages/Authentication/Register'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import AddPetPage from './pages/PetAdd'
import IndexPage from './pages/Index'
import SupportPage from './pages/Support'
import AboutUsPage from './pages/AboutUs'

export default function App() {

	const loginPage = '/auth/login'

	const routes: RouteObject[] = [
		{
			path: '/auth',
			element: <AuthLayout />,
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
			element: <WebLayout />,
			children: [
				{
					path: '/support',
					element: <SupportPage />
				},
				{
					path: '/',
					element: <IndexPage />
				},
				{
					path: '/about-us',
					element: <AboutUsPage />
				}
			]
		},
		{
			element: <PwaLayout />,
			children: [
				{
					path: '/pwa',
					element: <Main />,
				},
				{
					path: '/pwa/profile',
					element: <Profile />,
				},
				{
					path: '/pwa/settings',
					element: <Settings />,
				},
				{
					path: '/pwa/pets/add',
					element: <RequireAuth loginPath={loginPage}>
						<AddPetPage /></RequireAuth>,
				}
			]
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
