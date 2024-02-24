import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { m, useAnimate } from 'framer-motion'

export default function IndexPage() {
    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()
	const [scope, animate] = useAnimate()

    function go() {
        animate(scope.current, { y: 0, display: 'block', position: 'absolute', opacity: 1, x: 0, top: 0 }, { duration: 1 }).then(() => {
            navigate('/pwa')
        })
    }

    return (
        <>
        <m.div animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <div className='bg-purple-500'>
                <img src={'/images/cover_pets_picture.webp'} alt="Cover Picture Of Pets" />
            </div>
            <Card className='flex flex-col items-center gap-4 mt-4 p-5'>
                <div className='text-center'>
                    <p className='text-4xl'>{`${t('index.welcome_to')} `}<b>PETE</b></p>
                    <p className='text-muted-foreground'>{t('index.description')}</p>
                </div>
                <div className='grid grid-cols-2 grid-rows-1 gap-1.5'>
                    <LanguageSwitcher />
                    <div className='grid w-full items-center gap-1.5'>
                        <Label>PWA</Label>
                        <Button onClick={go}>{t('index.proceed_PWA')}</Button>
                    </div>
                </div>
            </Card>
        </m.div>
        <m.div className='bg-background h-screen w-screen left-0' ref={scope} initial={{ display: 'none', opacity: 0, y: 500 }}>

        </m.div>
        </>
    )
}