const poiTemplate = `
[divbox=white]
[center][u]DETECTIVE BUREAU - PERSON OF INTEREST[/u][/center]
[hr][/hr]
[center]
[img]https://i.imgur.com/RvO2yL5.png?1[/img]
[url=NAMEHERE]MDC[/url]
[/center]
[hr][/hr]
[b]NAME:[/b] NAMEHERE
[b]RACE:[/b] NAMEHERE
[b]SEX:[/b] NAMEHERE
[b]AGE:[/b] NAMEHERE
[b]DESCRIPTION:[/b] NAMEHERE
[b]SAN-GANG File:[/b] [url=NAMEHERE]ACCESS[/url]
[b]Affiliation:[/b] NAMEHERE
[b]Status:[/b] [b][color=#00BF00]ALIVE[/color][/b]/[b][color=#FF0000]DECEASED[/color][/b]/[b]UNKNOWN[/b]
[b]Known Properties[/b]:
[list]
[*] NAMEHERE
[/list]
[b]Known Phone Numbers:[/b]
[list]
[*] NAMEHERE
[/list]
[b]Known Associates[/b]:
[list]
[*] NAMEHERE
[/list]
[b]Related IR/CASEFILES[/b]:
[list]
[*] NAMEHERE
[/list]
[/divbox]
`;

// Custom placeholders for each dynamic list container:
const placeholderConfig = {
  propertiesList: "Enter property address/name.",
  phonesList: "Enter phone number.",
  associatesList: "Enter associate's name/alias.",
  casesList: "Enter IR or casefile number."
};

/**
 * Returns the BBCode snippet for subject's status (Alive/Deceased/Unknown).
 */
function getStatusBBCode() {
  const alive = document.getElementById('aliveCheck').checked;
  const dead = document.getElementById('deadCheck').checked;
  const unknown = document.getElementById('unknownCheck').checked;

  if (alive) return `[b][color=#00BF00]ALIVE[/color][/b]`;
  if (dead) return `[b][color=#FF0000]DECEASED[/color][/b]`;
  if (unknown) return `[b]UNKNOWN[/b]`;
  return `[b]UNKNOWN[/b]`;
}

/**
 * Ensures only one of Alive/Dead/Unknown can be checked at a time.
 */
function handleStatusCheckboxes(event) {
  if (event.target.id === 'aliveCheck') {
    document.getElementById('deadCheck').checked = false;
    document.getElementById('unknownCheck').checked = false;
  } else if (event.target.id === 'deadCheck') {
    document.getElementById('aliveCheck').checked = false;
    document.getElementById('unknownCheck').checked = false;
  } else if (event.target.id === 'unknownCheck') {
    document.getElementById('aliveCheck').checked = false;
    document.getElementById('deadCheck').checked = false;
  }
}

/**
 * Adds an <input> to the specified container (for dynamic lists).
 */
function addListItem(containerId) {
  const container = document.getElementById(containerId);
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('list-input');
  // Use custom placeholder if defined:
  input.placeholder = placeholderConfig[containerId] || "NAMEHERE";
  container.appendChild(input);
}

/**
 * Removes the last <input> from the specified container (if any).
 */
function removeListItem(containerId) {
  const container = document.getElementById(containerId);
  // Just remove the last child if it exists:
  if (container && container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

/**
 * Returns an array of trimmed input values from a container's .list-input fields.
 */
function getListItems(containerId) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll('.list-input');
  const items = [];
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (val) items.push(val);
  });
  return items;
}

/**
 * Clears the form, removes all dynamic inputs, and clears the BBCode output.
 */
function clearForm() {
  document.getElementById('poiForm').reset();
  // Remove dynamic inputs from each container:
  ['propertiesList','phonesList','associatesList','casesList'].forEach((id) => {
    document.getElementById(id).innerHTML = '';
  });
  document.getElementById('bbcodeText').textContent = '';
}

/**
 * Generates BBCode, places it in #bbcodeText, and auto-highlights it.
 */
