// Type interface for the user message object
interface UserMessage {
	firstname?: string;
	lastname?: string;
	email?: string;
	message?: string;
}

// Regex for firstname/lastname and email verification
const nameRegex = /^[a-z,A-Z]+(([\-,', ])?[a-z,A-Z])*$/;
const emailRegex = /^[a-z,A-Z,0-9]+([\-,.,_]?[a-z,A-Z,0-9]+)*@{1}[a-z,A-Z]{2,}\.{1}[a-z,A-Z]{2,}$/;

// * Form submit handler
const submitFormButton = document.querySelector(".contact-modal__button") as HTMLButtonElement;
const contactModal = document.querySelector("#contactModal") as HTMLDialogElement;

submitFormButton.addEventListener("click", () => {
	const input: Array<HTMLInputElement> = Array.from(document.querySelectorAll(".contact-modal__text-input"));
	let userMessageState = true;
	let userMessage: UserMessage = {};

	// Check each input
	input.forEach((element) => {
		const message = document.querySelector(`#${element.name}-incorrect-input`) as HTMLSpanElement; // Error message

		switch (element.name) {
			case "firstname":
			case "lastname":
				nameRegex.test(element.value) ? validateInput(element, message) : invalidateInput(message);
				break;

			case "email":
				emailRegex.test(element.value) ? validateInput(element, message) : invalidateInput(message);
				break;

			case "message":
				element.value !== "" ? validateInput(element, message) : invalidateInput(message);
				break;
		}
	});

	// Log the message if all inputs are valid
	if (userMessageState) {
		console.log(userMessage);
		contactModal.close();
		//Reset input fields
		input.forEach((element) => {
			element.value = "";
		});
	}

	function validateInput(element: HTMLInputElement, message: HTMLSpanElement) {
		userMessage[element.name as keyof typeof userMessage] = element.value;
		message.style.display = "none";
	}

	function invalidateInput(message: HTMLSpanElement) {
		userMessageState = false;
		message.style.display = "inline";
	}
});
