//Photographers.JSON file type interface
interface PhotographersData {
    photographers: Array<PhotographerType>,
    media: Array<MediaType>
}

//Photographers profile type interface
export interface PhotographerType {
    name: string,
    id: number,
    city: string,
    country: string,
    tagline: string,
    price: number,
    portrait: string
}

//Photographer's media type interface
export interface MediaType {
    id: number,
    photographerId: number,
    title: string,
    image: string,
    likes: number,
    date: string,
    price: number,
}

//Fetch the photographer.json file
export async function fetchData() {

    const response = await fetch("/Fisheye/data/photographers.json");
    const fetchedData: PhotographersData = await response.json()
    const photographersArray = fetchedData.photographers;

    return photographersArray;
}