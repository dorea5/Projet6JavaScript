// Sélecteurs DOM
const gallery = document.querySelector(".gallery");
const filters = document.querySelector(".filters");
const form = document.querySelector(".addform form");
const title = document.querySelector(".addform title");
const category = document.querySelector(".addform category");
const xmark = document.querySelector(".container_modal .fa-xmark");
const containermodal = document.querySelector(".container_modal");
const editicon = document.querySelector(".edit_icon");
const modifier = document.querySelector(" .modifier");
const logoutbtn = document.querySelector("header nav .logout");
const pictures = document.querySelector(".pictures");
const addform = document.querySelector(".container_modal .addform");
const btnaddform = document.querySelector(".container_modal .add_photo");
const modalgallery = document.querySelector(".modal_gallery");
const galleryTitle = document.querySelector(".galerie_photo");
const arrowleft = document.querySelector(".fa-arrow-left");
const addclose = document.querySelector(".addform .fa-xmark");
const view = document.querySelector(".container_photo img");
const inputmodal = document.querySelector(".container_photo input");
const labelmodal = document.querySelector(".container_photo label");
const inconmodal = document.querySelector(".container_photo  .fa-image");
const pmodal = document.querySelector(".container_photo p");
const btnvalidation = document.querySelector(".container_modal .bouton");

// Récupération des oeuvres depuis l'API pour les afficher
async function getWorks() {
  const answer = await fetch("http://localhost:5678/api/works");
  return await answer.json();
}

// Affichage des oeuvres : Pour chaque projet, crée un élément graphique
async function displayWorks() {
  const projects = await getWorks();
  projects.forEach((project) => {
    createProjects(project);
  });
}

// Crée un élément projet: Génère un élément figure pour afficher une oeuvre
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

// Récupération des catégories: Récupère les catégories depuis l'API
async function getCategories() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

//,Affichage des boutons filtres : Crée un bouton pour chaque catégorie
async function buttons() {
  const categories = await getCategories();
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name.toUpperCase();
    btn.id = `category_${category.id}`;
    console.log(btn.id);
    btn.classList.add("button_style");
    filters.appendChild(btn);
  });
}

