import React from 'react'
// import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import BottomPWABar from '@/Components/BottomPWABar'

export default function MainLayout({ children }: { children: React.ReactNode}) {
	return (
		<>
			<Toaster />
			<BottomPWABar />
			<main>
				{children}
			</main>
		</>
	)
}
