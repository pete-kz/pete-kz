/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { Avatar, Typography, IconButton } from '@mui/material'
import { Clear, StarOutlined, Favorite, ArrowCircleRight } from '@mui/icons-material'
import { m } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { themeColor } from '@colors'
import type { Pet_Response, User_Response, PetCard_props } from '@declarations'
import { API } from '@config'
import { axiosAuth as axios, notification } from '@utils'
import { AxiosResponse } from 'axios'

const IconButtonStyle = {
  borderColor: themeColor[12], color: themeColor[7], borderRadius: 9999, fontWeight: 500, paddingLeft: '12px', paddingRight: '12px', marginRight: 1, border: 1,
}

export default function PetCard({ id, name, age, type, description, userID, imagesPath, city }: PetCard_props) {

  // Setups
  const { t, i18n } = useTranslation()


  if (userID == null) {
    localStorage.removeItem('token')
    location.reload()
  }


  return (
    <>
      <m.div key={`${id}`} className="my-1 mx-2 rounded-2xl w-full" style={{ backgroundColor: themeColor[2], maxWidth: '500px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex flex-start flex-row items-center p-4 pb-0">
          <div className="flex rounded-full">
            <Avatar>{type[0]}</Avatar>
          </div>
          <div className="flex flex-col ml-4">
            <h4 className="" style={{ color: themeColor[11] }}>{name}, {age}</h4>
            <p style={{ color: themeColor[11] }}>{status[1]}</p>
          </div>
        </div>
        {imagesPath[0] !== undefined && imagesPath[0] !== ''
          && (
            <>
              {imagesPath.map((image_link) => (
                <div className="pt-2 mt-2 mb-2" key={image_link}>
                  <div className="flex justify-center ">
                    <img src={image_link} alt="" className="min-w-full" style={{ aspectRatio: '1/1', objectFit: 'cover', overflow: 'hidden' }} />
                  </div>
                </div>
              ))}
            </>
          )}
        <div className="mt-4 px-4 ">
          <Typography variant="body2" color="text.secondary">
            {t('main.pet_card.city_label')}
            :
            {city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </div>
        <div className="flex flex-row justify-around mt-7 px-4 pb-4">
          <IconButton
            sx={IconButtonStyle}
          >
            <Clear />
          </IconButton>
          <IconButton
            sx={IconButtonStyle}
          >
            <StarOutlined />
          </IconButton>
          <IconButton
            sx={IconButtonStyle}
            onClick={() => { window.open(`/pets?id=${id}`, '_self') }}
          >
            <ArrowCircleRight />
          </IconButton>
        </div>
      </m.div>
    </>
  )
}
