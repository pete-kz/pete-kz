import React from 'react'
import { Password, Phone } from '@mui/icons-material'
import { TextField } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useSignIn, useIsAuthenticated } from 'react-auth-kit'
import axios, { AxiosResponse } from 'axios'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { notification } from '@utils'
import { API } from '@config'
import { themeColor } from '@colors'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/types.cjs'
import { LoadingButton } from '@mui/lab'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

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

	const handlePhoneChange = (type: E164Number | React.ChangeEvent<HTMLInputElement> | undefined) => {
		setPhone(typeof type === typeof {} ? (type as React.ChangeEvent<HTMLInputElement>).target.value : (type as E164Number))
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
			navigate('/p')
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
				<div>
					<div className="mb-2">
						<h1 className="text-2xl">{t('login.title')}</h1>
						<p className="text-sm">
							{t('login.or_create_new_account.0')}
							{' '}
							<Link className="" style={{ color: themeColor[7] }} to="/register">{t('login.or_create_new_account.1')}</Link>
						</p>
					</div>
					<div className="flex flex-end items-center mb-2">
						<Phone className="mr-2" />
						<PhoneInput international placeholder="+7 123 456 7890" value={phone} onChange={handlePhoneChange} onBlur={handleOnBlurPhoneInput} />
					</div>
					<div className="flex flex-end items-center mb-4">
						<Password className="mr-2" />
						<TextField label={t('login.labels.0')} variant="outlined" type="password" onChange={handlePasswordChange} />
					</div>
					<LoadingButton
						id="loginbtn"
						variant='contained'
						fullWidth
						sx={{ borderRadius: 9999, fontWeight: 500 }}
						onClick={userSignIn}
						loading={loadingState}
					>
						{t('login.button')}
					</LoadingButton>
					<LanguageSwitcher />
				</div>
			</m.div>
		</>
	)
}
