
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

async function login() {
  const users = await getUsers;
  console.log(users);
}
login();