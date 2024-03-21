import React, { useEffect, useState, lazy, Suspense } from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import axios, { AxiosError } from 'axios'
import { API } from '@config'
import { AuthState, Pet_Response, User_Response } from '@declarations'
import { useNavigate, useParams } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobilePageHeader from '@/components/mobile-page-header'
import AddPetCard from '@/components/cards/add-pet'
import { useQuery } from '@tanstack/react-query'

const LikedPet = lazy(() => import('@/components/cards/liked-pet'))
const MyPetIcon = lazy(() => import('@/components/my-pet-icon'))
const UserProfileCard = lazy(() => import('@/components/cards/user-profile'))

export default function User() {

    // Setups
    const { userId } = useParams()
    const { t } = useTranslation()
    const { data: user, error, isPending }: { data: User_Response | undefined, isPending: boolean, error: AxiosError | null  } = useQuery({ queryKey: ['user', userId], queryFn: () => axios.get(`${API.baseURL}/users/find/${userId}`).then(res => res.data) })
    const { data: pets, error: petsError, isPending: petsPending }: { data: Pet_Response[] | undefined, isPending: boolean, error: AxiosError | null } = useQuery({ queryKey: ['user_pets', userId], queryFn: () => axios.get(`${API.baseURL}/pets/find/`).then(res => { 
        return (res.data as Pet_Response[]).filter(pet => pet.ownerID === user?._id) 
    })})

    return (
        <>
            <m.div className="block w-full gap-2 p-3 mb-20" initial={{ opacity: 0, y: 1 }} animate={{ opacity: 1, y: 0 }}>
                {error && <div>{t('errors.user_not_found')}</div>}
                {isPending ? (
                    <div>Loading...</div>
                ) : user && (
                    <div className='space-y-2'>
                        <UserProfileCard user={user} />
                        <m.div className='flex justify-center items-center space-x-2'>
                            <h1 className='text-2xl font-bold'>{t('label.userPets')}</h1>
                            {pets?.map(pet => (
                                <MyPetIcon key={pet._id} {...pet} />
                            ))}
                        </m.div>
                    </div>
                )}
            </m.div>
        </>
    )
    
}