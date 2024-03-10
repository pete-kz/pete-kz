import React from 'react'
import { Card, CardContent, CardTitle } from '../ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { notification } from '@/lib/utils'

export default function SupportCard() {

    // Setups
    const { t } = useTranslation()

    return (
        <Card className='p-4'>
				<CardTitle>{t('label.support.default')}</CardTitle>
				<CardContent className='mt-2 p-0'>
					{t('label.support.usVia')}
					<ul className='list-disc ml-4'>
						<li>Kaspi Gold: <Button className='p-0' variant={'link'} onClick={() => { navigator.clipboard.writeText('4400430228103260'); notification.custom.success(t('label.copied')) }}>4400 4302 2810 3260</Button></li>
						<li>{t('label.support.soon')}</li>
					</ul>
				</CardContent>
			</Card>
    )
}