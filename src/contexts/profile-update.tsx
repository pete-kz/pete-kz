import { createContext } from 'react'

interface OnBoardingProfileUpdateContextProps {
    update: boolean
    setUpdate: React.Dispatch<React.SetStateAction<boolean>>
}

export const ProfileUpdateContext = createContext<OnBoardingProfileUpdateContextProps | undefined>(undefined)