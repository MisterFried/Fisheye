import { fetchData } from "./fetchData";

getPhotographerID();

//Retrieve the photographer's ID via URL querry parameters
function getPhotographerID() {
    const urlParameters = new URLSearchParams(window.location.search);
    const photographerID = urlParameters.get("id");

    (photographerID)
    ? displayPhotographerInfo(photographerID)
    : console.log("Error : no photographer ID");
}

//Display informations about the photographer
async function displayPhotographerInfo(ID: string) {
    const photographerName = document.querySelector(".photographer__name") as HTMLElement
    const photographerLocation = document.querySelector(".photographer__location") as HTMLElement
    const photographerTagline = document.querySelector(".photographer__tagline") as HTMLElement
    const photographerImage = document.querySelector(".photographer__image") as HTMLElement
    const ContactFormHeader = document.querySelector(".contact-modal__title") as HTMLElement
    
    const photographersArray = await fetchData();

    photographersArray.forEach((photographer) => {
		if (photographer.id.toString() === ID) {
			photographerName.innerText = photographer.name;
			photographerLocation.innerText = `${photographer.city}, ${photographer.country}`;
			photographerTagline.innerText = photographer.tagline;
			photographerImage.setAttribute("src",`/images/photographers-profile-picture/${photographer.portrait}`);
			ContactFormHeader.innerText = `Contactez-moi ${photographer.name}`;
		}
	});
}

//Header Logo redirect to homepage
const headerLogo = document.querySelector(".header__logo") as HTMLElement;
headerLogo.addEventListener ("click", () => {window.location.href = "/index.html"})
