import { info } from "sass";
import {
	MediaType,
	PhotographerType,
	fetchPhotographersData,
} from "./fetchPhotographersData";

// * Initialize the page with the photographers' informations and media
async function photographerPageInitialization() {
	const photographerID = getPhotographerID();

	// Default method for sorting medias
	let sortMethod = "popular";

	if (photographerID) {
		const data = await fetchPhotographersData();

		if (data) {
			const price = await displayPhotographerInfo(
				photographerID,
				data.photographers
			);
			const totalLikes = await displayPhotographerMedia(
				photographerID,
				sortMethod,
				data.media
			);
			displayPhotographerInfoBar(totalLikes, price);
		} else {
			console.log("Error : couldn't fetch photographers' data");
		}
	} else {
		console.log("Error : no photographer ID");
	}
}

// * Retrieve the photographer's ID via URL querry parameters
function getPhotographerID() {
	const URLParameters = new URLSearchParams(window.location.search);
	const ID = URLParameters.get("id");

	if (ID) {
		// String to number conversion
		return Number(ID);
	}
}

// * Display informations about the photographer
async function displayPhotographerInfo(
	ID: number,
	photographersArray: Array<PhotographerType>
) {
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

	let price = 0;

	photographersArray.forEach((photographer) => {
		if (photographer.id === ID) {
			photographerName.innerText = photographer.name;
			photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
			photographerTagline.innerText = photographer.tagline;
			photographerImage.setAttribute(
				"src",
				`/Fisheye/images/photographers-profile-picture/${photographer.portrait}`
			);
			photographerImage.setAttribute(
				"alt",
				`Photo de profil de ${photographer.name}`
			);
			ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
			price = photographer.price;
		}
	});
	return price;
}

// * Factory design pattern to display medias
async function displayPhotographerMedia(
	ID: number,
	sortMethod: string,
	mediaArray: Array<MediaType>
) {
	const mediaSection = document.querySelector(
		".photographer-media__container"
	) as HTMLElement;

	let totalLikes = 0;

	const orderedMediaArray = orderMedia(mediaArray, sortMethod);

	orderedMediaArray.forEach((media) => {
		if (media.photographerId === ID) {
			const mediaContainer = document.createElement("div");
			mediaContainer.classList.add("photographer-media__media-container");
			let mediaElement: HTMLImageElement | HTMLVideoElement;

			// If the media is an image
			if (media.image) {
				mediaElement = displayImage(media);
				mediaContainer.appendChild(mediaElement);
			} // If the media is a video
			if (media.video) {
				mediaElement = displayVideo(media);
				mediaContainer.appendChild(mediaElement);
			}
			if (!media.image && !media.video) {
				console.log(`Couldn't find the filename for : ${media.title}`);
			}

			const mediaLegend = addMediaLegend(media);
			mediaContainer.appendChild(mediaLegend);

			mediaSection.appendChild(mediaContainer);
			totalLikes += media.likes;
		}
	});
	setupImagesModal();
	likeSystem();
	return totalLikes;
}

