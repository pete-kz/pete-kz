import axios from 'axios'
import { toast, type ToastOptions } from 'react-hot-toast'

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
		background: '#302d38',
		color: '#ffffff',
	},
	className: 'text-white rounded-xl',
	position: 'bottom-left',
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

export { axiosAuth, notification, type Notification }
