import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import NavigationBar from '@/Components/NavigationBar'

export default function MainLayout() {
	return (
		<>
			<Toaster />
			<NavigationBar />
			<main>
				<Outlet />
			</main>
		</>
	)
}
