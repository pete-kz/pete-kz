/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react'
import { Select, type SelectChangeEvent, InputLabel, MenuItem, FormControl } from '@mui/material'
import { useTranslation } from 'react-i18next'

const languages = [
	['ru', '🇷🇺 Русский'], 
	['kz', '🇰🇿 Қазақ тілі'], 
	['en', '🇬🇧 English']
]
const lanaguagesCodes = ['ru', 'kz', 'en']

export default function LanguageSwitcher() {

	// Setups
	const { t, i18n } = useTranslation()
	const [currentLanguage, setLanguage] = useState<string>('ru')

	useEffect(() => {
		setLanguage(lanaguagesCodes.includes(i18n.language) ? i18n.language : 'en')
		i18n.changeLanguage(currentLanguage)
	}, [])

	return (
		<FormControl fullWidth style={{ marginTop: 16 }}>
			<InputLabel className="flex justify-center items-center">
				{t('settings.labels.language_button')}
			</InputLabel>
			<Select
				value={currentLanguage}
				label={t('settings.labels.language_button')}
				className="rounded-3xl"
				onChange={(event: SelectChangeEvent) => {
					i18n.changeLanguage(event.target.value)
					setLanguage(event.target.value)
				}}>
				{languages.map((language) => (
					<MenuItem key={language[0]} value={language[0]}>{language[1]}</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}
