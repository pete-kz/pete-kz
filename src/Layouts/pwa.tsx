import React from 'react'
import { Toaster } from 'react-hot-toast'
import BottomBar from '@/components/bottom-bar'
import { m } from 'framer-motion'

export default function PwaLayout({ children }: { children: React.ReactNode}) {
	return (
		<>
			<Toaster />
			<BottomBar />
			<m.main animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} exit={{ opacity: 0, x: -100 }}>
				{children}
			</m.main>
		</>
	)
}
