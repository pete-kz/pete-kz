import React, { useEffect } from 'react'
import NavigationBar from '@/components/nav-bar'
import { Toaster } from '@/components/ui/toaster'
import { useTranslation } from 'react-i18next'
import { useToast } from '@/components/ui/use-toast'
import { Outlet } from 'react-router-dom'

export default function WebLayout() {

	// States
	const { t } = useTranslation()
	const { toast } = useToast()

	useEffect(() => {
		if (window.innerHeight / window.innerWidth <= 1) {
			toast({ description: t('notifications.mobile_only') })
		} 
	}, [])

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
