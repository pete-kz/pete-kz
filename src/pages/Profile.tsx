import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuthUser, useIsAuthenticated, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, axiosErrorHandler, parseMongoDate } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { Pet_Response, User_Response } from '@declarations'
import { useNavigate } from 'react-router-dom'
import { Trash, Pencil, Plus, Settings, LogOut } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import MobilePageHeader from '@/components/mobile-page-header'
import ChangeProfileForm from '@/components/forms/change-profile'
import LikedPet from '@/components/cards/liked-pet'
import { useToast } from '@/components/ui/use-toast'

export default function Profile() {

    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const isAuthenticated = useIsAuthenticated()
    const { t } = useTranslation()
    const navigate = useNavigate()
    const signout = useSignOut()
    const { toast } = useToast()

    // States
    const [userPets, setUserPets] = useState<Pet_Response[]>([])
    const [userData, setUserData] = useState<User_Response>()
    const [userLiked, setUserLiked] = useState<Pet_Response[]>([])

    // Functions
    const getUserData = useMemo(() => async () => {
        if (user._id) {
            axios.get(`${API.baseURL}/users/find/${user._id}`).then((res) => {
                setUserData(res.data)

                axios.get(`${API.baseURL}/pets/find`).then((res) => {
                    setUserPets((res.data as Pet_Response[]).filter(pet => pet.ownerID === user._id))
                }).catch(axiosErrorHandler)
            }).catch(axiosErrorHandler)
        }
    }, [user._id])

    const getUser = useMemo(() => async () => {
        // Fetch all pets
        axios.get(`${API.baseURL}/pets/find`,).then((res) => {
            const allPets: Pet_Response[] = res.data
            const likedIds: string[] = userData?.liked || JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            // If user is not authenticated
            setUserLiked(allPets.filter(pet => likedIds.includes(pet._id)))
        }).catch(axiosErrorHandler)

    }, [userData])

    function removePet(pet: Pet_Response) {
        // If user is not authenticated, do not do anything
        if (!isAuthenticated()) return

        // Send request to remove pet from user data
        axios.delete(`${API.baseURL}/pets/remove/${pet._id}`)
            .then((res: AxiosResponse) => {
                if (res.data.err) {
                    toast({ description: res.data.err })
                }

                // Filter pet from state of user pets for rendering
                setUserPets(pets => pets?.filter(userPet => userPet._id != pet._id))
                toast({ description: `${t('pet.goodbye')}, ${pet.name}!` })
            })
            .catch(axiosErrorHandler)
    }



    const userLastUpdated = useCallback((user: User_Response) => {
        const parsedDate = parseMongoDate(user.updatedAt)
        return `${parsedDate.date.day}.${parsedDate.date.month}.${parsedDate.date.year}`
    }, [])

    useEffect(() => {
        getUserData()
        getUser()
    }, [])

    return (
        <>
            <MobilePageHeader title={t('header.profile')} to='/pwa' />
            <m.div className="block w-full gap-2 p-3 mb-20" initial={{ opacity: 0, y: 1 }} animate={{ opacity: 1, y: 0 }}>
            {userData ? (
                    <Card className='p-3 flex flex-col gap-4'>
                        <div className='flex gap-2'>
                            <Avatar>
                                <AvatarImage src={'/images/pete-logo.svg'} alt={'PETE'} />
                                <AvatarFallback>P</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-bold'>{userData.companyName ? userData.companyName : `${userData.firstName} ${userData.lastName}`}</p>
                                <p className=''>{`${t('label.lastUpdated')}: ${userLastUpdated(userData)}`}</p>
                            </div>
                        </div>
                        <div className='grid grid-cols-2 border grid-rows-1 rounded-lg'>
                            <ChangeProfileForm>
                                <Button className='rounded-none p-2 m-0 border-r gap-2 rounded-l-lg' type='submit' variant={'link'}>
                                    {t('label.edit')}<Pencil />
                                </Button>
                            </ChangeProfileForm>
                            <Button variant={'link'} className='text-red-500 hover:bg-red-500 hover:text-white hover:rounded-r-lg rounded-r-lg border-l rounded-none p-2 m-0 gap-2' onClick={() => { signout(); navigate('/pwa') }}>
                            {t('label.logout')}<LogOut />
                            </Button>
                        </div>
                    </Card>
                ) : isAuthenticated() ? (
                    <Skeleton className='h-[132px] w-full rounded-lg' />
                ) : (
                    <Button variant={'secondary'} className='gap-2 w-full font-bold' onClick={() => { navigate('/auth/login') }}>
                        {t('button.authorization')}
                    </Button>
                )}

                <div className='p-1 mt-3'>
                    <p>{t('label.myPets')}</p>
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
                        <Card className='flex flex-col justify-center items-center p-3 gap-3 cursor-pointer' onClick={() => { navigate('/pwa/pets/add') }}>
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
                    <p>{t('label.myLikes')}</p>
                    {userLiked.length > 0 && userLiked.map((pet, index) => (
                        <LikedPet userLiked={userLiked} setUserLiked={setUserLiked} key={index} pet={pet} userData={userData} />
                    ))}
                </div>
                <div className='absolute bottom-5 right-5'>
                    <button className='p-3 bg-primary rounded-full text-border' onClick={() => navigate('/pwa/settings')}><Settings className='h-8 w-8' /></button>
                </div>
            </m.div>
        </>
    )
}
