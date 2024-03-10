/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Heart, Instagram, Phone, Send } from 'lucide-react'
import ReactImageGallery from 'react-image-gallery'
import { formatAge } from '@/lib/utils'
import { ChangePetForm } from '@/components/forms/change-pet'
import { OverlayContent, Overlay } from './ui/overlay'
import { AuthStateUserObject } from 'react-auth-kit/dist/types'
import BackButton from './back-button'

export default function PetOverlay({ pet, owner, info = false, edit = false, contacts = false, open = false, setOpen }: { pet: Pet_Response, owner?: User_Response, info?: boolean, edit?: boolean, contacts?: boolean, open?: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {

    // Setups
    const user: AuthStateUserObject = useAuthUser() || {}
    const { t } = useTranslation()

    // States
    const [imageLinks, setImageLinks] = useState<{ original: string, thumbnail: string }[]>([])

    // Functions
    function fetchOwner() {
        axios.get(`${API.baseURL}/users/find/${pet.ownerID}`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                owner = res.data
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }


    useEffect(() => {
        fetchOwner()
        setImageLinks(pet.imagesPath.map(imageLink => {
            return {
                original: imageLink,
                thumbnail: imageLink
            }
        }))
    }, [])

    return <Overlay open={open}>
        <OverlayContent className='max-h-full h-fit overflow-scroll'>
            
            {
                (edit && owner?._id === user?._id) ? (
                    <div className='m-4 bg-card p-4 border rounded-lg mb-16'>
                        <ChangePetForm petData={pet} />
                    </div>
                ) : (
                    <>
                        <Card className='m-2 flex flex-col gap-3'>
                            <BackButton className='pb-0 pl-4' action={() => { setOpen(false) }} />
                            <CardTitle className='p-6 pb-2 pt-0'>
                                {pet.name}, {formatAge(pet.birthDate, t('pet.year'), t('pet.month'))}, {owner?.companyName ? owner.companyName : owner?.firstName + ' ' + owner?.lastName}
                            </CardTitle>
                            <CardContent className="p-0">
                                <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={true} showPlayButton={false} />
                            </CardContent>
                            <CardDescription className='p-6 pt-2 pb-2'>
                                {pet.description}
                            </CardDescription>
                            {info && (
                                <div className='p-6 pt-0 flex justify-center'>
                                    <LikeButton pet={pet} />
                                </div>
                            )}
                        </Card>
                        {contacts && (
                            <Card className='p-4 m-2'>
                                <Accordion type='single' collapsible>
                                    <AccordionItem value={`${pet._id}_owner_contacts`}>
                                        <AccordionTrigger className='p-0'>{t('label.contacts')}</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{owner?.firstName + ' ' + owner?.lastName}</p>
                                            {owner?.social.instagram && (
                                                <Button variant={'link'} className='flex gap-2' onClick={() => { window.open(`https://instagram.com/${owner?.social.instagram}`, '_blank') }}>
                                                    <Instagram />{owner?.social.instagram}
                                                </Button>
                                            )}
                                            {owner?.social.telegram && (
                                                <Button className='flex gap-2' variant={'link'} onClick={() => { window.open(`https://t.me/${owner?.social.telegram}`, '_blank') }}>
                                                    <Send />{owner?.social.telegram}
                                                </Button>
                                            )}
                                            {owner?.phone && (
                                                <Button className='flex gap-2' variant={'link'} onClick={() => { window.open(`tel:${owner?.phone}`, '_blank') }}>
                                                    <Phone />{owner?.phone}
                                                </Button>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        )}
                    </>
                )
            }

        </OverlayContent>
    </Overlay>
}

function LikeButton(props: { pet: Pet_Response }) {
    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()
    const isAuthenticated = useIsAuthenticated()

    // States
    const [userData, setUserData] = useState<User_Response>()
    const [liked, setLiked] = useState<boolean>(false)

    function likePet() {
        if (!liked) {
            if (!isAuthenticated() || !userData) {
                const browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
                browserLiked.push(props.pet._id)
                localStorage.setItem('_data_offline_liked', JSON.stringify(browserLiked))
                notification.custom.success(t('pet.liked'))
                setLiked(true)
                return
            }
            const userPrevData = structuredClone(userData)
            userPrevData.liked.push(props.pet._id)
            // @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
            userPrevData.password = undefined
            axios.post(`${API.baseURL}/users/update/${userData._id}`, { update: userPrevData }).then((res: AxiosResponse) => {
                if (!res.data.err) {
                    notification.custom.success(t('pet.liked') + ` ${props.pet.name}!`)
                    setLiked(true)
                } else {
                    notification.custom.error(res.data.err)
                }
            })
        } else {
            removePetFromLiked(props.pet._id)
            setLiked(false)
        }

    }

    function removePetFromLiked(pet_id: string) {
        // If user is not authenticated, remove pet from local storage
        if (!isAuthenticated || !userData) {
            // Parse liked pets from local storage
            let browserLiked = JSON.parse(localStorage.getItem('_data_offline_liked') || '[]') as string[]
            // Filter liked pets from unliked pet
            browserLiked = browserLiked.filter(likedPet => likedPet != pet_id)

            localStorage.setItem('_data_offline_liked', JSON.stringify(browserLiked))
            notification.custom.success(t('notifications.liked_remove'))

            return
        }
        // If user is authenticated, remove pet from user data
        // Send request to remove liked pet from user data
        axios.delete(`${API.baseURL}/users/remove/${userData._id}/liked/${pet_id}`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                notification.custom.success(t('notifications.liked_remove'))
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    function getUser() {
        if (isAuthenticated()) {
            axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
                if (!res.data.err) {
                    setUserData(res.data)
                } else {
                    notification.custom.error(res.data.err)
                }
            })
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    return <Button variant={'outline'} size={'icon'} className='w-fit p-6 rounded-full' style={{ color: '#FF0000' }} onClick={likePet}><Heart fill={liked ? '#FF0000' : 'transparent'} /></Button>



    
}
