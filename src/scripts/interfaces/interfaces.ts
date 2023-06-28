// Type interface for the user message object (contact form)
export interface UserMessage {
	firstname?: string;
	lastname?: string;
	email?: string;
	message?: string;
}

// Photographers.JSON file type interface
export interface PhotographersData {
	photographers: Array<PhotographerType>;
	media: Array<MediaType>;
}

// Photographers profile type interface
export interface PhotographerType {
	name: string;
	id: number;
	city: string;
	country: string;
	tagline: string;
	price: number;
	portrait: string;
}

// Photographers media type interface
export interface MediaType {
	id: number;
	photographerId: number;
	title: string;
	image?: string;
	video?: string;
	likes: number;
	date: string;
	price: number;
	isLiked?: boolean
}