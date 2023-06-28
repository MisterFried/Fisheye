import { MediaType } from "../interfaces/interfaces";

// * Setup the event listener to open the modal when clicking on the media
export function setupMediaModal(mediaList: Array<MediaType>) {
	const photographerMediaDOM: Array<HTMLButtonElement> = Array.from(
		document.querySelectorAll(
			".photographer-media__image-button-container, .photographer-media__video-button-container"
		)
	);
	const mediaModal = document.querySelector("#mediaModal") as HTMLDialogElement;
	const imageInModal = document.querySelector(".media-modal__image") as HTMLImageElement;
	const videoInModal = document.querySelector(".media-modal__video") as HTMLVideoElement;
	const videoSourceInModal = document.querySelector(".media-modal__video-source") as HTMLSourceElement;
	const mediaModalLegend = document.querySelector(".media-modal__legend") as HTMLSpanElement;
	const nextMediaButton = document.querySelector(".media-modal__next-icon") as HTMLElement;
	const previousMediaButton = document.querySelector(".media-modal__previous-icon") as HTMLElement;
	let mediaSource = "";
	let mediaType = "";
	let mediaBasePath = "";
	let mediaFile = "";
	let mediaFullPathArray: Array<string> = [];

	// * Add the event listener on each media button
	photographerMediaDOM.forEach((media) => {
		media.addEventListener("click", (event) => {
			mediaModal.showModal();
			const eventTarget = event.currentTarget as HTMLButtonElement;
			const mediaEventTarget = eventTarget.firstElementChild as HTMLImageElement | HTMLVideoElement; // Get the corresponding media

			// * Get the source of the media
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
			mediaBasePath = mediaFullPathArray.join("/");

			displayMediaInModal(mediaType, mediaFile, mediaBasePath);

			// * Keyboard navigation + scroll button event listener setup once the modal is opened
			nextMediaButton.addEventListener("click", nextMedia);
			previousMediaButton.addEventListener("click", previousMedia);
			document.addEventListener("keydown", keyboardNavMediaModal);
		});
	});

	// * Display the media inside the modal
	const displayMediaInModal = (mediaType: string, mediaFile: string, mediaBasePath: string) => {
		let mediaName = "";
		switch (mediaType) {
			case "image": // Show the image + reset video src and hide it
				videoInModal.style.display = "none";
				videoSourceInModal.src = "";
				imageInModal.style.display = "block";
				mediaName = mediaList.find((media) => media.image === mediaFile)!.title; // find the name of the image to display in the mediaList
				imageInModal.src = `${mediaBasePath}/${mediaFile}`;
				imageInModal.alt = `Photo : ${mediaName}`;
				break;

			case "video": // Show the video + reset image src and hide it
				imageInModal.style.display = "none";
				imageInModal.src = "";
				imageInModal.alt = "";
				videoInModal.style.display = "block";
				mediaName = mediaList.find((media) => media.video === mediaFile)!.title; // find the name of the video to display in the mediaList
				videoSourceInModal.src = `${mediaBasePath}/${mediaFile}`;
				videoInModal.load();
				break;

			default:
				console.error(`Error : ${mediaType} media type not recognized`);
		}
		mediaModalLegend.innerText = mediaName;
	};

	const nextMedia = () => scrollMediaModal(+1); // Scroll +1 media
	const previousMedia = () => scrollMediaModal(-1); // Scroll -1 media

	// * Change the media inside the modal to display the previous / next one
	const scrollMediaModal = (direction: number) => {
		let mediaToDisplayNext = "";

		// * Check if the currrent media is an image or a video and get its source
		if (imageInModal.style.display === "block" && videoInModal.style.display === "none") {
			mediaFullPathArray = imageInModal.src.split("/");
		}
		if (imageInModal.style.display === "none" && videoInModal.style.display === "block") {
			mediaFullPathArray = videoSourceInModal.src.split("/");
		}

		mediaFile = mediaFullPathArray.pop()!;
		mediaBasePath = mediaFullPathArray.join("/");

		// * Get the index of the current media
		let currentMediaDisplayedIndex = mediaList.findIndex(
			(media) => media.image === mediaFile || media.video === mediaFile
		)!;

		// * Infinite scroll
		if (currentMediaDisplayedIndex + direction <= -1) {
			currentMediaDisplayedIndex = mediaList.length;
		} else if (currentMediaDisplayedIndex + direction >= mediaList.length) {
			currentMediaDisplayedIndex = -1;
		}

		// * Get the next media to display and its type
		if (mediaList[currentMediaDisplayedIndex + direction].image) {
			mediaType = "image";
			mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + direction].image!;
		} else if (mediaList[currentMediaDisplayedIndex + direction].video) {
			mediaType = "video";
			mediaToDisplayNext = mediaList[currentMediaDisplayedIndex + direction].video!;
		}

		displayMediaInModal(mediaType, mediaToDisplayNext, mediaBasePath);
	};

	// * Keyboard navigation when pressing left and right arrow to scroll
	const keyboardNavMediaModal = (event: KeyboardEvent) => {
		if (event.key === "ArrowLeft") {
			previousMediaButton.click();
		}
		if (event.key === "ArrowRight") {
			nextMediaButton.click();
		}
	};

	// * Reset the media sources when the modal is closed
	mediaModal.addEventListener("close", () => {
		imageInModal.src = "#";
		imageInModal.style.display = "none";
		videoSourceInModal.src = "#";
		videoInModal.style.display = "none";

		// * Clear event listeners to prevent duplicate when reopening the modal
		nextMediaButton.removeEventListener("click", nextMedia);
		previousMediaButton.removeEventListener("click", previousMedia);
		document.removeEventListener("keydown", keyboardNavMediaModal);
	});
}
