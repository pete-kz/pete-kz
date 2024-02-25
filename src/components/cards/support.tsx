import React from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export default function SupportCard() {

    // Setups
    const { t } = useTranslation()

    return (
        <Card className='p-4'>
				<CardTitle>{t('support.label')}</CardTitle>
				<CardContent className='mt-2 p-0'>
					{t('support.text')}
					<ul className='list-disc ml-4'>
						<li>Kaspi Gold: <Button className='p-0' variant={'link'} onClick={() => { navigator.clipboard.writeText('4400430228103260') }}>4400 4302 2810 3260</Button></li>
						<li>{t('support.more_soon')}</li>
					</ul>
				</CardContent>
			</Card>
    )
}