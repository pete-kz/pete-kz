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
import { type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'
import PetCard from '@/Components/Cards/Pet.card'

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

export default function Favoutires() {

	// Setups
	const isAuthenticated = useIsAuthenticated()
	const navigate = useNavigate()
	const authStateUser = useAuthUser()
	const user = authStateUser() || {}
	const signout = useSignOut()
	const authHeader = useAuthHeader()
	const { t } = useTranslation()

	// States
	const [institutions, setInstitutions] = useState<Pet_Response[]>([])
	const [filter, setFilter] = useState<string>('')
	const [city, setCity] = useState<string>('')

	// Handlers
	function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
		setFilter(e.target.value)
	}

	// Functions
	function fetchInstitutions() {
		notification.custom.promise(
			axios.post(`${API.baseURL}/pets/find`, {}).then((res: AxiosResponse) => {
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
				{/* <PageAlert title='Предупреждение' description='Пожалуйста, прочтите дисклеймер.' /> */}
				{institutions.map((pet, index: number) => (
					pet?.city?.includes(city) && (
						pet?.name.includes(filter) && (
							<PetCard
								key={index}
								imagesPath={pet.imagesPath}
								age={pet.age}
								type={pet.type}
								name={pet.name}
								description={pet.description}
								id={pet._id}
								userID={user._id}
								city={pet.city}
							/>
						)
					)

				))}
			</div>
		</>
	)
}
