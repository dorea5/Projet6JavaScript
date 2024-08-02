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


const xmark = document.querySelector(".container_modal .fa-xmark");
const containermodal = document.querySelector(".container_modal");
const editicon = document.querySelector(".edit_icon");
const modifier = document.querySelector ( " .modifier");
const loged = window.sessionStorage.loged;
const lougout = document.querySelector("header nav .logout");
const pictures =document.querySelector(".pictures");


if (loged == "true") {
  lougout.textContent="logout";
  modifier.textContent="modifier";
  editicon.style.display = 'inline-flex';
  lougout.addEventListener("click",() => {
window.sessionStorage.loged = false;});
}

//affichage modale quand connecté//

modifier.addEventListener("click", () => {
containermodal.style.display='inline-flex';
});
//exit//
xmark.addEventListener("click", () => {
  containermodal.style.display='none';
});


//affichage photos dans modale//

async function DisplayPictures () {
  pictures.innerHTML=""
  const AllWorks =  await getWorks()
  AllWorks.forEach(picture => {
  const figure = document.createElement("figure")
  const span = document.createElement("span")
  const img = document.createElement("img")
  const trash = document.createElement("i")
  trash.classList.add("fa-solid", "fa-trash-can")
  trash.id = picture.id
  img.src =picture.imageUrl
  span.appendChild(trash)
  figure.appendChild(span)
  figure.appendChild(img)
  picture.appendChild(figure)

  });
deleteworks()
}

DisplayPictures();

//suppression image modale//

function deleteworks() {
  const trashALL = docume.querySelectorAll(".fa-trash-can")
 trashALL.forEach(trash => {
  trash.add.addEventListener("click", (e)=>{
    const id = trash.id
    const init ={
      method:"DELETE",
      headers : {"content-Type": "application/json"},

    }
    fetch("http://localhost:5678/api/works/1"+ id,init)
    .then((response)=>{
      if (!response.ok){
        console.log("delete na pas marché")
      }
      return response.json()
    })
    .then((data)=>{
      console.log("le delete a reussi:",data)
      DisplayPictures()  //reactualisation modale//
      displayWorks()   //reactualisation vehicules//
    })
  })
 })
}
 //faire apparaitre deuxieme modale//

 const btnaddmodal = document.querySelector(".modal_gallery button")
 const modaladdphotos = document.querySelector(".modal_add_photos")
 const modalgallery = document.querySelector(".modal_gallery")
 const arrowleft = document.querySelector("arrow_left")

 function displayaddmodal () {
  btnaddmodal.addEventListener("click",()=>{modaladdphotos.style.display="inline-flex";
    modalgallery.style.display="none";
  })
 }
 displayaddmodal();
