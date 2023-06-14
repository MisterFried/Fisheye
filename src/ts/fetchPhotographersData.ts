// Photographers.JSON file type interface
interface PhotographersData {
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

// * Fetch the photographers.json file
export async function fetchPhotographersData() {
	try {
		const response = await fetch("/Fisheye/data/photographers.json");
		const responseJSON: PhotographersData = await response.json();
		return responseJSON;
	} catch {
		console.log(Error);
	}
}
