import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSignIn, useIsAuthenticated } from 'react-auth-kit'
import axios, { AxiosResponse } from 'axios'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { notification } from '@utils'
import { API } from '@config'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'
import LoadingSpinner from '@/Components/loading-spinner'

export default function Login() {

	// Setups
	const navigate = useNavigate()
	const signIn = useSignIn()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	// States
	const [password, setPassword] = React.useState<string>('')
	const [phone, setPhone] = React.useState<string>('+7')
	const [loadingState, setLoadingState] = React.useState<boolean>(false)

	// Handlers
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement> | undefined) => {
		e && setPhone(e.target.value)
	}

	// Functions
	const userSignIn = () => {
		setLoadingState(true)
		axios.post(`${API.baseURL}/users/login`, {
			phone,
			password,
		}).then((response: AxiosResponse) => {
			if (!response.data.err) {
				if (signIn({
					token: response.data.token,
					expiresIn: response.data.expiresIn,
					tokenType: 'Bearer',
					authState: response.data.docs,
				})) {
					location.reload()
					notification.custom.success(t('success.login_proccess'))
				} else {
					notification.custom.error(t('errors.internal_error'))
				}
			} else {
				const error = response.data.err
				notification.custom.error(error)
			}
			setLoadingState(false)
		}).catch(() => { notification.custom.error(t('errors.too_many_request')) })
	}

	function handleOnBlurPhoneInput() {
		if (!phone.includes('+')) {
			notification.custom.error(t('errors.phone_international'))
			return
		}
		if (phone.length < 7) {
			notification.custom.error(t('errors.phone_required'))
			return
		}
	}

	React.useEffect(() => {
		if (isAuthenticated()) {
			navigate('/pwa')
		}
		function confirmpress(event: Event) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			if (event.key === 'Enter') {
				event.preventDefault()
				const loginButton = document.getElementById('loginbtn') as HTMLElement
				loginButton.click()
			}
		}
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
		window.addEventListener('keypress', confirmpress)
		return () => {
			window.removeEventListener('keypress', confirmpress)
		}
	}, [])
	return (
		<>
			<Toaster />
			<m.div
				className='flex justify-center items-center h-screen flex-col'
				initial={{ opacity: 0.1 }}
				animate={{ opacity: 1 }}
			>
				<div className='flex flex-col gap-2'>
					<div>
						<h1 className="text-2xl">{t('login.title')}</h1>
						<p className="text-sm">
							{t('login.or_create_new_account.0')}
							{' '}
							<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/register') }}>{t('login.or_create_new_account.1')}</Button>
						</p>
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label>{t('login.labels.1')}</Label>
						<Input placeholder="+7 123 456 7890" value={phone} onChange={handlePhoneChange} onBlur={handleOnBlurPhoneInput} />
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor='user_password'>{t('login.labels.0')}</Label>
						<Input id='user_password' type="password" onChange={handlePasswordChange} />
					</div>
					<Button
						id="loginbtn"
						onClick={userSignIn}
						className='w-full'
					>
						{loadingState ? <LoadingSpinner /> :t('login.button')}
					</Button>
					<LanguageSwitcher />
				</div>
			</m.div>
		</>
	)
}
