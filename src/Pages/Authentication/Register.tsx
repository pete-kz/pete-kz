import React, { useEffect } from 'react'
import { useIsAuthenticated } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Button } from '@/Components/ui/button'
import { RegisterForm } from '@/Components/forms/register'

export default function Register() {

	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	useEffect(() => {
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
		if (isAuthenticated()) {
			navigate('/pwa')
		}
	}, [])

	return (
		<>
			<Toaster />
			<m.div className="flex justify-center items-center h-screen w-screen px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className='flex flex-col gap-2 w-full'>
					<div className='w-full'>
						<h1 className="text-2xl">{t('register.title')}</h1>
						<p className="text-sm">
							{t('register.account_already.0')}
							{' '}
							<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/login') }}>{t('register.account_already.1')}</Button>
						</p>
					</div>
					<RegisterForm />
				</div>
			</m.div>
		</>
	)
}
