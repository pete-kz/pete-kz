/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AddPetForm } from '@/components/forms/add-pet'

export default function AddPetPage() {

    // Setups
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const signout = useSignOut()
    const authHeader = useAuthHeader()
    const { t } = useTranslation()

    // Functions
    function checkToken() {
        const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
        const isEqualTokens = authHeader() == token
        if (!isEqualTokens) {
            signout()
        }
    }

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate('/auth/login')
            return
        }
        checkToken()
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

    return (
        <>
            <m.div className='m-2 p-2 mb-20' initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div>
                    <h1 className='text-2xl font-bold'>{t('pet.add.label')}</h1>
                </div>
                <AddPetForm />        
            </m.div>
        </>
    )
}