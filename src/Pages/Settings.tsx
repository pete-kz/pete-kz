import React, { useEffect } from 'react'
import { useSignOut, useIsAuthenticated } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { Button } from '@/Components/ui/button'
import ChangeCity from '@/Components/change-city'

export default function Settings() {
	// Setups
	const signout = useSignOut()
	const { t } = useTranslation()
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()

	useEffect(() => {
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
	}, [])

	return (
		<div className="grid grid-rows-3 grid-cols-1 p-4 gap-3">
			{!isAuthenticated() && (
				<Button className='gap-2 w-full' onClick={() => { navigate('/auth/login') }}>
					{t('settings.labels.login')}
				</Button>
			)}
			<div>
				<ChangeCity />
			</div>
			<div>
				<LanguageSwitcher />
			</div>

			{isAuthenticated() && (
				<Button className='gap-2 w-full' variant={'destructive'} onClick={() => { signout() }}>
					{t('settings.labels.exit_button')}
				</Button>
			)}

		</div>
	)
}
