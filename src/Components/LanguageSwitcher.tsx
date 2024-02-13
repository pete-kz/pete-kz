/* eslint-disable linebreak-style */
import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { main } from '@config'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Label } from './ui/label'

const languages = main.languages
const lanaguagesCodes = languages.map(language => language[0])

export default function LanguageSwitcher() {

	// Setups
	const { t, i18n } = useTranslation()
	const [currentLanguage, setLanguage] = useState<string>()

	useEffect(() => {
		setLanguage(lanaguagesCodes.includes(i18n.language) ? i18n.language : 'en')
		i18n.changeLanguage(currentLanguage)
	}, [])

	return (
		<div className='grid w-full items-center gap-1.5'>
			<Label>
				{t('settings.labels.language_button')}
			</Label>
			<Select
				value={currentLanguage}
				onValueChange={(value) => {
					i18n.changeLanguage(value)
					setLanguage(value)
				}}>
				<SelectTrigger>
					<SelectValue placeholder={t('settings.labels.language_button')} />
					<SelectContent>
						{languages.map((language) => (
							<SelectItem key={language[0]} value={language[0]}>{language[1]}</SelectItem>
						))}
					</SelectContent>
				</SelectTrigger>
			</Select>
		</div>
	)
}
