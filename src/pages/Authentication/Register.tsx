import React, { useEffect } from 'react'
import { useIsAuthenticated } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { RegisterForm } from '@/components/forms/register'
import { m } from 'framer-motion'

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
		<m.div className='flex flex-col gap-2 w-full md:max-w-[20%]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div className='w-full'>
				<h1 className="text-2xl">{t('register.title')}</h1>
				<p className="text-sm">
					{t('register.account_already.0')}
					{' '}
					<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/login') }}>{t('register.account_already.1')}</Button>
				</p>
			</div>
			<RegisterForm />
		</m.div>
	)
}
