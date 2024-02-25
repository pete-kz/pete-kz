import React, { useEffect } from 'react'
import NavigationBar from '@/components/nav-bar'
import { Toaster } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { notification } from '@/lib/utils'

export default function WebLayout({ children }: { children: React.ReactNode}) {

	// States
	const { t } = useTranslation()

	useEffect(() => {
		if (window.innerHeight / window.innerWidth <= 1) {
			notification.custom.error(t('errors.mobile_only'))
		} 
	}, [])

	return (
		<div className='h-screen'>
			<NavigationBar />
			<Toaster />
			<main className='p-4'>
				{children}
			</main>
		</div>
	)
}
