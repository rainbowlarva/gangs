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
  
  // --- Google Content Dropdown Banner using JSONP ---
  const googleHeader = document.getElementById('googleHeader');
  const googleDropdown = document.getElementById('googleDropdown');
  
  googleHeader.addEventListener('click', () => {
    // Immediately toggle the dropdown open/closed
    googleDropdown.classList.toggle('open');
    
    // Generate a unique callback function name using a timestamp
    const callbackName = 'handleGoogleContent_' + Date.now();
    console.log("Callback name:", callbackName);
    
    // Create a script element variable that will be used for JSONP
    let script = document.createElement('script');
    
    // Define the callback function to process the JSONP response
    window[callbackName] = function(data) {
      console.log("JSONP callback called with data:", data);
      // If your doGet returns { content: "Your Google content goes here" }
      // then data.content is "Your Google content goes here"
      googleDropdown.innerHTML = data.content || "No 'content' in the JSON!";
      
      // Clean up: remove the script element and delete the callback
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      delete window[callbackName];
    };
    
    // Construct the JSONP URL
    const url = 'https://script.google.com/macros/s/AKfycby56ZYfNzYvtTT9wCszYHsAgDOH2Zn7GSPyoeLpro3VLJ393M7O8iHOfIDINMp2nxwS/exec'
              + '?mode=get&callback=' + callbackName;
    
    console.log("Requesting JSONP from:", url);
    script.src = url;
    document.body.appendChild(script);
  });
});
