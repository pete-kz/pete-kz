export type Pet_Response = {
    _id: string
	name: string
    age: string
    type: string,
    sterilized: boolean,
    sex: 'male' | 'female',
    weight: number,
    description: string
    ownerID: User_Response['_id']
    imagesPath: string[]
    city: string
    createdAt: string
    updatedAt: string
}

export interface Pet_Filter {
    age?: {
        min?: number,
        max?: number
    },
    type?: string,
    sterilized?: boolean,
    sex?: 'male' | 'female' | '',
    weight?: number,
    owner_type?: 'private' | 'shelter' | 'breeder' | 'nursery' | ''
}

export type User_Response = {
    _id: string
    companyName: string
    firstName: string
    lastName: string
    phone: string
    type: 'private' | 'shelter' | 'breeder' | 'nursery'
    social: {
        telegram: string
        instagram: string
    }
    password: string
    liked: string[]
    token: string
    createdAt: string
    updatedAt: string
}

export type PetCard_props = {
	id: string
	name: string
    age: string
    type: string
    sterilized: boolean,
    sex: 'male' | 'female' | string,
    weight: number
    description: string
    ownerID: User_Data['_id']
    imagesPath: string[]
    city: string
    createdAt: string
    updatedAt: string
}

export interface AboutUsLanguage {
    about_us: {
        label: string
        text: {
            heading: string
            keys: [string, string][],
            conclusion: string
        }
    }
}