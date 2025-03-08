document.addEventListener('DOMContentLoaded', () => {
  // --- Sidebar Dropdowns ---
  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  dropdownButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dropdown = button.closest('.dropdown');
      dropdown.classList.toggle('active');
    });
  });
  
  // --- Modal Functionality for Forum Drive Map and Latest Map ---
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
      modalImage.classList.remove('zoomed');
    }
  });
  
  modalImage.addEventListener('click', (e) => {
    e.stopPropagation();
    modalImage.classList.toggle('zoomed');
  });
  
  const googleHeader = document.getElementById('googleHeader');
  const googleDropdown = document.getElementById('googleDropdown');
  
  googleHeader.addEventListener('click', () => {
    googleDropdown.classList.toggle('open');
  
    const callbackName = 'handleGoogleContent_' + Date.now();
    console.log("Callback name:", callbackName);
  
    let script = document.createElement('script');
  
    window[callbackName] = function(data) {
      console.log("Received Data:", data);
    
      if (data.name && data.imageUrl.startsWith("http")) {
        googleDropdown.innerHTML = `
          <div class="injunction-content">
            <h2>${data.name}</h2>
            <img src="${data.imageUrl}" alt="Injunction Image" class="injunction-image"
              onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Not+Found';">
            <div class="injunction-info">${data.injunctionInfo}</div>
          </div>
        `;
      } else {
        googleDropdown.innerHTML = `<p>No injunction data found.</p>`;
      }
    
      document.body.removeChild(script);
      delete window[callbackName];
    };
    
  
    const url = `https://script.google.com/macros/s/AKfycbzvCS0IKhffdKDyAiOxuPw10SJZ_ebwZoxqY7w3guuF60zBdUFEnK8TxxBfK9iuV_2A/exec?callback=${callbackName}`;
  
    console.log("Requesting JSONP from:", url);
    script.src = url;
    document.body.appendChild(script);
  });  
});
