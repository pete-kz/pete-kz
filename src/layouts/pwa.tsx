import React from 'react'
import { Toaster } from '@/components/ui/toaster'
import { m } from 'framer-motion'
import { Outlet } from 'react-router-dom'

export default function PwaLayout() {
	return (
		<>
			<Toaster />
			<m.div animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} className='flex items-center bg-[url("/images/background.webp")] justify-center object-cover' exit={{ opacity: 0, x: -100 }}>
				<main className='h-screen max-w-lg w-full relative bg-background'>
					<Outlet />
				</main>
			</m.div>
		</>
	)
}
