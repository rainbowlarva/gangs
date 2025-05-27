document.addEventListener('DOMContentLoaded', () => {
  // Utility to replace newlines with <br>
  function nl2br(str) {
    if (!str) return '';
    return str.replace(/\n/g, '<br>');
  }

  // Auto-resize textareas
  function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
  document.querySelectorAll('textarea').forEach(textarea => {
    textarea.addEventListener('input', function() {
      autoResizeTextarea(this);
    });
    autoResizeTextarea(textarea);
  });

  const officerRank = document.getElementById('officerRank');
  const officerName = document.getElementById('officerName');
  const officerBadge = document.getElementById('officerBadge');

  officerRank.value = localStorage.getItem('officerRank') || '';
  officerName.value = localStorage.getItem('officerName') || '';
  officerBadge.value = localStorage.getItem('officerBadge') || '';

  officerRank.addEventListener('input', () => localStorage.setItem('officerRank', officerRank.value));
  officerName.addEventListener('input', () => localStorage.setItem('officerName', officerName.value));
  officerBadge.addEventListener('input', () => localStorage.setItem('officerBadge', officerBadge.value));

  const threatLevelSelect = document.getElementById('threatLevel');

  function updateThreatColor() {
    const value = threatLevelSelect.value.toLowerCase();
    threatLevelSelect.classList.remove('low', 'medium', 'high');
    if (['low', 'medium', 'high'].includes(value)) {
      threatLevelSelect.classList.add(value);
    }
  }

  threatLevelSelect.addEventListener('change', updateThreatColor);
  updateThreatColor();

  const form = document.getElementById('sangangForm');
  const output = document.getElementById('htmlText');
  const clearBtn = document.getElementById('clearButton');

  // Screenshot logic
  function addScreenshotField() {
    const container = document.getElementById('screenshotList');
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('list-input');
    input.placeholder = 'Image URL';
    container.appendChild(input);
  }
  function removeScreenshotField() {
    const container = document.getElementById('screenshotList');
    if (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  }
  function getScreenshotURLs() {
    const container = document.getElementById('screenshotList');
    const inputs = container.querySelectorAll('input');
    return Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
  }

  // Attachments logic
  function addAttachmentField() {
    const container = document.getElementById('attachmentList');
    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add('list-input');
    input.placeholder = 'Paste incident report URL';
    container.appendChild(input);
  }
  function removeAttachmentField() {
    const container = document.getElementById('attachmentList');
    if (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  }
  function getAttachmentURLs() {
    const container = document.getElementById('attachmentList');
    const inputs = container.querySelectorAll('input');
    return Array.from(inputs).map(input => input.value.trim()).filter(Boolean);
  }

  // Add listeners for attachments
  document.getElementById('addAttachment').addEventListener('click', addAttachmentField);
  document.getElementById('removeAttachment').addEventListener('click', removeAttachmentField);

  // Screenshot listeners
  document.getElementById('addScreenshot').addEventListener('click', addScreenshotField);
  document.getElementById('removeScreenshot').addEventListener('click', removeScreenshotField);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const officer = `${officerRank.value.trim() || 'N/A'} ${officerName.value.trim() || 'N/A'} (Badge #${officerBadge.value.trim() || 'N/A'})`;
    const date = (document.getElementById('date')?.value || 'N/A').trim();
    const criteria = nl2br((document.getElementById('criteria')?.value || 'N/A').trim());
    const evidence = nl2br((document.getElementById('evidence')?.value || 'N/A').trim());
    const threatLevel = document.getElementById('threatLevel')?.value || 'N/A';
    const threatExplanation = nl2br((document.getElementById('threatExplanation')?.value || 'N/A').trim());
    const physicalDescription = nl2br((document.getElementById('physicalDescription')?.value || 'N/A').trim());
    const screenshots = getScreenshotURLs();
    const attachments = getAttachmentURLs();

    let threatColor;
    switch (threatLevel.toLowerCase()) {
      case ' low':
        threatColor = '#2196F3';
        break;
      case ' medium':
        threatColor = '#FF9800';
        break;
      case ' high':
        threatColor = '#F44336';
        break;
      default:
        threatColor = '#000000';
    }

    // Compose the attachments section
    const attachmentsHtml = attachments.length
      ? `<tr><th colspan="2" style="font-weight: bold; font-size: 10px;">ATTACHMENTS</th></tr>
         <tr><td colspan="2" style="font-size: 14px;">
           <ul style="margin:0;padding-left:20px;">
           ${attachments.map(url => `<li><a href="${url}" target="_blank">${url}</a></li>`).join('')}
           </ul>
         </td></tr>`
      : '';

    const html = `
<div style="padding: 2px; border: 1px solid #000; background-color: white; width: 100%; max-width: 210mm; color: black; font-family: Arial, sans-serif;">
  <h1 style="text-align: center; font-size: 16px; font-weight: bold; margin-top: 10px;">LOS SANTOS POLICE DEPARTMENT<br>GANG DESIGNATION REPORT</h1>
  <table border="1" cellpadding="2" style="width:100%; border-collapse: collapse; color: black;">
    <tr>
      <th style="font-weight: bold; font-size: 10px; width: 70%;">FILING OFFICER</th>
      <th style="font-weight: bold; font-size: 10px; width: 30%;">DATE</th>
    </tr>
    <tr>
      <td style="font-size: 14px; text-transform: uppercase; width: 70%;">${officer}</td>
      <td style="font-size: 14px; text-transform: uppercase; width: 30%;">${date}</td>
    </tr>

    <tr><th colspan="2" style="font-weight: bold; font-size: 10px;">CRITERIA</th></tr>
    <tr><td colspan="2" style="font-size: 14px;">${criteria}</td></tr>

    <tr>
      <th style="font-weight: bold; font-size: 10px; width: 70%;">THREAT EXPLANATION</th>  
      <th style="font-weight: bold; font-size: 10px; width: 30%;">THREAT LEVEL</th>
    </tr>
    <tr>
    <td style="font-size: 14px;">${threatExplanation}</td>
      <td style="font-size: 14px; font-weight: bold;">
        <span style="color: ${threatColor};">${threatLevel}</span>
      </td>
    </tr>

    <tr><th colspan="2" style="font-weight: bold; font-size: 10px;">EVIDENCE</th></tr>
    <tr><td colspan="2" style="font-size: 14px;">${evidence}</td></tr>

    <tr><th colspan="2" style="font-weight: bold; font-size: 10px;">PHYSICAL DESCRIPTION</th></tr>
    <tr><td colspan="2" style="font-size: 14px;">${physicalDescription}</td></tr>

    ${attachmentsHtml}

    ${screenshots.length ? `<tr><th colspan="2" style="font-weight: bold; font-size: 10px;">PHOTOS / IMAGES</th></tr>` : ""}
    ${screenshots.map(url => `<tr><td colspan="2" style="text-align:center;"><img src="${url}" alt="Screenshot" style="max-width: 100%; margin: 10px 0;"></td></tr>`).join("")}
  </table>
</div>
`;

    // Output as raw code
    output.textContent = html;

    // Live preview below
    const preview = document.getElementById('htmlPreview');
    if (preview) {
      preview.innerHTML = "<h2>Preview:</h2>" + html;
    }

    // Select for easy copying
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    document.getElementById('screenshotList').innerHTML = '';
    document.getElementById('attachmentList').innerHTML = '';
    output.textContent = '';
    const preview = document.getElementById('htmlPreview');
    if (preview) {
      preview.innerHTML = "<h2>Preview:</h2>";
    }
  });
});

// --- Tutorial Overlay Logic ---
function showTutorial() {
  document.getElementById('tutorialOverlay').style.display = 'flex';
}
function hideTutorial() {
  document.getElementById('tutorialOverlay').style.display = 'none';
}

// Show only on first visit in this browser
window.addEventListener('DOMContentLoaded', function() {
  if (!localStorage.getItem('sangangTutorialSeen')) {
    showTutorial();
    localStorage.setItem('sangangTutorialSeen', 'yes');
  }
  document.getElementById('tutorialBtn').onclick = function(e) {
    e.preventDefault();
    showTutorial();
  };
  // Click outside the modal closes overlay
  document.getElementById('tutorialOverlay').onclick = function(e) {
    if (e.target === this) { // Only if clicking the overlay itself, not inside content
      hideTutorial();
    }
  };
  // Prevent click-inside from bubbling to overlay
  document.getElementById('tutorialWindow').onclick = function(e) {
    e.stopPropagation();
  };
});
