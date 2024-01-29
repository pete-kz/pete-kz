// System
import React from 'react'
import { AuthProvider, RequireAuth } from 'react-auth-kit'
import { useRoutes } from 'react-router-dom'
import { LazyMotion, domAnimation } from 'framer-motion'
import type { RouteObject } from 'react-router-dom'
import './i18.js'

// Layouts
import MainLayout from './Layouts/Main.layout'
import DefaultLayout from './Layouts/Default'

// Pages
import Main from './Pages/Main'
import Login from './Pages/Authentication/Login.js'
import Register from './Pages/Authentication/Register'
import Settings from './Pages/Settings'
import Favoutires from './Pages/Favourites.js'
import Profile from './Pages/Profile.js'
import PetPage from './Pages/Pet.js'

export default function App() {

	const loginPage = '/login'

	const routes: RouteObject[] = [
		{
			path: '/login',
			element: <DefaultLayout><Login /></DefaultLayout>,
		},
		{
			path: '/register',
			element: <DefaultLayout><Register /></DefaultLayout>,
		},
		{
			path: '/',
			element: <RequireAuth loginPath={loginPage}><DefaultLayout><MainLayout /></DefaultLayout></RequireAuth>,
			children: [
				{
					index: true,
					element: <Main />,
				},
				{
					path: '/favourites',
					element: <Favoutires />,
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
