import { PhotographerType, fetchData, MediaType } from "./fetchData";
import { addModalImages } from "./pictureModal";

TestFunction();

async function TestFunction() {
	const photographerID = getPhotographerID();
	let sortMethod = "popular";

	if (photographerID) {
		await displayPhotographerInfo(photographerID);
		await displayPhotographerMedia(photographerID, sortMethod);
		addModalImages();
	} else {
		console.log("Incorrect photographer ID");
	}
}

//Retrieve the photographer's ID via URL querry parameters
function getPhotographerID() {
	const urlParameters = new URLSearchParams(window.location.search);
	const ID = urlParameters.get("id");

	if (ID) {
		const photographerID = Number(ID);
		return photographerID;
	} else {
		console.log("Error : no photographer ID");
	}
}

//Display informations about the photographer
async function displayPhotographerInfo(ID: number) {
	const photographerName = document.querySelector(
		".photographer-presentation__name"
	) as HTMLElement;
	const photographerLocation = document.querySelector(
		".photographer-presentation__location"
	) as HTMLElement;
	const photographerTagline = document.querySelector(
		".photographer-presentation__tagline"
	) as HTMLElement;
	const photographerImage = document.querySelector(
		".photographer-presentation__image"
	) as HTMLElement;
	const ContactFormHeader = document.querySelector(
		".contact-modal__title"
	) as HTMLElement;
	const infoBarPrice = document.querySelector(
		".photographer-info-bar__price"
	) as HTMLElement;

	const photographersArray = (await fetchData(
		"photographers"
	)) as Array<PhotographerType>;

	photographersArray.forEach((photographer: PhotographerType) => {
		if (photographer.id === ID) {
			photographerName.innerText = photographer.name;
			photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
			photographerTagline.innerText = photographer.tagline;
			photographerImage.setAttribute(
				"src",
				`/Fisheye/images/photographers-profile-picture/${photographer.portrait}`
			);
			ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
			infoBarPrice.innerText = `${photographer.price}€ / jour`;
		}
	});
}

//Factory design pattern to display each media
async function displayPhotographerMedia(ID: number, sortMethod: string) {
	console.log("display media function start");
	const photographersMedia = (await fetchData("media")) as Array<MediaType>;
	const mediaSection = document.querySelector(
		".photographer-media__container"
	) as HTMLElement;
	const infoBarLikes = document.querySelector(
		".photographer-info-bar__likes"
	) as HTMLElement;
	let totalLikes = 0;

	const orderPhotographersMedia = orderMedia(photographersMedia, sortMethod);

	orderPhotographersMedia.forEach((media: MediaType) => {
		if (media.photographerId === ID) {
			const mediaContainer = document.createElement("div");
			mediaContainer.classList.add("photographer-media__media");
			let mediaElement: HTMLElement;
			if (media.image) {
				mediaElement = displayImage(media);
				mediaContainer.appendChild(mediaElement);
			} else if (media.video) {
				mediaElement = displayVideo(media);
				mediaContainer.appendChild(mediaElement);
			}
			const mediaLegend = addMediaLegend(media);
			mediaContainer.appendChild(mediaLegend);

			mediaSection.appendChild(mediaContainer);
			totalLikes += media.likes;
		}
	});
	infoBarLikes.innerHTML = `${totalLikes} <i class="fa-solid fa-heart"></i>`;
	console.log("display media function end");
}

//Display an image
function displayImage(image: MediaType) {
	const imageElement = document.createElement("img");
	imageElement.setAttribute(
		"src",
		`/Fisheye/images/photographers-media/${image.photographerId}/${image.image}`
	);
	imageElement.setAttribute("loading", "lazy");
	imageElement.classList.add("photographer-media__image");

	return imageElement;
}

//display a video
function displayVideo(video: MediaType) {
	const videoElement = document.createElement("video");
	videoElement.classList.add("photographer-media__image");
	videoElement.setAttribute("controls", "");
	const videoSource = document.createElement("source");
	videoSource.setAttribute(
		"src",
		`/Fisheye/images/photographers-media/${video.photographerId}/${video.video}`
	);
	videoElement.setAttribute("loading", "lazy");
	videoElement.appendChild(videoSource);

	return videoElement;
}

//Add legend to the media
function addMediaLegend(media: MediaType) {
	const legend = document.createElement("div");
	legend.classList.add("photographer-media__legend");
	const name = document.createElement("span");
	name.innerText = media.title;
	name.classList.add("photographer-media__legend-name");
	const like = document.createElement("span");
	like.innerHTML = `${media.likes} <i class="fa-regular fa-heart"></i>`;
	like.classList.add("photographer-media__legend-likes");

	legend.append(name, like);

	return legend;
}

//Header Logo redirect to homepage
const headerLogo = document.querySelector(".header__logo") as HTMLElement;
headerLogo.addEventListener("click", () => {
	window.location.href = "/Fisheye/index.html";
});

//Event listener on the select / order media input
const orderButton = document.querySelector(
	".photographer-media__order-select"
) as HTMLElement;
orderButton.addEventListener("change", (event) => {
	const target = event.target as HTMLButtonElement;
	const id = getPhotographerID();
	if (id) {
		clearMedia();
		displayPhotographerMedia(id, target.value);
	}
});

//Reorder the array of media
function orderMedia(photographersMedia: Array<MediaType>, sortMethod: string) {
	switch (sortMethod) {
		case "popular":
			photographersMedia.sort((a, b) => b.likes - a.likes);
			break;
		case "date":
			photographersMedia.sort((a, b) => {
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
		case "name":
			photographersMedia.sort((a, b) => {
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
	}
	return photographersMedia;
}

//Clear all the media
function clearMedia() {
	const mediaSection = document.querySelector(
		".photographer-media__container"
	) as HTMLElement;
	while (mediaSection.firstChild) {
		mediaSection.removeChild(mediaSection.lastChild as HTMLElement);
	}
}
