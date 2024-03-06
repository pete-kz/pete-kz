import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import ChangeLanguage from '@/components/change-language'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { m, useAnimate } from 'framer-motion'
import ProjectCard from '@/components/cards/project'
import { useQuery } from '@/lib/utils'

export default function IndexPage() {

    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()
    const [scope, animate] = useAnimate()
    const query = useQuery()

    // Functions
    function go() {
        animate(scope.current, { y: 0, display: 'block', position: 'absolute', opacity: 1, x: 0, top: 0 }, { duration: 1 }).then(() => {
            navigate('/pwa')
        })
    }

    useEffect(() => {
        if (query.get('pwa') === 'true') {
            navigate('/pwa')
        }
    }, [])

    return (
        <>
            <m.div animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} exit={{ opacity: 0, x: -100 }}>
                <Card className='mx-auto flex flex-col items-center p-5 max-w-lg'>
                    <ProjectCard description />
                    <div className='grid grid-cols-2 grid-rows-1 gap-1.5 w-full'>
                        <ChangeLanguage />
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