import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

// here is API configuration // 

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let classroomNames = [];

// Fetch all classroom names from Firestore
async function fetchClassroomNames() {
    const querySnapshot = await getDocs(collection(db, 'KitClassrooms'));
    classroomNames = querySnapshot.docs.map(doc => doc.data().name.toLowerCase());
}

// Function to display suggestions
function displaySuggestions(suggestions) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(suggestion => {
        const suggestionElement = document.createElement('div');
        suggestionElement.innerText = suggestion.toUpperCase(); // Show in uppercase
        suggestionElement.className = 'suggestion'; // Add class for styling
        
        // Onclick behavior for suggestions
        suggestionElement.onclick = () => {
            document.getElementById('documentName').value = suggestion; // Set input value to suggestion
            resultsDiv.innerHTML = ''; // Clear suggestions
            searchClassroom(suggestion); // Call searchClassroom directly with the selected suggestion
        };
        
        resultsDiv.appendChild(suggestionElement);
    });

    // Clear results area if no suggestions match
    if (suggestions.length === 0) {
        resultsDiv.innerHTML = '';
    }
}

// Handle input in the search box
function handleInput(event) {
    const inputValue = event.target.value.trim().toLowerCase();

    // Check if input is empty
    if (inputValue === "") {
        document.getElementById('results').innerHTML = ''; // Clear all suggestions if input is empty
        const locationBox = document.getElementById('locationInfo');
        locationBox.innerHTML = '<p style="color: gray;">Location will be displayed here...</p>'; // Reset to default message
        return;
    }

    const suggestions = classroomNames.filter(name => name.startsWith(inputValue)); // Filter suggestions
    displaySuggestions(suggestions);
}

// Function to search for a classroom in the database and display its details
async function searchClassroom(documentName = null) {
    const inputName = documentName || document.getElementById('documentName').value.trim().toLowerCase();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    const locationBox = document.getElementById('locationInfo');
    locationBox.innerHTML = '<p style="color: gray;">Location will be displayed here...</p>'; // Reset default message

    const querySnapshot = await getDocs(collection(db, 'KitClassrooms'));
    let found = false;

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id.toLowerCase() === inputName) {
            found = true;

            // Display location in the location box only
            locationBox.innerHTML = `
                <h3>Location Details:</h3>
                <div class="location-item">
                    <span class="left-label">NAME:</span>
                    <span class="right-value"><span style="color: red; text-transform: uppercase;">${data.name}</span></span>
                </div>
                <div class="location-item">
                    <span class="left-label">BUILDING:</span>
                    <span class="right-value">${data.building.charAt(0).toUpperCase() + data.building.slice(1).toLowerCase()}</span>
                </div>
                <div class="location-item">
                    <span class="left-label">SIDE:</span>
                    <span class="right-value">${data.side.charAt(0).toUpperCase() + data.side.slice(1).toLowerCase()}</span>
                </div>
                <div class="location-item">
                    <span class="left-label">FLOOR:</span>
                    <span class="right-value">${data.floor.charAt(0).toUpperCase() + data.floor.slice(1).toLowerCase()}</span>
                </div>
                <div class="location-item">
                    <span class="left-label">ROOM NUMBER:</span>
                    <span class="right-value">${data.roomNumber.charAt(0).toUpperCase() + data.roomNumber.slice(1).toLowerCase()}</span>
                </div>
            `;
        }
    });

    if (!found) {
        resultsDiv.innerHTML = '<p>No results found.</p>';
        locationBox.innerHTML = '<p style="color: gray;">Location will be displayed here...</p>'; // Reset if no result
    }
}

// Initialize the classroom list when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', async () => {
    await fetchClassroomNames(); // Fetch classroom names when the page loads
    document.getElementById('searchButton').addEventListener('click', () => searchClassroom());
    document.getElementById('documentName').addEventListener('input', handleInput); // Listen for input changes
});