// * Reorder the array of media
function orderMedia(mediaArray: Array<MediaType>, sortMethod: string) {
	switch (sortMethod) {
		// Sort by like number (Desc)
		case "popular":
			mediaArray.sort((a, b) => b.likes - a.likes);
			break;

		// Sort by date (Desc)
		case "date":
			mediaArray.sort((a, b) => {
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

		//Sort by name (Asc)
		case "name":
			mediaArray.sort((a, b) => {
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
	return mediaArray;
}

// * Display an image
// * Only a resized version of the image is displayed on the
// * photographers' page (less ressources)
// * The full-size version is shown in the image modal
function displayImage(image: MediaType) {
	const pathToImage = `/Fisheye/images/photographers-media/${image.photographerId}/${image.image}`;
	const pathToResizedImage = pathToImage.slice(0, -5) + "_resized.webp";
	const imageElement = document.createElement("img");

	imageElement.setAttribute("src", pathToResizedImage);
	imageElement.classList.add("photographer-media__image");
	imageElement.setAttribute("alt", `Photo : ${image.title}`);
	imageElement.setAttribute("decoding", "async");

	return imageElement;
}

// * Display a video + thumbnail
function displayVideo(video: MediaType) {
	const videoPath = `/Fisheye/images/photographers-media/${video.photographerId}/${video.video}`;
	const thumbnailPath = videoPath.slice(0, -4) + "_thumbnail.png";
	const videoElement = document.createElement("video");
	const videoSource = document.createElement("source");
	videoElement.classList.add("photographer-media__video");
	videoElement.setAttribute("poster", thumbnailPath);
	videoElement.setAttribute("controls", "");
	videoSource.setAttribute("src", videoPath);

	videoElement.appendChild(videoSource);

	return videoElement;
}

// * Create the legend for media (Image | Video)
function addMediaLegend(media: MediaType) {
	const legend = document.createElement("div");
	const name = document.createElement("span");
	const like = document.createElement("span");

	legend.classList.add("photographer-media__legend");
	name.classList.add("photographer-media__legend-name");
	name.innerText = media.title;
	like.classList.add("photographer-media__legend-likes");
	like.innerHTML = `${media.likes} <i class="fa-regular fa-heart"></i>`;

	legend.append(name, like);

	return legend;
}

// * Displat the photographers' infobar with total likes and price
function displayPhotographerInfoBar(likes: number, price: number) {
	const infoBarLikes = document.querySelector(
		".photographer-info-bar__likes"
	) as HTMLSpanElement;
	let infoBarPrice;

	infoBarPrice = document.querySelector(
		".photographer-info-bar__price"
	) as HTMLSpanElement;

	infoBarLikes.innerHTML = `${likes} <i class = "fa-solid fa-heart"></i>`;
	infoBarPrice.innerText = `${price}€/ jour`;
}

// * Setup the modal opening when clicking on the images
function setupImagesModal() {
	const photographerImagesDOM: Array<HTMLImageElement> = Array.from(
		document.querySelectorAll(".photographer-media__image")
	);
	const imageModal = document.querySelector(
		"#imageModal"
	) as HTMLDialogElement;
	const imageInModal = document.querySelector(
		".image-modal__image"
	) as HTMLImageElement;
	const imageModalLegend = document.querySelector(
		".image-modal__legend"
	) as HTMLSpanElement;

	photographerImagesDOM.forEach((image) => {
		const pathToResizedImage = image.src;
		const pathToImage = pathToResizedImage.slice(0, -13) + ".webp";

		// TODO : remove type any
		image.addEventListener("click", () => {
			// Select the legend span corresponding to the current displayed image
			const legendSpanDOM: any =
				image.nextElementSibling?.firstElementChild;
			const legend = legendSpanDOM.innerText;
			imageModal.showModal();
			imageInModal.setAttribute("src", pathToImage);
			imageModalLegend.innerText = legend;
		});
	});

	// Reset the src of the modal image when closing
	imageModal.addEventListener("cancel", () => {
		imageInModal.setAttribute("src", "#");
	});
	imageModal.addEventListener("close", () => {
		imageInModal.setAttribute("src", "#");
	});
}

await photographerPageInitialization();

// * Header Logo redirect to homepage
const headerLogo = document.querySelector(".header__logo") as HTMLElement;
headerLogo.addEventListener("click", () => {
	window.location.href = "/Fisheye/index.html";
});

// * Reorder the media
const orderButton = document.querySelector(
	".photographer-media__order-select"
) as HTMLSelectElement;
orderButton.addEventListener("change", async () => {
	const sortMethod = orderButton.value;
	const id = getPhotographerID();
	const data = await fetchPhotographersData();

	if (id) {
		if (data) {
			clearMedia();
			displayPhotographerMedia(id, sortMethod, data.media);
		} else {
			console.log(
				"Error : couldn't fetch photographers' data to reorganize media"
			);
		}
	} else {
		console.log("Error : no photographer ID");
	}
});

// * Clear all the media (used when reordering medias)
function clearMedia() {
	const mediaSection = document.querySelector(
		".photographer-media__container"
	) as HTMLElement;
	while (mediaSection.firstChild) {
		mediaSection.removeChild(mediaSection.firstChild);
	}
}

const ImageModalPrevious = document.querySelector(
	".image-modal__previous-icon"
) as HTMLButtonElement;
const ImageModalNext = document.querySelector(
	".image-modal__next-icon"
) as HTMLButtonElement;

ImageModalPrevious.addEventListener("click", () => {
	imageModalNavigation(-1);
});
ImageModalNext.addEventListener("click", () => {
	imageModalNavigation(1);
});

// * navigation in the image modal
function imageModalNavigation(direction: number) {
	console.log(`Scroll ${direction} image`);
}

function likeSystem() {
	const mediasLike: Array<HTMLSpanElement> = Array.from(
		document.querySelectorAll(".photographer-media__legend-likes")
	);
	mediasLike.forEach((mediaLike) => {
		mediaLike.addEventListener("click", () => {
			if (!mediaLike.classList.contains("--liked")) {
				mediaLike.innerHTML = `${
					Number(mediaLike.innerText) + 1
				} <i class="fa-solid fa-heart"></i>`;
				mediaLike.classList.add("--liked");
			} else {
				mediaLike.innerHTML = `${
					Number(mediaLike.innerText) - 1
				} <i class="fa-regular fa-heart"></i>`;
				mediaLike.classList.remove("--liked")
			}
		updateInfoBarLikes();
		});
	});
}

function updateInfoBarLikes() {
	const likes: Array<HTMLSpanElement> = Array.from(
		document.querySelectorAll(".photographer-media__legend-likes")
	);
	const infoBarLikes = document.querySelector(".photographer-info-bar__likes") as HTMLSpanElement;
	let totalLikes = 0;
	likes.forEach(like => {
		totalLikes += Number(like.innerText);
	})
	infoBarLikes.innerHTML = `${totalLikes.toString()} <i class = "fa-solid fa-heart"></i>`;
}