/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useMemo, useState } from 'react'
import { Avatar, IconButton, Button, Card, CardHeader, TextField, CardActions, CardMedia, CardContent, Typography, Skeleton } from '@mui/material'
import { Clear, StarOutlined, Favorite, ArrowRight, ArrowLeft, Cancel, MoreVert } from '@mui/icons-material'
import { m, useAnimate } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import type { Pet_Response, User_Response, PetCard_props } from '@declarations'
import { API } from '@config'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'
import { useAuthUser } from 'react-auth-kit'
import { red } from '@mui/material/colors'

export default function PetCard({ id, name, age, type, description, userID, imagesPath, city }: PetCard_props) {

  // Setups
  const { t, i18n } = useTranslation()
  const authStateUser = useAuthUser()
  const user = authStateUser() || {}
  const [scope, animate] = useAnimate()

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


      <div className='m-4 block shadow-lg' style={{ border: `1px solid ${themeColor.iconColor}`, borderRadius: 15, backgroundColor: themeColor.cardBackground }}>
        <div className='flex justify-between p-3 items-center'>
          <div className='flex gap-2 items-center'>
            <div>
              <Avatar sx={{ bgcolor: red[500] }} sizes='40' aria-label="recipe">
                R
              </Avatar>
            </div>
            <div className='block '>
              <Typography variant='h6'>{name}, {age}</Typography>
              {owner ? (
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Typography variant='subtitle1'>{owner?.login}</Typography></m.div>
              ) : (
                <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Skeleton height={28} width={50}></Skeleton></m.div>
              )}
            </div>
          </div>
        </div>
        <div style={{ aspectRatio: '1/1', minWidth: '100%' }}>
          <img className='placeholder_img' loading='eager' src={imagesPath[0]} alt={name} style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} />
        </div>
        <div className='p-3'>
          <div>
            <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} maxHeight={20}>{description}...</Typography>
          </div>
          <div className='w-full flex justify-end mt-3'>
            <Button
              variant='contained'
              onClick={() => { window.open(`/pets?id=${id}&more=true`, '_self') }}
              className='font-semibold'
              sx={{ marginLeft: 1, marginRight: 1, border: `1px solid ${themeColor.iconButtonColor}`, borderRadius: 15, width: '6rem' }}
            >
              More
            </Button>
          </div>
        </div>
      </div>

  )
}
