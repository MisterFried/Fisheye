import { MediaType, PhotographerType, fetchPhotographersData } from "./fetchPhotographersData";

// * Initialize the page with the photographers' informations and media
async function photographerPageInitialization() {
	const photographerID = getPhotographerID();

	if (photographerID) {
		const data = await fetchPhotographersData();

		if (data) {
			const { photographers: photographersInfo, media: mediasInfo } = data;

			const photographerInfo = photographersInfo.find((photographer) => photographer.id === photographerID);
			const mediaList = mediasInfo.filter((media) => media.photographerId === photographerID);

			if (photographerInfo && mediaList) {
				orderMedia(mediaList, "popular");

				displayPhotographerInfo(photographerInfo);
				displayPhotographerInfoBar(mediaList, photographerInfo.price);
				displayPhotographerMedia(mediaList);

				// * Event listener to reordering media
				const orderButton = document.querySelector(".photographer-media__order-select") as HTMLSelectElement;
				orderButton.addEventListener("change", () => {
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

// * Factory design pattern (?) to display medias
function displayPhotographerMedia(mediaList: Array<MediaType>) {
	const mediaSection = document.querySelector(".photographer-media__container");

	mediaList.forEach((media) => {
		const mediaContainer = document.createElement("div");
		mediaContainer.classList.add("photographer-media__media-container");

		if (media.image) {
			const mediaElement = displayImage(media);
			mediaContainer.appendChild(mediaElement);
		}
		if (media.video) {
			const mediaElement = displayVideo(media);
			mediaContainer.appendChild(mediaElement);
		}
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
	imageButtonContainer.ariaLabel = `Clickez pour ouvrir "${image.title}" en grand`;

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
	videoButtonContainer.ariaLabel = `Clickez pour ouvrir "${video.title}" en grand`;

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

// * Update the number of likes on the photogrpahers' infobar
function updatePhotographerInfoBarLikes(mediaList: Array<MediaType>) {
	const infoBarLikes = document.querySelector(".photographer-info-bar__likes") as HTMLSpanElement;

	let totalLikes = 0;
	mediaList.forEach((media) => {
		totalLikes += media.likes;
	});
	infoBarLikes.innerHTML = `${totalLikes} <i class = "fa-solid fa-heart" aria-label="likes"></i>`;
}

// * Setup the modal when clicking on the images
function setupMediaModal(mediaList: Array<MediaType>) {
	const photographerMediaDOM: Array<HTMLButtonElement> = Array.from(
		document.querySelectorAll(
			".photographer-media__image-button-container, .photographer-media__video-button-container"
		)
	);
	const mediaModal = document.querySelector("#mediaModal") as HTMLDialogElement;
	const imageInModal = document.querySelector(".media-modal__image") as HTMLImageElement;
	const videoInModal = document.querySelector(".media-modal__video") as HTMLVideoElement;
	const videoSourceInModal = document.createElement("source");
	videoInModal.appendChild(videoSourceInModal);
	const mediaModalLegend = document.querySelector(".media-modal__legend") as HTMLSpanElement;
	const nextMediaButton = document.querySelector(".media-modal__next-icon") as HTMLElement;
	const previousMediaButton = document.querySelector(".media-modal__previous-icon") as HTMLElement;
	let mediaSource = "";
	let mediaType = "";
	let mediaRootPath = "";
	let mediaFile = "";
	let mediaFullPathArray: Array<string> = [];

	const nextMedia = () => scrollMediaModal(+1);
	const previousMedia = () => scrollMediaModal(-1);

	photographerMediaDOM.forEach((media) => {
		media.addEventListener("click", (event) => {
			mediaModal.showModal();
			const eventTarget = event.currentTarget as HTMLButtonElement;
			const mediaEventTarget = eventTarget.firstElementChild as HTMLImageElement | HTMLVideoElement;

			if (mediaEventTarget instanceof HTMLImageElement) {
				mediaType = "image";
				mediaSource = `${mediaEventTarget.src.slice(0, -13)}.webp`; //cut the "_resized" in filename
			} else if (mediaEventTarget instanceof HTMLVideoElement) {
				mediaType = "video";
				const clickedVideoSource = mediaEventTarget.firstElementChild as HTMLSourceElement;
				mediaSource = clickedVideoSource.src;
			}
			mediaFullPathArray = mediaSource.split("/");
			mediaFile = mediaFullPathArray.pop()!;
			mediaRootPath = mediaFullPathArray.join("/");

			displayMediaInModal(mediaType, mediaFile, mediaRootPath);

			nextMediaButton.addEventListener("click", nextMedia);
			previousMediaButton.addEventListener("click", previousMedia);
			document.addEventListener("keydown", keyboardNavMediaModal);
		});
	});

	function keyboardNavMediaModal(event: KeyboardEvent) {
		if (event.key === "ArrowLeft") {
			previousMediaButton.click();
		} else if (event.key === "ArrowRight") {
			nextMediaButton.click();
		}
	}

	function scrollMediaModal(direction: number) {
		let mediaToDisplayNext = "";

		// Check if the currrent media is an image or a video and get its source
		if (imageInModal.style.display === "block" && videoInModal.style.display === "none") {
			mediaFullPathArray = imageInModal.src.split("/");
		}
		if (imageInModal.style.display === "none" && videoInModal.style.display === "block") {
			mediaFullPathArray = videoSourceInModal.src.split("/");
		}

		mediaFile = mediaFullPathArray.pop()!;
		mediaRootPath = mediaFullPathArray.join("/");

		// Get the index of the current media
		let currentMediaDisplayedIndex = mediaList.findIndex(
			(media) => media.image === mediaFile || media.video === mediaFile
		)!;

		// Infinite scroll
		if (currentMediaDisplayedIndex + direction <= -1) {
			currentMediaDisplayedIndex = mediaList.length;
		} else if (currentMediaDisplayedIndex + direction >= mediaList.length) {
			currentMediaDisplayedIndex = -1;
		}

		// Get the next media to display
		if (mediaList[currentMediaDisplayedIndex + direction].image) {
			mediaType = "image";
			mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + direction].image!;
		} else if (mediaList[currentMediaDisplayedIndex + direction].video) {
			mediaType = "video";
			mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + direction].video!;
		}

		displayMediaInModal(mediaType, mediaToDisplayNext, mediaRootPath);
	}

	// ! * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// TODO FIX VIDEO NOT DISPLAYING CORRECLY INSIDE THE MODAL
	// ! * * * * * * * * * * * * * * * * * * * * * * * * * * *
	// Display the media inside the modal
	function displayMediaInModal(mediaType: string, mediaFile: string, mediaRootPath: string) {
		let mediaName = "";
		switch (mediaType) {
			case "image":
				imageInModal.style.display = "block";
				videoInModal.style.display = "none";
				mediaName = mediaList.find((media) => media.image === mediaFile)!.title;
				imageInModal.src = `${mediaRootPath}/${mediaFile}`;
				imageInModal.alt = `Photo : ${mediaName}`;
				break;

			case "video":
				imageInModal.style.display = "none";
				videoInModal.style.display = "block";
				mediaName = mediaList.find((media) => media.video === mediaFile)!.title;
				videoSourceInModal.src = `${mediaRootPath}/${mediaFile}`;
				break;
		}
		mediaModalLegend.innerText = mediaName;
	}

	// Reset the media sources when the modal is closed
	mediaModal.addEventListener("close", () => {
		imageInModal.src = "#";
		imageInModal.style.display = "none";
		videoSourceInModal.src = "#";
		videoInModal.style.display = "none";

		// Prevent duplicate event listener
		nextMediaButton.removeEventListener("click", nextMedia);
		previousMediaButton.removeEventListener("click", previousMedia);
		document.removeEventListener("keydown", keyboardNavMediaModal);
	});
}

// * Reorder the list of media
function orderMedia(mediaList: Array<MediaType>, sortMethod: string) {
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

// * Clear all the media
function clearMedia() {
	const mediaSection = document.querySelector(".photographer-media__container") as HTMLDivElement;
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
			const target = event.currentTarget as HTMLSpanElement;

			// DOM element corresponding to the clicked legend (image or video)
			const mediaElement = target.parentElement!.parentElement!.firstElementChild!.firstElementChild as
				| HTMLImageElement
				| HTMLVideoElement;

			if (mediaElement instanceof HTMLImageElement) {
				const resizedImageName = mediaElement.src.split("/").pop()!;
				const clickedImageName = resizedImageName.slice(0, -13);

				const clickedImageIndex = mediaList.findIndex(
					(media) => media.image?.slice(0, -5) === clickedImageName
				);
				likeUnlikeMedia(clickedImageIndex);
			} else if (mediaElement instanceof HTMLVideoElement) {
				const videoSourceElement = mediaElement.firstChild as HTMLSourceElement;
				const clickedVideoSource = videoSourceElement.src.split("/").pop()!;

				const clickedVideoIndex = mediaList.findIndex((media) => media.video === clickedVideoSource);
				likeUnlikeMedia(clickedVideoIndex);
			}

			function likeUnlikeMedia(index: number) {
				if (!mediaList[index].isLiked) {
					mediaList[index].likes += 1;
					mediaList[index].isLiked = true;
					mediaLike.innerHTML = `${mediaList[index].likes} <i class="fa-solid fa-heart" aria-label="likes" ></i>`;
				} else {
					mediaList[index].likes -= 1;
					mediaList[index].isLiked = false;
					mediaLike.innerHTML = `${mediaList[index].likes} <i class="fa-regular fa-heart" aria-label="likes" ></i>`;
				}
				updatePhotographerInfoBarLikes(mediaList);
			}
		});
	});
}

photographerPageInitialization();
