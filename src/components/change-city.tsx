import React, { useState, useEffect } from 'react'

import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function ChangeCity() {

    // Setups
    const { t } = useTranslation()

    // States
    const [currentCity, setCurrentCity] = useState<string>(localStorage.getItem('_city') || '-')

    useEffect(() => {
        if (currentCity != '-') localStorage.setItem('_city', currentCity)
    }, [currentCity])

    return (
        <div className='grid w-full items-center gap-1.5'>
            <Label>
                {t('label.city')}
            </Label>
            <Select
                value={currentCity}
                onValueChange={(value: React.SetStateAction<string>) => {
                    setCurrentCity(value)
                }}>
                <SelectTrigger>
                    <SelectValue placeholder={t('label.city')} />
                    <SelectContent>
                        <SelectItem  value={'-'}>{'-'}</SelectItem>
                        {[...Array(10).keys()].map((city) => (
                            <SelectItem key={city} value={String(city)}>{t(`cities.${city}`)}</SelectItem>
                        ))}
                    </SelectContent>
                </SelectTrigger>
            </Select>
        </div>
    )
}