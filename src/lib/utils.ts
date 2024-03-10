import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'
import { setupCache } from 'axios-cache-interceptor'
import React from 'react'
import { toast, type ToastOptions } from 'react-hot-toast'
import { useLocation } from 'react-router-dom'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatAge(age: string, i18_years: string, i18_months: string) {
	// Parse the given date string to a Date object
	const birthDate = new Date(age)

	// Get today's date
	const today = new Date()

	// Calculate the difference in years
	let years = today.getFullYear() - birthDate.getFullYear()

	// Calculate the difference in months
	let months = today.getMonth() - birthDate.getMonth()

	// If the current month is before the birth month or
	// if it's the same month but the current day is before the birth day,
	// then subtract a year from the age and adjust the months
	if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
		years--
		months += 12 // Adjust months
	}

	// Adjust months if day of birth is greater than current day
	if (today.getDate() < birthDate.getDate()) {
		months--
	}

	// Ensure months is non-negative
	if (months < 0) {
		months += 12
	}

	const yearsString: string = Number(years) > 0 ? `${years} ${i18_years}` : ''
	const monthsString: string = Number(months) > 0 ? `${months} ${i18_months}` : ''

	// Return the formatted age string
	return yearsString + (yearsString && monthsString ? ' ' : '') + monthsString
}

const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`


const configuredAxios = axios.create({
	headers: {
		Authorization: token,
	},
})
const axiosAuth = setupCache(configuredAxios)

const notificationConfig: ToastOptions = {
	className: 'rounded-lg border bg-card text-card-foreground shadow-sm w-full font-semibold',
	position: 'top-center',
}

interface Notification {
	custom: {
		error: (err: string) => void
		success: (msg: string) => void
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		promise: (fn: any) => void
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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
	}
}

function useQuery() {
	const { search } = useLocation()

	return React.useMemo(() => new URLSearchParams(search), [search])
}

function parseMongoDate(Mongo_Date: string) {
	// Mongo_Date: 2024-02-03T01:39:13.410+00:00
	const parsedTime = Mongo_Date.split('-')[2].split('T')[1].split('.')[0] // -> 01:39:13

	const date = {
		year: Mongo_Date.split('-')[0],
		month: Mongo_Date.split('-')[1].split('T')[0][0] != '0' ? Mongo_Date.split('-')[1].split('T')[0] : Mongo_Date.split('-')[1].split('T')[0][1],
		day: Mongo_Date.split('-')[2].split('T')[0][0] != '0' ? Mongo_Date.split('-')[2].split('T')[0] : Mongo_Date.split('-')[2].split('T')[0][1],
	}

	const time = {
		hour: parsedTime.split(':')[0][0] != '0' ? Number(parsedTime.split(':')[0]) : Number(parsedTime.split(':')[0][1]),
		minutes: parsedTime.split(':')[1][0] != '0' ? Number(parsedTime.split(':')[1]) : Number(parsedTime.split(':')[1][1])
	}

	return {
		date,
		time
	}
}

const filterValues = {
    type: ['cat',  'dog', 'other'],
    sex: ['male', 'female'],
    owner_type: ['private', 'shelter', 'breeder', 'nursery']
}

export { axiosAuth, notification, type Notification, useQuery, parseMongoDate, token, filterValues }
