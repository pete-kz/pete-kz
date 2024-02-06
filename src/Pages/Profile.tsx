import React, { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { Edit, AddCircle, Delete, Instagram, AccountCircle, Password, Phone, Telegram, ArrowDownward } from '@mui/icons-material'
import { Avatar, Typography, IconButton, TextField, Accordion, AccordionSummary, AccordionActions, AccordionDetails } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { Pet_Response, User_Response } from '@declarations'
import { themeColor } from '@/Utils/colors'
import { red } from '@mui/material/colors'
import PhoneInput from 'react-phone-number-input'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router-dom'

export default function Profile() {

    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()
    const navigate = useNavigate()

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
        axios.post(`${API.baseURL}/pets/remove`, { query: { _id: pet._id } })
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    notification.custom.success(`Goodbye, ${pet.name}!`)
                    setUsersPet(pets => pets?.filter(userPet => userPet._id != pet._id))
                } else {
                    notification.custom.error(res.data.err)
                }
            })
    }

    function removePetFromLiked(pet_id: string) {
        if (!userData) return
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
                    notification.custom.success('Profile updated')
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
            <Accordion className='mt-2 p-3 m-4' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15 }}>
                <AccordionSummary
                    expandIcon={<ArrowDownward sx={{ color: themeColor.iconButtonColor }} />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                >
                    <Typography>{t('main.my_profile')}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div className='flex items-center gap-2 mb-2'>
                        <AccountCircle />
                        <TextField value={name} fullWidth label={t('user.name')} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-2 mb-2'>
                        <AccountCircle />
                        <TextField value={login} fullWidth label={t('user.login')} onChange={(e) => setLogin(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Phone />
                        <PhoneInput placeholder="Phone" value={phone} label={t('user.contacts.phone')} onChange={(e) => setPhone(e as string)} />
                    </div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Instagram />
                        <TextField value={instagram} fullWidth label={t('user.contacts.instagram')} onChange={(e) => setInstagram(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Telegram />
                        <TextField value={telegram} fullWidth label={t('user.contacts.telegram')} onChange={(e) => setTelegram(e.target.value)} />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Password />
                        <TextField value={password} type="password" fullWidth label={t('user.password')} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </AccordionDetails>
                <AccordionActions>
                    <LoadingButton loading={updatingState} variant='contained' fullWidth sx={{ marginTop: 1 }} onClick={updateProfileInfo}>Update</LoadingButton>
                </AccordionActions>
            </Accordion>
            <div className='p-4'>
                <Typography variant='h6'>{t('main.my_pets')}</Typography>
                <div className='grid grid-cols-3 gap-2 mt-2'>
                    {usersPet?.map((pet, index) => (
                        <div key={index} className='relative flex flex-col items-center p-3 gap-2' style={{ border: `1px solid ${themeColor.divBorder}`, borderRadius: 15, backgroundColor: themeColor.cardBackground }} >
                            <Avatar src={pet.imagesPath[0]}></Avatar>
                            <Typography variant='body1' className='text-center' sx={{ color: themeColor.primaryTextLight }}>{pet.name}</Typography>
                            <div className='grid grid-rows-1 grid-cols-2 gap-2'>
                                <IconButton onClick={() => { navigate(`/pets?id=${pet._id}&edit=true`) }} sx={{ color: themeColor.iconColor, border: `1px solid ${themeColor.divBorder}` }}>
                                    <Edit fontSize='small' sx={{ color: themeColor.primaryTextLight }} />
                                </IconButton>
                                <IconButton onClick={() => { removePet(pet) }} sx={{ color: themeColor.iconColor, border: `1px solid ${themeColor.divBorder}` }}>
                                    <Delete fontSize='small' sx={{ color: red[500] }} />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                    <div className='flex flex-col justify-center items-center p-3' style={{ border: `1px solid ${themeColor.divBorder}`, borderRadius: 15, backgroundColor: themeColor.cardBackground }} >
                        <IconButton onClick={() => { navigate('/pets/add') }} sx={{ color: themeColor[12] }}>
                            <AddCircle fontSize='large' sx={{ color: themeColor.primaryTextLight }} />
                        </IconButton>
                        <div className='text-center'>
                            <Typography variant='body1' sx={{ color: themeColor.primaryTextLight }}>{t('pet.add.btn')}</Typography>
                        </div>
                    </div>
                </div>
            </div>

            {liked.length > 0 && (
                <div className='p-4'>
                    <Typography variant='h6'>{t('main.your_likes')}</Typography>
                    {liked?.map((pet, index) => (
                        <m.div key={index} className='flex items-center justify-between mt-2 p-3' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15, backgroundColor: themeColor.cardBackground }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <div className='w-full' onClick={() => { navigate(`/pets?id=${pet._id}&contacts=true`) }}>
                                <div className='flex gap-2 items-center'>
                                    <Avatar src={pet.imagesPath[0]}></Avatar>
                                    <Typography variant='body1' sx={{ color: themeColor.primaryTextLight }}>{pet.name}</Typography>
                                </div>
                            </div>
                            <div style={{ width: 38 }}>
                                <IconButton onClick={() => { removePetFromLiked(pet._id) }} sx={{ color: themeColor.iconColor, border: `1px solid ${themeColor.divBorder}` }}>
                                    <Delete fontSize='small' sx={{ color: red[500] }} />
                                </IconButton>
                            </div>
                        </m.div>
                    ))}
                </div>
            )}
        </m.div>
    )
}
