import { Skeleton } from '@/components/ui/skeleton'
import { m } from 'framer-motion'
import React from 'react'

export default function UserSkeleton() {
  return (
    <m.div className='h-screen w-full flex items-center justify-center p-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Skeleton className='h-[140px] w-full' />
        <div className='grid grid-cols-3 grid-rows-2 gap-2'>
            <Skeleton className='h-[86px] w-full' />
            <Skeleton className='h-[86px] w-full' />
            <Skeleton className='h-[86px] w-full' />
            <Skeleton className='h-[86px] w-full' />
            <Skeleton className='h-[86px] w-full' />
        </div>
    </m.div>
  )
}