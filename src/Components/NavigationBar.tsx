import React from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '@/Images/icon.svg'
import { main } from '@config'
import { useTranslation } from 'react-i18next'

export default function MainNavigationBar() {
    // Setups
    const navigate = useNavigate()
    const { t } = useTranslation()

    // Function
    function isActive(page: string): boolean {
        return page === window.location.pathname
    }

    return (
        <header className='h-16 flex items-center justify-between px-5 w-screen bg-white sticky top-0' style={{ zIndex: 9999 }}>
            <div>
                <img src={Icon} alt="" className='h-10 w-10' />
            </div>
            <div className='flex flex-row gap-3'>
                {main.navLinks.map((link, index) => (
                    <button className={`transition-all ease-in duration-75 ${isActive(link[1]) ? 'font-bold' : ''}`} key={index} onClick={() => { navigate(link[1]) }}>{t(link[0])}</button>
                ))}
            </div>
        </header>
    )
}