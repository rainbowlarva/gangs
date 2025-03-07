document.addEventListener('DOMContentLoaded', () => {
    // Existing dropdown code
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    dropdownButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dropdown = button.closest('.dropdown');
        dropdown.classList.toggle('active');
      });
    });
    
    // Modal functionality for Forum Drive Map and Metro/Sewer Map
    const forumDriveMapLink = document.getElementById('forumDriveMap');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalImage = document.getElementById('modalImage');
    
    function showModal(imageUrl) {
       modalImage.setAttribute('src', imageUrl);
       // Add the open class to trigger the fade-in transition
       modalOverlay.classList.add('open');
    }
    
    forumDriveMapLink.addEventListener('click', (e) => {
       e.preventDefault();
       const imageUrl = forumDriveMapLink.getAttribute('href');
       showModal(imageUrl);
    });
    
    // New: Latest Gang Map link using the Imgur API
    const latestMapLink = document.getElementById('latestMap');
    latestMapLink.addEventListener('click', async (e) => {
       e.preventDefault();
       try {
         // Replace "YOUR_CLIENT_ID" with your actual Imgur client ID.
         const response = await fetch('https://api.imgur.com/3/album/ls-gang-map-of-gta-world-uQyYFzW/images', {
           headers: {
             'Authorization': '634e5da0086834e'
           }
         });
         const data = await response.json();
         if (data.success && data.data && data.data.length > 0) {
           // Get the last image from the album
           const lastImage = data.data[data.data.length - 1];
           showModal(lastImage.link);
         } else {
           console.error('No images found in album');
         }
       } catch (err) {
         console.error('Error fetching album images:', err);
       }
    });
    
    // Hide modal when clicking outside the modal-content with a fade-out animation
    modalOverlay.addEventListener('click', (e) => {
       if (e.target === modalOverlay) {
         modalOverlay.classList.remove('open');
       }
    });
});