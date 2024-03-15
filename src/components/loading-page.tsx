import React from 'react'
import LoadingSpinner from './loading-spinner'

export default function LoadingPage() {
    return (
       <div className='h-screen w-full flex items-center justify-center'>
         <LoadingSpinner size={24} />
       </div>
    )
}