import React, { useEffect } from 'react'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { RegisterForm } from '@/components/forms/register'

export default function Register() {

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
		<div className='flex flex-col gap-2 w-full'>
			<div className='w-full'>
				<h1 className="text-2xl">{t('label.authorization.register.default')}</h1>
				<p className="flex items-center gap-1.5 text-sm">
					{t('label.authorization.or')}
					{' '}
					<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/login') }}>{t('label.authorization.register.login')}</Button>
				</p>
			</div>
			<RegisterForm />
		</div>
	)
}
