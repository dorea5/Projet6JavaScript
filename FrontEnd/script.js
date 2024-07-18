const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return await  answer.json();
 }
getWorks();



async function displayWorks () {
const arrayWorks = await getWorks();
arrayWorks.forEach((project) => {
  const figure= document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src= project.imageUrl;
  figcaption.innerHTML = project.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
console.log("ca marche");
});

}
displayWorks();


/*******affichage filtres***************** */

async function getCatergories(){
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCatergories();


async function Buttons() {
  const categories = await getCatergories();
  console.log(categories);

categories.forEach((category)  => {
const button = document.createElement("button");
button.innerHTML= category.name.toUpperCase();
button.id=category.id;
filters.appendChild(button);
})}

Buttons();


////filtrer///

async function filterCategories () {
  const AllWorks = await getWorks;
  

}

filterCategories();
