import React from 'react'
import { Toaster } from 'react-hot-toast'
import BottomBar from '@/components/bottom-bar'
import { m } from 'framer-motion'
import { Outlet } from 'react-router-dom'


export default function PwaLayout() {
	return (
		<>
			<Toaster />
			<BottomBar />
			<m.main animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} exit={{ opacity: 0, x: -100 }}>
				<Outlet />
			</m.main>
		</>
	)
}
