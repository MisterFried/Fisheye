import { PhotographerType, fetchData } from "./fetchData";

initialization();

//Initialize the page with every photographers profile
async function initialization() {
	const photographersArray = await fetchData("photographers") as Array<PhotographerType>;

	photographersArray.forEach((photographer: PhotographerType) => {
		const photographerCard = createPhotographerCard(photographer);
		document
			.querySelector(".photographers_section")
			?.appendChild(photographerCard);
	});
}

//Create an "article" HTMLElement with all infos about the photographer
function createPhotographerCard(photographer: PhotographerType) {
	const photographerCard = document.createElement("article");
	photographerCard.classList.add("photographer-card");

	const photographerImage = document.createElement("img");
	photographerImage.classList.add("photographer-card__image");
	photographerImage.setAttribute("src",
		`/Fisheye/images/photographers-profile-picture/${photographer.portrait}`
	);

	const photographerName = document.createElement("h2");
	photographerName.innerText = photographer.name;
	photographerName.classList.add("photographer-card__name");

	const photographerLink = document.createElement("a");
	photographerLink.setAttribute("href",
		`./src/pages/photographer.html?id=${photographer.id}`
	);
	photographerLink.classList.add("photographer-card__link");
	photographerLink.append(photographerImage, photographerName);

	const photographerLocation = document.createElement("h3");
	photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
	photographerLocation.classList.add("photographer-card__location");

	const photographerTagline = document.createElement("p");
	photographerTagline.innerText = photographer.tagline;
	photographerTagline.classList.add("photographer-card__tagline");

	const photographerPrice = document.createElement("p");
	photographerPrice.innerText = `${photographer.price}€/jour`;
	photographerPrice.classList.add("photographer-card__price");

	photographerCard.append(
		photographerLink,
		photographerLocation,
		photographerTagline,
		photographerPrice
	);

	return photographerCard;
}
