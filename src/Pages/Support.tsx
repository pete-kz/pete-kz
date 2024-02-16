import React from 'react'
import { Card, CardTitle, CardDescription } from '@/Components/ui/card'
import { useTranslation } from 'react-i18next'
import { Button } from '@/Components/ui/button'
import { m } from 'framer-motion'

export default function SupportPage() {
    const { t } = useTranslation()
    // 
    return (
        <m.div animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <Card className='p-4'>
                <CardTitle>Support</CardTitle>
                <CardDescription className='mt-2'>
                    {t('support.text')}
                    <ul className='list-disc ml-4'>
                        <li>Kaspi Gold: <Button className='p-0' variant={'link'} onClick={() => { navigator.clipboard.writeText('4400430228103260') }}>4400 4302 2810 3260</Button></li>
                        <li>{t('support.more_soon')}</li>
                    </ul>
                </CardDescription>
            </Card>
        </m.div>
    )
}