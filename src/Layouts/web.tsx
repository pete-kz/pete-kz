import React from 'react'
import NavigationBar from '@/components/nav-bar'

export default function WebLayout({ children }: { children: React.ReactNode}) {
	return (
		<>
			<NavigationBar />
			<main className='p-4'>
				{children}
			</main>
		</>
	)
}
