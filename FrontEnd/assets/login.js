
const email = document.querySelector("form #email");
const password = document.querySelector("form #password");
console.log(email,password);
const form = document.querySelector("form");
const erreur = document.querySelector(".error p");
console.log(erreur);





async function doLogin(plogin, ppassword) {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      
      body: JSON.stringify({ email: plogin, password: ppassword })
    });


    if (!response.ok) {
      if (response.status === 401 || response.status === 404) {
        erreur.textContent = "Vos identifiants ne sont pas valides.";
      } else {
        erreur.textContent = `Erreur : ${response.statusText}`;
      }
      
      return false;
    }
    else {
      
      const data = await response.json()
      return data;
    }


  } catch (error) {
    throw new Error('Login failed: ' + error.message);
  }
}

const testSurface = (pMail, pPassword) => {
  
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]{2,}\.[a-z]{2,4}$/g;
  
  if (!pMail.match(emailRegex)) {
    erreur.textContent = "L'email doit être au format xxx@domaine.com.";
    return false;
  }

  const passwordRegex = /^(?=.*\d)(?=.*[A-Z]).{4,}$/;
  if (!pPassword.match(passwordRegex)) {
    erreur.textContent = "Le mot de passe n'est pas au bon format.";
    return false;
  }

  return true;
 
}




async function login() {

  
  form.addEventListener("submit", async function (e) {  
    e.preventDefault();
    const userEmail = email.value;
    const userPassword = password.value;

    
    if (!testSurface(userEmail, userPassword)) {
      return; 
    }

    const dataUser = await doLogin(userEmail, userPassword);
    
    if (dataUser != false) {
      
      const token = dataUser.token;
    
      localStorage.setItem("token", token);
      
      window.location.href = "./index.html"
     
    }

  }
  )
}
login();



