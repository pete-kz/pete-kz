import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'

export default function AuthLayout() {

	return (
		<m.div className='h-screen' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<Toaster />
			<main className='p-4'>
				<Outlet />
			</main>
		</m.div>
	)
}
