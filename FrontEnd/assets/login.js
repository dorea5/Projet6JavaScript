
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
console.log(email,password);
const form = document.querySelector("form");
const erreur = document.querySelector(".error p");
console.log(erreur);



//connexion//

// passer login et password en paramètres (plogin, ppassword)
async function doLogin(plogin, ppassword) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // passer les paramètres à la requête en json
      body: JSON.stringify({ email: plogin, password: ppassword })
    });

    // dans cette version on teste directement la réponse après avoir fait le await du fetch
    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        erreur.textContent = "Vos identifiants ne sont pas valides.";
      } else {
        erreur.textContent = `Erreur : ${response.statusText}`;
      }
      // Il y a une erreur, la fonction retournea arbitrairement "false"
      return false;
    }
    else {
      // pas d'erreur, on retourne les données en json après avoir attendu le résultat (promise)
      const data = await response.json()
      return data;
    }


  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
}

const testSurface = (pMail, pPassword) => {
  // avec une regex
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g;
  // cette regex est facilement trouvable sur le net
  if (!pMail.match(emailRegex)) {
    erreur.textContent = "L'email doit être au format xxx@domaine.com.";
    return false;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{4,}$/;
  // ceci n'est pas obligatoire puisque la validité du password est testée backend
  // on pourrait simplement tester au moins la longueur de la chaine
  // ce test complet serait plutot à faire sur un "signup"
  if (!pPassword.match(passwordRegex)) {
    erreur.textContent = "Le mot de passe n'est pas au bon format.";
    return false;
  }

  return true;
  /* 
  Explication de la regex password :
^ : Indique le début de la chaîne.
(?=.*\d) : Vérifie qu'il y a au moins un chiffre (\d).
(?=.*[A-Z]) : Vérifie qu'il y a au moins une lettre majuscule ([A-Z]).
.{4,} : Vérifie que la longueur totale est d'au moins 4 caractères (.{4,} signifie "n'importe quel caractère" répété au moins 4 fois).
$ : Indique la fin de la chaîne.
*/
}


//connexion//

async function login() {

  // ATTENTION : ici il faut que la fonction rattachée au addEventListener soit ASYNC
  // c'est pourquoi auparavant il nous retournait une Promise
  form.addEventListener("submit", async function (e) {  //ignorer le load au click de se connecter//
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;

    // Tester la validité des champs (contrôle de surface)
    if (!testSurface(userEmail, userPassword)) {
      return; // arrête tout si quelque chose n'est pas valide
    }

    const dataUser = await doLogin(userEmail, userPassword);
    // s'il n'y a pas d'erreur
    if (dataUser != false) {
      // récupérer le token
      const token = dataUser.token;
      // stocker le tocken dans le local storage
      localStorage.setItem("token", token);
      // redirection page d'accueil
      window.location.href = "./index.html"
     
    }

  }
  )
}
login();



