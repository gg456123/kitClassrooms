// Get all map links
const mapLinks = document.querySelectorAll('a[data-map]');
const mapImage = document.getElementById('mapImage');

// Firebase Storage base URL
const baseUrl = "https://firebasestorage.googleapis.com/v0/b/yasu-d7691.appspot.com/o/";

// Function to load the map image
mapLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default link behavior C:\Users\LENOVO\Desktop\firstINVENTION\.firebaserc

        const mapFile = event.target.getAttribute('data-map');
        const mapUrl = `${baseUrl}${encodeURIComponent(mapFile)}?alt=media`; // Ensure the map filename is encoded properly

        // Display the selected image
        mapImage.src = mapUrl;
        mapImage.style.display = 'block';
    });
});