import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function BackButton() {

    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Button variant={'link'} onClick={() => { navigate('/pwa') }} className='flex justify-start gap-1 h-fit text-muted-foreground p-4 pl-0'>
            <div className='flex items-center'><ChevronLeft />
            {t('label.back')}</div>
        </Button>
    )
}