// Import Firebase modules 
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js';
import { getFirestore, collection, getDocs } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js';

//API CONFIURATION IS here

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fetches and lists all classrooms from the Firestore database.
 */
async function listClassrooms() {
    const listDiv = document.getElementById('classroomList');
    listDiv.innerHTML = ''; // Clear previous list

    try {
        const querySnapshot = await getDocs(collection(db, 'KitClassrooms'));

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            // Create a link for each classroom name
            const classroomLink = document.createElement('a');
            classroomLink.innerText = data.name.toUpperCase(); // Set the classroom name in uppercase
            classroomLink.className = 'classroom-link'; // Add a class for styling
            classroomLink.href = '#';
            classroomLink.onclick = (event) => {
                event.preventDefault(); // Prevent default link behavior
                displayLocationInfo(data);
                scrollToTop(); // Scroll to the top when a classroom is clicked
            };
            listDiv.appendChild(classroomLink);
        });
    } catch (error) {
        console.error("Error fetching classrooms:", error);
        listDiv.innerHTML = '<p style="color: red;">Failed to load classrooms. Please try again later.</p>';
    }
}

/**
 * Displays the location information of the selected classroom.
 * @param {Object} data - The classroom data.
 */
function displayLocationInfo(data) {
    const infoBox = document.getElementById('locationInfo');
    infoBox.innerHTML = `
        <h3>Location Details:</h3>
        <div class="location-item">
            <span class="left-label">NAME:</span>
            <span class="right-value"><span style="color: red; text-transform: uppercase;">${escapeHTML(data.name)}</span></span>
        </div>
        <div class="location-item">
            <span class="left-label">BUILDING:</span>
            <span class="right-value">${capitalizeFirstLetter(data.building)}</span>
        </div>
        <div class="location-item">
            <span class="left-label">SIDE:</span>
            <span class="right-value">${capitalizeFirstLetter(data.side)}</span>
        </div>
        <div class="location-item">
            <span class="left-label">FLOOR:</span>
            <span class="right-value">${capitalizeFirstLetter(data.floor)}</span>
        </div>
        <div class="location-item">
            <span class="left-label">ROOM NUMBER:</span>
            <span class="right-value">${capitalizeFirstLetter(data.roomNumber)}</span>
        </div>
    `;
}

/**
 * Scrolls the page to the top.
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // Smooth scrolling
    });
}

/**
 * Capitalizes the first letter of a string and makes the rest lowercase.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
function capitalizeFirstLetter(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Escapes HTML to prevent XSS attacks.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

// Initialize the classroom list when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    listClassrooms(); // List classrooms when the page loads
});
