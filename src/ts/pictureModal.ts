// TODO : Refactor and clean up code

export function addModalImages() {
	const photographerImages = document.querySelectorAll(
		".photographer-media__image"
	);
	const imageModal = document.querySelector(
		"#imageModalContainer"
	) as HTMLDialogElement;
	const imageInModal = document.querySelector(
		".image-modal"
	) as HTMLImageElement;

	// const pathToImage = `/Fisheye/images/photographers-media/${image.photographerId}/${image.image}`;
	// const pathToResizedImage = pathToImage.slice(0, -5) + "_resized.webp";

	photographerImages.forEach((image) => {
		const imageElement = image as HTMLImageElement;
		const pathToResizedImage = imageElement.src;
		const pathToImage = pathToResizedImage.slice(0, -13) + ".webp";
		imageElement.addEventListener("click", () => {
			imageModal.showModal();
			imageInModal.setAttribute("src", pathToImage);

			const modalAspectRatio =
				imageModal.offsetWidth / imageModal.offsetHeight;
			const imageAspectRatio =
				imageInModal.naturalWidth / imageInModal.naturalHeight;

			if (imageAspectRatio > modalAspectRatio) {
				imageInModal.style.width = "100%";
				imageInModal.style.height = "auto";
			} else {
				imageInModal.style.width = "auto";
				imageInModal.style.height = "100%";
			}
		});
	});

	imageModal.addEventListener("cancel", () => {
		imageInModal.setAttribute("src", "#");
	});
}
