import { app, auth } from "./firebase.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, getDocs, addDoc, collection, Timestamp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const db = getFirestore();

const logoutButton = document.getElementById('logout-button');


function getUserProfileData(uid) {
  console.log("Fetching data for UID:", uid);
  const userDocRef = doc(db, "users", uid);
  getDoc(userDocRef)
    .then((docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();

        console.log("User data retrieved:", userData);
        document.getElementById('profile-name').innerText = userData.userName;
        document.getElementById('profile-contact').innerText = userData.phoneNo;
        document.getElementById('profile-city').innerText = userData.city;

        document.getElementById('user-name').innerHTML = `<strong>Name:</strong> ${userData.userName}`;
        document.getElementById('user-email').innerHTML = `<strong>Email Address:</strong> ${userData.email}`;
        document.getElementById('user-contact').innerHTML = `<strong>Contact:</strong> ${userData.phoneNo}`;
        document.getElementById('user-dob').innerHTML = `<strong>Date of Birth:</strong> ${userData.dob}`;
        document.getElementById('user-gender').innerHTML = `<strong>Gender:</strong> ${userData.gender}`;
        document.getElementById('user-city').innerHTML = `<strong>City:</strong> ${userData.city}`;
      }
    })
    .catch((error) => {
      window.location.href = 'loginAcc.html';
    });
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'loginAcc.html';
    console.log('login');
  } else {
    console.log('User is logged in:', user);
    getUserProfileData(user.uid);
    setBlogInDashboard()
    logoutButton.addEventListener('click', () => {
      signOut(auth)
        .then(() => {
          window.location.href = '../index.html';
        }).catch((error) => {
          console.error('Error signing out:', error);
        });
    });
  }
});



let addBlog = document.getElementById('add-blog');


addBlog.addEventListener('click', async function () {
  const title = document.getElementById('title');
  const description = document.getElementById('description');
  // const image = document.getElementById('image').value;

  console.log(title.value);
  console.log(description.value);

  try {
    const docRef = await addDoc(collection(db, "blogs"), {
      blogTitle: title.value,
      blogDescription: description.value,
      blogDate: Timestamp.fromDate(new Date()),
    });
    setBlogInDashboard()
    console.log("Document written with ID: ", docRef.id);
  }
  catch (e) {
    console.error("Error adding document: ", e);
    alert(`Error: ${e.message}`);
  }
});


async function setBlogInDashboard() {
  const blogTitle = document.getElementById('blog-title');
  const blogDescription = document.getElementById('blog-description');
  let order_card = document.querySelector('.order_card')


  const querySnapshot = await getDocs(collection(db, "blogs"));
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    console.log(doc.id, " => ", doc.data());

    order_card.innerHTML += `<div class="card mb-4">
                                <img src="../images/man.png" class="card-img-top"
                                    alt="...">
                                <div class="card-body">
                                    <h5 class="card-title" id="blog-title">${data.blogTitle}</h5>
                                    <p class="card-text" id="blog-description">${data.blogDescription}</p>
                                    <p class="card-text bottom "><strong id="user-name">ABDUL AHAD</strong> <small id="date" class="text-body-secondary">Aug 12, 2024</small></p>                                </div>
                            </div>`
  });
}