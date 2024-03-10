import React from 'react'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

export default function BackButton({ to = '/pwa', action, className }: { to?: string, action?: () => void, className?: string }) {

    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()

    return (
        <Button variant={'link'} onClick={() => { action ? action() : navigate(to) }} className={cn('flex justify-start gap-1 h-fit text-muted-foreground p-4 pl-0', className)}>
            <div className='flex items-center'><ChevronLeft />
            {t('label.back')}</div>
        </Button>
    )
}