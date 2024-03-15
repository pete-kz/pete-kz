import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { m } from 'framer-motion'
import MobilePageHeader from '@/components/mobile-page-header'
import { useTranslation } from 'react-i18next'

export default function AuthLayout() {

	// Setups
	const { t } = useTranslation()

	return (
		<m.div className='h-screen flex justify-center bg-[url("/images/background.webp")]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className='max-w-lg bg-background'>
				<MobilePageHeader title={t('header.authorization')} to='/pwa/profile' />
				<Toaster />
				<main className='p-4'>
					<Outlet />
				</main>
			</div>
		</m.div>
	)
}
