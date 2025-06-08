const propertyTemplate = `[divbox=white]
[center][u]DETECTIVE BUREAU - PROPERTY OF INTEREST[/u][/center]
[divbox=black][center][b][color=#FFFFFF]PROPERTY[/color][/b][/center][/divbox]
[divbox=white]
[b]ADDRESS:[/b] NAMEHERE
[b]PROPERTY TYPE[/b]
[cb] Business
[cb] Residence
[cb] Storage
[cb] Other: 
[b]BUSINESS LICENSE(S):[/b] NAMEHERE
[/divbox]
[hr][/hr]
[divbox=black][center][b][color=#FFFFFF]OCCUPANTS[/color][/b][/center][/divbox]
[divbox=white]
[b]OWNER NAME:[/b] NAMEHERE
[b]NON-OWNERS[/b] 
[list]
[*]Name - Person's Association To Property
[/divbox]
[hr][/hr]
[divbox=black][center][b][color=#FFFFFF]ATTACHMENTS[/color][/b][/center][/divbox]
[divbox=white]
[b]PROPERTY PHOTO(S)[/b]
[img]NAMEHERE[/img]

[b]OTHER[/b]

NAMEHERE

[/divbox]
[/divbox]`;

function buildPropertyTypeBBCode() {
  const businessChecked = document.getElementById('businessCheck').checked;
  const residenceChecked = document.getElementById('residenceCheck').checked;
  const storageChecked   = document.getElementById('storageCheck').checked;
  const otherChecked     = document.getElementById('otherCheck').checked;
  const otherValue       = document.getElementById('otherType').value.trim();

  const businessLine  = businessChecked  ? `[cbx] Business`  : `[cb] Business`;
  const residenceLine = residenceChecked ? `[cbx] Residence` : `[cb] Residence`;
  const storageLine   = storageChecked   ? `[cbx] Storage`   : `[cb] Storage`;

  const otherLine = otherChecked
    ? `[cbx] Other: ${otherValue || 'N/A'}`
    : `[cb] Other: `;

  return [
    businessLine,
    residenceLine,
    storageLine,
    otherLine
  ].join('\n');
}

function handlePropertyTypeCheck(event) {
  const clickedId = event.target.id;
  const all = ['businessCheck', 'residenceCheck', 'storageCheck', 'otherCheck'];
  // Uncheck all except the one that was clicked
  all.forEach((id) => {
    if (id !== clickedId) {
      document.getElementById(id).checked = false;
    }
  });
  toggleOtherType();
}

function toggleOtherType() {
  const isOther = document.getElementById('otherCheck').checked;
  const container = document.getElementById('otherTypeContainer');
  container.style.display = isOther ? 'block' : 'none';
}

function addNonOwner() {
  const container = document.getElementById('nonOwnersList');
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('list-input');
  input.placeholder = "Name - Person's Association To Property";
  container.appendChild(input);
}

function removeNonOwner() {
  const container = document.getElementById('nonOwnersList');
  if (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

function getNonOwners() {
  const container = document.getElementById('nonOwnersList');
  const inputs = container.querySelectorAll('.list-input');
  const lines = [];
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (val) lines.push(`[*] ${val}`);
  });
  return lines;
}

function clearForm() {
  document.getElementById('propertyForm').reset();
  document.getElementById('nonOwnersList').innerHTML = '';
  document.getElementById('otherTypeContainer').style.display = 'none';
  document.getElementById('bbcodeText').textContent = '';
}

function generateBBCode(e) {
  e.preventDefault();

  const address = document.getElementById('address').value.trim() || 'N/A';
  const propertyTypeBB = buildPropertyTypeBBCode(); // Our [cb]/[cbx] lines
  const businessLicenses = document.getElementById('businessLicenses').value.trim() || 'N/A';

  const ownerName = document.getElementById('ownerName').value.trim() || 'N/A';
  const nonOwners = getNonOwners();

  const propertyPhoto = document.getElementById('propertyPhoto').value.trim() || 'N/A';
  const otherText     = document.getElementById('otherAttachments').value.trim() || 'N/A';

  let finalText = propertyTemplate;

  finalText = finalText.replace('[b]ADDRESS:[/b] NAMEHERE', `[b]ADDRESS:[/b] ${address}`);

  const propertyTypeRegex = /\[cb\] Business\s*\[cb\] Residence\s*\[cb\] Storage\s*\[cb\] Other:/;
  finalText = finalText.replace(propertyTypeRegex, propertyTypeBB);

  finalText = finalText.replace('[b]BUSINESS LICENSE(S):[/b] NAMEHERE', 
    `[b]BUSINESS LICENSE(S):[/b] ${businessLicenses}`
  );

  finalText = finalText.replace('[b]OWNER NAME:[/b] NAMEHERE', 
    `[b]OWNER NAME:[/b] ${ownerName}`
  );

  if (nonOwners.length > 0) {
    const occupantLines = nonOwners.join('\n');
    finalText = finalText.replace('[*]Name - Person\'s Association To Property', occupantLines);
  }

  finalText = finalText.replace('[img]NAMEHERE[/img]', `[img]${propertyPhoto}[/img]`);

  finalText = finalText.replace('\nNAMEHERE\n', `\n${otherText}\n`);

  document.getElementById('bbcodeText').textContent = finalText;
  const range = document.createRange();
  range.selectNodeContents(document.getElementById('bbcodeText'));
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('propertyForm').addEventListener('submit', generateBBCode);

  document.getElementById('clearButton').addEventListener('click', clearForm);

  document.getElementById('addNonOwner').addEventListener('click', addNonOwner);
  document.getElementById('removeNonOwner').addEventListener('click', removeNonOwner);

  const allChecks = ['businessCheck','residenceCheck','storageCheck','otherCheck'];
  allChecks.forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      allChecks.forEach(otherId => {
        if (otherId !== e.target.id) {
          document.getElementById(otherId).checked = false;
        }
      });
      toggleOtherType();
    });
  });
});