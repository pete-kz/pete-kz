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

	const loginPage = '/login'

	const routes: RouteObject[] = [
		{
			path: '/login',
			element: <Login />,
		},
		{
			path: '/register',
			element: <Register />,
		},
		{
			path: '/',
			element: <IndexPage />,
		},
		{
			path: '/',
			element: <RequireAuth loginPath={loginPage}><MainLayout /></RequireAuth>,
			children: [
				{
					path: '/p',
					element: <Main />,
				},
				{
					path: '/profile',
					element: <Profile />,
				},
				{
					path: '/pets',
					element: <PetPage />,
				},
				{
					path: '/pets/add',
					element: <AddPetPage />
				},
				{
					path: '/settings',
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
