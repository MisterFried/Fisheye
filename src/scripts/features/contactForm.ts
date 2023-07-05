import { UserMessage } from "../interfaces/interfaces";

// * Regex for firstname/lastname and email verification
const nameRegex = /^[a-z,A-Z]+(([-,', ])?[a-z,A-Z])*$/;
const emailRegex = /^[a-z,A-Z,0-9]+([-,.,_]?[a-z,A-Z,0-9]+)*@{1}[a-z,A-Z]{2,}\.{1}[a-z,A-Z]{2,}$/;

// * Form submit handler
const submitFormButton = document.querySelector(".contact-modal__button");
const contactModal = document.querySelector("#contactModal") as HTMLDialogElement;

submitFormButton?.addEventListener("click", () => {
	const userInputs: Array<HTMLInputElement> = Array.from(document.querySelectorAll(".contact-modal__text-input"));
	let userMessageState = true; // true = all inputs are valid - False = at least one input is invalid
	const userMessage: UserMessage = {};

	// * Test each input
	userInputs.forEach(input => {
		// Querry the corresponding error message
		const errorMessage: HTMLSpanElement | null = document.querySelector(`#${input.name}-incorrect-input`);
		if (errorMessage) {
			switch (input.name) {
				case "firstname":
				case "lastname":
					nameRegex.test(input.value) ? validateInput(input, errorMessage) : invalidateInput(errorMessage);
					break;

				case "email":
					emailRegex.test(input.value) ? validateInput(input, errorMessage) : invalidateInput(errorMessage);
					break;

				case "message":
					input.value !== "" ? validateInput(input, errorMessage) : invalidateInput(errorMessage);
					break;
				default:
					break;
			}
		} else console.error("Error message null");
	});

	// * Log the message if all userInputs are valid
	if (userMessageState) {
		console.info(userMessage);
		contactModal.close();

		// * Reset inputs
		userInputs.forEach(input => (input.value = ""));
	}

	// * Validate the input and add it to the userMessage object
	function validateInput(element: HTMLInputElement, errorMessage: HTMLSpanElement) {
		userMessage[element.name as keyof typeof userMessage] = element.value;
		errorMessage.style.display = "none";
	}

	// * Invalidate the input
	function invalidateInput(errorMessage: HTMLSpanElement) {
		userMessageState = false;
		errorMessage.style.display = "inline";
	}
});
