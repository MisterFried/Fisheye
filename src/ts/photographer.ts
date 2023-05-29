import { PhotographerType, fetchData, MediaType } from "./fetchData";

getPhotographerID();

//Retrieve the photographer's ID via URL querry parameters
function getPhotographerID() {
	const urlParameters = new URLSearchParams(window.location.search);
	const photographerID = urlParameters.get("id");

	if (photographerID) {
		displayPhotographerInfo(photographerID);
		displayPhotographerMedia(photographerID);
	} else {
		console.log("Error : no photographer ID");
	}
}

//Display informations about the photographer
async function displayPhotographerInfo(ID: string) {
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

	const photographersArray = await fetchData("photographers");

	photographersArray.forEach((photographer: PhotographerType) => {
		if (photographer.id.toString() === ID) {
			photographerName.innerText = photographer.name;
			photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
			photographerTagline.innerText = photographer.tagline;
			photographerImage.setAttribute(
				"src",
				`/Fisheye/images/photographers-profile-picture/${photographer.portrait}`
			);
			ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
		}
	});
}

async function displayPhotographerMedia(ID: string) {
	const photographersMedia = await fetchData("media");
	const mediaSection = document.querySelector(
		".photographer-media__container"
	) as HTMLElement;

	photographersMedia.forEach((media: MediaType) => {
		if (media.photographerId.toString() === ID) {
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
		}
	});
}

function displayImage(image: MediaType) {
	const imageElement = document.createElement("img");
	imageElement.setAttribute(
		"src",
		`/Fisheye/images/photographers-media/${image.photographerId}/${image.image}`
	);
	imageElement.classList.add("photographer-media__image");

	return imageElement;
}

function displayVideo(video: MediaType) {
	const videoElement = document.createElement("video");
	videoElement.classList.add("photographer-media__image");
	videoElement.setAttribute("controls","");
	const videoSource = document.createElement("source");
	videoSource.setAttribute(
		"src",
		`/Fisheye/images/photographers-media/${video.photographerId}/${video.video}`
	);
	videoElement.appendChild(videoSource);

	return videoElement;
}

function addMediaLegend(media: MediaType) {
	const legend = document.createElement("div");
	legend.classList.add("photographer-media__legend");
	const name = document.createElement("span");
	name.innerText = media.title;
	name.classList.add("photographer-media__legend-name");
	const like = document.createElement("span");
	like.innerHTML = `${media.likes} <i class="fa-regular fa-heart photographer-media__legend-likes"></i>`;
	like.classList.add("photographer-media__legend-likes");

	legend.append(name, like);

	return legend;
}

//Header Logo redirect to homepage
const headerLogo = document.querySelector(".header__logo") as HTMLElement;
headerLogo.addEventListener("click", () => {
	window.location.href = "/Fisheye/index.html";
});
