export function addModalImages () {
    const photographerImages = document.querySelectorAll(".photographer-media__image");
    const imageModal = document.querySelector("#imageModalContainer") as HTMLDialogElement;
    const imageInModal = document.querySelector("#imageInModal") as HTMLImageElement;

    photographerImages.forEach(image => {
        console.log(image)
        const imageElement = image as HTMLImageElement
        imageElement.addEventListener("click",() => {
            console.log(`You clicked on ${imageElement.src}`);
            imageModal.showModal();
            imageInModal.setAttribute("src",imageElement.src)

            const modalAspectRatio = imageModal.offsetWidth / imageModal.offsetHeight
            const imageAspectRatio = imageInModal.naturalWidth / imageInModal.naturalHeight
            
            console.log(imageAspectRatio);
            console.log(modalAspectRatio);

            if (imageAspectRatio > modalAspectRatio) {
                imageInModal.style.width = "100%";
                imageInModal.style.height = "auto";
            }
            else {
                imageInModal.style.width = "auto";
				imageInModal.style.height = "100%";
            }

        })
    })
}

