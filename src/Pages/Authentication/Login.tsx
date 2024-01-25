import React from 'react'
import { AccountCircle, Password } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { useNavigate, Link } from 'react-router-dom'
import { useSignIn, useIsAuthenticated } from 'react-auth-kit'
import axios, { AxiosResponse } from 'axios'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { notification } from '@utils'
import { API } from '@config'
import { themeColor } from '@colors'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

export default function Login() {

	// Setups
	const navigate = useNavigate()
	const signIn = useSignIn()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	// States
	const [login, setLogin] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')

	// Handlers
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}
	const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLogin(event.target.value)
	}

	// Functions
	const userSignIn = () => {
		axios.post(`${API.baseURL}/users/login`, {
			login,
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
		}).catch(() => { notification.custom.error(t('errors.too_many_request')) })
	}

	React.useEffect(() => {
		if (isAuthenticated()) {
			navigate('/')
		}
		window.addEventListener('keypress', (event) => {
			if (event.key === 'Enter') {
				event.preventDefault()
				const loginButton = document.getElementById('loginbtn') as HTMLElement
				loginButton.click()
			}
		})
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
						<AccountCircle className="mr-2" />
						<TextField label={t('login.login_placeholder')} variant="outlined" onChange={handleLoginChange} />
					</div>
					<div className="flex flex-end items-center mb-4">
						<Password className="mr-2" />
						<TextField label={t('login.password_placeholder')} variant="outlined" type="password" onChange={handlePasswordChange} />
					</div>
					<Button
						id="loginbtn"
						sx={{ borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, width: '100%', border: 1, }}
						onClick={userSignIn}
					>
						{t('login.button')}
					</Button>
					<LanguageSwitcher />
				</div>
			</m.div>
		</>
	)
}