// Filtres: Ajoute des écouteurs d'événements aux boutons pour filtrer les oeuvres
async function filterCategories() {
  const allWorks = await getWorks();
  const buttons = document.querySelectorAll(".filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      console.log("ID du bouton cliqué :", btnId);
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const worksfilteredcategory = allWorks.filter((project) => {
          return project.categoryId == btnId.split("_")[1];
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

// Vérifie si l'utilisateur est connecté: Renvoie vrai si token est présent
function isUserLoggedIn() {
  return localStorage.getItem("token") !== null;
}

// Déconnexion : Supprime le token de localStorage
function logout() {
  localStorage.removeItem("token");
  window.location.replace("http://localhost:5678");
}

// Vérification de la connexion : Si l'utilisateur est connecté, affiche certains éléments
if (isUserLoggedIn()) {
  const banner = document.querySelector(".banner");
  banner.style.display = "inline-flex";
  logoutbtn.textContent = "logout";
  modifier.textContent = "modifier";
  editicon.style.display = "inline-flex";
  filters.style.display = "none";
} else {
  // Affichage pour les utilisateurs déconnectés
  const banner = document.querySelector(".banner");
  banner.style.display = "none"; // Masquer la bannière
  logoutbtn.textContent = "Login"; // Changer le texte du bouton
  modifier.style.display = "none"; // Masquer le bouton de modification
  editicon.style.display = "none"; // Masquer l'icône d'édition
  filters.style.display = "inline-flex"; // Afficher les filtres
}

//Affichage de la modale galerie : Ouvre la modale pour afficher la galerie
modifier.addEventListener("click", () => {
  containermodal.style.display = "inline-flex";
  modalgallery.style.display = "inline-flex";
  addform.style.display = "none";
  pictures.style.display = "flex";
  galleryTitle.style.display = "flex";
  btnaddform.style.display = "flex";
  xmark.style.display = "flex";
});

// Fermeture de la modale : Cache la modale lorsque l'utilisateur clique sur la croix
xmark.addEventListener("click", () => {
  containermodal.style.display = "none";
});

// Fermeture de la modale en cliquant à côté
containermodal.addEventListener("click", (event) => {
  if (event.target === containermodal) {
    containermodal.style.display = "none";
    modalgallery.style.display = "none";
  }
});

// Création d'un élément projet dans la modale galerie : Crée un projet avec une option de suppression
function createDeleteModalProject(work) {
  const figure = document.createElement("figure");
  const span = document.createElement("span");
  const img = document.createElement("img");
  const trash = document.createElement("i");
  trash.classList.add("fa-solid", "fa-trash-can");
  trash.id = `trash_${work.id}`;
  trash.dataset.id = work.id;
  const token = localStorage.getItem("token");

  // Ecouteur pour supprimer l'oeuvre
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
}

// Affichage des photos dans la modale galerie : Affiche toutes les oeuvres dans la modale
async function displayPictures() {
  const allWorks = await getWorks();
  allWorks.forEach((work) => {
    createDeleteModalProject(work);
  });
}

// Suppression d'une photo : Envoie une requête DELETE à l'API pour supprimer une oeuvre
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

// Affichage du formulaire d'ajout : Gère l'affichage du formulaire et la navigation
function displayaddform() {
  btnaddform.addEventListener("click", () => {
    pictures.style.display = "none";
    galleryTitle.style.display = "none";
    btnaddform.style.display = "none";
    addform.style.display = "flex";
    xmark.style.display = "none";
    arrowleft.style.display = "flex";
  });
  // Gestion du RETOUR à la modale du suppression
  arrowleft.addEventListener("click", () => {
    pictures.style.display = "flex";
    galleryTitle.style.display = "flex";
    arrowleft.style.display = "none";
    addform.style.display = "none";
    btnaddform.style.display = "flex";
    xmark.style.display = "flex";
  });
  // Fermeture du formulaire d'ajout
  addclose.addEventListener("click", () => {
    containermodal.style.display = "none";
    view.style.display = "none"; // Cacher l'image prévisualisée
    labelmodal.style.display = "flex"; // Réafficher le label
    inconmodal.style.display = "flex"; // Réafficher l'icône
    pmodal.style.display = "flex"; // Réafficher le texte
    inputmodal.value = "";
  });
}

// Previsualisation de l'image à ajouter : Affiche un aperçu de l'image sélectionnée
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

// Liste des catégories pour le formulaire d'ajout : Récupère et affiche les catégories dans le select
async function categoriesadd() {
  const select = document.querySelector(".addform select");
  const defaultOption = document.createElement("option");
  defaultOption.value = ""; // Valeur vide pour l'option par défaut
  defaultOption.textContent = ""; // Message d'invite
  select.appendChild(defaultOption);

  const categories = await getCategories();
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    select.appendChild(option);
  });
}

// Vérification du token : Assure que l'utilisateur est connecté
const token = localStorage.getItem("token");
if (!token) {
  console.error("Token non trouvé. Assurez-vous d'être connecté.");
}

// Validation des champs du formulaire : Change l'état du bouton selon la validité des champs
function inputok() {
  const inputvalid = document.querySelector(".addform button");

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

// Ajouter une photo : Envoie une requête POSR à l'API pour ajouter une nouvelle oeuvre
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
        `Erreur ${response.status}:Erreur lors de la suppression`
      );
    }
    const data = await response.json();

    createProjects(data);
    createDeleteModalProject(data);

    form.reset();
  } catch (error) {
    console.error("Erreur :", error);
  }
}

// Soumission du formulaire : Gère l'envoi du formulaire pour ajouter une nouvelle oeuvre
form.addEventListener("submit", function (e) {
  e.preventDefault(); // empêche le rechargement de la page
  const formData = new FormData(form);
  postNewProject(formData); //Envoie le formulaire
});

// Appel des fonctions principales : Exécute les fonctions pour initialiser l'application
function main() {
  displayaddform(); //Gère l'affichage du formulaire d'ajout
  getWorks(); //Récupère les oeuvres
  displayWorks(); //Affiche les oeuvres dans la galerie
  displayPictures(); //Affiche les photos dans la modale
  filterCategories(); //Gère le filtrage des oeuvres
  inputok(); //Vérifie la validité du formulaire
  categoriesadd(); //Remplit la liste des catégories
  buttons(); //Crée les boutons de filtrage
  getCategories(); //Récupère les catégories
}
main();
