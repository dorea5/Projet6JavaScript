const { forEach } = require("lodash");

const gallery = document.querySelector("main");


async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return await  answer.json();
 }
getWorks();



async function displayWorks () {
const arrayWorks = await getWorks();
arrayWorks.forEach((project) => {
  const design= document.createElement("design");
  const img = document.createElement("img");
  const text = document.createElement("text");
  img.src= project.imageUrl;
  text.textContent = project.title;
  design.classList.add("gallery img");
  design.appendChild(img);
  design.appendChild(text);
  gallery.appendChild(design);
console.log("ca marche");
});

}
displayWorks();




async function getCatergories(){
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCatergories();

