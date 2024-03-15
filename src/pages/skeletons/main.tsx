import { Skeleton } from '@/components/ui/skeleton'
import { m } from 'framer-motion'
import React from 'react'

export default function MainSkeleton() {
  return (
    <m.div className='h-screen w-full flex items-center justify-center p-4' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <Skeleton className='h-[477px] w-full' />
    </m.div>
  )
}