document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.add('active');
    });
    
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    dropdownButtons.forEach(button => {
      button.addEventListener('click', () => {
        const dropdown = button.closest('.dropdown');
        dropdown.classList.toggle('active');
      });
    });
    
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
    
    async function fetchAlbumImages(albumId) {
       const response = await fetch(`https://api.imgur.com/3/album/${albumId}/images`, {
         headers: {
           'Authorization': 'Client-ID 634e5da0086834e'
         }
       });
       const data = await response.json();
       return (data.success && data.data && data.data.length > 0) ? data.data : [];
    }
    
    const latestMapLink = document.getElementById('latestMap');
    latestMapLink.addEventListener('click', async (e) => {
       e.preventDefault();
       try {
         const images = await fetchAlbumImages('uQyYFzW');
         if (images.length > 0) {
           const lastImage = images[images.length - 1];
           showModal(lastImage.link);
         } else {
           console.error('No images found in album');
         }
       } catch (err) {
         console.error('Error fetching album images:', err);
       }
    });
    
    modalOverlay.addEventListener('click', (e) => {
       if (e.target === modalOverlay) {
         modalOverlay.classList.remove('open');
       }
    });
});
