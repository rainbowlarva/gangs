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

/**
 * Build the [cb]/[cbx] lines for property type:
 * - If a box is checked, it becomes [cbx], otherwise [cb].
 * - If “Other” is checked, we also append user text.
 */
function buildPropertyTypeBBCode() {
  const businessChecked = document.getElementById('businessCheck').checked;
  const residenceChecked = document.getElementById('residenceCheck').checked;
  const storageChecked   = document.getElementById('storageCheck').checked;
  const otherChecked     = document.getElementById('otherCheck').checked;
  const otherValue       = document.getElementById('otherType').value.trim();

  const businessLine  = businessChecked  ? `[cbc] Business`  : `[cb] Business`;
  const residenceLine = residenceChecked ? `[cbc] Residence` : `[cb] Residence`;
  const storageLine   = storageChecked   ? `[cbc] Storage`   : `[cb] Storage`;

  // If “Other” is checked => [cbx] Other: userValue, else => [cb] Other:
  const otherLine = otherChecked
    ? `[cbc] Other: ${otherValue || 'N/A'}`
    : `[cb] Other: `;

  return [
    businessLine,
    residenceLine,
    storageLine,
    otherLine
  ].join('\n');
}

/** 
 * Only one property type can be selected at a time. 
 * If “Other” is checked, show the extra input. 
 */
function handlePropertyTypeCheck(event) {
  const clickedId = event.target.id;
  const all = ['businessCheck', 'residenceCheck', 'storageCheck', 'otherCheck'];
  // Uncheck all except the one that was clicked
  all.forEach((id) => {
    if (id !== clickedId) {
      document.getElementById(id).checked = false;
    }
  });
  // Show/hide the “Specify Other Type” input
  toggleOtherType();
}

/**
 * Show or hide the “otherTypeContainer” depending on whether “otherCheck” is checked.
 */
function toggleOtherType() {
  const isOther = document.getElementById('otherCheck').checked;
  const container = document.getElementById('otherTypeContainer');
  container.style.display = isOther ? 'block' : 'none';
}

/** Add an input for the Non-Owners list. */
function addNonOwner() {
  const container = document.getElementById('nonOwnersList');
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('list-input');
  input.placeholder = "Name - Person's Association To Property";
  container.appendChild(input);
}

/** Remove the last input from Non-Owners. */
function removeNonOwner() {
  const container = document.getElementById('nonOwnersList');
  if (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

/** Gather occupant lines from Non-Owners. */
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

/** Clear the entire form. */
function clearForm() {
  document.getElementById('propertyForm').reset();
  // Clear dynamic Non-Owners
  document.getElementById('nonOwnersList').innerHTML = '';
  // Hide “Other Type” container
  document.getElementById('otherTypeContainer').style.display = 'none';
  // Clear output
  document.getElementById('bbcodeText').textContent = '';
}

/** Generate final BBCode from propertyTemplate. */
function generateBBCode(e) {
  e.preventDefault();

  // 1) Basic fields
  const address = document.getElementById('address').value.trim() || 'NAMEHERE';
  const propertyTypeBB = buildPropertyTypeBBCode(); // Our [cb]/[cbx] lines
  const businessLicenses = document.getElementById('businessLicenses').value.trim() || 'NAMEHERE';

  // Occupants
  const ownerName = document.getElementById('ownerName').value.trim() || 'NAMEHERE';
  const nonOwners = getNonOwners();

  // Attachments
  const propertyPhoto = document.getElementById('propertyPhoto').value.trim() || 'NAMEHERE';
  const otherText     = document.getElementById('otherAttachments').value.trim() || 'NAMEHERE';

  // 2) Make a copy
  let finalText = propertyTemplate;

  // 3) Replace placeholders
  // a) Address
  finalText = finalText.replace('[b]ADDRESS:[/b] NAMEHERE', `[b]ADDRESS:[/b] ${address}`);

  // b) Replace the 4 lines of [cb] with our propertyTypeBB
  const propertyTypeRegex = /\[cb\] Business\s*\[cb\] Residence\s*\[cb\] Storage\s*\[cb\] Other:/;
  finalText = finalText.replace(propertyTypeRegex, propertyTypeBB);

  // c) Business Licenses
  finalText = finalText.replace('[b]BUSINESS LICENSE(S):[/b] NAMEHERE', 
    `[b]BUSINESS LICENSE(S):[/b] ${businessLicenses}`);

  // d) Owner Name
  finalText = finalText.replace('[b]OWNER NAME:[/b] NAMEHERE', 
    `[b]OWNER NAME:[/b] ${ownerName}`);

  // e) Non-Owners => the template has “[*]Name - Person's Association To Property”
  if (nonOwners.length > 0) {
    const occupantLines = nonOwners.join('\n');
    finalText = finalText.replace('[*]Name - Person\'s Association To Property', occupantLines);
  }

  // f) Property Photo(s)
  finalText = finalText.replace('[img]NAMEHERE[/img]', `[img]${propertyPhoto}[/img]`);

  // g) “OTHER” => The template has a line: 
  // 
  // [b]OTHER[/b]
  //
  // NAMEHERE
  //
  // We replace that “NAMEHERE” with the user text
  finalText = finalText.replace('\nNAMEHERE\n', `\n${otherText}\n`);

  // 4) Output & Highlight
  document.getElementById('bbcodeText').textContent = finalText;
  const range = document.createRange();
  range.selectNodeContents(document.getElementById('bbcodeText'));
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

/** On DOM load, wire up everything. */
document.addEventListener('DOMContentLoaded', () => {
  // 1) Handle form submission => generate
  document.getElementById('propertyForm').addEventListener('submit', generateBBCode);

  // 2) Clear
  document.getElementById('clearButton').addEventListener('click', clearForm);

  // 3) Non-Owners dynamic
  document.getElementById('addNonOwner').addEventListener('click', addNonOwner);
  document.getElementById('removeNonOwner').addEventListener('click', removeNonOwner);

  // 4) If “Other” is checked => uncheck others + show input
  // If businessCheck, residenceCheck, storageCheck is checked => uncheck the rest
  const allChecks = ['businessCheck','residenceCheck','storageCheck','otherCheck'];
  allChecks.forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      // Uncheck all except the one that was clicked
      allChecks.forEach(otherId => {
        if (otherId !== e.target.id) {
          document.getElementById(otherId).checked = false;
        }
      });
      // Show/hide otherType input
      toggleOtherType();
    });
  });
});
