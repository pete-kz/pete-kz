import React, { useState } from 'react'
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
import { HeartOff } from 'lucide-react'
import { Pet_Response, User_Response } from '@/lib/declarations'
import { useIsAuthenticated } from 'react-auth-kit'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { useTranslation } from 'react-i18next'
import PetOverlay from '../pet-overlay'

export default function LikedPet({ pet, userData, setUserLiked }: { pet: Pet_Response, userData: User_Response | undefined, userLiked: Pet_Response[], setUserLiked: React.Dispatch<React.SetStateAction<Pet_Response[]>> }) {
    // States
    const [open, setOpen] = useState<boolean>(false)

    // Setups
    const isAuthenticated = useIsAuthenticated()
    const { t } = useTranslation()

    // Functions
    function removePetFromLiked(pet_id: string) {
        // If user is not authenticated, remove pet from local storage
        if (!isAuthenticated || !userData) {
            // Parse liked pets from local storage
            let browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            // Filter liked pets from unliked pet
            browserLiked = browserLiked.filter(likedPet => likedPet != pet_id)

            // Fetch all pets
            axios.get(`${API.baseURL}/pets/find`)
                .then((res: AxiosResponse) => {
                    if (!res.data.err) return notification.custom.error(res.data.err)
                    const allPets: Pet_Response[] = res.data

                    // Filter liked pets from all pets that saved locally
                    const likedPets = allPets.filter(pet => {
                        return browserLiked.includes(pet._id)
                    })

                    // Set liked pets to state for rendering
                    setUserLiked(likedPets)

                    // Save liked pets to local storage
                    localStorage.setItem('_data_offline_liked', JSON.stringify(browserLiked))
                    notification.custom.success(t('notifications.liked_remove'))
                })

            return
        }
        // If user is authenticated, remove pet from user data
        const userPrevData = structuredClone(userData)  // Clone user data

        // Filter liked pets from unliked pet
        userPrevData.liked.filter(pet => pet != pet_id)

        // Removing password field from userData so API does not update the password by accident
        // @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
        userPrevData.password = undefined

        // Send request to remove liked pet from user data
        axios.delete(`${API.baseURL}/users/remove/${userData._id}/liked/${pet_id}`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                notification.custom.success(t('notifications.liked_remove'))
                // Remove pet from state of liked pets for rendering
                setUserLiked(pets => pets?.filter(userPet => userPet._id != pet_id))
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    return (
        <Card className='flex items-center justify-between mt-2 p-3 cursor-pointer' >
            <PetOverlay open={open} setOpen={setOpen} pet={pet} owner={userData} contacts />
            <div className='w-full' onClick={() => { setOpen(true) }}>
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
    )
}