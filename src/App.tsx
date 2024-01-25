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
import Request from './Pages/Request'
import Disclaimer from './Pages/Disclaimer.js'

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
			path: '/disclaimer',
			element: <DefaultLayout><Disclaimer /></DefaultLayout>,
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
					path: '/request',
					element: <Request />,
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
