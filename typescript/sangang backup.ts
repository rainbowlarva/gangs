document.addEventListener('DOMContentLoaded', () => {
// Restore saved value if available
const filingOfficerInput = document.getElementById('filingOfficer');
const savedFilingOfficer = localStorage.getItem('filingOfficer');
if (savedFilingOfficer) {
  filingOfficerInput.value = savedFilingOfficer;
}

// Save to localStorage on change
filingOfficerInput.addEventListener('input', () => {
  localStorage.setItem('filingOfficer', filingOfficerInput.value);
});

  const threatLevelSelect = document.getElementById('threatLevel');

function updateThreatColor() {
  const value = threatLevelSelect.value.toLowerCase(); // 'low', 'medium', 'high'
  threatLevelSelect.classList.remove('low', 'medium', 'high');
  if (['low', 'medium', 'high'].includes(value)) {
    threatLevelSelect.classList.add(value);
  }
}

threatLevelSelect.addEventListener('change', updateThreatColor);
updateThreatColor(); // initialize on load

  const form = document.getElementById('sangangForm');
  const output = document.getElementById('htmlText');
  const clearBtn = document.getElementById('clearButton');

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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const officerRankVal = officerRank?.value.trim() || 'N/A';
const officerNameVal = officerName?.value.trim() || 'N/A';
const officerBadgeVal = officerBadge?.value.trim() || 'N/A';
const officer = `${officerRankVal} ${officerNameVal} (Badge #${officerBadgeVal})`;
    const date = (document.getElementById('date')?.value || 'N/A').trim();
    const criteria = (document.getElementById('criteria')?.value || 'N/A').trim();
    const evidence = (document.getElementById('evidence')?.value || 'N/A').trim();
const threatLevel = document.getElementById('threatLevel')?.value || 'N/A';

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
    threatColor = '#ffffff';
}

    const threatExplanation = (document.getElementById('threatExplanation')?.value || 'N/A').trim();
    const physicalDescription = (document.getElementById('physicalDescription')?.value || 'N/A').trim();
    const screenshots = getScreenshotURLs();

    const html = `
<div class="sangang-report">
  <p><span style="font-weight: bold;">Filing Officer:</span><br>${officer}</p>
  <p><span style="font-weight: bold;">Date:</span><br>${date}</p>
  <p><span style="font-weight: bold;">Criteria:</span><br>${criteria}</p>
  <p><span style="font-weight: bold;">Evidence:</span><br>${evidence}</p>
  <p><span style="font-weight: bold;">Threat Level:</span><br>
  <span style="color: ${threatColor}; font-weight: bold;">${threatLevel}</span>
  </p>
  <p><span style="font-weight: bold;">Threat Explanation:</span><br>${threatExplanation}</p>
  <p><span style="font-weight: bold;">Physical Description:</span><br>${physicalDescription}</p>
  ${screenshots.length ? "<p><strong>Screenshots:</strong></p>" : ""}
  ${screenshots.map(url => `<img src="${url}" alt="Screenshot" style="max-width: 100%; margin-bottom: 10px;">`).join("")}
</div>
`;

    output.textContent = html;
    const range = document.createRange();
    range.selectNodeContents(output);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    document.getElementById('screenshotList').innerHTML = '';
    output.textContent = '';
  });

  document.getElementById('addScreenshot').addEventListener('click', addScreenshotField);
  document.getElementById('removeScreenshot').addEventListener('click', removeScreenshotField);
});