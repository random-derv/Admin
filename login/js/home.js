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

// Get a reference to the database service
const database = firebase.database();

// Function to fetch and display user information
function fetchAndDisplayUserInfo() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in
            console.log('User is signed in. UID:', user.uid);

            const userId = user.uid;
            const userRef = database.ref('users').child(userId);

            // Fetch user data
            userRef.once('value', function (snapshot) {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    console.log('User data retrieved:', userData);

                    // Display user information on the page
                    displayUserInfo(userData);
                    // Display user credits
                    displayUserCredits(userData);

                    // Start polling for credit changes
                    startCreditPolling(userId);
                } else {
                    console.error('User data not found');
                }
            });
        } else {
            // User is not signed in, redirect to login page
            console.log('User is not signed in');
            window.location.href = 'index.html';
        }
    });
}

// Function to display user information
function displayUserInfo(userData) {
    console.log('Displaying user information:', userData);

    const userInfoContainer = document.getElementById('user-info-container');

    // Create elements to display user information
    const userInfoElement = document.createElement('div');
    userInfoElement.classList.add('user-info');
    userInfoElement.innerHTML = `
        <strong>Welcome back,</strong> ${userData.username}!
    `;

    // Replace existing content
    userInfoContainer.innerHTML = '';
    // Append user information to the container
    userInfoContainer.appendChild(userInfoElement);
}



function startCreditPolling(userId) {
    setInterval(function () {
        const userRef = database.ref('users').child(userId);

        userRef.once('value', function (snapshot) {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                console.log('User credits retrieved:', userData.credits);

                // Compare with previous credits if available
                if (typeof previousCredits !== 'undefined' && previousCredits !== null) {
                    if (userData.credits !== previousCredits) {
                        console.log('Credits changed. Refreshing page...');
                        window.location.reload();
                    }
                }

                previousCredits = userData.credits;
            } else {
                console.error('User data not found');
            }
        });
    }, 1000);
}

document.getElementById('logoutBtn').addEventListener('click', function () {
    firebase.auth().signOut().then(function () {
        window.location.href = 'index.html';
    }).catch(function (error) {
        console.error('Error signing out:', error);
    });
});

document.getElementById('sendBtn').addEventListener('click', function () {
    window.location.href = 'sms.html';
});

fetchAndDisplayUserInfo();

document.getElementById('pricingLink').addEventListener('click', function (event) {
    event.preventDefault();
    document.getElementById('pricingDialog').showModal();
});

// Close pricing dialog when the Close button is clicked
document.getElementById('closeDialogBtn').addEventListener('click', function () {
    document.getElementById('pricingDialog').close();
});

// Existing code
fetchAndDisplayUserInfo();

document.getElementById('logoutBtn').addEventListener('click', function () {
    firebase.auth().signOut().then(function () {
        // Sign-out successful, redirect to login page
        window.location.href = 'index.html';
    }).catch(function (error) {
        console.error('Error signing out:', error);
    });
});

document.getElementById('sendBtn').addEventListener('click', function () {
    window.location.href = 'sms.html';
});
