import { app, auth } from "./firebase.mjs";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, getDocs, addDoc, collection, Timestamp, deleteDoc, } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";


const db = getFirestore();
const logoutButton = document.getElementById('logout-button');

// Get user data From firestore and set in dashboard profile
function getUserProfileData(uid) {
  console.log("Fetching data for UID:", uid);
  const userDocRef = doc(db, "users", uid);
  getDoc(userDocRef)
    .then((docSnapshot) =>
    {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        var userName = userData.userName
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
    .catch((error) =>
    {
      window.location.href = 'loginAcc.html';
    });
}


// Chech USER Login or not!
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = 'loginAcc.html';
    console.log('login');
  } else {
    console.log('User is logged in:', user);
    getUserProfileData(user.uid);
    setBlogInDashboard()
    logoutButton.addEventListener('click', () =>
    {
      signOut(auth)
        .then(() =>
        {
          window.location.href = '../index.html';
        }).catch((error) =>
        {
          console.error('Error signing out:', error);
        });
    });
  }
});


// Add Blog 
let addBlog = document.getElementById('add-blog');

addBlog.addEventListener('click', () => {
  onAuthStateChanged(auth, (user) =>
  {
    if (user) {
      const uid = user.uid;
      addBlogInUserAcc(uid);
    } else {
      alert("User is not authenticated");
    }
  })
});

function addBlogInUserAcc(uid) {
  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;

  async function getUserProfileData(uid) {
    try {
      const userDocRef = doc(db, "users", uid);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userName = userData.userName;

        const docRef = await addDoc(collection(db, "blogs"), {
          userUID: uid,
          userName: userName,
          blogTitle: title,
          blogDescription: description,
          blogDate: Timestamp.fromDate(new Date())
        });
        document.getElementById('title').value = '';
        document.getElementById('description').value = '';
        setBlogInDashboard();
      } else {
        console.error("No user data found for UID:", uid);
        alert("User data not found.");
      }
    } catch (e) {
      console.error("Error adding document:", e);
      alert(`Error: ${e.message}`);
    }
  }
  getUserProfileData(uid);
}


// Set Blog in Dashboard 
async function setBlogInDashboard() {
  const order_card = document.querySelector('.order_card');

  const querySnapshot = await getDocs(collection(db, "blogs"));
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      order_card.innerHTML = '';

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.userUID === uid) {
          
          order_card.innerHTML += `<div class="card mb-4 position-relative" data-doc-id="${doc.id}">
                                  <button type="button" id="del-card" class="btn-close position-absolute top-0 start-0 m-2" aria-label="Close">
                                      <i class="fa-solid fa-xmark"></i>
                                  </button>
                              
                                  <img src="../images/logo.png" class="card-img-top" alt="...">
                              
                                  <div class="card-body">
                                      <h5 class="card-title">${data.blogTitle}</h5>
                                      <p class="card-text">${data.blogDescription}</p>
                                      <p class="card-text bottom">
                                          <strong>${data.userName || 'User'}</strong>
                                          <small class="text-body-secondary">${data.blogDate.toDate().toLocaleDateString()}</small>
                                      </p>
                                      
                                      <!-- Update Button -->
                                      <button type="button" class="btn btn-primary">Update</button>
                                  </div>
                              </div>`;
        }
      });
    } else {
      alert("Please sign in to view your blogs.");
    }
  });
}


// Delete Blog 
let order_card = document.querySelector('.order_card');

order_card.addEventListener('click', function (e) {
  if (e.target.classList.contains('btn-close') || e.target.closest('.btn-close')) {
    const card = e.target.closest('.card');
    if (card) {
      const docId = card.getAttribute('data-doc-id');

      if (docId) {
        deleteDoc(doc(db, "blogs", docId))
          .then(() =>
          {
            alert("Document successfully deleted!");
            card.remove();
          })
          .catch((error) =>
          {
            console.error("Error removing document: ", error);
          });
      } else {
        console.error("No document ID found on the card.");
      }
    }
  }
});