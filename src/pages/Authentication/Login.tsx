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
	}, [])

	return (
		<m.div className='flex flex-col gap-2 w-full md:max-w-[20%]' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
			<div>
				<h1 className="text-2xl">{t('label.authorization.login.default')}</h1>
				<p className="text-sm">
					{t('label.authorization.or')}
					{' '}
					<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/register') }}>{t('label.authorization.login.register')}</Button>
				</p>
			</div>
			<LoginForm />
		</m.div>
	)
}
