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
	const { t } = useTranslation()

	// States
	const [currentCity, setCurrentCity] = useState<string>(localStorage.getItem('_city') || '0')

	// Function

	useEffect(() => {
		localStorage.setItem('_city', currentCity)
	}, [currentCity])

	useEffect(() => {
		if (!localStorage.getItem('_city')) localStorage.setItem('_city', '0')
		// @ts-expect-error because it is imported from the web
		ym(96355513, 'hit', window.origin)
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
								{[...Array(10).keys()].map((city) => (
									<MenuItem key={city} value={city}>{t(`cities.${city}`)}</MenuItem>
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
