import React from 'react'
import { useNavigate } from 'react-router-dom'
import { main } from '@config'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function NavigationBar() {

    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Functions
    function isActive(page: string): boolean {
        return page === window.location.pathname
    }

    return (
        <header className='h-16 fixed top-0 flex items-center px-5 w-screen bg-card border-b justify-between' style={{ zIndex: 9999 }}>
            <img src="/images/pete-logo.svg" onClick={() => { navigate('/') }} width={30} />
            <div className='flex gap-3'>
                {main.navLinks.map((link, index) => (
                    <Button variant={'link'} className={`text-white/75 hover:bg-none transition-all ease-in duration-75 p-0 ${isActive(link[1]) && 'text-primary'}`} key={index} onClick={() => { navigate(link[1]) }}>{t(link[0])}</Button>
                ))}
            </div>
        </header>
    )
}