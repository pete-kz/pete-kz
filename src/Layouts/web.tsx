import React from 'react'
import MainNavigationBar from '@/Components/NavigationBar'

export default function WebLayout({ children }: { children: React.ReactNode}) {
	return (
		<>
			<MainNavigationBar />
			<main>
				{children}
			</main>
		</>
	)
}
