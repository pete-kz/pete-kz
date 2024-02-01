/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, IconButton, Button, Card, CardHeader, TextField, CardActions, CardMedia, CardContent, Typography } from '@mui/material'
import { Clear, StarOutlined, Favorite, ArrowRight, ArrowLeft, Cancel, MoreVert } from '@mui/icons-material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import type { Pet_Response, User_Response, PetCard_props } from '@declarations'
import { API } from '@config'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'
import { useAuthUser } from 'react-auth-kit'
import { red } from '@mui/material/colors'

export default function PetCard({ id, name, age, type, description, userID, imagesPath, city, changePet }: PetCard_props) {

  // Setups
  const { t, i18n } = useTranslation()
  const authStateUser = useAuthUser()
  const user = authStateUser() || {}

  // States
  const [owner, setOwner] = useState<User_Response>()

  // Functions
  function getOwner() {
    axios.post(`${API.baseURL}/users/find`, { query: { _id: userID } }).then((res: AxiosResponse) => {
      if (!res.data.err) {
        setOwner(res.data)
      } else {
        notification.custom.error(res.data.err)
      }
    })
  }

  


  if (userID == null) {
    localStorage.removeItem('token')
    location.reload()
  }

  useEffect(() => {
    getOwner()
  }, [])

  return (
    <>

      <div className='m-4 block' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15 }}>
        <div className='flex justify-between p-3 items-center'>
          <div className='flex gap-2 items-center'>
            <div>
              <Avatar sx={{ bgcolor: red[500] }} sizes='40' aria-label="recipe">
                R
              </Avatar>
            </div>
            <div className='block '>
              <Typography variant='h6'>{name}, {age}</Typography>
              <Typography variant='subtitle1'>{owner?.login}</Typography>
            </div>
          </div>
          {/* <div>
            <IconButton sx={{ color: themeColor.iconButtonColor }} aria-label="settings">
              <MoreVert />
            </IconButton>
          </div> */}
        </div>
        <div>
          <img src={imagesPath[0]} alt={name} style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} />
        </div>
        <div className='p-3'>
          <div>
            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} maxHeight={20}>{description}...</Typography>
          </div>
          <div className='w-full flex justify-between mt-3'>
            <IconButton
              sx={{ border: `1px solid ${themeColor.iconButtonColor}`, color: themeColor.iconButtonColor }}
              className='gap-2'
              onClick={() => { if (changePet) changePet('p') }}
            >
              <ArrowLeft />
            </IconButton>
            <Button
              variant='outlined'
              onClick={() => { window.open(`/pets?id=${id}&more=true`, '_self') }}
              className='w-full font-semibold'
              sx={{ marginLeft: 1, marginRight: 1, border: `1px solid ${themeColor.iconButtonColor}` }}
            >
              More
            </Button>
            <IconButton
              sx={{ border: `1px solid ${themeColor.iconButtonColor}`, color: themeColor.iconButtonColor }}
              className='gap-2'
              onClick={() => { if (changePet) changePet('n') }}
            >
              <ArrowRight />
            </IconButton>
          </div>
        </div>
      </div>
    </>
  )
}
