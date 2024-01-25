/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { styled as styledMUI, alpha } from '@mui/material/styles'
import { m } from 'framer-motion'
import { Search as SearchIcon } from '@mui/icons-material'
import { InputBase, Select, type SelectChangeEvent, MenuItem, FormControl, InputLabel } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import { API } from '@config'
import { type Institution_Data } from '@declarations'
import { axiosAuth as axios, notification } from '@utils'
import InstitutionCard from '@/Components/Cards/Institution.card'
import PageAlert from '@/Components/PageAlert'
import { AxiosResponse } from 'axios'

const Search = styledMUI('div')(({ theme }) => ({
	marginTop: 10,
	width: '95vw',
	maxWidth: 500,
	position: 'relative',
	borderRadius: 15,
	height: 55,
	backgroundColor: themeColor[9],
	'&:hover': {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	[theme.breakpoints.up('sm')]: {
		marginLeft: theme.spacing(3),
		width: 'auto',
	},
}))

const SearchIconWrapper = styledMUI('div')(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: '100%',
	position: 'absolute',
	pointerEvents: 'none',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	color: themeColor[6],
}))

const StyledInputBase = styledMUI(InputBase)(({ theme }) => ({
	color: themeColor[6],
	'& .MuiInputBase-input': {
		padding: theme.spacing(1, 1, 1, 1),
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create('width'),
		width: '100%',
		height: '100%',
		display: 'flex',
		alignItems: 'center',
	},
	height: '100%',
}))

const cities: string[] = ['Алматы', 'Астана', 'Шымкент']

export default function Main() {

	// Setups
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()

	// States
	const [institutions, setInstitutions] = useState<Institution_Data[]>([])
	const [filter, setFilter] = useState<string>('')
	const [city, setCity] = useState<string>('')

	// Handlers
	function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFilter(e.target.value)
	}

	// Functions
	function fetchInstitutions() {
		notification.custom.promise(
			axios.post(`${API.baseURL}/institutions/find`, {}).then((res: AxiosResponse) => {
				if (!res.data.err) {
					setInstitutions(res.data)
				} else {
					notification.custom.error(res.data.err)
				}
			}),
		)
	}

	function checkToken() {
		const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
		const isEqualTokens = authHeader() == token
		if (!isEqualTokens) {
			signout()
		}
	}

	useEffect(() => {
		if (isAuthenticated()) {
			fetchInstitutions()
			checkToken()
		} else {
			navigate('/login')
		}
	}, [])

	return (
		<>
			<m.div className="flex justify-center items-center flex-row mx-2 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
				<Search className="mr-2">
					<SearchIconWrapper>
						<SearchIcon />
					</SearchIconWrapper>
					<StyledInputBase
						placeholder={t('main.search_box_institution')!}
						inputProps={{ 'aria-label': 'поиск' }}
						onChange={handleFilterChange}
						sx={{ width: '100%' }}
					/>
				</Search>
				<FormControl fullWidth style={{ marginTop: 8 }}>
					<InputLabel>{t('main.select_button_city')}</InputLabel>
					<Select
						value={city}
						label={t('main.select_button_city')}
						className="rounded-3xl"
						onChange={(event: SelectChangeEvent) => { setCity(event.target.value) }}
					>
						<MenuItem value="">{t('main.select_button_city_everything_option')}</MenuItem>
						{cities.map((_city: string) => (
							<MenuItem key={_city} value={_city}>{_city}</MenuItem>
						))}

					</Select>
				</FormControl>
			</m.div>

			<div className="flex justify-center flex-wrap">
				<PageAlert title='Предупреждение' description='Пожалуйста, прочтите дисклеймер.' />
				{institutions.map((institution, index: number) => (
					institution?.city?.includes(city) && (
						institution?.title.includes(filter) && (
							<InstitutionCard
								key={index}
								imagePath={institution.imagePath}
								name={institution.title}
								status={institution.status}
								description={institution.description}
								address={institution.address}
								id={institution._id}
								link={institution.link}
								userID={user._id}
								city={institution.city}
							/>
						)
					)

				))}
			</div>
		</>
	)
}
