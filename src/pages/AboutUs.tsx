import React from 'react'
import { m } from 'framer-motion'
import AboutUsCard from '@/components/cards/about-us'

export default function AboutUsPage() {
    return (
        <m.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} exit={{ opacity: 0, x: -100 }}>
            <AboutUsCard />
        </m.div>
    )
}