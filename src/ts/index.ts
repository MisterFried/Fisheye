import { fetchPhotographersData, PhotographerType } from "./fetchPhotographersData";

// * Initialize the page with every photographers profile
async function HomepageInitialization() {
	const data = await fetchPhotographersData();

	if (data) {
		const photographerSectionDOM = document.querySelector(".photographers_section");

		data.photographers.forEach((photographer) => {
			const photographerCard = createPhotographerCard(photographer);
			photographerSectionDOM?.appendChild(photographerCard);
		});
	} else {
		console.error("Error : photographers' data undefined");
	}
}

// * Create an "article" with all infos about the photographer
function createPhotographerCard(photographer: PhotographerType) {
	const photographerCard = document.createElement("article");
	photographerCard.classList.add("photographer-card");

	const photographerImage = document.createElement("img");
	photographerImage.classList.add("photographer-card__image");
	photographerImage.src = `/Fisheye/images/photographers-profile-picture/${photographer.portrait}`;
	photographerImage.alt = `Photo de profil de ${photographer.name}`;

	const photographerName = document.createElement("h2");
	photographerName.classList.add("photographer-card__name");
	photographerName.innerText = photographer.name;

	// Link with querry parameters
	const photographerLink = document.createElement("a");
	photographerLink.classList.add("photographer-card__link");
	photographerLink.href = `./src/pages/photographer.html?id=${photographer.id}`;
	photographerLink.ariaLabel = `Lien vers la page de ${photographer.name}`;
	photographerLink.append(photographerImage, photographerName);

	const photographerLocation = document.createElement("h3");
	photographerLocation.classList.add("photographer-card__location");
	photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;

	const photographerTagline = document.createElement("span");
	photographerTagline.classList.add("photographer-card__tagline");
	photographerTagline.innerText = photographer.tagline;

	const photographerPrice = document.createElement("span");
	photographerPrice.classList.add("photographer-card__price");
	photographerPrice.innerText = `${photographer.price}€/jour`;

	photographerCard.append(photographerLink, photographerLocation, photographerTagline, photographerPrice);

	return photographerCard;
}

HomepageInitialization();
