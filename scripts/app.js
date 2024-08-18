import { app, auth } from "./firebase.mjs";
import { getFirestore, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const db = getFirestore();

// jump welcome screen to login
var signInScreen = document.getElementById('sign-in-screen');
signInScreen.addEventListener('click', () => {
    window.location.href = './pages/loginAcc.html';
});

// jump welcome screen to login
var signUpScreen = document.getElementById('sign-up-screen');
signUpScreen.addEventListener('click', () => {
    window.location.href = './pages/createAcc.html';
});

const navToggle = document.querySelector('.nav-toggle')
const links = document.querySelector('.links')

navToggle.addEventListener('click', function () {
    if (links.classList.contains('show-links')) {
        links.classList.remove('show-links');
    } else {
        links.classList.add('show-links');
    }
})

let blogMainPage = document.querySelector(".blog-main-page");
console.log(blogMainPage);

const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach((doc) => {
    const data = doc.data()

    blogMainPage.innerHTML += `<div class="card mb-3">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <img src="images/logo.png" class="img-fluid rounded-start" alt="...">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <h5 class="card-title" id="title">${data.blogTitle}</h5>
                                <p class="card-text" id="discription">${data.blogDescription}</p>
                                <p class="card-text bottom ">
                                    <strong id="user-name">${data.userName || 'N/A'}</strong>
                                    <small id="date" class="text-body-secondary">${data.blogDate.toDate().toLocaleDateString()}</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>`
});