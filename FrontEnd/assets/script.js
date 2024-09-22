const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");

async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return await answer.json();
}

async function displayWorks() {
  const projects = await getWorks();
  projects.forEach((project) => {
    createProjects(project);
  });
}

function createProjects(project) {
  const figure = document.createElement("figure");
  figure.id = `figure_${project.id}`;
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = project.imageUrl;
  figcaption.textContent = project.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

//affichage filtres

async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCategories();

async function Buttons() {
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name.toUpperCase();
    btn.id = `category_${category.id}`;
    btn.classList.add("button_style");
    filters.appendChild(btn);
  });
}

Buttons();

//filtrer

async function filterCategories() {
  const AllWorks = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksfilteredcategory = AllWorks.filter((project) => {
          return project.categoryId == btnId;
        });

        worksfilteredcategory.forEach((project) => {
          createProjects(project);
        });
      } else {
        displayWorks();
      }
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

//token dans le localStorage
function isUserLoggedIn() {
  return localStorage.getItem("token") !== null;
}

//logout
function logout() {
  localStorage.removeItem("token");
}

//login
if (isUserLoggedIn()) {
  const banner = document.querySelector(".banner");
  banner.style.display = "inline-flex";
  lougout.textContent = "logout";
  modifier.textContent = "modifier";
  editicon.style.display = "inline-flex";
}

//affichage modale au logout

modifier.addEventListener("click", () => {
  containermodal.style.display = "inline-flex";
  modalgallery.style.display = "inline-flex";
});
//exit//
xmark.addEventListener("click", () => {
  containermodal.style.display = "none";
});

//affichage photos dans modale

async function DisplayPictures() {
  const AllWorks = await getWorks();
  AllWorks.forEach((work) => {
    const figure = document.createElement("figure");
    const span = document.createElement("span");
    const img = document.createElement("img");
    const trash = document.createElement("i");
    trash.classList.add("fa-solid", "fa-trash-can");
    trash.id = `trash_${work.id}`;
    trash.dataset.id = work.id;
    const token = localStorage.getItem("token");

    trash.addEventListener("click", (ev) => {
      const id_base = ev.target.dataset.id;
      deleteWorkById(id_base, token).then(() => {
        ev.target.closest("figure").remove();
        const figure_front = document.querySelector(`#figure_${id_base}`);
        figure_front.remove();
      });
    });

    img.src = work.imageUrl;
    span.appendChild(trash);
    figure.appendChild(span);
    figure.appendChild(img);
    pictures.appendChild(figure);
  });
}

//supprimer photo
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
  } catch (error) {
    console.error("Erreur :", error);
  }
}

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

// previsualisation de limage à ajouter
const view = document.querySelector(".container_photo img");
const inputmodal = document.querySelector(".container_photo input");
const labelmodal = document.querySelector(".container_photo label");
const inconmodal = document.querySelector(".container_photo  .fa-image");
const pmodal = document.querySelector(".container_photo p");

inputmodal.addEventListener("change", () => {
  const file = inputmodal.files[0];
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

//liste categories//
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
const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage

if (!token) {
  console.error("Token non trouvé. Assurez-vous d'être connecté.");
}

//ajouter une photo//
const form = document.querySelector(".modal_add_photo form");
const title = document.querySelector(".modal_add_photo title");
const category = document.querySelector(".modal_add_photo category");

async function postNewProject(formData) {
  try {
    const response = await fetch("http://localhost:5678/api/works/", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Erreur ${response.status}:${"Erreur lors de la suppression"}`
      );
    }
  } catch (error) {
    console.error("Erreur :", error);
  }

  const data = await response.json();

  const newPost = document.createElement("figure");
  const img = document.createElement("img");
  img.src = data.imageUrl;
  img.alt = data.title;
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = data.title;
  newPost.appendChild(img);
  newPost.appendChild(figcaption);
  pictures.appendChild(newPost);
  gallery.appendChild(newPost);
  form.reset();
}

function inputok() {
  const inputvalid = document.querySelector(".modal_add_photo button");
  const form = document.querySelector(".modal_add_photo form");

  // Fonction pour vérifier la validité des champs
  function checkFormValidity() {
    const formData = new FormData(form);

    // Vérifie si tous les champs requis sont remplis
    const isValid =
      formData.get("title") &&
      formData.get("category") &&
      formData.get("image");

    // Met à jour l'état du bouton
    if (isValid) {
      inputvalid.classList.add("valid");
      inputvalid.disabled = false;
    } else {
      inputvalid.classList.remove("valid");
      inputvalid.disabled = true;
    }
  }

  // Écouteurs d'événements pour les champs du formulaire
  form.addEventListener("input", checkFormValidity);
  form.addEventListener("change", checkFormValidity); // Vérifie les selects
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
