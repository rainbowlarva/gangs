document.addEventListener('DOMContentLoaded', () => {
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

  function showModal(imageUrl, enablePanzoom = false) {
    modalImage.setAttribute('src', '');
    modalImage.setAttribute('src', imageUrl);
    modalOverlay.classList.add('open');

    if (panzoomInstance) {
      panzoomInstance.destroy();
      panzoomInstance = null;
    }

    modalImage.onload = () => {
      if (enablePanzoom) {
        panzoomInstance = panzoom(modalImage, {
          maxScale: 8,
          minScale: 1,
          contain: 'inside',
          animate: true
        });
        modalImage.onwheel = null;
        modalImage.addEventListener('wheel', panzoomInstance.zoomWithWheel, { passive: false });
      } else {
        modalImage.style.transform = '';
        modalImage.onwheel = null;
      }
    };
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
      if (panzoomInstance) {
        panzoomInstance.destroy();
        panzoomInstance = null;
      }
      modalImage.setAttribute('src', '');
    }
  });

  // ALL STATIC MAPS
  const staticMapLinkIds = ['forumDrive', 'jamestown', 'Charleston', 'missionrow'];
  staticMapLinkIds.forEach(id => {
    const link = document.getElementById(id);
    if (link) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const imageUrl = link.getAttribute('href');
        showModal(imageUrl, false);
      });
    }
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
      const images = await fetchAlbumImages('rCsvUxU');
      if (images.length > 0) {
        const lastImage = images[images.length - 1];
        showModal(lastImage.link, true); // Panzoom ENABLED
      } else {
        console.error('No images found in album');
      }
    } catch (err) {
      console.error('Error fetching album images:', err);
    }
  });

  const googleHeader = document.getElementById('googleHeader');
  const googleDropdown = document.getElementById('googleDropdown');

  googleHeader.addEventListener('click', () => {
    googleDropdown.classList.toggle('open');

    const callbackName = 'handleGoogleContent_' + Date.now();
    let script = document.createElement('script');

    window[callbackName] = function(data) {
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
    script.src = url;
    document.body.appendChild(script);
  });
});

function updateUtcTime() {
  const now = new Date();
  const utcString = now.toISOString().split("T")[1].split(".")[0]; // HH:MM:SS
  const timeElement = document.getElementById("utcTime");
  if (timeElement) {
    timeElement.textContent = utcString;
  }
}

setInterval(updateUtcTime, 1000);
updateUtcTime();

const saveButton = document.getElementById('saveOfficerInfo');
const officerNameInput = document.getElementById('officerName');
const serialNumberInput = document.getElementById('serialNumber');
const officerRankSelect = document.getElementById('officerRank');
const displayOfficerName = document.getElementById('displayOfficerName');
const displaySerialNumber = document.getElementById('displaySerialNumber');
const displayOfficerRank = document.getElementById('displayOfficerRank');
const officerForm = document.getElementById('officerForm');
const officerDisplay = document.getElementById('officerDisplay');

function saveOfficerData(name, serial, rank) {
  ['officerName', 'employeeName'].forEach(key => localStorage.setItem(key, name));
  ['serialNo', 'officerBadge'].forEach(key => localStorage.setItem(key, serial));
  localStorage.setItem('officerRank', rank);
}

function showOfficerDisplay(name, serial, rank) {
  displayOfficerName.textContent = name;
  displaySerialNumber.textContent = serial;
  displayOfficerRank.textContent = rank;
  officerForm.style.display = 'none';
  officerDisplay.style.display = 'block';
  saveButton.textContent = 'Edit';
}

function showOfficerForm() {
  officerForm.style.display = 'block';
  officerDisplay.style.display = 'none';
  saveButton.textContent = 'Save';
}

const storedName = localStorage.getItem('officerName');
const storedSerial = localStorage.getItem('serialNo');
const storedRank = localStorage.getItem('officerRank');

if (storedName && storedSerial) {
  officerNameInput.value = storedName;
  serialNumberInput.value = storedSerial;
  officerRankSelect.value = storedRank;
  showOfficerDisplay(storedName, storedSerial, storedRank);
} else {
  showOfficerForm();
}

saveButton.addEventListener('click', () => {
  if (saveButton.textContent === 'Save') {
    const name = officerNameInput.value.trim();
    const serial = serialNumberInput.value.trim();
    const rank = officerRankSelect.value;

    if (name && serial && rank) {
      saveOfficerData(name, serial, rank);
      showOfficerDisplay(name, serial, rank);
    }
  } else {
    showOfficerForm();
    officerNameInput.value = localStorage.getItem('officerName') || '';
    serialNumberInput.value = localStorage.getItem('serialNo') || '';
    officerRankSelect.value = localStorage.getItem('officerRank') || '';
  }
});
