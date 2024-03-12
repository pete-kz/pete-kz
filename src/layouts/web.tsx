import React from 'react'
import NavigationBar from '@/components/nav-bar'
import { Toaster } from '@/components/ui/toaster'
import { Outlet } from 'react-router-dom'

export default function WebLayout() {

	return (
		<div className='h-screen'>
			<NavigationBar />
			<Toaster />
			<main className='p-4 pt-20'>
				<Outlet />
			</main>
		</div>
	)
}