function generateBBCode(event) {
  event.preventDefault(); // Prevent form submission

  // Gather normal fields
  const poiName     = document.getElementById('poiName').value.trim()     || 'NAMEHERE';
  const imageUrl    = document.getElementById('imageUrl').value.trim()    || 'https://i.imgur.com/RvO2yL5.png?1';
  const mdcUrl      = document.getElementById('mdcUrl').value.trim()      || 'NAMEHERE';
  const race        = document.getElementById('race').value.trim()        || 'NAMEHERE';
  const sex         = document.getElementById('sex').value.trim()         || 'NAMEHERE';
  const age         = document.getElementById('age').value.trim()         || 'NAMEHERE';
  const description = document.getElementById('description').value.trim() || 'NAMEHERE';
  const sanGangFile = document.getElementById('sanGangFile').value.trim() || 'NAMEHERE';
  const affiliation = document.getElementById('affiliation').value.trim() || 'NAMEHERE';

  // Subject status
  const statusBB = getStatusBBCode();

  // Dynamic lists
  const properties = getListItems('propertiesList');
  const phones     = getListItems('phonesList');
  const associates = getListItems('associatesList');
  const cases      = getListItems('casesList');

  // Make a copy of the template
  let finalText = poiTemplate;

  // Insert user image + MDC link
  finalText = finalText.replace('https://i.imgur.com/RvO2yL5.png?1', imageUrl);
  finalText = finalText.replace('[url=NAMEHERE]MDC[/url]', `[url=${mdcUrl}]MDC[/url]`);

  // Basic placeholders
  finalText = finalText.replace('[b]NAME:[/b] NAMEHERE', `[b]NAME:[/b] ${poiName}`);
  finalText = finalText.replace('[b]RACE:[/b] NAMEHERE', `[b]RACE:[/b] ${race}`);
  finalText = finalText.replace('[b]SEX:[/b] NAMEHERE', `[b]SEX:[/b] ${sex}`);
  finalText = finalText.replace('[b]AGE:[/b] NAMEHERE', `[b]AGE:[/b] ${age}`);
  finalText = finalText.replace('[b]DESCRIPTION:[/b] NAMEHERE', `[b]DESCRIPTION:[/b] ${description}`);
  finalText = finalText.replace(
    '[b]SAN-GANG File:[/b] [url=NAMEHERE]ACCESS[/url]',
    `[b]SAN-GANG File:[/b] [url=${sanGangFile}]ACCESS[/url]`
  );
  finalText = finalText.replace('[b]Affiliation:[/b] NAMEHERE', `[b]Affiliation:[/b] ${affiliation}`);

  // Status
  finalText = finalText.replace(
    '[b]Status:[/b] [b][color=#00BF00]ALIVE[/color][/b]/[b][color=#FF0000]DECEASED[/color][/b]/[b]UNKNOWN[/b]',
    `[b]Status:[/b] ${statusBB}`
  );

  // Known Properties
  if (properties.length > 0) {
    const lines = properties.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace('[list]\n[*] NAMEHERE\n[/list]', `[list]\n${lines}\n[/list]`);
  }

  // Known Phone Numbers
  if (phones.length > 0) {
    const lines = phones.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace(
      '[b]Known Phone Numbers:[/b]\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Known Phone Numbers:[/b]\n[list]\n${lines}\n[/list]`
    );
  }

  // Known Associates
  if (associates.length > 0) {
    const lines = associates.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace(
      '[b]Known Associates[/b]:\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Known Associates[/b]:\n[list]\n${lines}\n[/list]`
    );
  }

  // Related IR/Casefiles
  if (cases.length > 0) {
    const lines = cases.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace(
      '[b]Related IR/CASEFILES[/b]:\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Related IR/CASEFILES[/b]:\n[list]\n${lines}\n[/list]`
    );
  }

  // Place final text in #bbcodeText
  document.getElementById('bbcodeText').textContent = finalText;

  // Auto-highlight
  const codeElement = document.getElementById('bbcodeText');
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

// On DOMContentLoaded, wire up everything
document.addEventListener('DOMContentLoaded', () => {
  // Generate button
  document.getElementById('poiForm').addEventListener('submit', generateBBCode);

  // Clear button
  document.getElementById('clearButton').addEventListener('click', clearForm);

  // Alive/Dead/Unknown checkboxes
  document.getElementById('aliveCheck').addEventListener('change', handleStatusCheckboxes);
  document.getElementById('deadCheck').addEventListener('change', handleStatusCheckboxes);
  document.getElementById('unknownCheck').addEventListener('change', handleStatusCheckboxes);

  // Add/Remove dynamic items
  document.getElementById('addProperty').addEventListener('click', () => addListItem('propertiesList'));
  document.getElementById('removeProperty').addEventListener('click', () => removeListItem('propertiesList'));

  document.getElementById('addPhone').addEventListener('click', () => addListItem('phonesList'));
  document.getElementById('removePhone').addEventListener('click', () => removeListItem('phonesList'));

  document.getElementById('addAssociate').addEventListener('click', () => addListItem('associatesList'));
  document.getElementById('removeAssociate').addEventListener('click', () => removeListItem('associatesList'));

  document.getElementById('addCase').addEventListener('click', () => addListItem('casesList'));
  document.getElementById('removeCase').addEventListener('click', () => removeListItem('casesList'));
});
