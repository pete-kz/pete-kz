import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import MobilePageHeader from '@/components/mobile-page-header'
import { useTranslation } from 'react-i18next'

export default function AuthLayout() {

	// Setups
	const { t } = useTranslation()

	return (
		<m.div className='h-screen' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<MobilePageHeader title={t('header.authorization')} to='/pwa/settings' />
			<Toaster />
			<main className='p-4'>
				<Outlet />
			</main>
		</m.div>
	)
}
