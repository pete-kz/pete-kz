import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { m } from 'framer-motion'

export default function MobilePageHeader({ title, to }: { title: string, to: string }) {

    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <m.div className='grid grid-rows-1 grid-cols-3 bg-card h-16 w-screen' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className='flex items-center justify-start pl-2'>
                <Button variant={'link'} onClick={() => { navigate(to) }} className='flex justify-start gap-1 h-fit text-muted-foreground p-4 pl-0'>
                    <div className='flex items-center'><ChevronLeft />
                        {t('label.back')}</div>
                </Button>
            </div>
            <div className='text-2xl font-bold flex items-center justify-center'>{title}</div>
            <div className='w-full'></div>
        </m.div>
    )
}
