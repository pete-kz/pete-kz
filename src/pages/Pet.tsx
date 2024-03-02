/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated } from 'react-auth-kit'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'

// UI
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Heart, Instagram, CornerDownLeft, Phone, Send } from 'lucide-react'
import ReactImageGallery from 'react-image-gallery'
import { formatAge } from '@/lib/utils'

export default function PetPage() {

    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()
    const query = useQuery()

    // States
    const [petData, setPetData] = useState<Pet_Response>()
    const [ownerData, setOwnerData] = useState<User_Response>()
    const [name, setName] = useState<string>('')
    const [age, setAge] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [imageLinks, setImageLinks] = useState<{ original: string, thumbnail: string }[]>([])

    // Functions
    function fetchPet() {
        axios.post(`${API.baseURL}/pets/find`).then((res: AxiosResponse) => {
            if (!res.data.err) {
                const petOne = (res.data as Pet_Response[]).filter(petOne => petOne._id === query.get('id'))[0]
                setPetData(petOne)
                setName(petOne.name)
                setAge(petOne.age)
                setDescription(petOne.description)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    function fetchOwner() {
        if (petData) {
            axios.post(`${API.baseURL}/users/find`, { query: { _id: petData?.userID } }).then((res: AxiosResponse) => {
                if (!res.data.err) {
                    setOwnerData(res.data)
                } else {
                    notification.custom.error(res.data.err)
                }
            })
        }
    }

    function updatePetInfo() {
        notification.custom.promise(
            axios.post(`${API.baseURL}/pets/edit`, {
                query: { _id: petData?._id },
                updated: {
                    name,
                    age,
                    description
                }
            })
        )
    }

    // Handlers
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const handleAgeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAge(event.target.value)
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    useEffect(() => {
        fetchPet()
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

    useEffect(() => {
        fetchOwner()

        const images: { original: string, thumbnail: string }[] = []
        petData?.imagesPath.map(imageLink => {
            images.push({
                original: imageLink,
                thumbnail: imageLink
            })
        })
        setImageLinks(images)
    }, [petData])

    return (
        <>
            {petData && (
                (query.get('edit') === 'true' && ownerData?._id == user._id) ? (
                    <Card className='m-2 p-4 mb-20'>
                        <div className='mb-3'>
                            <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
                        </div>
                        <div className='gap-2 flex flex-col'>
                            <div className='flex gap-2 w-full'>
                                <div className='grid w-full items-center gap-1.5'>
                                    <Label htmlFor='pet_name'>{t('pet.name')}</Label>
                                    <Input id='pet_name' defaultValue={name} onChange={handleNameChange} />
                                </div>
                                <div className='grid w-full items-center gap-1.5'>
                                    <Label htmlFor='pet_age'>{t('pet.age')}</Label>
                                    <Input id='pet_age' defaultValue={age} onChange={handleAgeChange} type='number' />
                                </div>
                            </div>
                            <div className='grid w-full items-center gap-1.5'>
                                <Label htmlFor='pet_description'>{t('pet.description')}</Label>
                                <Input id='pet_description' defaultValue={description} onChange={handleDescriptionChange} multiple />
                            </div>
                        </div>
                        <Button className='w-full' onClick={updatePetInfo}>{t('pet.update_btn')}</Button>
                    </Card>
                ) : (
                    <>
                        {query.get('more') === 'true' && (
                            <LikeReturnBottom pet={petData} />
                        )}
                        <Card className='m-2 flex flex-col gap-3'>
                            <CardTitle className='p-6 pb-2'>
                                {petData.name}, {formatAge(petData.age, t('pet.year'), t('pet.month'))}
                            </CardTitle>
                            <CardContent className="p-0">
                                <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
                            </CardContent>
                            <CardDescription className='p-6 pt-2'>
                                {petData.description}
                            </CardDescription>
                        </Card>
                        {query.get('contacts') === 'true' && (
                            <Card className='p-6 m-2'>
                                <Accordion type='single' collapsible>
                                    <AccordionItem value={`${petData._id}_owner_contacts`}>
                                        <AccordionTrigger className='p-0'>{t('pet.contacts.label')}</AccordionTrigger>
                                        <AccordionContent>
                                            <p>{ownerData?.name}</p>
                                            {ownerData?.social.instagram && (
                                                <Button variant={'link'} className='flex gap-2' onClick={() => { window.open(`https://instagram.com/${ownerData?.social.instagram}`, '_blank') }}>
                                                    <Instagram />{ownerData?.social.instagram}
                                                </Button>
                                            )}
                                            {ownerData?.social.telegram && (
                                                <Button className='flex gap-2' variant={'link'} onClick={() => { window.open(`https://t.me/${ownerData?.social.telegram}`, '_blank') }}>
                                                    <Send />{ownerData?.social.telegram}
                                                </Button>
                                            )}
                                            {ownerData?.phone && (
                                                <Button className='flex gap-2' variant={'link'} onClick={() => { window.open(`tel:${ownerData?.phone}`, '_blank') }}>
                                                    <Phone />{ownerData?.phone}
                                                </Button>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </Card>
                        )}
                    </>
                )
            )}
        </>
    )
}

function LikeReturnBottom(props: { pet: Pet_Response }) {
    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()
    const navigate = useNavigate()
    const isAuthenticated = useIsAuthenticated()

    // States
    const [userData, setUserData] = useState<User_Response>()
    const [liked, setLiked] = useState<boolean>(false)

    function addLikedPet() {
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
                notification.custom.success(t('pet.liked'))
                setLiked(true)
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
        // @ts-expect-error because it is imported from the web
        ym(96355513, 'hit', window.origin)
    }, [])

    return (
        <>
            <div className='absolute w-screen flex items-center justify-center bottom-[4.5rem]'>
                <div className='flex items-center gap-3'>
                    <Button variant={'outline'} onClick={() => { navigate(`/pwa?start_id=${props.pet._id}&type=${props.pet.type}`) }}><CornerDownLeft /></Button>
                    <Button variant={'outline'} style={{ color: '#FF0000' }} onClick={addLikedPet}><Heart fill={liked ? '#FF0000' : 'transparent'} /></Button>
                </div>
            </div>
        </>
    )
}
