import React, { useEffect, useState } from 'react'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { Pet_Response, User_Response } from '@declarations'
import { useNavigate } from 'react-router-dom'

// UI
import { HeartOff, Trash, Pencil, Plus } from 'lucide-react'
import { Card } from '@/Components/ui/card'
import { Button } from '@/Components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/Components/ui/avatar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/Components/ui/accordion'
import { Input } from '@/Components/ui/input'
import { Label } from '@/Components/ui/label'
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
} from '@/Components/ui/alert-dialog'

export default function Profile() {

    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()
    const navigate = useNavigate()
    const isAuthenticated = useIsAuthenticated()

    // States
    const [usersPet, setUsersPet] = useState<Pet_Response[]>()
    const [liked, setLiked] = useState<Pet_Response[]>([])

    // States for editing
    const [name, setName] = useState<User_Response['name']>('')
    const [login, setLogin] = useState<User_Response['login']>('')
    const [phone, setPhone] = useState<User_Response['phone']>('')
    const [instagram, setInstagram] = useState<User_Response['social']['instagram']>('')
    const [telegram, setTelegram] = useState<User_Response['social']['telegram']>('')
    const [password, setPassword] = useState<User_Response['password']>('')
    const [update, setUpdated] = useState<boolean>(false)
    const [updatingState, setUpdatingState] = useState<boolean>(false)
    const [userData, setUserData] = useState<User_Response>()

    // Functions
    function getInfo() {
        if (!isAuthenticated()) {
            const likedIDS = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            if (likedIDS.length > 0) {
                axios.post(`${API.baseURL}/pets/find`)
                    .then((res: AxiosResponse) => {
                        if (!res.data.err) {
                            const allPets: Pet_Response[] = res.data
                            const likedPets = allPets.filter(pet => {
                                return likedIDS.includes(pet._id)
                            })
                            setLiked(likedPets)
                        } else {
                            notification.custom.error(res.data.err)
                        }
                    })
            }
            return
        }
        axios.post(`${API.baseURL}/pets/find`)
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    const allPets: Pet_Response[] = res.data
                    setUsersPet((res.data as Pet_Response[]).filter(pet => pet.userID === user._id))
                    axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
                        // need to populate skipped and like => filter out all pets based on skipped ids
                        if (!res.data.err) {
                            const user: User_Response = res.data
                            setName(user.name)
                            setLogin(user.login)
                            setPhone(user.phone)
                            setInstagram(user.social.instagram)
                            setTelegram(user.social.telegram)
                            setUserData(user)
                            setLiked(allPets?.filter(pet => user.liked.includes(pet._id)) || [])
                        } else {
                            notification.custom.error(res.data.err)
                        }
                    })
                } else {
                    notification.custom.error(res.data.err)
                }
            })
    }

    function removePet(pet: Pet_Response) {
        if (!isAuthenticated()) return
        axios.post(`${API.baseURL}/pets/remove`, { query: { _id: pet._id } })
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    notification.custom.success(`${t('pet.goodbye')}, ${pet.name}!`)
                    setUsersPet(pets => pets?.filter(userPet => userPet._id != pet._id))
                } else {
                    notification.custom.error(res.data.err)
                }
            })
    }

    function removePetFromLiked(pet_id: string) {
        if (!isAuthenticated || !userData) {
            let browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            browserLiked = browserLiked.filter(likedPet => likedPet != pet_id)
            axios.post(`${API.baseURL}/pets/find`)
                .then((res: AxiosResponse) => {
                    if (!res.data.err) {
                        const allPets: Pet_Response[] = res.data
                        const likedPets = allPets.filter(pet => {
                            return browserLiked.includes(pet._id)
                        })
                        setLiked(likedPets)
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
                setLiked(pets => pets?.filter(userPet => userPet._id != pet_id))
                setUserData(userPrevData)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    function updateProfileInfo() {
        setUpdatingState(true)
        axios.post(`${API.baseURL}/users/update/${user._id}`, {
            update: {
                name,
                login,
                phone,
                password: password != '' ? password : undefined,
                social: {
                    instagram,
                    telegram
                }
            }
        })
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    notification.custom.success(t('user.profile_updated'))
                    setUpdated(update => !update)
                } else {
                    notification.custom.error(res.data.err)
                }
                setUpdatingState(false)
            })
    }

    useEffect(() => {
        getInfo()
    }, [update])

    useEffect(() => {
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

    return (
        <m.div className="block w-screen gap-2 p-3 mb-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Accordion type='single' collapsible>
                {user._id && (
                    <AccordionItem value='my_profile' className='m-4'>
                        <AccordionTrigger>{t('main.my_profile')}</AccordionTrigger>
                        <AccordionContent className='flex flex-col p-2 gap-3'>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='user_name'>{t('user.name')}</Label>
                                <Input id='user_name' value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='user_login'>{t('user.login')}</Label>
                                <Input id='user_login' value={login} onChange={(e) => setLogin(e.target.value)} />
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label>{t('user.contacts.phone')}</Label>
                                <Input placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value as string)} />
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='user_instagram'>{t('user.contacts.instagram')}</Label>
                                <Input id='user_instagram' value={instagram} onChange={(e) => setInstagram(e.target.value)} />
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='user_telegram'>{t('user.contacts.telegram')}</Label>
                                <Input id='user_telegram' value={telegram} onChange={(e) => setTelegram(e.target.value)} />
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='user_password'>{t('user.password')}</Label>
                                <Input id='user_password' value={password} type="password" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <Button onClick={updateProfileInfo}>{updatingState ? 'Loading...' : 'Update'}</Button>
                        </AccordionContent>
                    </AccordionItem>
                )}
                {liked.length > 0 && (
                    <AccordionItem value='my_likes' className='m-4'>
                        <AccordionTrigger>{t('main.your_likes')}</AccordionTrigger>
                        <AccordionContent className='flex flex-col p-2 gap-3'>
                            {liked?.map((pet, index) => (
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
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
            <div className='p-4'>
                <p>{t('main.my_pets')}</p>
                <div className='grid grid-cols-3 gap-2 mt-2'>
                    {usersPet?.map((pet, index) => (
                        <Card key={index} className='flex flex-col items-center p-3 gap-2' >
                            <Avatar>
                                <AvatarImage src={pet.imagesPath[0]} alt={pet.name} />
                                <AvatarFallback>{pet.name[0]}</AvatarFallback>
                            </Avatar>
                            <p className='text-center'>{pet.name}</p>
                            <div className='grid grid-rows-1 grid-cols-2 gap-2'>
                                <Button className='p-2' variant={'outline'} onClick={() => { navigate(`/pwa/pets?id=${pet._id}&edit=true`) }}>
                                    <Pencil size={14} />
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button className='p-2' variant={'outline'}>
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


        </m.div>
    )
}
