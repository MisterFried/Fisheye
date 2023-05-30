import { PhotographerType, fetchData, MediaType } from "./fetchData";

const photographerID = getPhotographerID();

if (photographerID) {
	displayPhotographerInfo(photographerID);
	displayPhotographerMedia(photographerID);
}
else {
	console.log("Incorrect photographer ID");
}

//Retrieve the photographer's ID via URL querry parameters
function getPhotographerID() {
	const urlParameters = new URLSearchParams(window.location.search);
	const ID = urlParameters.get("id");

	if (ID) {
		const photographerID = Number(ID)
		return (photographerID)
	} else {
		console.log("Error : no photographer ID");
	}
}

//Display informations about the photographer
async function displayPhotographerInfo(ID: number) {
	const photographerName = document.querySelector(".photographer-presentation__name") as HTMLElement;
	const photographerLocation = document.querySelector(".photographer-presentation__location") as HTMLElement;
	const photographerTagline = document.querySelector(".photographer-presentation__tagline") as HTMLElement;
	const photographerImage = document.querySelector(".photographer-presentation__image") as HTMLElement;
	const ContactFormHeader = document.querySelector(".contact-modal__title") as HTMLElement;
	const infoBarPrice = document.querySelector(".photographer-info-bar__price") as HTMLElement;

	const photographersArray = (await fetchData("photographers")) as Array<PhotographerType>;

	photographersArray.forEach((photographer: PhotographerType) => {
		if (photographer.id === ID) {
			photographerName.innerText = photographer.name;
			photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
			photographerTagline.innerText = photographer.tagline;
			photographerImage.setAttribute("src",
				`/Fisheye/images/photographers-profile-picture/${photographer.portrait}`
			);
			ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
			infoBarPrice.innerText = `${photographer.price}€ / jour`
		}
	});
}

//Factory design pattern to display each media
async function displayPhotographerMedia(ID: number) {
	const photographersMedia = (await fetchData("media")) as Array<MediaType>;
	const mediaSection = document.querySelector(".photographer-media__container") as HTMLElement;
	const infoBarLikes = document.querySelector(".photographer-info-bar__likes") as HTMLElement;
	let totalLikes = 0;

	photographersMedia.forEach((media: MediaType) => {
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
	infoBarLikes.innerHTML = `${totalLikes} <i class="fa-solid fa-heart"></i>`
}

//Display an image
function displayImage(image: MediaType) {
	const imageElement = document.createElement("img");
	imageElement.setAttribute(
		"src",
		`/Fisheye/images/photographers-media/${image.photographerId}/${image.image}`
	);
	imageElement.classList.add("photographer-media__image");

	return imageElement;
}

//display a video
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
