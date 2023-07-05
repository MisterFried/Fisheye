import { fetchPhotographersData } from "./API/fetchData";
import { likeEventHandler, updatePhotographerInfoBarLikes } from "./features/like";
import { setupMediaModal } from "./features/mediaModal";
import { orderMedia } from "./features/orderMedia";
import { MediaType, PhotographerType } from "./interfaces/interfaces";

// * Initialize the page with the photographers' informations and media
async function photographerPageInitialization() {
	const photographerID = getPhotographerID();

	if (photographerID) {
		const data = await fetchPhotographersData();

		if (data) {
			const { photographers: photographersInfo, media: mediasInfo } = data;

			// Find the photographer with corresponding ID
			const photographerInfo = photographersInfo.find(photographer => photographer.id === photographerID);
			// Create an array with only the current photographer's media
			const mediaList = mediasInfo.filter(media => media.photographerId === photographerID);

			if (photographerInfo && mediaList) {
				orderMedia(mediaList, "popular"); // Sort the media by like by default

				displayPhotographerInfo(photographerInfo);
				displayPhotographerInfoBar(mediaList, photographerInfo.price);
				displayPhotographerMedia(mediaList);

				// * Event listener for reordering media
				const orderButton = document.querySelector(".photographer-media__order-select") as HTMLSelectElement;
				orderButton.addEventListener("change", () => {
					// * Reorder the mediaList, clear all the currently displayed media and then display them again in correct order
					orderMedia(mediaList, orderButton.value);
					clearMedia();
					displayPhotographerMedia(mediaList);
				});
			} else {
				console.error(`Error : no photographer with ID : ${photographerID}`);
			}
		} else {
			console.error("Error : couldn't fetch photographers' data");
		}
	} else {
		console.error("Error : no photographer ID");
	}
}

photographerPageInitialization();

// * Retrieve the photographer's ID via URL querry parameters
function getPhotographerID() {
	const URLParameters = new URLSearchParams(window.location.search);
	const ID = URLParameters.get("id");

	if (ID) {
		return Number(ID);
	} else {
		console.error("Error : No ID parameter");
	}
}

// * Display informations about the photographer
function displayPhotographerInfo(photographer: PhotographerType) {
	const photographerName = document.querySelector(".photographer-presentation__name") as HTMLHeadingElement;
	const photographerLocation = document.querySelector(".photographer-presentation__location") as HTMLSpanElement;
	const photographerTagline = document.querySelector(".photographer-presentation__tagline") as HTMLParagraphElement;
	const photographerImage = document.querySelector(".photographer-presentation__image") as HTMLImageElement;
	const ContactFormHeader = document.querySelector(".contact-modal__title") as HTMLHeadingElement;

	photographerName.innerText = photographer.name;
	photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
	photographerTagline.innerText = photographer.tagline;
	photographerImage.src = `/Fisheye/images/photographers-profile-picture/${photographer.portrait}`;
	photographerImage.alt = `Photo de profil de ${photographer.name}`;
	ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
}

// * Factory design pattern to display medias
function displayPhotographerMedia(mediaList: Array<MediaType>) {
	const mediaSection = document.querySelector(".photographer-media__container");

	mediaList.forEach(media => {
		const mediaContainer = document.createElement("article");
		mediaContainer.classList.add("photographer-media__media-container");

		// Image
		if (media.image) {
			const mediaElement = displayImage(media);
			mediaContainer.appendChild(mediaElement);
		}
		// Video
		if (media.video) {
			const mediaElement = displayVideo(media);
			mediaContainer.appendChild(mediaElement);
		}
		// Error / Default
		if (!media.image && !media.video) {
			console.error(`Couldn't find the filename for : ${media.title}`);
		}

		const mediaLegend = addMediaLegend(media);
		mediaContainer.appendChild(mediaLegend);
		mediaSection?.appendChild(mediaContainer);
	});
	setupMediaModal(mediaList);
	likeEventHandler(mediaList);
}

// * Display an image (resized version)
function displayImage(image: MediaType) {
	const pathToImage = `/Fisheye/images/photographers-media/${image.photographerId}/${image.image}`;
	const pathToResizedImage = pathToImage.slice(0, -5) + "_resized.webp";

	const imageButtonContainer = document.createElement("button");
	imageButtonContainer.classList.add("photographer-media__image-button-container");
	imageButtonContainer.ariaLabel = `Clickez pour ouvrir ${image.title} en grand`;

	const imageElement = document.createElement("img");
	imageElement.classList.add("photographer-media__image");
	imageElement.src = pathToResizedImage;
	imageElement.alt = `Photo : ${image.title}`;
	imageElement.loading = "lazy";

	imageButtonContainer.appendChild(imageElement);

	return imageButtonContainer;
}

// * Display a video + thumbnail
function displayVideo(video: MediaType) {
	const videoPath = `/Fisheye/images/photographers-media/${video.photographerId}/${video.video}`;
	const thumbnailPath = videoPath.slice(0, -4) + "_thumbnail.png";

	const videoButtonContainer = document.createElement("button");
	videoButtonContainer.classList.add("photographer-media__video-button-container");
	videoButtonContainer.ariaLabel = `Clickez pour ouvrir ${video.title} en grand`;

	const videoElement = document.createElement("video");
	videoElement.classList.add("photographer-media__video");
	videoElement.poster = thumbnailPath;
	const videoSource = document.createElement("source");
	videoSource.src = videoPath;

	videoElement.appendChild(videoSource);
	videoButtonContainer.appendChild(videoElement);

	return videoButtonContainer;
}

// * Create the legend for media
function addMediaLegend(media: MediaType) {
	const legend = document.createElement("div");
	legend.classList.add("photographer-media__legend");

	const name = document.createElement("span");
	name.classList.add("photographer-media__legend-name");
	name.innerText = media.title;

	const like = document.createElement("button");
	like.classList.add("photographer-media__legend-likes");
	media.isLiked
		? (like.innerHTML = `${media.likes} <i class="fa-solid fa-heart" aria-label="likes" ></i>`)
		: (like.innerHTML = `${media.likes} <i class="fa-regular fa-heart" aria-label="likes" ></i>`);

	legend.append(name, like);

	return legend;
}

// * Display the photographers' infobar with total likes and price
function displayPhotographerInfoBar(mediaList: Array<MediaType>, price: number) {
	const infoBarPrice = document.querySelector(".photographer-info-bar__price") as HTMLSpanElement;
	infoBarPrice.innerText = `${price}€/ jour`;
	updatePhotographerInfoBarLikes(mediaList);
}

// * Clear all the media
export function clearMedia() {
	const mediaSection = document.querySelector(".photographer-media__container");
	while (mediaSection?.firstChild) {
		mediaSection.removeChild(mediaSection.firstChild);
	}
}
