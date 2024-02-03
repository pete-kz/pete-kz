/**
 *  RESPONSE TYPES
 */

import { AnimationScope } from "framer-motion"

/*

const petSchema = new mongoose.Schema({
    name: { type: String }, // name of the pet
    age: { type: String },
    type: { type: String, enum: ['Cat', 'Dog', 'Other'] },
    description: { type: String, default: '' }, // short description of pet
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imagesPath: [{ type: String }],
    city: { type: String, default: '' },
}, { timestamps: true })
*/

export type Pet_Response = {
    _id: string
	name: string
    age: string
    type: 'Cat' | 'Dog' | 'Other'
    description: string
    userID: User_Response["_id"]
    imagesPath: string[]
    city: string
    createdAt: string
    updatedAt: string
}

/* 

const userSchema = new mongoose.Schema({
    login: { type: String unique: true }
    name: { type: String }
    phone: { type: String unique: true }
    social: {
        telegram: { type: String default: '' }
        instagram: { type: String default: '' }
    }
    password: { type: String default: '' }
    liked: { type: [{ type: mongoose.Schema.Types.ObjectId ref: 'Pet' }] default: [] }
    skipped: { type: [{ type: mongoose.Schema.Types.ObjectId ref: 'Pet' }] default: [] }
    token: { type: String default: '' }
} { timestamps: true })
*/

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
    userID: User_Data["_id"]
    imagesPath: string[]
    city: string
    createdAt: string
    updatedAt: string
}

export type NavigationBar_Props = {
	children?: any
}

export type PageAlert_Props = {
    title: string
    description: string
}