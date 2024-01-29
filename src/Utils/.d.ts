/**
 *  RESPONSE TYPES
 */

export type Pet_Response = {
    _id: string
	name: string
    age: string
    type: 'Cat' | 'Dog' | 'Other'
    description: string
    userID: User_Data["_id"],
    imagesPath: string[],
    city: string
}

export type User_Response = {
    _id: string
    login: string,
    social: {
        telegram: string,
        instagram: string,
        phone: string
    },
    email: string,
    password: string,
    liked: string[],
    token: string
}

/**
 *  PROPS TYPES
 */

export type EditPetDialog_Props = {
	open: boolean
	petID: string
	petName: string
	onClose: Function
}

export interface UserCard_Props {
    login: string
    social: {
        telegram?: string
        instagram?: string
        phone: string
    }
    email: string
    password: string
    liked: PetCard_props["id"][]
    token: string
}

export type PetCard_props = {
	id: string
	name: string
    age: string
    type: 'Cat' | 'Dog' | 'Other'
    description: string
    userID: User_Data["_id"],
    imagesPath: string[],
    city?: string
}

export type NavigationBar_Props = {
	children?: any
}

export type PageAlert_Props = {
    title: string
    description: string
}