//*** Open & Close the contact form from the photographe page ***/
//DOM
const displayModalButton = document.querySelector(
	".photographer-presentation__contact-button"
) as HTMLElement;
const closeModalButton = document.querySelector(".contact-modal__close-icon") as HTMLElement;
const modalContainer = document.querySelector("#modal-container") as HTMLElement;
const contactModal = document.querySelector(".contact-modal") as HTMLElement;

//Event listener
displayModalButton.addEventListener("click", displayModal);
closeModalButton.addEventListener("click", closeModal);
modalContainer.addEventListener("click", closeModal);
contactModal.addEventListener("click",(e) => e.stopPropagation());

//Display modal
function displayModal(): void {
	modalContainer.style.display = "block";
}

//Close modal
function closeModal(): void {
    modalContainer.style.display = "none";
}