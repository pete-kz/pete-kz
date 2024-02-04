/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthUser, useIsAuthenticated, useAuthHeader, useSignOut } from 'react-auth-kit'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { API } from '@config'
import { User_Response, type Pet_Response } from '@declarations'
import { axiosAuth as axios, notification, useQuery } from '@utils'
import { AxiosResponse } from 'axios'
import { Button, TextField, IconButton, Typography, Link } from '@mui/material'
import { Favorite, Instagram, KeyboardReturn, Phone, Telegram } from '@mui/icons-material'
import ReactImageGallery from 'react-image-gallery'
import { themeColor } from '@/Utils/colors'
import { red } from '@mui/material/colors'


export default function PetPage() {

    // Setups
    const isAuthenticated = useIsAuthenticated()
    const navigate = useNavigate()
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const signout = useSignOut()
    const authHeader = useAuthHeader()
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

    function checkToken() {
        const token = `${localStorage.getItem('_auth_type')} ${localStorage.getItem('_auth')}`
        const isEqualTokens = authHeader() == token
        if (!isEqualTokens) {
            signout()
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
        if (!isAuthenticated()) {
            navigate('/login')
            return
        }

        fetchPet()
        checkToken()
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
                    <m.div className='m-2 p-4 mb-20' initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ backgroundColor: themeColor.cardBackground, borderRadius: 15,border: `1px solid ${themeColor.divBorder}`}}>
                        <div className='mb-3'>
                            <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
                        </div>
                        <div className='gap-2 flex flex-col'>
                            <div className='flex gap-2 w-full'>
                                <TextField defaultValue={name} fullWidth label={t('pet.name')} variant="outlined" onChange={handleNameChange} />
                                <TextField defaultValue={age} label={t('pet.age')} style={{ width: 60 }} variant="outlined" onChange={handleAgeChange} type='number' />
                            </div>
                            <TextField defaultValue={description} label={t('pet.description')} variant="outlined" onChange={handleDescriptionChange} multiline />
                        </div>
                        <Button className='w-full' style={{ marginTop: 10 }} variant='contained' onClick={updatePetInfo}>{t('pet.update_btn')}</Button>
                    </m.div>
                ) : (
                    <>
                        {query.get('more') === 'true' && (
                            <LikeReturnBottom pet={petData} />
                        )}
                        <m.div className='m-2 p-4 mb-20' style={{ backgroundColor: themeColor.cardBackground, borderRadius: 15,border: `1px solid ${themeColor.divBorder}`}} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div>
                                <ReactImageGallery items={imageLinks} showFullscreenButton={false} showThumbnails={false} showPlayButton={false} />
                            </div>
                            <div>
                                <Typography variant='h6'>{petData.name}, {petData.age}</Typography>
                                <Typography sx={{ wordWrap: 'break-word' }} variant='body2'>{petData.description}</Typography>
                            </div>
                            {query.get('contacts') === 'true' && (
                                <div style={{ border: `1px solid ${themeColor.divBorder}`, borderRadius: 15}} className='p-4 mt-2'>
                                    <p>{ownerData?.name}</p>
                                    {ownerData?.social.instagram && (<Link className='flex gap-2' href={`https://instagram.com/${ownerData?.social.instagram}`}><Instagram />{ownerData?.social.instagram}</Link>)}
                                    {ownerData?.social.telegram && (<Link className='flex gap-2' href={`https://t.me/${ownerData?.social.telegram}`}><Telegram />{ownerData?.social.telegram}</Link>)}
                                    {ownerData?.phone && (<Link className='flex gap-2' href={`tel:${ownerData?.phone}`}><Phone />{ownerData?.phone}</Link>)}
                                </div>
                            )}
                        </m.div>
                    </>
                )
            )}
        </>
    )
}

function LikeReturnBottom(props: { pet: Pet_Response}) {
    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}

    // States
    const [userData, setUserData] = useState<User_Response>()

    function addLikedPet() {
        if (!userData) return
        const userPrevData = structuredClone(userData)
        userPrevData.liked.push(props.pet._id)
        // @ts-expect-error Using interface User_Response that have strict definitions throws error when trying to exclude password from data
        userPrevData.password = undefined
        axios.post(`${API.baseURL}/users/update/${userData._id}`, { update: userPrevData }).then((res: AxiosResponse) => {
            if (!res.data.err) {
                notification.custom.success('Liked! Check in your profile later')
            } else {
                notification.custom.error(res.data.err)
            }
        })

    }

    function getUser() {
        axios.post(`${API.baseURL}/users/find`, { query: { _id: user._id } }).then((res: AxiosResponse) => {
            if (!res.data.err) {
                setUserData(res.data)
            } else {
                notification.custom.error(res.data.err)
            }
        })
    }

    useEffect(() => {
        getUser()
    }, [])

    return (
        <>
            <div className='absolute w-screen flex items-center justify-center bottom-[6rem]'>
                <div className='flex items-center gap-3'>
                    <IconButton sx={{ backgroundColor: themeColor.cardBackground, color: themeColor.iconButtonColor }} onClick={() => { window.open(`/?start_id=${props.pet._id}`, '_self') }}><KeyboardReturn /></IconButton>
                    <IconButton sx={{ backgroundColor: themeColor.cardBackground, color: red[500] }} onClick={addLikedPet}><Favorite /></IconButton>
                </div>
            </div>
        </>
    )
}
