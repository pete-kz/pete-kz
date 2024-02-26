import React from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import { useTranslation } from 'react-i18next'

export default function AboutUsCard() {

    // Setups
    const { t } = useTranslation()

    return (
        <Card className='p-4'>
				<CardTitle>{t('about_us.label')}</CardTitle>
				<CardContent className='mt-2 p-0'>
					{t('about_us.text')}
				</CardContent>
			</Card>
    )
}