/****************************************************
 * property.js
 * Example: Property of Interest BBCode Generator
 ****************************************************/

/**
 * The exact text from property.txt as a multiline template.
 */
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
 * For each property type (Business, Residence, Storage, Other), we have a checkbox.
 * We'll convert them to [cbx] if checked, [cb] if not. For "Other", we also add user text if it's checked.
 */
function buildPropertyTypeBBCode() {
  // We have 4 checkboxes: businessCheck, residenceCheck, storageCheck, otherCheck
  // We'll produce lines like:
  // [cbx] Business
  // [cbx] Residence
  // [cbx] Storage
  // [cbx] Other: some custom text
  // If unchecked, it's [cb].
  let propertyTypeLines = [];

  // 1) Business
  const business = document.getElementById('businessCheck').checked
    ? `[cbx] Business`
    : `[cb] Business`;
  propertyTypeLines.push(business);

  // 2) Residence
  const residence = document.getElementById('residenceCheck').checked
    ? `[cbx] Residence`
    : `[cb] Residence`;
  propertyTypeLines.push(residence);

  // 3) Storage
  const storage = document.getElementById('storageCheck').checked
    ? `[cbx] Storage`
    : `[cb] Storage`;
  propertyTypeLines.push(storage);

  // 4) Other
  const otherCheck = document.getElementById('otherCheck').checked;
  const otherValue = document.getElementById('otherType').value.trim();
  if (otherCheck) {
    // e.g. [cbx] Other: Warehouse
    propertyTypeLines.push(`[cbx] Other: ${otherValue || 'N/A'}`);
  } else {
    // [cb] Other:
    propertyTypeLines.push(`[cb] Other: `);
  }

  // Return the lines joined by newlines
  return propertyTypeLines.join('\n');
}

/**
 * Adds an input for the "nonOwnersList".
 */
function addNonOwner() {
  const container = document.getElementById('nonOwnersList');
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('list-input');
  input.placeholder = "Name - Person's Association To Property";
  container.appendChild(input);
}

/**
 * Removes the last input from the "nonOwnersList".
 */
function removeNonOwner() {
  const container = document.getElementById('nonOwnersList');
  if (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

/**
 * Gathers the occupant lines from #nonOwnersList inputs.
 */
function getNonOwners() {
  const container = document.getElementById('nonOwnersList');
  const inputs = container.querySelectorAll('.list-input');
  const lines = [];
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (val) {
      // e.g. [*] John Doe - Tenant
      lines.push(`[*] ${val}`);
    }
  });
  return lines;
}

/**
 * Toggles the "Specify Other Type" input if the "Other" checkbox is checked.
 */
function toggleOtherType() {
  const otherCheck = document.getElementById('otherCheck').checked;
  const otherTypeContainer = document.getElementById('otherTypeContainer');
  otherTypeContainer.style.display = otherCheck ? 'block' : 'none';
}

/**
 * Clears the entire form and resets.
 */
function clearForm() {
  document.getElementById('propertyForm').reset();

  // Remove dynamic inputs from the nonOwnersList
  document.getElementById('nonOwnersList').innerHTML = '';

  // Hide the otherType container
  document.getElementById('otherTypeContainer').style.display = 'none';

  // Clear output
  document.getElementById('bbcodeText').textContent = '';
}

/**
 * Generate the BBCode from property.txt and place it in #bbcodeText
 */
function generateBBCode(event) {
  event.preventDefault();

  // 1) Grab user inputs
  const address = document.getElementById('address').value.trim() || 'NAMEHERE';
  const propertyTypeBBCode = buildPropertyTypeBBCode(); // checkboxes -> [cb] or [cbx]
  const businessLicenses = document.getElementById('businessLicenses').value.trim() || 'NAMEHERE';

  const ownerName = document.getElementById('ownerName').value.trim() || 'NAMEHERE';
  const nonOwners = getNonOwners(); // dynamic list
  const photoUrl = document.getElementById('propertyPhoto').value.trim() || 'NAMEHERE';
  const otherAttachments = document.getElementById('otherAttachments').value.trim() || 'NAMEHERE';

  // 2) Make a copy of the propertyTemplate
  let finalText = propertyTemplate;

  // Replace placeholders
  // a) [b]ADDRESS:[/b] NAMEHERE
  finalText = finalText.replace('[b]ADDRESS:[/b] NAMEHERE', `[b]ADDRESS:[/b] ${address}`);

  // b) [cb] lines for property type
  // We have 4 lines:
  // [cb] Business
  // [cb] Residence
  // [cb] Storage
  // [cb] Other:
  // We'll replace them with our generated propertyTypeBBCode
  // So let's do a simple approach: We see in the template:
  //
  // [cb] Business
  // [cb] Residence
  // [cb] Storage
  // [cb] Other:
  //
  // We'll do a single replace that covers them all in a chunk
  const propertyTypeRegex = /\[cb\] Business\s*\[cb\] Residence\s*\[cb\] Storage\s*\[cb\] Other:/;
  finalText = finalText.replace(propertyTypeRegex, propertyTypeBBCode);

  // c) [b]BUSINESS LICENSE(S):[/b] NAMEHERE
  finalText = finalText.replace('[b]BUSINESS LICENSE(S):[/b] NAMEHERE', `[b]BUSINESS LICENSE(S):[/b] ${businessLicenses}`);

  // d) [b]OWNER NAME:[/b] NAMEHERE
  finalText = finalText.replace('[b]OWNER NAME:[/b] NAMEHERE', `[b]OWNER NAME:[/b] ${ownerName}`);

  // e) Non-owners: The template has:
  // [b]NON-OWNERS[/b]
  // [list]
  // [*]Name - Person's Association To Property
  // We'll replace the single line "[*]Name - Person's Association To Property" with multiple lines if user added more
  if (nonOwners.length > 0) {
    const occupantLines = nonOwners.join('\n');
    finalText = finalText.replace('[*]Name - Person\'s Association To Property', occupantLines);
  }

  // f) [img]NAMEHERE[/img]
  finalText = finalText.replace('[img]NAMEHERE[/img]', `[img]${photoUrl}[/img]`);

  // g) The "OTHER" section is just "NAMEHERE"
  finalText = finalText.replace('\nNAMEHERE\n', `\n${otherAttachments}\n`);

  // 3) Display the final text in #bbcodeText
  document.getElementById('bbcodeText').textContent = finalText;

  // 4) Auto-highlight
  const codeElement = document.getElementById('bbcodeText');
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Wire everything up on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Submit
  document.getElementById('propertyForm').addEventListener('submit', generateBBCode);
  // Clear
  document.getElementById('clearButton').addEventListener('click', clearForm);

  // Non-owners dynamic list
  document.getElementById('addNonOwner').addEventListener('click', addNonOwner);
  document.getElementById('removeNonOwner').addEventListener('click', removeNonOwner);

  // Show/hide "otherTypeContainer" if the "Other" box is checked
  const otherCheck = document.getElementById('otherCheck');
  otherCheck.addEventListener('change', () => {
    const container = document.getElementById('otherTypeContainer');
    container.style.display = otherCheck.checked ? 'block' : 'none';
  });
});