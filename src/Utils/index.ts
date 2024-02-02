import axios from 'axios'
import React from 'react'
import { toast, type ToastOptions } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'
import { themeColor } from './colors'

const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem(
	'_auth',
)}`

const axiosAuth = axios.create({
	headers: {
		Authorization: token,
	},
})

const notificationConfig: ToastOptions = {
	style: {
		background: themeColor.cardBackground,
		color: themeColor.iconButtonColor,
		border: `1px solid ${themeColor.divBorder}`,
	},
	className: 'rounded-md shadow-lg w-full font-semibold',
	position: 'top-center',
}

interface Notification {
  custom: {
    error: (err: string) => void
    success: (msg: string) => void
    promise: (fn: any) => void
  }
  login: {
    success: () => void
    invalid: () => void
  }
  register: {
    success: () => void
    invalid: () => void
  }
  server: {
    internalError: () => void
  }
}

const notification: Notification = {
	custom: {
		error: (err: string) => {
			toast.error(err, notificationConfig)
		},
		success: (msg: string) => {
			toast.success(msg, notificationConfig)
		},
		promise: (fn: any) => {
			toast.promise(
				fn,
				{
					loading: 'Загрузка...',
					success: 'Успешно загружено!',
					error: 'Произошла ошибка',
				},
				notificationConfig,
			)
		},
	},
	login: {
		success: () => {
			toast.success('Вы успешно вошли!', notificationConfig)
		},
		invalid: () => {
			toast.error('Неправильный логин или пароль.', notificationConfig)
		},
	},
	register: {
		success: () => {
			toast.success('Вы успешно зарегистрировались!', notificationConfig)
		},
		invalid: () => {
			toast.error('Такой логин уже существует', notificationConfig)
		},
	},
	server: {
		internalError: () => {
			toast.error('Что-то пошло не так', notificationConfig)
		},
	},
}

function useQuery() {
    const { search } = useLocation()

    return React.useMemo(() => new URLSearchParams(search), [search])
}

export { axiosAuth, notification, type Notification, useQuery }
