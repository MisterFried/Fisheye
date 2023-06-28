import { PhotographersData } from "../interfaces/interfaces";

// * Fetch the photographers.json file
export async function fetchPhotographersData() {
	try {
		const response = await fetch("/Fisheye/data/photographers.json");
		const responseJSON: PhotographersData = await response.json();
		return responseJSON;
	} catch {
		console.error(Error);
	}
}
