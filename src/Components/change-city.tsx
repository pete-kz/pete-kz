import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Label } from '@/Components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'

export default function ChangeCity() {
    // Setups
    const { t } = useTranslation()

    // States
    const [currentCity, setCurrentCity] = useState<string>(localStorage.getItem('_city') || '0')

    useEffect(() => {
        localStorage.setItem('_city', currentCity)
    }, [currentCity])


    return (
        <div className='grid w-full items-center gap-1.5'>
            <Label>
                {t('settings.labels.city')}
            </Label>
            <Select
                value={currentCity}
                onValueChange={(value) => {
                    setCurrentCity(value)
                }}>
                <SelectTrigger>
                    <SelectValue placeholder={t('settings.labels.city')} />
                    <SelectContent>
                        {[...Array(10).keys()].map((city) => (
                            <SelectItem key={city} value={String(city)}>{t(`cities.${city}`)}</SelectItem>
                        ))}
                    </SelectContent>
                </SelectTrigger>
            </Select>
        </div>
    )
}