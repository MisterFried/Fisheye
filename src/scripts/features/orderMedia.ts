import { MediaType } from "../interfaces/interfaces";

// * Reorder the list of media
export function orderMedia(mediaList: Array<MediaType>, sortMethod: string) {
	switch (sortMethod) {
		case "popular": // Sort by like number (Desc)
			mediaList.sort((a, b) => b.likes - a.likes);
			break;

		case "date": // Sort by date (Desc)
			mediaList.sort((a, b) => {
				const dateA = new Date(a.date);
				const dateB = new Date(b.date);
				if (dateA < dateB) {
					return -1;
				}
				if (dateA > dateB) {
					return 1;
				} else {
					return 0;
				}
			});
			break;

		case "name": //Sort by name (Asc)
			mediaList.sort((a, b) => {
				const nameA = a.title.toUpperCase();
				const nameB = b.title.toUpperCase();

				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return +1;
				} else {
					return 0;
				}
			});
			break;

		default:
			console.error("Unknown sort method");
			break;
	}
}
