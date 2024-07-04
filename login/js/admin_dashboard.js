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

// Get a reference to the storage service
const storage = firebase.storage();

// Get a reference to the database service
const database = firebase.database();

// DOM elements
const fileUpload = document.getElementById('file-upload');
const uploadButton = document.getElementById('upload-button');
const fileList = document.getElementById('file-list');

// File upload event listener
uploadButton.addEventListener('click', function () {
    const file = fileUpload.files[0];

    if (file) {
        const storageRef = storage.ref('uploads/' + file.name);

        // Upload file to Firebase Storage
        const uploadTask = storageRef.put(file);

        // Handle successful upload
        uploadTask.then(snapshot => {
            console.log('File uploaded successfully');
            storageRef.getDownloadURL().then(url => {
                saveFileData(url); // Save file data to Firebase Realtime Database
            });
        }).catch(error => {
            console.error('Error uploading file', error);
            alert('Error uploading file: ' + error.message);
        });
    } else {
        alert('Please select a file');
    }
});

// Function to save file data to Firebase Realtime Database
function saveFileData(fileUrl) {
    // Generate a unique key for the file data
    const newFileKey = database.ref().child('files').push().key;

    // Save the file metadata under files > fileUID > fileUrl
    const updates = {};
    updates[`files/${newFileKey}/fileUrl`] = fileUrl;

    database.ref().update(updates)
        .then(() => {
            console.log('File data saved successfully');
            displayFileList(); // Refresh file list after upload
        })
        .catch(error => {
            console.error('Error saving file data', error);
            alert('Error saving file data: ' + error.message);
        });
}

// Function to display uploaded files list
function displayFileList() {
    fileList.innerHTML = ''; // Clear existing list

    // Retrieve and display files from Firebase Realtime Database
    database.ref('files').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const fileData = childSnapshot.val();
            const fileId = childSnapshot.key;
            const fileItem = createFileListItem(fileId, fileData.fileUrl);
            fileList.appendChild(fileItem);
        });
    });
}

// Function to create HTML element for file list item
function createFileListItem(fileId, fileUrl) {
    const listItem = document.createElement('div');
    listItem.className = 'file-item';
    listItem.innerHTML = `
            <p><strong>File:</strong> <a href="${fileUrl}" target="_blank">View</a></p>
            <button onclick="deleteFile('${fileId}', '${fileUrl}')">Delete</button>
        `;
    return listItem;
}

// Function to delete file from Firebase Storage and Database
function deleteFile(fileId, fileUrl) {
    const filePath = fileUrl.split('?')[0].split('/o/')[1];
    const decodedFilePath = decodeURIComponent(filePath);

    // Delete the file from Firebase Storage
    const storageRef = storage.ref(decodedFilePath);
    storageRef.delete()
        .then(() => {
            console.log('File deleted from storage');
            // Delete the file data from Firebase Realtime Database
            return database.ref('files/' + fileId).remove();
        })
        .then(() => {
            console.log('File data deleted from database');
            displayFileList(); // Refresh file list after deletion
        })
        .catch(error => {
            console.error('Error deleting file', error);
            alert('Error deleting file: ' + error.message);
        });
}

// Display initial file list upon page load
displayFileList();

// Automatic page refresh on Firebase data change
database.ref('files').on('child_removed', snapshot => {
    displayFileList(); // Refresh file list after deletion
});
// Function to add HOD
document.getElementById('add-hod-button').addEventListener('click', function () {
    const hodName = document.getElementById('hod-name').value.trim();
    const department = document.getElementById('department-select').value;
    const phoneNumber = document.getElementById('phone-number').value.trim();

    if (hodName && department && phoneNumber) {
        // Check if HOD for this department already exists
        database.ref('users/HODs').orderByChild('department').equalTo(department).once('value', snapshot => {
            if (snapshot.exists()) {
                alert(`HOD for ${department} department already exists.`);
            } else {
                // Add HOD details to Firebase
                const newHodKey = database.ref().child('users/HODs').push().key;
                const updates = {};
                updates[`users/HODs/${newHodKey}`] = {
                    name: hodName,
                    department: department,
                    phoneNumber: phoneNumber
                };

                database.ref().update(updates)
                    .then(() => {
                        console.log('HOD added successfully');
                        // Clear input fields after adding
                        document.getElementById('hod-name').value = '';
                        document.getElementById('department-select').value = '';
                        document.getElementById('phone-number').value = '';
                        displayHodDetails(); // Refresh HOD details display
                    })
                    .catch(error => {
                        console.error('Error adding HOD', error);
                        alert('Error adding HOD: ' + error.message);
                    });
            }
        });
    } else {
        alert('Please fill out all fields.');
    }
});

// Function to display HOD details
function displayHodDetails() {
    const hodDetailsContainer = document.getElementById('hod-details');
    hodDetailsContainer.innerHTML = ''; // Clear existing details

    database.ref('users/HODs').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const hodData = childSnapshot.val();
            const hodItem = createHodListItem(hodData.name, hodData.department, hodData.phoneNumber);
            hodDetailsContainer.appendChild(hodItem);
        });
    });
}

// Function to create HTML element for HOD list item
function createHodListItem(name, department, phoneNumber) {
    const listItem = document.createElement('div');
    listItem.className = 'hod-item';
    listItem.innerHTML = `
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Department:</strong> ${department}</p>
            <p><strong>Phone Number:</strong> ${phoneNumber}</p>
            
        `;
    return listItem;
}

// Display initial HOD details upon page load
displayHodDetails();

// Function to display HOD details
function displayHodDetails() {
    const hodDetailsContainer = document.getElementById('hod-details');
    hodDetailsContainer.innerHTML = ''; // Clear existing details

    // Retrieve HODs from Firebase Realtime Database
    database.ref('users/HODs').once('value', snapshot => {
        snapshot.forEach(childSnapshot => {
            const hodData = childSnapshot.val();
            const hodItem = createHodListItem(hodData.name, hodData.department, hodData.phoneNumber);
            hodDetailsContainer.appendChild(hodItem);
        });
    });
}

// Display initial HOD details upon page load
displayHodDetails();

// Automatic page refresh on Firebase data change
database.ref('users/HODs').on('value', snapshot => {
    displayHodDetails(); // Refresh HOD details on value change
});

