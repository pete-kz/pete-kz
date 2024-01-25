/**
 *  RESPONSE TYPES
 */

export type Comment_Data = {
    _id: string,
    userID: string,
    institutionID: string,
    date: string,
    dateStamp: string,
    content: string,
    rate: string,
}

export type Institution_Data = {
    _id: string
	title: string
	description: string
    userID: string
    status: string
	address: string
	link: string
	imagePath: string
    city: string
}

export type RequestInstitution_Data = {
    _id: string
    userRequestID: string
    title: string
    address: string
	description: string
	link: string
	imagePath: string
    city: string
}

export type User_Data = {
    _id: string
    login: string
    password: string
    inviteCode: string
    acceptCode: string
    token: string
}

/**
 *  PROPS TYPES
 */

export type EditInstitutionDialog_Props = {
	open: boolean
	institutionID: string
	institutionTitle: string
	onClose: Function
}

export type UserComments_Props = {
	userID: string
	rate: string
	comment: string
}

export type UserCard_Props = {
    id: string
    login: string
    inviteCode: string
    acceptCode: string
}

export type Comments_Props = {
	comments: Array<Comment_Props>
	expanded?: boolean
	id: string
}

export type Comment_Props = {
	rate: string
	userID: string
	institutionID: string
	content: string
    _id: string
    date: string
    dateStamp: string
}

export type InstitutionCard_Props = {
	userID: string
	id: string
	name: string
	address: string
	status: string
	description: string
	link: string
	imagePath: string
    city?: string
}

export type RequestInstitutionCard_Props = {
    id?: string
    name: string
    address: string
    description: string
    link: string
    imagePath: string
    userID?: string
    city?: string
}

export type NavigationBar_Props = {
	children?: any
}

export type PageAlert_Props = {
    title: string
    description: string
}