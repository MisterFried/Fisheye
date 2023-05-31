//Photographers.JSON file type interface
interface PhotographersData {
	photographers: Array<PhotographerType>;
	media: Array<MediaType>;
}

//Photographers profile type interface
export interface PhotographerType {
	name: string;
	id: number;
	city: string;
	country: string;
	tagline: string;
	price: number;
	portrait: string;
}

//Photographer's media type interface
export interface MediaType {
	id: number;
	photographerId: number;
	title: string;
	image?: string;
	video?: string;
	likes: number;
	date: string;
	price: number;
}

//Fetch the photographer.json file
export async function fetchData(request: string) {
	try {
		const response = await fetch("/Fisheye/data/photographers.json");
		const responseJSON: PhotographersData = await response.json();

		if (request === "photographers") {
			return responseJSON.photographers;
		}
		if (request === "media") {
			return responseJSON.media;
		} else {
			return "Error: incorrect request";
		}
	} catch {
		console.log(Error);
	}
}
