import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { AboutUsLanguage } from '@/lib/declarations'

export default function AboutUsCard() {

    // Setups
    const { t, i18n } = useTranslation()
    
    // States
    const [data, setData] = useState<AboutUsLanguage>()

    useEffect(() => {
        i18n.language && fetch(`locales/${i18n.language}/translation.json`).then(res => res.json()).then(res => {
            setData(res)
        })
    }, [])
    return (
        <div className='p-4 border-none bg-none'>
            <h1 className='text-2xl font-bold'>{t('label.aboutUs')}</h1>
            <div className='mt-2 p-0 flex flex-col gap-3'>
                <p>{data?.about_us.text.heading}</p>
                <ul className='list-disc'>
                {data?.about_us.text.keys.map((key, idx) => (
                    <li key={key[0]} className={`${idx != 0 && 'mt-3'} ml-4`}>
                        <h3 className='text-lg italic font-semibold'>{key[0]}</h3>
                        <p>{key[1]}</p>
                    </li>
                ))}
                </ul>
                <p>{data?.about_us.text.conclusion}</p>
            </div>
        </div>
    )
}