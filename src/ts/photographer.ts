import { MediaType, PhotographerType, fetchPhotographersData } from "./fetchPhotographersData";

// * Initialize the page with the photographers' informations and media
async function photographerPageInitialization() {
	const photographerID = getPhotographerID();

	if (photographerID) {
		const data = await fetchPhotographersData();

		if (data) {
			const photographersInfo = data.photographers;
			const mediasInfo = data.media;

			const photographerInfo = photographersInfo.find((photographer) => photographer.id === photographerID);
			let mediaList = mediasInfo.filter((media) => media.photographerId === photographerID);

			if (photographerInfo! && mediaList.length !== 0) {
				const orderedMediaList = orderMedia(mediaList, "popular");

				displayPhotographerInfo(photographerInfo);
				displayPhotographerInfoBar(orderedMediaList, photographerInfo.price);
				displayPhotographerMedia(orderedMediaList);

				// * Event listener to reordering media
				const orderButton = document.querySelector(".photographer-media__order-select") as HTMLSelectElement;
				orderButton.addEventListener("change", () => {
					const orderedMediaList = orderMedia(mediaList, orderButton.value);
					clearMedia();
					displayPhotographerMedia(orderedMediaList);
				});
			}
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
function displayPhotographerInfo(photographer: PhotographerType) {
	const photographerName = document.querySelector(".photographer-presentation__name") as HTMLElement;
	const photographerLocation = document.querySelector(".photographer-presentation__location") as HTMLElement;
	const photographerTagline = document.querySelector(".photographer-presentation__tagline") as HTMLElement;
	const photographerImage = document.querySelector(".photographer-presentation__image") as HTMLElement;
	const ContactFormHeader = document.querySelector(".contact-modal__title") as HTMLElement;

	photographerName.innerText = photographer.name;
	photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
	photographerTagline.innerText = photographer.tagline;
	photographerImage.setAttribute("src", `/Fisheye/images/photographers-profile-picture/${photographer.portrait}`);
	photographerImage.setAttribute("alt", `Photo de profil de ${photographer.name}`);
	ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
}

// * Factory design pattern to display medias
function displayPhotographerMedia(mediaList: Array<MediaType>) {
	const mediaSection = document.querySelector(".photographer-media__container") as HTMLElement;

	mediaList.forEach((media) => {
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
		} //Default / Error
		if (!media.image && !media.video) {
			console.log(`Couldn't find the filename for : ${media.title}`);
		}

		const mediaLegend = addMediaLegend(media);
		mediaContainer.appendChild(mediaLegend);

		mediaSection.appendChild(mediaContainer);
	});
	setupMediaModal(mediaList);
	likeEventHandler(mediaList);
}

// * Display an image
// * Only a resized version of the image is displayed on the
// * photographers' page (less ressources)
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
	if (media.isLiked) {
		like.innerHTML = `${media.likes} <i class="fa-solid fa-heart"></i>`;
	} else {
		like.innerHTML = `${media.likes} <i class="fa-regular fa-heart"></i>`;
	}

	legend.append(name, like);

	return legend;
}

// * Display the photographers' infobar with total likes and price
function displayPhotographerInfoBar(mediaList: Array<MediaType>, price: number) {
	const infoBarLikes = document.querySelector(".photographer-info-bar__likes") as HTMLSpanElement;
	let infoBarPrice;

	infoBarPrice = document.querySelector(".photographer-info-bar__price") as HTMLSpanElement;

	let totalLikes: number = 0;
	mediaList.forEach((media) => {
		totalLikes += media.likes;
	});

	infoBarLikes.innerHTML = `${totalLikes} <i class = "fa-solid fa-heart"></i>`;
	infoBarPrice.innerText = `${price}€/ jour`;
}

function updatePhotographerInfoBar(mediaList: Array<MediaType>) {
	const infoBarLikes = document.querySelector(".photographer-info-bar__likes") as HTMLSpanElement;
	let totalLikes: number = 0;
	mediaList.forEach((media) => {
		totalLikes += media.likes;
	});
	infoBarLikes.innerHTML = `${totalLikes} <i class = "fa-solid fa-heart"></i>`;
}

// * Setup the modal opening when clicking on the images
function setupMediaModal(mediaList: Array<MediaType>) {
	const photographerImagesDOM: Array<HTMLImageElement> = Array.from(
		document.querySelectorAll(".photographer-media__image")
	);
	const imageModal = document.querySelector("#imageModal") as HTMLDialogElement;
	const imageInModal = document.querySelector(".image-modal__image") as HTMLImageElement;
	const imageModalLegend = document.querySelector(".image-modal__legend") as HTMLSpanElement;

	photographerImagesDOM.forEach((image) => {
		const pathToResizedImage = image.src;
		const pathToImage = pathToResizedImage.slice(0, -13) + ".webp";

		image.addEventListener("click", () => {
			// Select the legend span corresponding to the current displayed image
			const legendSpanDOM = image.nextElementSibling?.firstElementChild as HTMLSpanElement;
			imageModal.showModal();
			imageInModal.setAttribute("src", pathToImage);
			imageModalLegend.innerText = legendSpanDOM.innerText;
		});
	});

	//TODO USE FIND ISNTEAD OF FOREACH
	const nextMediaButton = document.querySelector(".image-modal__next-icon");
	nextMediaButton!.addEventListener("click", () => {
		const modalImageElement = document.querySelector(".image-modal__image") as HTMLImageElement;
		const imageModalLegend = document.querySelector(".image-modal__legend") as HTMLSpanElement;
		const modalImageName = modalImageElement.src.split("/").pop();
		const modalImageRootPathArray = modalImageElement.src.split("/");
		modalImageRootPathArray.pop();
		const modalImageRootPath = modalImageRootPathArray.join("/");
		mediaList.forEach((media, index) => {
			if (media.image === modalImageName) {
				if (index === mediaList.length - 1) {
					modalImageElement.src = `${modalImageRootPath}/${mediaList[0].image}`;
					imageModalLegend.innerText = mediaList[0].title;
				}
				else {
					modalImageElement.src = `${modalImageRootPath}/${mediaList[index + 1].image}`;
					imageModalLegend.innerText = mediaList[index + 1].title!;
				}
			}
		});
	});

	//TODO USE FIND ISNTEAD OF FOREACH
	const previousMediaButton = document.querySelector(".image-modal__previous-icon");
	previousMediaButton!.addEventListener("click", () => {
		const modalImageElement = document.querySelector(".image-modal__image") as HTMLImageElement;
		const modalImageName = modalImageElement.src.split("/").pop();
		const modalImageRootPathArray = modalImageElement.src.split("/");
		modalImageRootPathArray.pop();
		const modalImageRootPath = modalImageRootPathArray.join("/");
		mediaList.forEach((media, index) => {
			if (media.image === modalImageName) {
				if (index === 0) {
					modalImageElement.src = `${modalImageRootPath}/${mediaList[mediaList.length - 1].image}`;
					imageModalLegend.innerText = mediaList[mediaList.length - 1].title;
				}
				else {
					modalImageElement.src = `${modalImageRootPath}/${mediaList[index - 1].image}`;
					imageModalLegend.innerText = mediaList[index - 1].title!;
				}
			}
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

// * Reorder the list of media
function orderMedia(mediaList: Array<MediaType>, sortMethod: string) {
	switch (sortMethod) {
		// Sort by like number (Desc)
		case "popular":
			mediaList.sort((a, b) => b.likes - a.likes);
			break;

		// Sort by date (Desc)
		case "date":
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

		//Sort by name (Asc)
		case "name":
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
			console.log("Unknown sort method");
			break;
	}
	return mediaList;
}

// * Clear all the media
function clearMedia() {
	const mediaSection = document.querySelector(".photographer-media__container") as HTMLElement;
	while (mediaSection.firstChild) {
		mediaSection.removeChild(mediaSection.firstChild);
	}
}

// * Like event Handler
function likeEventHandler(mediaList: Array<MediaType>) {
	const mediasLike: Array<HTMLSpanElement> = Array.from(
		document.querySelectorAll(".photographer-media__legend-likes")
	);

	mediasLike.forEach((mediaLike) => {
		mediaLike.addEventListener("click", (event) => {
			const target = event.target as HTMLElement;

			// * The DOM element corresponding to the clicked legend (image or video)
			const mediaElement = target.parentElement!.parentElement!.firstElementChild as
				| HTMLImageElement
				| HTMLVideoElement;

			if (mediaElement instanceof HTMLImageElement) {
				const resizedImageName = mediaElement.src.split("/").pop();
				const clickedImageName = resizedImageName!.slice(0, -13);

				mediaList.forEach((media, index) => {
					if (media.image) {
						const ImageName = media.image.slice(0, -5);
						if (ImageName === clickedImageName) {
							likeUnlikeMedia(index);
						}
					}
				});
			}
			if (mediaElement instanceof HTMLVideoElement) {
				const videoSourceElement = mediaElement.firstChild as HTMLSourceElement;
				const clickedVideoSource = videoSourceElement.src.split("/").pop()?.slice(0, -4);

				mediaList.forEach((media, index) => {
					if (media.video) {
						const videoSource = media.video.slice(0, -4);
						if (clickedVideoSource === videoSource) {
							likeUnlikeMedia(index);
						}
					}
				});
			}
			function likeUnlikeMedia(index: number) {
				if (!mediaList[index].isLiked) {
					mediaList[index].likes += 1;
					mediaList[index].isLiked = true;
					mediaLike.innerHTML = `${mediaList[index].likes} <i class="fa-solid fa-heart"></i>`;
					updatePhotographerInfoBar(mediaList);
				} else {
					mediaList[index].likes -= 1;
					mediaList[index].isLiked = false;
					mediaLike.innerHTML = `${mediaList[index].likes} <i class="fa-regular fa-heart"></i>`;
					updatePhotographerInfoBar(mediaList);
				}
			}
		});
	});
}

photographerPageInitialization();

// * Header Logo redirect to homepage
const headerLogo = document.querySelector(".header__logo") as HTMLElement;
headerLogo.addEventListener("click", () => {
	window.location.href = "/Fisheye/";
});
