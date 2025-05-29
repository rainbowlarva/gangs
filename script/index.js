document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.generator-card').forEach(card => {
    card.addEventListener('click', function() {
      if (typeof gtag === "function") {
        const gen = card.querySelector('span').innerText.trim();
        gtag('event', 'generator_used', {
          'event_category': 'Generators',
          'event_label': gen
        });
      }
    });
  });

  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(dropdown => dropdown.classList.add('active'));

  const dropdownButtons = document.querySelectorAll('.dropdown-btn');
  dropdownButtons.forEach(button => {
    button.addEventListener('click', () => {
      const dropdown = button.closest('.dropdown');
      dropdown.classList.toggle('active');
    });
  });

const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalImageWrapper = document.querySelector('.modal-image-interactive');

let panzoomInstance = null;

function showModal(imageUrl) {
  modalImage.setAttribute('src', imageUrl);
  modalOverlay.classList.add('open');

  modalImage.onload = () => {
    if (panzoomInstance) {
      panzoomInstance.destroy();
      panzoomInstance = null;
    }
    panzoomInstance = panzoom(modalImage, {
      maxScale: 8,
      minScale: 1,
      contain: 'inside',
      animate: true
    });
    modalImage.onwheel = null;
    modalImage.addEventListener('wheel', panzoomInstance.zoomWithWheel, { passive: false });
  };
}

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('open');
    if (panzoomInstance) {
      panzoomInstance.destroy();
      panzoomInstance = null;
    }
  }
});

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.classList.remove('open');
    if (panzoomInstance) {
      panzoomInstance.destroy();
      panzoomInstance = null;
    }
  }
});


  const forumDriveMapLink = document.getElementById('forumDrive');
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

  const additionalMapLinkIds = ['jamestown', 'Charleston', 'missionrow'];
  additionalMapLinkIds.forEach(id => {
    const link = document.getElementById(id);
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const imageUrl = link.getAttribute('href');
        showModal(imageUrl);
      });
    }
  });

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
      if (panzoomInstance) {
        panzoomInstance.destroy();
        panzoomInstance = null;
      }
    }
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