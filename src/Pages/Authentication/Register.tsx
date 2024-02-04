import React from 'react'
import { AccountCircle, Password, Phone } from '@mui/icons-material'
import { TextField } from '@mui/material'
import { useIsAuthenticated } from 'react-auth-kit'
import { useNavigate, Link } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import { API } from '@config'
import { notification } from '@utils'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/types.cjs'
import { LoadingButton } from '@mui/lab'

export default function Register() {

	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	// States
	const [login, setLogin] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')
	const [phone, setPhone] = React.useState<string>('')
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

	const handlePhoneChange = (type: E164Number | React.ChangeEvent<HTMLInputElement> | undefined) => {
		if (type !== undefined) {
			setPhone(typeof type === typeof {} ? (type as React.ChangeEvent<HTMLInputElement>).target.value : (type as E164Number))
			setRegisterButtonDisabled(false)
		}
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
				navigate('/login')
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
			navigate('/')
		}
	}, [])

	return (
		<>
			<Toaster />
			<m.div className="flex justify-center items-center h-screen flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<div>
					<div className="mb-2">
						<h1 className="text-2xl">{t('register.title')}</h1>
						<p className="text-sm">
							{t('register.account_already.0')}
							{' '}
							<Link className="" style={{ color: themeColor[7] }} to="/login">{t('register.account_already.1')}</Link>
						</p>
					</div>
					<div className="flex flex-end items-center mb-2">
						<AccountCircle className="mr-2" />
						<TextField label={t('register.labels.1')} placeholder={t('register.placeholders.1') || ''} variant="outlined" onChange={handleNameChange} type='text' />
					</div>
					<div className="flex flex-end items-center mb-2">
						<AccountCircle className="mr-2" />
						<TextField label={t('register.labels.0')} placeholder={t('register.placeholders.0') || ''} variant="outlined" onChange={handleLoginChange} onBlur={handleOnBlurLoginInput} type='text' />
					</div>
					<div className="flex flex-end items-center mb-2">
						<Phone className="mr-2" />
						<PhoneInput international placeholder="+7 123 456 7890" value={phone} onChange={handlePhoneChange} onBlur={handleOnBlurPhoneInput} />
					</div>
					<div className="flex flex-end items-center mb-2">
						<Password className="mr-2" />
						<TextField label={t('register.labels.2')} variant="outlined" type="password" onChange={handlePasswordChange} onBlur={handleOnBlurPasswordInput} />
					</div>
					<div className="flex justify-center items-center" style={{ marginTop: 12 }}>
						<LoadingButton
							onClick={register}
							sx={{ borderRadius: 9999, fontWeight: 500, width: '100%' }}
							variant='contained'
							fullWidth
							loading={loadingState}
							disabled={registerButtonDisabled}
						>
							{t('register.button')}
						</LoadingButton>
					</div>
				</div>
			</m.div>
		</>
	)
}
