import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsAuthenticated } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { m } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { LoginForm } from '@/components/forms/login'

export default function Login() {

	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	useEffect(() => {
		if (isAuthenticated()) {
			navigate('/pwa')
		}
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
	}, [])

	return (
		<m.div className='flex flex-col gap-2 w-full md:max-w-[20%]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div>
				<h1 className="text-2xl">{t('login.title')}</h1>
				<p className="text-sm">
					{t('login.or_create_new_account.0')}
					{' '}
					<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/register') }}>{t('login.or_create_new_account.1')}</Button>
				</p>
			</div>
			<LoginForm />
		</m.div>
	)
}
