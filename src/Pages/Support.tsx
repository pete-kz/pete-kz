import React from 'react'
import { m } from 'framer-motion'

export default function SupportPage() {
    return (
        <m.div animate={{ opacity: 1, y: 0, x: 0 }} initial={{ opacity: 0, y: 100, x: 0 }} exit={{ opacity: 0, x: -100 }}>
            <SupportPage />
        </m.div>
    )
}