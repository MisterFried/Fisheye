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
				displayPhotographerMedia(orderedMediaList); // + image modal setup

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

// * Factory design pattern (?) to display medias
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
		} // Default / Error
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

	imageElement.src = pathToResizedImage;
	imageElement.classList.add("photographer-media__image");
	imageElement.alt = `Photo : ${image.title}`;
	imageElement.decoding = "async";

	return imageElement;
}

// * Display a video + thumbnail
function displayVideo(video: MediaType) {
	const videoPath = `/Fisheye/images/photographers-media/${video.photographerId}/${video.video}`;
	const thumbnailPath = videoPath.slice(0, -4) + "_thumbnail.png";
	const videoElement = document.createElement("video");
	const videoSource = document.createElement("source");
	videoElement.classList.add("photographer-media__video");
	videoElement.setAttribute("controls", "");
	videoElement.poster = thumbnailPath;
	videoSource.src = videoPath;

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

// * Update the number of likes on the photogrpahers' infobar
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
	const photographerMediaDOM: Array<HTMLImageElement> = Array.from(
		document.querySelectorAll(".photographer-media__image, .photographer-media__video")
	);
	const mediaModal = document.querySelector("#mediaModal") as HTMLDialogElement;
	const imageInModal = document.querySelector(".media-modal__image") as HTMLImageElement;
	const videoInModal = document.querySelector(".media-modal__video") as HTMLVideoElement;
	const videoSourceInModal = videoInModal.firstElementChild as HTMLSourceElement;
	const mediaModalLegend = document.querySelector(".media-modal__legend") as HTMLSpanElement;
	const nextMediaButton = document.querySelector(".media-modal__next-icon") as HTMLElement;
	const previousMediaButton = document.querySelector(".media-modal__previous-icon") as HTMLElement;
	let mediaSource = "";
	let mediaType = "";
	let mediaRootPath = "";

	photographerMediaDOM.forEach((media) => {
		media.addEventListener("click", (event) => {
			mediaModal.showModal();
			const eventTarget = event.target as HTMLImageElement | HTMLVideoElement;

			if (eventTarget instanceof HTMLImageElement) {
				mediaSource = `${eventTarget.src.slice(0, -13)}.webp`; //cut the _resized in filename
				mediaType = "image";
				const mediaFullPath = eventTarget.src.split("/");
				mediaFullPath.splice(-1, 1);
				mediaRootPath = mediaFullPath.join("/");
			} else if (eventTarget instanceof HTMLVideoElement) {
				const clickedVideoSource = eventTarget.firstElementChild as HTMLSourceElement;
				mediaSource = clickedVideoSource.src;
				mediaType = "video";
				const mediaFullPath = mediaSource.split("/");
				mediaFullPath.splice(-1, 1);
				mediaRootPath = mediaFullPath.join("/");
			}
			const mediaFile = mediaSource.split("/").pop()!;

			displayMediaInModal(mediaType, mediaFile, mediaRootPath);
		});
	});

	// ! * * * * * * * * * * *
	//TODO FIX NEXT/PREVIOUS BUTTON HAVING MULTIPLE EVENT LISTENER EACH TIME MEDIA ARE REORDERED
	// ! * * * * * * * * * * *

	nextMediaButton.addEventListener("click", () => {
		let mediaToDisplayNext = "";
		if (imageInModal.style.display === "block" && videoInModal.style.display === "none") {
			const mediaFullPathArray = imageInModal.src.split("/");
			const mediaFile = mediaFullPathArray.pop();
			mediaRootPath = mediaFullPathArray.join("/");

			let currentMediaDisplayedIndex = mediaList.findIndex((media) => media.image === mediaFile)!;
			if (currentMediaDisplayedIndex === mediaList.length - 1) {
				currentMediaDisplayedIndex = -1;
			}
			if (mediaList[currentMediaDisplayedIndex + 1].image) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + 1].image!;
				mediaType = "image";
			} else if (mediaList[currentMediaDisplayedIndex + 1].video) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + 1].video!;
				mediaType = "video";
			}
		} else if (imageInModal.style.display === "none" && videoInModal.style.display === "block") {
			const mediaFullPathArray = videoSourceInModal.src.split("/");
			const mediaFile = mediaFullPathArray.pop();
			mediaRootPath = mediaFullPathArray.join("/");

			let currentMediaDisplayedIndex = mediaList.findIndex((media) => media.video === mediaFile)!;
			if (currentMediaDisplayedIndex === mediaList.length - 1) {
				currentMediaDisplayedIndex = -1;
			}
			if (mediaList[currentMediaDisplayedIndex + 1].image) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + 1].image!;
				mediaType = "image";
			} else if (mediaList[currentMediaDisplayedIndex + 1].video) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + 1].video!;
				mediaType = "video";
			}
		}
		displayMediaInModal(mediaType, mediaToDisplayNext, mediaRootPath);
	});

	previousMediaButton.addEventListener("click", () => {
		let mediaToDisplayNext = "";
		if (imageInModal.style.display === "block" && videoInModal.style.display === "none") {
			const mediaFullPathArray = imageInModal.src.split("/");
			const mediaFile = mediaFullPathArray.pop();
			mediaRootPath = mediaFullPathArray.join("/");

			let currentMediaDisplayedIndex = mediaList.findIndex((media) => media.image === mediaFile)!;
			if (currentMediaDisplayedIndex === 0) {
				currentMediaDisplayedIndex = mediaList.length;
			}
			if (mediaList[currentMediaDisplayedIndex - 1].image) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex - 1].image!;
				mediaType = "image";
			} else if (mediaList[currentMediaDisplayedIndex - 1].video) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex - 1].video!;
				mediaType = "video";
			}
		} else if (imageInModal.style.display === "none" && videoInModal.style.display === "block") {
			const mediaFullPathArray = videoSourceInModal.src.split("/");
			const mediaFile = mediaFullPathArray.pop();
			mediaRootPath = mediaFullPathArray.join("/");

			let currentMediaDisplayedIndex = mediaList.findIndex((media) => media.video === mediaFile)!;
			if (currentMediaDisplayedIndex === 0) {
				currentMediaDisplayedIndex = mediaList.length;
			}
			if (mediaList[currentMediaDisplayedIndex - 1].image) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex - 1].image!;
				mediaType = "image";
			} else if (mediaList[currentMediaDisplayedIndex - 1].video) {
				mediaToDisplayNext = mediaList[currentMediaDisplayedIndex - 1].video!;
				mediaType = "video";
			}
		}
		displayMediaInModal(mediaType, mediaToDisplayNext, mediaRootPath);
	});

	//TODO FIX VIDEO NOT DISPLAYING CORRECLY INSIDE THE MODAL
	function displayMediaInModal(mediaType: string, mediaFile: string, mediaRootPath: string) {
		let mediaName = "";
		switch (mediaType) {
			case "image":
				imageInModal.style.display = "block";
				videoInModal.style.display = "none";
				imageInModal.src = `${mediaRootPath}/${mediaFile}`;
				mediaName = mediaList.find((media) => media.image === mediaFile)?.title!;
				break;

			case "video":
				imageInModal.style.display = "none";
				videoInModal.style.display = "block";
				videoSourceInModal.src = `${mediaRootPath}/${mediaFile}`;
				mediaName = mediaList.find((media) => media.video === mediaFile)?.title!;
				break;
		}
		mediaModalLegend.innerText = mediaName;
	}

	mediaModal.addEventListener("close", () => {
		imageInModal.src = "#";
		imageInModal.style.display = "none";
		videoInModal.src = "#";
		videoInModal.style.display = "none";
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
			const target = event.target as HTMLSpanElement;

			// * The DOM element corresponding to the clicked legend (image or video)
			const mediaElement = target.parentElement!.parentElement!.firstElementChild as
				| HTMLImageElement
				| HTMLVideoElement;

			if (mediaElement instanceof HTMLImageElement) {
				const resizedImageName = mediaElement.src.split("/").pop();
				const clickedImageName = resizedImageName!.slice(0, -13);

				const clickedImageIndex = mediaList.findIndex(
					(media) => media.image?.slice(0, -5) === clickedImageName
				);
				likeUnlikeMedia(clickedImageIndex);
			} else if (mediaElement instanceof HTMLVideoElement) {
				const videoSourceElement = mediaElement.firstChild as HTMLSourceElement;
				const clickedVideoSource = videoSourceElement.src.split("/").pop();

				const clickedVideoIndex = mediaList.findIndex((media) => media.video === clickedVideoSource);
				likeUnlikeMedia(clickedVideoIndex);
			}

			function likeUnlikeMedia(index: number) {
				if (!mediaList[index].isLiked) {
					mediaList[index].likes += 1;
					mediaList[index].isLiked = true;
					mediaLike.innerHTML = `${mediaList[index].likes} <i class="fa-solid fa-heart"></i>`;
				} else {
					mediaList[index].likes -= 1;
					mediaList[index].isLiked = false;
					mediaLike.innerHTML = `${mediaList[index].likes} <i class="fa-regular fa-heart"></i>`;
				}
				updatePhotographerInfoBar(mediaList);
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
