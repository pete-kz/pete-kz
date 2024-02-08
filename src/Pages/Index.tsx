import React from 'react'
import NavigationBar from '@/Components/NavigationBar'
import HowToInstall from '@/Components/HowToInstall'

export default function IndexPage() {
    return (
        <div className='w-screen h-full bg-white'>
            <NavigationBar />
            <div className='bg-purple-500'>
                <img src={'/images/cover_pets_picture.webp'} alt="Cover Picture Of Pets" />
            </div>
            <div className='flex flex-col items-center gap-4 mt-5'>
                <div className='text-center'>
                    <p className='text-4xl'>Welcome to <b>PETE</b></p>
                    <p className='text-gray-700'>Find a loving home for your pets fast!</p>
                </div>
                <div className='text-center'>
                    <p className='text-2xl'>How to install?</p>
                    <HowToInstall />
                </div>
            </div>
        </div>
    )
}