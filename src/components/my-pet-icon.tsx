import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pet_Response, User_Response } from '@declarations'
import { Trash, Pencil } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from '@/components/ui/alert-dialog'
import PetOverlay from './pet-overlay'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { axiosAuth as axios, axiosErrorHandler } from '@/lib/utils'
import { API } from '@config'
import { useToast } from './ui/use-toast'

interface PetIcon extends Pet_Response {
    user: User_Response
    setUserPets: React.Dispatch<React.SetStateAction<Pet_Response[]>>
}

export default function MyPetIcon(props: PetIcon) {

    // Setups
    const { t } = useTranslation()
    const authHeader = useAuthHeader()
    const isAuthenticated = useIsAuthenticated()
    const { toast } = useToast()

    // States
    const [openPet, setOpenPet] = useState<boolean>(false)

    // Functions
    function removePet(pet: Pet_Response) {
        // If user is not authenticated, do not do anything
        if (!isAuthenticated()) return

        // Send request to remove pet from user data
        axios.delete(`${API.baseURL}/pets/remove/${pet._id}`, { headers: { Authorization: authHeader } })
            .then(() => {
                // Filter pet from state of user pets for rendering
                props.setUserPets(pets => pets?.filter(userPet => userPet._id != pet._id))
                toast({ description: `${t('pet.goodbye')}, ${pet.name}!` })
            })
            .catch(axiosErrorHandler)
    }

    return (
        <>
            <PetOverlay pet={props} owner={props.user} edit open={openPet} setOpen={setOpenPet} />
            <Card className='flex flex-col items-center p-3 gap-2' >
                <Avatar>
                    <AvatarImage src={props.imagesPath[0]} alt={props.name} />
                    <AvatarFallback>{props.name[0]}</AvatarFallback>
                </Avatar>
                <p className='text-center'>{props.name}</p>
                <div className='grid grid-rows-1 grid-cols-2 gap-2'>
                    <Button className='p-2 w-10 h-10' variant={'outline'} onClick={() => { setOpenPet(true) }}>
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
                                <AlertDialogAction onClick={() => { removePet({ ...props }) }}>{t('alert.sure')}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </Card>
        </>
    )
}
