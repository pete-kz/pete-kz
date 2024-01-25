import React from 'react'
import { AccountCircle, Password, Celebration } from '@mui/icons-material'
import { Button, TextField } from '@mui/material'
import { useIsAuthenticated } from 'react-auth-kit'
import { useNavigate, Link } from 'react-router-dom'
import axios, { AxiosResponse } from 'axios'
import { Toaster } from 'react-hot-toast'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import { API } from '@config'
import { notification } from '@utils'

export default function Register() {

	// Setups
	const navigate = useNavigate()
	const isAuthenticated = useIsAuthenticated()
	const { t } = useTranslation()

	// States
	const [login, setLogin] = React.useState<string>('')
	const [password, setPassword] = React.useState<string>('')
	const [inviteCode, setInviteCode] = React.useState<string>('')
	const [registerButtonDisabled, setRegisterButtonDisabled] = React.useState<boolean>(false)

	// States
	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
		setRegisterButtonDisabled(false)
	}
	const handleLoginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setLogin(event.target.value)
		setRegisterButtonDisabled(false)
	}
	const handleInviteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInviteCode(event.target.value)
		setRegisterButtonDisabled(false)
	}

	// Functions
	const register = () => {
		if (login == '' || password == '' || inviteCode == '') {
			notification.custom.error(t('errors.fill_all_fields'))
			setRegisterButtonDisabled(true)
			return null
		}
		axios.post(`${API.baseURL}/users/register`, {
			login,
			password,
			inviteCode,
		}).then((response: AxiosResponse) => {
			if (!response.data.err) {
				navigate('/login')
			} else {
				notification.custom.error(response.data.err)
			}
			return null
		}).catch((r) => { notification.custom.error(t('errors.too_many_requests')) })
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

	function handleOnBlurInviteCodeInput() {
		if (inviteCode.length != 8 || inviteCode == '') {
			notification.custom.error(t('errors.invalid_invite_code'))
			setRegisterButtonDisabled(true)
		}
	}

	React.useEffect(() => {
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
						<TextField label={t('register.labels.0')} variant="outlined" onChange={handleLoginChange} onBlur={handleOnBlurLoginInput} />
					</div>
					<div className="flex flex-end items-center mb-2">
						<Password className="mr-2" />
						<TextField label={t('register.labels.1')} variant="outlined" type="password" onChange={handlePasswordChange} onBlur={handleOnBlurPasswordInput} />
					</div>
					<div className="flex flex-end items-center mb-2">
						<Celebration className="mr-2" />
						<TextField label={t('register.labels.2')} variant="outlined" onChange={handleInviteChange} onBlur={handleOnBlurInviteCodeInput} />
					</div>
					<div className="flex justify-center items-center" style={{ marginTop: 12 }}>
						<Button
							onClick={register}
							sx={{
								borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, width: '100%', border: 1,
							}}
							variant="outlined"
							fullWidth
							disabled={registerButtonDisabled}
						>
							{t('register.button')}
						</Button>
					</div>
				</div>
			</m.div>
		</>
	)
}
