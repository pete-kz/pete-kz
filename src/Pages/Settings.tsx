import React, { useState, useEffect } from 'react'
import { Logout } from '@mui/icons-material'
import { useSignOut } from 'react-auth-kit'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { Select, type SelectChangeEvent, InputLabel, MenuItem, FormControl } from '@mui/material'

export default function Settings() {

	// Setups
	const signout = useSignOut()
	const { i18n, t } = useTranslation()

	// States
	const [cities, setCities] = useState<{
		en: string[]
		ru: string[]
		kz: string[]
	}>({
		'en': [],
		'ru': [],
		'kz': []
	})
	const [currentCity, setCurrentCity] = useState<string>(localStorage.getItem('_city') || cities[i18n.language as 'ru' | 'kz' | 'en'][0])

	// Functions
	function getCities() {
		fetch('locales/cities.json').then((res) => {
			res.json().then((res) => {
				setCities(res)
			})
		})
	}

	useEffect(() => {
		localStorage.setItem('_city', currentCity)
	}, [currentCity, cities])

	useEffect(() => {
		getCities()
	}, [])

	return (
		<m.div className="flex justify-center w-screen px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

				<List className='w-full'>
					<ListItem className=''>
						<FormControl fullWidth style={{ marginTop: 16 }}>
							<InputLabel className="flex justify-center items-center">
								{t('settings.labels.city')}
							</InputLabel>
							<Select fullWidth
								value={currentCity}
								label={t('settings.labels.city')}
								className="rounded-3xl"
								onChange={(event: SelectChangeEvent) => {
									setCurrentCity(event.target.value)
								}}>
								{cities[i18n.language as 'ru' | 'kz' | 'en'].map((city) => (
									<MenuItem key={city} value={city}>{city}</MenuItem>
								))}
							</Select>
						</FormControl>
					</ListItem>
					<ListItem>
						<LanguageSwitcher />
					</ListItem>
					<ListItem>
						<ListItemButton onClick={() => { signout() }} sx={{ color: '#eb4034' }}>
							<ListItemIcon>
								<Logout color="error" />
							</ListItemIcon>
							<ListItemText primary={t('settings.labels.exit_button')} />
						</ListItemButton>
					</ListItem>
					
				</List>

		</m.div>
	)
}
