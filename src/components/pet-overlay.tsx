/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect, lazy } from 'react'
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response, AuthState } from '@declarations'
import { axiosAuth as axios } from '@utils'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Send } from 'lucide-react'
import ReactImageGallery from 'react-image-gallery'
import { formatAge } from '@/lib/utils'
import { OverlayContent, Overlay } from './ui/overlay'
import BackButton from './back-button'
import { useQuery } from '@tanstack/react-query'

const ChangePetForm = lazy(() => import('@/components/forms/change-pet'))
const LikeButton = lazy(() => import('@/components/like-button'))

interface PetOverlayProps { 
    pet: Pet_Response, 
    owner?: User_Response, 
    info?: boolean, 
    like?: boolean, 
    edit?: boolean, 
    contacts?: boolean, 
    open?: boolean, 
    setOpen: React.Dispatch<React.SetStateAction<boolean>>, 
}

export default function PetOverlay({ pet, info = false, edit = false, contacts = false, open = false, like = false, setOpen }: PetOverlayProps) {

    // Setups
    const user = useAuthUser<AuthState>()
    const { t } = useTranslation()
    const { data: ownerData } = useQuery({ queryKey: ['owner'], queryFn: () => axios.get(`${API.baseURL}/users/find/${pet.ownerID}`).then(res => res.data), refetchInterval: 2000 })

    // States
    const [imageLinks, setImageLinks] = useState<{ original: string, thumbnail: string }[]>([])

    useEffect(() => {
        setImageLinks(pet.imagesPath.map(imageLink => ({
            original: imageLink,
            thumbnail: imageLink
        })))
    }, [])

    return (
        <Overlay open={open}>
            <OverlayContent className='max-h-full h-fit overflow-scroll'>
                {edit && ownerData?._id === user?._id && (
                    <div className='m-4 bg-card p-4 border rounded-lg mb-16'>
                        <BackButton className='p-0' action={() => setOpen(false)} />
                        <ChangePetForm setOpen={setOpen} pet_id={pet._id} />
                    </div>
                )}

                {ownerData && info && (
                    <Card className='border-none rounded-none flex flex-col gap-3 h-full w-full'>
                        <BackButton className='pb-0 pl-4' action={() => setOpen(false)} />
                        <CardTitle className='p-6 pb-2 pt-0'>
                            {pet.name}, {formatAge(pet.birthDate, t('pet.year'), t('pet.month')) as string}
                            <br />
                            <span className='text-muted font-normal'>
                                {ownerData.companyName ? ownerData.companyName : ownerData.firstName + ' ' + ownerData.lastName}
                            </span>
                        </CardTitle>
                        <CardContent className='p-0'>
                            <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={true} showPlayButton={false} />
                        </CardContent>
                        <div className='p-6 pt-2 pb-2'>
                            <p className='pb-3'>
                            <pre className='font-normal font-sans'>{pet.description}</pre>
                            </p>
                            <div id='pet_table'>
                                <div id='pet_row'>
                                    <p>{t('pet.sex.default')}</p>
                                    <p>{t(`pet.sex.${pet.sex}`)}</p>
                                </div>
                                <div id='pet_row'>
                                    <p>{t('pet.sterilized')}</p>
                                    <p>{pet.sterilized ? t('label.yes') : t('label.no')}</p>
                                </div>
                                <div id='pet_row'>
                                    <p>{t('pet.weight')}</p>
                                    <p>{`${pet.weight} ${t('pet.kg')}`}</p>
                                </div>
                            </div>
                        </div>
                        {contacts && (
                            <div className='p-6 pt-0'>
                                <h3 className='text-xl'>{t('label.contacts')}</h3>
                                <p>{ownerData.firstName + ' ' + ownerData.lastName}</p>
                                {ownerData.social.instagram && (
                                    <Button variant={'link'} className='flex gap-2 pl-0' onClick={() => { window.open(`https://instagram.com/${ownerData.social.instagram}`, '_blank') }}>
                                        {ownerData.social.instagram}
                                    </Button>
                                )}
                                {ownerData.social.telegram && (
                                    <Button className='flex gap-2 pl-0' variant={'link'} onClick={() => { window.open(`https://t.me/${ownerData.social.telegram}`, '_blank') }}>
                                        <Send />{ownerData.social.telegram}
                                    </Button>
                                )}
                                {ownerData.phone && (
                                    <Button className='flex gap-2 pl-0' variant={'link'} onClick={() => { window.open(`tel:${ownerData.phone}`, '_blank') }}>
                                        <Phone />{ownerData.phone}
                                    </Button>
                                )}
                            </div>
                        )}
                    </Card>
                )}

                {like && <LikeButton pet={pet} />}
            </OverlayContent>
        </Overlay>
    )
}

