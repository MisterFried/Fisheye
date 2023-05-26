function displayModal(): void {
    const modal = document.querySelector("#modal-container") as HTMLElement;
	modal.style.display = "block";
}

function closeModal(): void {
    const modal = document.querySelector("#modal-container") as HTMLElement;
    modal.style.display = "none";
}
