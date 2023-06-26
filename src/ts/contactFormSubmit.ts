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
const submitFormButton: HTMLButtonElement | null = document.querySelector(".contact-modal__button");
const contactModal: HTMLDialogElement | null = document.querySelector("#contactModal");

submitFormButton?.addEventListener("click", () => {
	const input: Array<HTMLInputElement> = Array.from(document.querySelectorAll(".contact-modal__text-input"));
	let userMessageState = true;
	let userMessage: UserMessage = {};

	// Check each input
	input.forEach((element) => {
		const errorMessage: HTMLSpanElement | null = document.querySelector(`#${element.name}-incorrect-input`); // Error message

		if (errorMessage) {
			switch (element.name) {
				case "firstname":
				case "lastname":
					nameRegex.test(element.value)
						? validateInput(element, errorMessage)
						: invalidateInput(errorMessage);
					break;

				case "email":
					emailRegex.test(element.value)
						? validateInput(element, errorMessage)
						: invalidateInput(errorMessage);
					break;

				case "message":
					element.value !== "" ? validateInput(element, errorMessage) : invalidateInput(errorMessage);
					break;
			}
		}
		else {
			console.error("Error message null")
		}
	});

	// Log the message if all inputs are valid
	if (userMessageState) {
		console.info(userMessage);
		contactModal?.close();

		//Reset input fields
		input.forEach((element) => {
			element.value = "";
		});
	}

	function validateInput(element: HTMLInputElement, errorMessage: HTMLSpanElement) {
		userMessage[element.name as keyof typeof userMessage] = element.value;
		errorMessage.style.display = "none";
	}

	function invalidateInput(errorMessage: HTMLSpanElement) {
		userMessageState = false;
		errorMessage.style.display = "inline";
	}
});
