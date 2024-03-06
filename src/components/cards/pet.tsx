/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from 'react'
import { useTranslation } from 'react-i18next'
import type { PetCard_props } from '@declarations'
import { formatAge } from '@/lib/utils'

export default function PetCard({ name, age, imagesPath }: PetCard_props) {

  // Setups
  const { t } = useTranslation()

  return (
    <div className='relative'>
      <img className='rounded-lg' src={imagesPath[0]} alt={name} style={{ aspectRatio: '3/4', objectFit: 'fill', overflow: 'hidden', minWidth: '100%' }}  />
      <div className='absolute flex items-end bottom-0 left-0 p-3 bg-gradient-to-t w-full h-full from-black from-2% to-transparent to-40% rounded-lg'>
        <p className='text-2xl font-bold'>{name}, {formatAge(age, t('pet.year'), t('pet.month'))}</p>
      </div>
    </div>
  )
}
