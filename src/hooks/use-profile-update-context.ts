import React from 'react'
import { ProfileUpdateContext } from '@/contexts/profile-update'

export default function useProfileUpdateContext() {
    const profileUpdateContext = React.useContext(ProfileUpdateContext)
    if (profileUpdateContext === undefined) {
        throw new Error('useProfileUpdateContext must be inside a ProfileUpdateContext')
    }
    return profileUpdateContext
}