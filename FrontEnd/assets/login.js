
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
console.log(email,password);
const form = document.querySelector("form");
const erreur = document.querySelector(".login p");
console.log(erreur);

async function getUsers() {
  const answer = await fetch("http://localhost:5678/api/users/login");
  return await answer.json();
}
getUsers();



//connexion//
async function getusers() {
const response = await fetch("http://localhost:5678/api/users/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: {email: "string",
  password: "string "}
  
})};


//connexion//

async function login() {
  const users = await getusers();
  console.log(users);
  form.addEventListener ("submit" , (e)=> {  //ignorer le load au click de se connecter//
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;
    console.log(userEmail, userPassword);   //recuperation des valeurs login au click (email et mdp saisis)//
    users.forEach(user => {
      if (
        user.email == userEmail &&
        user.password == userPassword 
      )
      {
        window.sessionStorage.loged=true //si les conditions sont ok alors il affiche true dans application//
        window.location.href = "../login.html"; //redirigé vers page d'accueil
      }else{
        erreur.textContent="erreur";
        erreur.classList.add("error p");
      }
    });

  })



}
login();