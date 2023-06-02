import { fetchPhotographersData, PhotographerType } from "./fetchPhotographersData";

// * Initialize the page with every photographers profile
async function HomepageInitialization() {
	const data = await fetchPhotographersData();

	if (data) {
		const photographerSectionDOM = document.querySelector(
			".photographers_section"
		) as HTMLElement;
		const photographersData = data.photographers;
		photographersData.forEach((photographer) => {
			const photographerCard = createPhotographerCard(photographer);
			photographerSectionDOM.appendChild(photographerCard);
		});
	} else {
		console.log("Error during photographers' data fetching");
	}
}

// * Create an "article" HTMLElement with all infos about the photographer
function createPhotographerCard(photographer: PhotographerType) {
	const photographerCard = document.createElement("article");
	photographerCard.classList.add("photographer-card");

	const photographerImage = document.createElement("img");
	photographerImage.classList.add("photographer-card__image");
	photographerImage.setAttribute(
		"src",
		`/Fisheye/images/photographers-profile-picture/${photographer.portrait}`
	);
		photographerImage.setAttribute("alt", `photo de profil de ${photographer.name}`)

	const photographerName = document.createElement("h2");
	photographerName.classList.add("photographer-card__name");
	photographerName.innerText = photographer.name;

	// Link with querry parameters
	const photographerLink = document.createElement("a");
	photographerLink.classList.add("photographer-card__link");
	photographerLink.setAttribute(
		"href",
		`./src/pages/photographer.html?id=${photographer.id}`
	);
	photographerLink.append(photographerImage, photographerName);

	const photographerLocation = document.createElement("h3");
	photographerLocation.classList.add("photographer-card__location");
	photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;

	const photographerTagline = document.createElement("p");
	photographerTagline.classList.add("photographer-card__tagline");
	photographerTagline.innerText = photographer.tagline;

	const photographerPrice = document.createElement("p");
	photographerPrice.classList.add("photographer-card__price");
	photographerPrice.innerText = `${photographer.price}€/jour`;

	photographerCard.append(
		photographerLink,
		photographerLocation,
		photographerTagline,
		photographerPrice
	);

	return photographerCard;
}

HomepageInitialization();