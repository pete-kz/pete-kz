import React, { useEffect, useState } from 'react'
import { useAuthUser } from 'react-auth-kit'
import { ArrowRight, Edit, AddCircle } from '@mui/icons-material'
import { Avatar, Typography, IconButton } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { Pet_Response, User_Response } from '@declarations'
import { themeColor } from '@/Utils/colors'

export default function Profile() {

    // Setups
    const authStateUser = useAuthUser()
    const user = authStateUser() || {}
    const { t } = useTranslation()

    // States
    const [usersPet, setUsersPet] = useState<Pet_Response[]>()
    const [liked, setLiked] = useState<Pet_Response[]>([])
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
                            const user = res.data
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

    useEffect(() => {
        getInfo()
    }, [])

    return (
        <m.div className="block w-screen gap-2 p-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className='mt-2 p-3 m-4' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15 }}>
                <div>
                    <Typography variant='h5' className='font-semibold'>Profile</Typography>
                </div>
                <div className='flex items-center gap-2'>
                    <div>
                        <Avatar>{userData?.login[0]}</Avatar>
                    </div>
                    <div>
                        <Typography variant='body2'>{userData?.login}</Typography>
                    </div>
                </div>
            </div>
            <div className='p-4'>
                <Typography variant='h6'>My pets</Typography>
                <div className='grid grid-cols-3 gap-2'>
                    {usersPet?.map((pet, index) => (
                        <div key={index} className='relative flex flex-col items-center p-3' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15 }} >
                            <Avatar src={pet.imagesPath[0]}></Avatar>
                            <Typography variant='body1' sx={{ color: themeColor.primaryTextLight }}>{pet.name}</Typography>
                            <div>
                                <IconButton onClick={() => { window.open(`/pets?id=${pet._id}&edit=true`, '_self') }} sx={{ color: themeColor.iconColor, backgroundColor: themeColor.cardBackground }}>
                                    <Edit fontSize='small' sx={{ color: themeColor.primaryTextLight }} />
                                </IconButton>
                            </div>
                        </div>
                    ))}
                    <div className='flex flex-col justify-center items-center p-3' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15 }} >
                        <IconButton onClick={() => { window.open('/pets/add', '_self') }} sx={{ color: themeColor[12] }}>
                            <AddCircle fontSize='large' sx={{ color: themeColor.primaryTextLight }} />
                        </IconButton>
                        <div className='text-center'>
                            <Typography variant='body1' sx={{ color: themeColor.primaryTextLight }}>Add new pet</Typography>
                        </div>
                    </div>
                </div>
            </div>

            <div className='p-4'>
                <Typography variant='h6'>Your likes</Typography>
                {liked?.map((pet, index) => (
                    <div key={index} className='flex items-center justify-between mt-2 p-3' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15 }} onClick={() => { window.open(`/pets?id=${pet._id}&contacts=true`, '_self') }}>
                        <div className='flex gap-2 items-center'>
                            <Avatar src={pet.imagesPath[0]}></Avatar>
                            <Typography variant='body1' sx={{ color: themeColor.primaryTextLight }}>{pet.name}</Typography>
                        </div>
                        <div>
                            <IconButton ><ArrowRight sx={{ color: themeColor.primaryTextLight }} /></IconButton>
                        </div>
                    </div>
                ))}
            </div>
        </m.div>
    )
}
