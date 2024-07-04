// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCpMLHUaA5YKWJ_11Xiv4te7X0GJU2GtIg",
  authDomain: "college-cbdd7.firebaseapp.com",
  databaseURL: "https://college-cbdd7-default-rtdb.firebaseio.com",
  projectId: "college-cbdd7",
  storageBucket: "college-cbdd7.appspot.com",
  messagingSenderId: "1041661998794",
  appId: "1:1041661998794:web:693fe41ff24d2f95186633",
  measurementId: "G-196WCPG8E4"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in, redirect to home.html
        window.location.href = 'admin_dashboard.html';
    }
});
// Get a reference to the database service
const database = firebase.database();

// Handle form submission   
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('signup-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const password = document.getElementById('password').value;
        const year = document.getElementById('year').value;
        const department = document.getElementById('department').value;
        const adminCode = document.getElementById('admin-code').value;

        const hashedPassword = CryptoJS.SHA256(password).toString();

        // Check admin code for teacher registration
        if (adminCode === "Poly98$SG") {
            // Register the teacher in Firebase Authentication
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const userId = userCredential.user.uid;
                    const teacherData = {
                        email: email,
                        username: username,
                        phoneNumber: phoneNumber,
                        hashedPassword: hashedPassword
                    };

                    // Save teacher data in Firebase Realtime Database under 'users/teachers/year/department'
                    database.ref(`users/teachers/${year}/${department}/${userId}`).set(teacherData)
                        .then(() => {
                            window.location.href = 'admin_dashboard.html'; // Redirect to admin dashboard upon successful registration
                        })
                        .catch((error) => {
                            console.error('Error saving teacher data', error);
                            alert('Error: ' + error.message);
                        });
                })
                .catch((error) => {
                    console.error('Error signing up', error);
                    alert('Error: ' + error.message);
                });
        } else {
            // Display an alert if admin code is incorrect
            alert('Please enter the correct admin code');
        }
    });
});
