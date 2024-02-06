import { useNavigate } from 'react-router-dom'
import React from 'react'

export default function IndexPage() {
    const navigate = useNavigate()

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <div className='flex flex-col items-center gap-4'>
                <div className='text-center'>
                
<p className='text-4xl'>Welcome to <b>PETE</b></p>
<p className='text-gray-700'>Find a loving home for your pets fast!</p>
                </div>
                <div className='w-64 h-64 bg-black'>

                </div>
                <div className='flex gap-2'>
                    <button id="main_auth_btn" onClick={() => { navigate('/login') }}>Login</button>
                    <button id="main_auth_btn" onClick={() => { navigate('/register') }}>Register</button>
                </div>
            </div>
        </div>
    )
}