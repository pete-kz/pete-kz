import React from 'react'
import BackButton from './back-button'

export default function MobilePageHeader({ title }: { title: string }) {

    return (
        <div className='grid grid-rows-1 grid-cols-3 bg-card h-16 w-screen'>
            <div className='flex items-center justify-start pl-2'><BackButton /></div>
            <div className='text-2xl font-bold flex items-center justify-center'>{title}</div>
            <div className='w-full bg-card'></div>
        </div>
    )
}