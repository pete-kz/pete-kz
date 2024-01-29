import React, { useEffect, useState } from 'react'
import { Logout } from '@mui/icons-material'
import { useAuthUser, useSignOut } from 'react-auth-kit'
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, ListItemAvatar } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { axiosAuth as axios, notification } from '@utils'
import { API } from '@config'
import { AxiosResponse } from 'axios'
import { Pet_Response } from '@declarations'

export default function Profile() {

    // Setups
    const authStateUser = useAuthUser()
    const signout = useSignOut()
    const user = authStateUser() || {}
    const { t } = useTranslation()

    // States
    const [usersPet, setUsersPet] = useState<Pet_Response[]>()

    // Functions
    function getAllPets() {
        axios.post(`${API.baseURL}/pets/find`)
            .then((res: AxiosResponse) => {
                if (!res.data.err) {
                    setUsersPet((res.data as Pet_Response[]).filter(pet => pet.userID === user._id))
                } else {
                    notification.custom.error(res.data.err)
                }
            })
    }

    useEffect(() => {
        getAllPets()
    }, [])
    return (
        <m.div className="flex justify-center w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mt-2">
                <List className='w-screen' style={{ paddingLeft: 20, paddingRight: 20 }}>
                    <p className='font-2xl font-bold'>Your pets</p>
                    {usersPet?.map((pet, index) => (
                        <ListItemButton key={index} onClick={() => { window.open(`/pets?id=${pet._id}&edit=true`, '_self') }}>
                            <ListItemAvatar>
                                <ListItemIcon>
                                    <Avatar src={pet.imagesPath[0]}></Avatar>
                                </ListItemIcon>
                            </ListItemAvatar>
                            <ListItemText primary={pet.name} />
                        </ListItemButton>
                    ))}
                    
                </List>
            </div>
        </m.div>
    )
}
