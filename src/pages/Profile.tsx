import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification, parseMongoDate } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { Pet_Response, User_Response } from '@declarations'
import { useNavigate } from 'react-router-dom'
import { HeartOff, Trash, Pencil, Plus, Settings } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import MobilePageHeader from '@/components/mobile-page-header'
import ChangeProfileForm from '@/components/forms/change-profile'


export default function Profile() {

    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const isAuthenticated = useIsAuthenticated()
    const { t } = useTranslation()
    const navigate = useNavigate()

    // States
    const [userPets, setUserPets] = useState<Pet_Response[]>([])
    const [userData, setUserData] = useState<User_Response>()
    const [userLiked, setUserLiked] = useState<Pet_Response[]>([])

    // Functions
    const getUserData = useMemo(() => async () => {
        axios.get(`${API.baseURL}/users/find/${user._id}`).then((res) => {
            if (res.data.err) return notification.custom.error(res.data.err)
            setUserData(res.data)

            axios.get(`${API.baseURL}/pets/find`).then((res) => {
                setUserPets((res.data as Pet_Response[]).filter(pet => pet.ownerID === user._id))
            })
        })
    }, [user._id])

    const getUser = useMemo(() => async () => {
        if (userData) {
            axios.get(`${API.baseURL}/pets/find`,).then((res) => {
                if (res.data.err) return notification.custom.error(res.data.err)
                const allPets: Pet_Response[] = res.data

                if (!isAuthenticated()) {
                    const likedIDS = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
                    if (likedIDS.length > 0) {
                        return setUserLiked(allPets.filter(pet => likedIDS.includes(pet._id)))
                    }
                    return setUserLiked(allPets)
                }

                return setUserLiked(allPets?.filter(pet => userData.liked.includes(pet._id)) || [])
            })
        }
    }, [userData])

    function removePet(pet: Pet_Response) {
        if (!isAuthenticated()) return
        axios.post(`${API.baseURL}/pets/remove`, { query: { _id: pet._id } })
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    notification.custom.success(`${t('pet.goodbye')}, ${pet.name}!`)
                    setUserPets(pets => pets?.filter(userPet => userPet._id != pet._id))
                } else {
                    notification.custom.error(res.data.err)
                }
            })
    }

    function removePetFromLiked(pet_id: string) {
        if (!isAuthenticated || !userData) {
            let browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            browserLiked = browserLiked.filter(likedPet => likedPet != pet_id)
            axios.get(`${API.baseURL}/pets/find`)
                .then((res: AxiosResponse) => {
                    if (!res.data.err) {
                        const allPets: Pet_Response[] = res.data
                        const likedPets = allPets.filter(pet => {
                            return browserLiked.includes(pet._id)
                        })
                        setUserLiked(likedPets)
                        localStorage.setItem('_data_offline_liked', JSON.stringify(browserLiked))
                        notification.custom.success(t('errors.liked_remove'))
                    } else {
                        notification.custom.error(res.data.err)
                    }
                })

            return
        }
        const userPrevData = structuredClone(userData)
        userPrevData.liked.filter(pet => pet != pet_id)
        // @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
        userPrevData.password = undefined
        axios.delete(`${API.baseURL}/users/remove/${userData._id}/liked/${pet_id}`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                notification.custom.success(t('errors.liked_remove'))
                setUserLiked(pets => pets?.filter(userPet => userPet._id != pet_id))
                setUserData(userPrevData)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    const userLastUpdated = useCallback((user: User_Response) => {
        const parsedDate = parseMongoDate(user.updatedAt)
        return `${parsedDate.date.day}.${parsedDate.date.month}.${parsedDate.date.year}`
    }, [])

    useEffect(() => {
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
        getUserData()
        getUser()
    }, [])

    return (
        <>
            <MobilePageHeader title={t('header.profile')} to='/pwa' />
            <m.div className="block w-screen gap-2 p-3 mb-20" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {userData ? (
                    <Card className='p-3 flex justify-between items-center'>
                        <div className='flex gap-2'>
                            <Avatar>
                                <AvatarImage src={'/images/pete-logo.svg'} alt={'PETE'} />
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-bold'>{userData.companyName ? userData.companyName : `${userData.firstName} ${userData.lastName}`}</p>
                                <p className=''>{`${t('main.pet_card.last_update')}: ${userLastUpdated(userData)}`}</p>
                                
                            </div>
                        </div>
                        <div>
                            <ChangeProfileForm>
                                <Button size={'icon'} type='submit' variant={'link'}><Pencil /></Button>
                            </ChangeProfileForm>
                        </div>
                    </Card>
                ) : isAuthenticated() && (
                    <Skeleton className='h-[74px] w-full rounded-lg' />
                )}

                <div className='p-1 mt-3'>
                    <p>{t('profile.myPets')}</p>
                    <div className='grid grid-cols-3 gap-2 mt-2'>
                        {userPets?.map((pet, index) => (
                            <Card key={index} className='flex flex-col items-center p-3 gap-2' >
                                <Avatar>
                                    <AvatarImage src={pet.imagesPath[0]} alt={pet.name} />
                                    <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                </Avatar>
                                <p className='text-center'>{pet.name}</p>
                                <div className='grid grid-rows-1 grid-cols-2 gap-2'>
                                    <Button className='p-2 w-10 h-10' variant={'outline'} onClick={() => { navigate(`/pwa/pets?id=${pet._id}&edit=true`) }}>
                                        <Pencil size={14} />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button className='p-2 w-10 h-10' variant={'outline'}>
                                                <Trash size={14} style={{ color: '#FF0000' }} />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>{t('alert.you_sure')}</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {t('alert.delete_pet_profile')}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>{t('alert.back')}</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => { removePet(pet) }}>{t('alert.sure')}</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </Card>
                        ))}
                        <Card className='flex flex-col justify-center items-center p-3 gap-3' onClick={() => { navigate('/pwa/pets/add') }}>
                            <div className='text-zinc-400'>
                                <Plus fontSize='large' />
                            </div>
                            <div className='text-center'>
                                <p>{t('pet.add.btn')}</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className='p-1 mt-3'>
                    <p>{t('profile.liked')}</p>
                    {userLiked.length > 0 && userLiked.map((pet, index) => (
                        <Card key={index} className='flex items-center justify-between mt-2 p-3' >
                            <div className='w-full' onClick={() => { navigate(`/pwa/pets?id=${pet._id}&contacts=true`) }}>
                                <div className='flex gap-2 items-center'>
                                    <Avatar>
                                        <AvatarImage src={pet.imagesPath[0]} alt={pet.name} />
                                        <AvatarFallback>{pet.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <p>{pet.name}</p>
                                </div>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant={'ghost'}>
                                        <HeartOff size="20" style={{ color: '#FF0000' }} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>{t('alert.you_sure')}</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {t('alert.remove_like')}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>{t('alert.back')}</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => { removePetFromLiked(pet._id) }}>{t('alert.sure')}</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </Card>
                    ))}
                </div>
                <div className='absolute bottom-5 right-5'>
                    <button className='p-3 bg-primary rounded-full text-border' onClick={() => navigate('/pwa/settings') }><Settings className='h-8 w-8' /></button>
                </div>
            </m.div>
        </>
    )
}
