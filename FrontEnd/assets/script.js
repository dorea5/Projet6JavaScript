const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return await answer.json();
}
getWorks();



async function displayWorks() {
  const projects = await getWorks();
  projects.forEach((project) => {
    createprojects(project);
  });
}
displayWorks();

function createprojects(project) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = project.imageUrl;
  figcaption.textContent = project.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
  console.log("ca marche");
}





/*******affichage filtres***************** */

async function getCatergories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCatergories();


async function Buttons() {
  const categories = await getCatergories();
  console.log(categories);

  categories.forEach(category => {
    const btn = document.createElement("button");
    btn.textContent= category.name.toUpperCase();
    btn.id = category.id;
    btn.classList.add("button_style");
    filters.appendChild(btn);
  })
}

Buttons();


////filtrer///

async function filterCategories() {
  const AllWorks = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach(button => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = ""; /// suppression de la gallerie avant filtrage//
      if (btnId !== "0") {
        const worksfilteredcategory = AllWorks.filter(project => {
          return project.categoryId == btnId;
        });
        //tableau trié mais pas affiché//
        worksfilteredcategory.forEach(project => {
          createprojects(project);

        });
      }
      else {
        displayWorks();  //tous//
      }
      
    console.log(btnId);

  });
});
}


filterCategories();
