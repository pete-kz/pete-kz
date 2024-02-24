export type Pet_Response = {
    _id: string
	name: string
    age: string
    type: 'Cat' | 'Dog' | 'Other'
    description: string
    userID: User_Response['_id']
    imagesPath: string[]
    city: string
    createdAt: string
    updatedAt: string
}

export type User_Response = {
    _id: string
    login: string
    name: string
    phone: string
    social: {
        telegram: string
        instagram: string
    }
    password: string
    liked: string[]
    token: string
    createdAt: Date
    updatedAt: Date
}

export type PetCard_props = {
	id: string
	name: string
    age: string
    type: 'Cat' | 'Dog' | 'Other'
    description: string
    userID: User_Data['_id']
    imagesPath: string[]
    city: string
    createdAt: string
    updatedAt: string
}