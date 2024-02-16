import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/Components/ui/button'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { Label } from '@/Components/ui/label'

export default function IndexPage() {
    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <>
            <div className='bg-purple-500'>
                <img src={'/images/cover_pets_picture.webp'} alt="Cover Picture Of Pets" />
            </div>
            <div className='flex flex-col items-center gap-4 mt-5'>
                <div className='text-center'>
                    <p className='text-4xl'>{`${t('index.welcome_to')} `}<b>PETE</b></p>
                    <p className='text-muted-foreground'>{t('index.description')}</p>
                </div>
                <div className='grid grid-cols-2 grid-rows-1 gap-1.5'>
                    <LanguageSwitcher />
                    <div className='grid w-full items-center gap-1.5'>
                        <Label>PWA</Label>
                        <Button onClick={() => { navigate('/pwa') }}>{t('index.proceed_PWA')}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}