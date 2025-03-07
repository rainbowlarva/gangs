document.addEventListener('DOMContentLoaded', () => {
    // Existing dropdown code
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    dropdownButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dropdown = button.closest('.dropdown');
        dropdown.classList.toggle('active');
      });
    });
    
    // Modal functionality for Forum Drive Map
    const forumDriveMapLink = document.getElementById('forumDriveMap');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalImage = document.getElementById('modalImage');
    
    function showModal(imageUrl) {
       modalImage.setAttribute('src', imageUrl);
       modalOverlay.classList.add('open');
    }
    
    forumDriveMapLink.addEventListener('click', (e) => {
       e.preventDefault();
       const imageUrl = forumDriveMapLink.getAttribute('href');
       showModal(imageUrl);
    });
    
    // Helper function: try fetching images from the album, with a fallback to the gallery endpoint
    async function fetchAlbumImages(albumId) {
       // Try the standard album endpoint first
       let response = await fetch(`https://api.imgur.com/3/album/${albumId}/images`, {
         headers: {
           'Authorization': 'Client-ID 634e5da0086834e'
         }
       });
       let data = await response.json();
       if (data.success && data.data && data.data.length > 0) {
         return data.data;
       }
       // Fallback to the gallery endpoint
       response = await fetch(`https://api.imgur.com/3/gallery/album/${albumId}/images`, {
         headers: {
           'Authorization': 'Client-ID 634e5da0086834e'
         }
       });
       data = await response.json();
       if (data.success && data.data && data.data.length > 0) {
         return data.data;
       }
       return [];
    }
    
    // New: Latest Gang Map link using the Imgur API with fallback
    const latestMapLink = document.getElementById('latestMap');
    latestMapLink.addEventListener('click', async (e) => {
       e.preventDefault();
       try {
         const images = await fetchAlbumImages('ls-gang-map-of-gta-world-uQyYFzW');
         if (images.length > 0) {
           // Get the last image from the album
           const lastImage = images[images.length - 1];
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
