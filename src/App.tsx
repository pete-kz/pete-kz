// System
import React from 'react'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { useRoutes } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import type { RouteObject } from 'react-router-dom'
import './i18.js'

// Layouts
import MainLayout from './Layouts/Main.layout'

// Pages
import Main from './Pages/Main'
import Login from './Pages/Authentication/Login.js'
import Register from './Pages/Authentication/Register'
import Settings from './Pages/Settings'
import Profile from './Pages/Profile.js'
import PetPage from './Pages/Pet.js'
import AddPetPage from './Pages/PetAdd.js'
import IndexPage from './Pages/Index.js'

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
			path: '/',
			element: <IndexPage />,
		},
		{
			path: '/pwa',
			element: <RequireAuth loginPath={loginPage}><MainLayout /></RequireAuth>,
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
					path: '/pwa/pets',
					element: <PetPage />,
				},
				{
					path: '/pwa/pets/add',
					element: <AddPetPage />
				},
				{
					path: '/pwa/settings',
					element: <Settings />,
				},
			],
		}
	]

	const router = useRoutes(routes)

	return (
		<LazyMotion features={domAnimation}>
			<AuthProvider authType="localstorage" authName="_auth">
				{router}
			</AuthProvider>
		</LazyMotion>
	)
}
