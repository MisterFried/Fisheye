import { fetchData } from "./fetchData"; //Function to fetch photographers.json
import { PhotographerType } from "./fetchData"; //Photographer object type interface 

initialization();

//Initialize the page with every photographers profile
async function initialization() {
	const photographersSection = document.querySelector(".photographers_section") as HTMLElement;
    const photographersArray = await fetchData();

	photographersArray.forEach((photographer) => {
		const photographerCard = createPhotographerCard(photographer);
		photographersSection.appendChild(photographerCard);
	});
};

//Create an "article" HTMLElement with all infos about the photographer
function createPhotographerCard(photographer: PhotographerType) {
	const photographerCard = document.createElement("article");
	photographerCard.classList.add("photographer-card");

	const photographerImage = document.createElement("img");
	photographerImage.classList.add("photographer-card__image");
	photographerImage.setAttribute("src",`/images/photographers-profile-picture/${photographer.portrait}`);
    
	const photographerName = document.createElement("h2");
	photographerName.innerText = photographer.name;
	photographerName.classList.add("photographer-card__name");
    
	const photographerLink = document.createElement("a");
	photographerLink.setAttribute("href",`./src/pages/photographer.html?id=${photographer.id}`);
	photographerLink.classList.add("photographer-card__link");
	photographerLink.appendChild(photographerImage);
	photographerLink.appendChild(photographerName);

	const photographerLocation = document.createElement("h3");
	photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
	photographerLocation.classList.add("photographer-card__location");

	const photographerTagline = document.createElement("p");
	photographerTagline.innerText = photographer.tagline;
	photographerTagline.classList.add("photographer-card__tagline");

	const photographerPrice = document.createElement("p");
	photographerPrice.innerText = `${photographer.price}€/jour`;
	photographerPrice.classList.add("photographer-card__price");

	photographerCard.appendChild(photographerLink);
	photographerCard.appendChild(photographerLocation);
	photographerCard.appendChild(photographerTagline);
	photographerCard.appendChild(photographerPrice);
	return photographerCard;
}