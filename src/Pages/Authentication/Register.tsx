import React from 'react'
import { useIsAuthenticated } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { notification } from '@utils'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
import { Button } from '@/Components/ui/button'

export default function Register() {

	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	// States
	const [login, setLogin] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')
	const [phone, setPhone] = React.useState<string>('+7')
	const [name, setName] = React.useState<string>('')
	const [registerButtonDisabled, setRegisterButtonDisabled] = React.useState<boolean>(false)
	const [loadingState, setLoadingState] = React.useState<boolean>(false)

	// States
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
		setRegisterButtonDisabled(false)
	}

	const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLogin(event.target.value)
		setRegisterButtonDisabled(false)
	}

	const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setName(event.target.value)
		setRegisterButtonDisabled(false)
	}

	const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		e && setPhone(e.target.value)
		setRegisterButtonDisabled(false)
	}

	// Functions
	const register = () => {
		if (login == '' || password == '' || phone.length < 7) {
			notification.custom.error(t('errors.fill_all_fields'))
			setRegisterButtonDisabled(true)
			return null
		}
		setLoadingState(true)
		axios.post(`${API.baseURL}/users/register`, {
			login,
			name,
			password,
			phone
		}).then((response: AxiosResponse) => {
			if (!response.data.err) {
				navigate('/auth/login')
			} else {
				notification.custom.error(response.data.err)
			}
			setLoadingState(false)
			return
		}).catch(() => { notification.custom.error(t('errors.too_many_requests')) })
	}

	function handleOnBlurLoginInput() {
		axios.post(`${API.baseURL}/users/find`, { query: { login } }).then((res: AxiosResponse) => {
			if (!res.data.err) {
				if (res.data.login == login) {
					notification.custom.error(t('errors.login_already_exists'))
					setRegisterButtonDisabled(true)
				}
			} else {
				notification.custom.success(t('errors.you_can_use_this_login'))
			}
		})
	}

	function handleOnBlurPasswordInput() {
		if (password.length < 7 || password == '') {
			notification.custom.error(t('errors.password_length'))
			setRegisterButtonDisabled(true)
		}
	}

	function handleOnBlurPhoneInput() {
		if (phone) {
			axios.post(`${API.baseURL}/users/find`, { query: { phone } }).then((res: AxiosResponse) => {
				if (!res.data.err && res.data.phone == phone) {
					notification.custom.error('phone in use')
					setRegisterButtonDisabled(true)
				}
			})
		}
	}

	React.useEffect(() => {
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
		if (isAuthenticated()) {
			navigate('/pwa')
		}
	}, [])

	return (
		<>
			<Toaster />
			<m.div className="flex justify-center items-center h-screen flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div className='flex flex-col gap-2'>
					<div>
						<h1 className="text-2xl">{t('register.title')}</h1>
						<p className="text-sm">
							{t('register.account_already.0')}
							{' '}
							<Button className='p-0' variant={'link'} onClick={() => { navigate('/auth/login') }}>{t('register.account_already.1')}</Button>
						</p>
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor='register_name'>{t('register.labels.1')}</Label>
						<Input id='register_name' placeholder={t('register.placeholders.1') || ''} onChange={handleNameChange} type='text' />
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor='register_login'>{t('register.labels.0')}</Label>
						<Input id='register_login' placeholder={t('register.placeholders.0') || ''} onChange={handleLoginChange} onBlur={handleOnBlurLoginInput} type='text' />
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label>{t('register.labels.3')}</Label>
						<Input placeholder="+7 123 456 7890" value={phone} onChange={handlePhoneChange} onBlur={handleOnBlurPhoneInput} />
					</div>
					<div className="grid w-full items-center gap-1.5">
						<Label htmlFor='register_password'>{t('register.labels.2')}</Label>
						<Input id='register_password' type="password" onChange={handlePasswordChange} onBlur={handleOnBlurPasswordInput} />
					</div>
					<div className="flex justify-center items-center">
						<Button
							onClick={register}
							className='w-full'
							disabled={registerButtonDisabled}
						>
							{loadingState ? 'Loading...' : t('register.button')}
						</Button>
					</div>
					<LanguageSwitcher />
				</div>
			</m.div>
		</>
	)
}
