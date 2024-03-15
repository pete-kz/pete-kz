import React, { useEffect, useState, lazy, Suspense } from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, axiosErrorHandler } from '@utils'
import { API } from '@config'
import { AuthState, Pet_Response, User_Response } from '@declarations'
import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import MobilePageHeader from '@/components/mobile-page-header'
import AddPetCard from '@/components/cards/add-pet'

const LikedPet = lazy(() => import('@/components/cards/liked-pet'))
const MyPetIcon = lazy(() => import('@/components/my-pet-icon'))
const UserProfileCard = lazy(() => import('@/components/cards/user-profile'))

import { ProfileUpdateContext } from '@/contexts/profile-update'

export default function Profile() {

    // Setups
    const user = useAuthUser<AuthState>()
    const isAuthenticated = useIsAuthenticated()
    const { t } = useTranslation()
    const navigate = useNavigate()

    // States
    const [userPets, setUserPets] = useState<Pet_Response[]>([])
    const [userData, setUserData] = useState<User_Response>()
    const [userLiked, setUserLiked] = useState<Pet_Response[]>([])
    const [update, setUpdate] = useState<boolean>(false)

    // Functions
    function getUser() {
        // Fetch all pets
        axios.get(`${API.baseURL}/pets/find`,).then((res) => {
            const allPets: Pet_Response[] = res.data
            const likedIds: string[] = userData?.liked || JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            setUserLiked(allPets.filter(pet => likedIds.includes(pet._id)))
            getUserData()
        }).catch(axiosErrorHandler)
    }

    function getUserData() {
        axios.get(`${API.baseURL}/users/find/${user?._id}`).then((res) => {
            setUserData(res.data)
            getPets()
        }).catch(axiosErrorHandler)
    }

    function getPets() {
        axios.get(`${API.baseURL}/pets/find`).then((res) => {
            setUserPets((res.data as Pet_Response[]).filter(pet => pet.ownerID === user?._id))
        }).catch(axiosErrorHandler)
    }

    useEffect(() => {
        getUserData()
        getUser()
    }, [update])

    return (
        <ProfileUpdateContext.Provider value={{ update, setUpdate }}>
            <MobilePageHeader title={t('header.profile')} to='/pwa' />
            <m.div className="block w-full gap-2 p-3 mb-20" initial={{ opacity: 0, y: 1 }} animate={{ opacity: 1, y: 0 }}>
                <Suspense fallback={<div>Loading...</div>}>
                    {isAuthenticated() ? (
                        userData && <UserProfileCard user={userData} />
                    ) : (
                        <Button variant={'secondary'} className='gap-2 w-full font-bold' onClick={() => { navigate('/auth/login') }}>
                            {t('button.authorization')}
                        </Button>
                    )}
                </Suspense>

                <div className='p-1 mt-3'>
                    <p>{t('label.myPets')}</p>
                    <div className='grid grid-cols-3 gap-2 mt-2'>
                        {userData && userPets?.map((pet, index) => (
                            <MyPetIcon key={index} user={userData} {...pet} setUserPets={setUserPets} />
                        ))}
                        <AddPetCard />
                    </div>
                </div>

                <div className='p-1'>
                    <p>{t('label.myLikes')}</p>
                    {userLiked.length > 0 && userLiked.map((pet, index) => (
                        <LikedPet userLiked={userLiked} setUserLiked={setUserLiked} key={index} pet={pet} userData={userData} />
                    ))}
                </div>
                <div className='absolute bottom-5 right-5'>
                    <SettingsButton />
                </div>
            </m.div>
        </ProfileUpdateContext.Provider>
    )
}

function SettingsButton() {
    // Setups
    const navigate = useNavigate()

    return (
        <button className='p-3 bg-primary rounded-full text-border' onClick={() => navigate('/pwa/settings')}><Settings className='h-8 w-8' /></button>
    )
}
