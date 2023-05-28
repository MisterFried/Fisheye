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

initialization();

async function initialization(): Promise<void> {
    const photographers = await getPhotographers();
    displayData(photographers);
};

async function getPhotographers(): Promise<Array<UserData>> {
    const pathDev = "./data/photographers.json"

    const fetchedData = await fetch(pathDev);
    const response: data = await fetchedData.json()
    const photographerResponse = response.photographers

    return (photographerResponse);
}

async function displayData(photographers: Array<UserData>): Promise<void> {
    const photographersSection = document.querySelector(".photographers_section") as HTMLElement;

    photographers.forEach((photographer) => {
        const userCardDOM = createUserProfileDOM(photographer);
        photographersSection.appendChild(userCardDOM);
    });
};

//TODO Change user with photographers
function createUserProfileDOM(user: UserData): HTMLElement {
    const userCard: HTMLElement = document.createElement("article");
    userCard.classList.add("user");

    const userLink: HTMLElement = document.createElement("a");
    userLink.setAttribute("href",`./src/html/photographer.html?id=${user.id}`);
    userLink.classList.add("user__link");

    const userImage: HTMLElement = document.createElement("img");
    userImage.classList.add("user__image");
    userImage.setAttribute("src", `./images/photographers-profile-picture/${user.portrait}`);
    userLink.appendChild(userImage);

    const userName: HTMLElement = document.createElement("h2");
    userName.innerText = user.name;
    userName.classList.add("user__name");
    userLink.appendChild(userName);

    const userLocation: HTMLElement = document.createElement("h3");
    userLocation.innerText = `${user.city}, ${user.country}`;
    userLocation.classList.add("user__location");

    const userTagline: HTMLElement = document.createElement("p");
    userTagline.innerText = user.tagline;
    userTagline.classList.add("user__tagline");

    const userPrice: HTMLElement = document.createElement("p");
    userPrice.innerText = `${user.price}€/jour`;
    userPrice.classList.add("user__price");
    
    userCard.appendChild(userLink);
    userCard.appendChild(userLocation);
    userCard.appendChild(userTagline);
    userCard.appendChild(userPrice)
    return (userCard);
}

const headerLogo = document.querySelector(".header__logo") as HTMLElement;
headerLogo.addEventListener ("click", () => {
    window.location.href = "./index.html"
})