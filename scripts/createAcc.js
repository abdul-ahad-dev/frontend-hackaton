import { app, auth } from "./firebase.mjs";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Initialize Firestore
const db = getFirestore();

// create account javascript
let createAcc = document.getElementById('create-acc');

function submit(e) {
    e.preventDefault();

    const userName = document.getElementById('user-name').value;
    const email = document.getElementById('email').value;
    const phoneNo = document.getElementById('mobile-no').value;
    const dob = document.getElementById('dob').value;
    const city = document.getElementById('city').value;
    const password = document.getElementById('pass').value;
    const passwordReEnter = document.getElementById('pass-re').value;
    const maleRadio = document.getElementById('male');
    const femaleRadio = document.getElementById('female');
    let gender = null;

    if (maleRadio.checked) {
        gender = "male"
    } else if (femaleRadio.checked) {
        gender = "female"
    }

    // check if input values are not empty or null
    if (userName &&
        email &&
        phoneNo &&
        dob &&
        city &&
        password &&
        passwordReEnter &&
        gender) {

        // check if passwords match
        if (password !== passwordReEnter) {
            alert('Passwords do not match');
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) =>
            {
                const user = userCredential.user;
                // Store user data in Firestore
                return setDoc(doc(db, "users", user.uid), {
                    userName: userName,
                    email: email,
                    phoneNo: phoneNo,
                    dob: dob,
                    city: city,
                    gender: gender
                });
            })
            .then((userCredential) =>
            {
                // Signed up 
                console.log('create Acc');
                window.location.href = 'loginAcc.html'
            })
            .catch((error) =>
            {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log('error Code ==>', errorCode);
                console.log('error Message ==>', errorMessage);
                if (errorCode == "auth/email-already-in-use") {
                    alert("This email is already registered");
                } else {
                    alert(errorMessage);
                }
            });
        alert('Account created successfully!');
    } else {
        alert('Please fill in all fields');
    }
}

createAcc.addEventListener('click', submit)