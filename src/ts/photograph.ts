interface UserData {
    name: string,
    id: number,
    city: string,
    country: string,
    tagline: string,
    price: number,
    portrait: string
}

interface data {
    photographers: Array<UserData>,
    media: Array<Object>
}

getPhotographerID();

function getPhotographerID() {
    let urlParameters = new URLSearchParams(window.location.search);
    let photographerID = urlParameters.get("id");
    console.log(photographerID);


    (photographerID)
    ? displayPhotographerInfo(photographerID)
    : console.log("Error : no photographer ID");
}

async function displayPhotographerInfo(ID: string) {
    const fetchedData = await fetch("../../data/photographers.json");
    const response: data = await fetchedData.json()
    const photographersInfo: Array<UserData> =response.photographers

    const photographerName = document.querySelector(".photographer__name") as HTMLElement
    const photographerLocation = document.querySelector(".photographer__location") as HTMLElement
    const photographerTagline = document.querySelector(".photographer__tagline") as HTMLElement
    const photographerImage = document.querySelector(".photographer__image") as HTMLElement
    const photographerContactheader = document.querySelector(".contact-modal__title") as HTMLElement

    photographersInfo.forEach((photograph) => {
        if (photograph.id.toString() === ID) {
            photographerName.innerText = photograph.name;
            photographerLocation.innerText = `${photograph.city}, ${photograph.country}`;
            photographerTagline.innerText = photograph.tagline;
            photographerImage.setAttribute("src", `../../images/photographers-profile-picture/${photograph.portrait}`);
            photographerContactheader.innerText = `Contactez-moi ${photograph.name}`;
        }
    })
}

const headerLogo2 = document.querySelector(".header__logo") as HTMLElement;
headerLogo2.addEventListener ("click", () => {
    window.location.href = "./../../index.html"
})