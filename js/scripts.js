// Firebase configuration (replace with your own config)
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

// Check if user is already signed in
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in, redirect to home.html
        window.location.href = 'admin_dashboard.html';
    }
});

// Handle form submission
document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim(); // Ensure no leading/trailing spaces
    const password = document.getElementById('password').value.trim(); // Ensure no leading/trailing spaces

    // Sign in user with Firebase Authentication
    firebase.auth().signInWithEmailAndPassword(username, password)
        .then((userCredential) => {
            // Signed in successfully, redirect to admin_dashboard.html
            window.location.href = 'admin_dashboard.html';
        })
        .catch((error) => {
            console.error('Error signing in', error);
            showErrorMessage('Authentication error: ' + error.message);
        });
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful, reload page to clear any cached state
        window.location.reload();
    }).catch(function (error) {
        console.error('Error signing out:', error);
    });
});

function showErrorMessage(message) {
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
}