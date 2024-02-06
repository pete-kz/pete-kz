/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Typography, Skeleton } from '@mui/material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import type { User_Response, PetCard_props } from '@declarations'
import { API } from '@config'
import { axiosAuth as axios, notification, parseMongoDate } from '@utils'
import { AxiosResponse } from 'axios'
import { red } from '@mui/material/colors'
import { useNavigate } from 'react-router-dom'

export default function PetCard({ id, name, age, description, userID, imagesPath, updatedAt }: PetCard_props) {

  // Setups
  const { t } = useTranslation()
  const navigate = useNavigate()

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
              {owner?.name[0] || 'P'}
            </Avatar>
          </div>
          <div className='block'>
            {owner ? (<Typography variant='h6'>{owner?.name}</Typography>) : (<Skeleton height={32} width={250}></Skeleton>)}
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}><Typography variant='subtitle1'>{`${t('main.pet_card.last_update')}: ${parseMongoDate(updatedAt).date.day}.${parseMongoDate(updatedAt).date.month}.${parseMongoDate(updatedAt).date.year}`}</Typography></m.div>
          </div>
        </div>
      </div>
      <div>
        <img className='placeholder_img' loading='eager' src={imagesPath[0]} alt={name} style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden', minWidth: '100%' }} />
      </div>
      <div className='p-3'>
        <div>
          <Typography variant='h6'>{name}, {age}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }} maxHeight={20}>{description}...</Typography>
        </div>
        <div className='w-full flex justify-end mt-3'>
          <Button
            variant='contained'
            onClick={() => { navigate(`/pets?id=${id}&more=true`) }}
            className='font-semibold'
            sx={{ marginLeft: 1, marginRight: 1, border: `1px solid ${themeColor.iconButtonColor}`, borderRadius: 15, width: '6rem' }}
          >
            {t('main.pet_card.more')}
          </Button>
        </div>
      </div>
    </div>

  )
}
