const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return await answer.json();
}

async function displayWorks() {
  const projects = await getWorks();
  projects.forEach((project) => {
    createprojects(project);
  });
}

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

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCategories();

async function Buttons() {
  const categories = await getCategories();
  console.log(categories);

  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name.toUpperCase();
    btn.id = category.id;
    btn.classList.add("button_style");
    filters.appendChild(btn);
  });
}

Buttons();

////filtrer///

async function filterCategories() {
  const AllWorks = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = ""; /// suppression de la gallerie avant filtrage//
      if (btnId !== "0") {
        const worksfilteredcategory = AllWorks.filter((project) => {
          return project.categoryId == btnId;
        });
        //tableau trié mais pas affiché//
        worksfilteredcategory.forEach((project) => {
          createprojects(project);
        });
      } else {
        displayWorks(); //tous//
      }

      console.log(btnId);
    });
  });
}

filterCategories();

const xmark = document.querySelector(".container_modal .fa-xmark");
const containermodal = document.querySelector(".container_modal");
const editicon = document.querySelector(".edit_icon");
const modifier = document.querySelector(" .modifier");
const loged = window.sessionStorage.loged;
const lougout = document.querySelector("header nav .logout");
const pictures = document.querySelector(".pictures");

function isUserLoggedIn() {
  // Vérifier la présence du token dans le localStorage
  return localStorage.getItem("token") !== null;
}

// Fonction de déconnexion (logout)
function logout() {
  localStorage.removeItem("token");
}

// si lutilisation est connecté
if (isUserLoggedIn()) {
  console.log("Utilisateur connecté");
  lougout.textContent = "logout";
  modifier.textContent = "modifier";
  editicon.style.display = "inline-flex";
} else {
  console.log("Utilisateur déconnecté");
}

// Déconnexion
//logout();

//affichage modale quand connecté//

modifier.addEventListener("click", () => {
  containermodal.style.display = "inline-flex";
  modalgallery.style.display = "inline-flex";
});
//exit//
xmark.addEventListener("click", () => {
  containermodal.style.display = "none";
});

//affichage photos dans modale//

async function DisplayPictures() {
  const AllWorks = await getWorks();
  AllWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const span = document.createElement("span");
    const img = document.createElement("img");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = work.id;
    img.src = work.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    pictures.appendChild(figure);
  });
}

//suppression image modale// //ALLER DANS LE DOM CHERCHER ELEMENT ET EFFACER//

// function deleteworks() {
//   const trashALL = document.querySelectorAll(
//     " .modal_gallery .fa-solid .fa-trash-can"
//   );
//   const token = localStorage.getItem("token");
//   trashALL.forEach((trash) => {
//     trash.addEventListener("click", (e) => {
//       const id = trash.id;
//       const init = {
//         method: "DELETE",
//         headers: {
//           "content-Type": "application/json",
//           Authorization: "Bearer " + token,
//         },
//       };
//       fetch("http://localhost:5678/api/works/" + id, init)
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error("Erreur de suppression");
//           }

//           return response.json();
//         })
//         .then((data) => {
//           console.log("delete reussi", data);
//         })
//         .catch((error) => {
//           console.error("erreur", error);
//         });
//     });
//   });
// }
// deleteworks();
//faire apparaitre deuxieme modale//

function deleteWorks() {
  const trashIcons = document.querySelectorAll(".fa-trash-can");
  const token = localStorage.getItem("token");

  trashIcons.forEach((trash) => {
    trash.addEventListener("click", () => {
      const id = trash.id;
      deleteWorkById(id, token);
    });
  });
}

async function deleteWorkById(id, token) {
  const init = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, init);

    if (!response.ok) {
      throw new Error("Échec de la suppression");
    }

    const data = await response.json();
    console.log("La suppression a réussi :", data);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

deleteWorks();

const btnaddmodal = document.querySelector(".container_modal .add_photo");
const modaladdphotos = document.querySelector(".modal_add_photo");
const modalgallery = document.querySelector(".modal_gallery");
const arrowleft = document.querySelector(".fa-arrow-left");
const addclose = document.querySelector(".modal_add_photo .fa-xmark");

function displayaddmodal() {
  btnaddmodal.addEventListener("click", () => {
    modaladdphotos.style.display = "inline-flex";
    modalgallery.style.display = "none";
  });
  arrowleft.addEventListener("click", () => {
    modaladdphotos.style.display = "none";
    modalgallery.style.display = "flex";
  });
  addclose.addEventListener("click", () => {
    containermodal.style.display = "none";
  });
}
displayaddmodal();
// previsualisation de limage à ajouter//
const view = document.querySelector(".container_photo img");
const inputmodal = document.querySelector(".container_photo input");
const labelmodal = document.querySelector(".container_photo label");
const inconmodal = document.querySelector(".container_photo  .fa-image");
const pmodal = document.querySelector(".container_photo p");

inputmodal.addEventListener("change", () => {
  const file = inputmodal.files[0];
  console.log(file);
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      view.src = e.target.result;
      view.style.display = "flex";
      labelmodal.style.display = "none";
      inconmodal.style.display = "none";
      pmodal.style.display = "none";
    };
    reader.readAsDataURL(file);
  }
});

//LISTE CATEGORIES DANS INPUT//
async function categoriesadd() {
  const select = document.querySelector(".modal_add_photo select");
  const categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}
categoriesadd();

//post pour ajouter une photo/
const form = document.querySelector(".modal_add_photo form");
const title = document.querySelector(".modal_add_photo #title");
const category = document.querySelector(".modal_add_photo #category");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  fetch("http://localhost:5678/api/works/", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: "Bearer" + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("ajout reussi:", data);
    });
});

//valider input//
function inputok() {
  const inputvalid = document.querySelector(".modal_add_photo button");
  form.addEventListener("input", () => {
    if (title.value !== "" && category.value !== "" && form.value !== "") {
      inputvalid.classList.add("valid");
    } else {
      inputvalid.classList.remove("valid");
      inputvalid.disabled = true;
    }
  });
}
inputok();

function main() {
  getWorks();
  displayWorks();
  DisplayPictures();
  containermodal.addEventListener("click", (event) => {
    if (event.target === containermodal) {
      containermodal.style.display = "none";
      modalgallery.style.display = "none";
      modaladdphotos.style.display = "none";
    }
  });
}

main();
