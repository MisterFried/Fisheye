import"./style-ce8f4945.js";s();function s(){let o=new URLSearchParams(window.location.search).get("id");console.log(o),o?l(o):console.log("Error : no photographer ID")}async function l(t){const r=(await(await fetch("../../data/photographers.json")).json()).photographers,n=document.querySelector(".photographer__name"),a=document.querySelector(".photographer__location"),c=document.querySelector(".photographer__tagline"),i=document.querySelector(".photographer__image"),h=document.querySelector(".contact-modal__title");r.forEach(e=>{e.id.toString()===t&&(n.innerText=e.name,a.innerText=`${e.city}, ${e.country}`,c.innerText=e.tagline,i.setAttribute("src",`../../images/photographers-profile-picture/${e.portrait}`),h.innerText=`Contactez-moi ${e.name}`)})}const p=document.querySelector(".header__logo");p.addEventListener("click",()=>{window.location.href="./../../index.html"});