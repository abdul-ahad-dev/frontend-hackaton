import { app, auth } from "./firebase.mjs";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// login account javascript
var loginButton = document.getElementById('login-btn');

function LoginAccount(e) {
    e.preventDefault();

    let email = document.getElementById('user-mail').value;
    let password = document.getElementById('user-password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) =>
        {
            window.location.href = 'dashboard.html'
        })
        .catch((error) =>
        {
            const errorCode = error.code;
            const errorMessage = error.message;
            if (errorCode == 'auth/invalid-credential') {
                alert('Account Does not exist')
            } else {
                alert('Error ===> ', errorCode)
            }
        });
}


loginButton.addEventListener('click', LoginAccount);