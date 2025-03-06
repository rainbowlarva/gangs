/****************************************************
 * poi.js
 * Example: Person of Interest (POI) BBCode Generator
 ****************************************************/

/**
 * The exact text from poi.txt as a multiline template.
 * We'll do replacements for NAMEHERE, plus handle the status color code,
 * plus user-specified image and MDC URL.
 */
const poiTemplate = `[divbox=white]
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
[/divbox]`;

/**
 * A configuration object to define custom placeholders
 * for each container ID.
 */
const placeholderConfig = {
  propertiesList: "Enter property address/name.",
  phonesList: "Enter phone number.",
  associatesList: "Enter associate's name/alias.",
  casesList: "Enter IR or casefile number."
};

/**
 * If "alive" is checked, we output [b][color=#00BF00]ALIVE[/color][/b].
 * If "dead" is checked, we output [b][color=#FF0000]DECEASED[/color][/b].
 * If "unknown" is checked or none, we output [b]UNKNOWN[/b].
 */
function getStatusBBCode() {
  const aliveCheck = document.getElementById('aliveCheck').checked;
  const deadCheck = document.getElementById('deadCheck').checked;
  const unknownCheck = document.getElementById('unknownCheck').checked;

  if (aliveCheck) {
    return `[b][color=#00BF00]ALIVE[/color][/b]`;
  } else if (deadCheck) {
    return `[b][color=#FF0000]DECEASED[/color][/b]`;
  } else if (unknownCheck) {
    return `[b]UNKNOWN[/b]`;
  } else {
    return `[b]UNKNOWN[/b]`;
  }
}

/**
 * Uncheck other status checkboxes when one is selected.
 */
function handleStatusCheckboxes(event) {
  const clickedId = event.target.id;
  if (clickedId === 'aliveCheck') {
    document.getElementById('deadCheck').checked = false;
    document.getElementById('unknownCheck').checked = false;
  } else if (clickedId === 'deadCheck') {
    document.getElementById('aliveCheck').checked = false;
    document.getElementById('unknownCheck').checked = false;
  } else if (clickedId === 'unknownCheck') {
    document.getElementById('aliveCheck').checked = false;
    document.getElementById('deadCheck').checked = false;
  }
}

/**
 * Dynamically adds an item input to a specified list container,
 * using a custom placeholder from `placeholderConfig`.
 */
function addListItem(containerId) {
  const container = document.getElementById(containerId);
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('list-input');

  // Use the custom placeholder if defined; else fallback to "NAMEHERE"
  input.placeholder = placeholderConfig[containerId] || "NAMEHERE";

  container.appendChild(input);
}

/**
 * Removes the last item from a specified list container.
 */
function removeListItem(containerId) {
  const container = document.getElementById(containerId);
  if (container.lastChild) {
    container.removeChild(container.lastChild);
  }
}

/**
 * Gathers items from a list container and returns them as an array.
 */
function getListItems(containerId) {
  const container = document.getElementById(containerId);
  const inputs = container.querySelectorAll('.list-input');
  const items = [];
  inputs.forEach((input) => {
    const val = input.value.trim();
    if (val) {
      items.push(val);
    }
  });
  return items;
}

/**
 * Clears the entire form and the output.
 */
function clearForm() {
  document.getElementById('poiForm').reset();

  // Remove dynamic inputs
  ['propertiesList','phonesList','associatesList','casesList'].forEach(id => {
    document.getElementById(id).innerHTML = '';
  });

  // Clear BBCode output
  document.getElementById('bbcodeText').textContent = '';
}

/**
 * Generates BBCode from the user's input, places it in #bbcodeText,
 * and auto-highlights the result.
 */
function generateBBCode(event) {
  event.preventDefault(); // Prevent form submission

  // Grab the new fields
  const imageUrl = document.getElementById('imageUrl').value.trim() || 'https://i.imgur.com/RvO2yL5.png?1';
  const mdcUrl = document.getElementById('mdcUrl').value.trim() || 'NAMEHERE';

  // Grab other fields
  const poiName = document.getElementById('poiName').value.trim() || 'NAMEHERE';
  const race = document.getElementById('race').value.trim() || 'NAMEHERE';
  const sex = document.getElementById('sex').value.trim() || 'NAMEHERE';
  const age = document.getElementById('age').value.trim() || 'NAMEHERE';
  const description = document.getElementById('description').value.trim() || 'NAMEHERE';
  const sanGangFile = document.getElementById('sanGangFile').value.trim() || 'NAMEHERE';
  const affiliation = document.getElementById('affiliation').value.trim() || 'NAMEHERE';
  const statusBB = getStatusBBCode();

  // Lists
  const properties = getListItems('propertiesList');
  const phones = getListItems('phonesList');
  const associates = getListItems('associatesList');
  const cases = getListItems('casesList');

  // Make a copy of the template
  let finalText = poiTemplate;

  // 1) Replace the default image with user input
  finalText = finalText.replace('https://i.imgur.com/RvO2yL5.png?1', imageUrl);

  // 2) Replace the default [url=NAMEHERE]MDC[/url] with the user’s MDC link
  finalText = finalText.replace('[url=NAMEHERE]MDC[/url]', `[url=${mdcUrl}]MDC[/url]`);

  // 3) Basic placeholders
  finalText = finalText.replace('[b]NAME:[/b] NAMEHERE', `[b]NAME:[/b] ${poiName}`);
  finalText = finalText.replace('[b]RACE:[/b] NAMEHERE', `[b]RACE:[/b] ${race}`);
  finalText = finalText.replace('[b]SEX:[/b] NAMEHERE', `[b]SEX:[/b] ${sex}`);
  finalText = finalText.replace('[b]AGE:[/b] NAMEHERE', `[b]AGE:[/b] ${age}`);
  finalText = finalText.replace('[b]DESCRIPTION:[/b] NAMEHERE', `[b]DESCRIPTION:[/b] ${description}`);
  finalText = finalText.replace('[b]SAN-GANG File:[/b] [url=NAMEHERE]ACCESS[/url]', 
    `[b]SAN-GANG File:[/b] [url=${sanGangFile}]ACCESS[/url]`);
  finalText = finalText.replace('[b]Affiliation:[/b] NAMEHERE', `[b]Affiliation:[/b] ${affiliation}`);

  // 4) Status line
  finalText = finalText.replace(
    '[b]Status:[/b] [b][color=#00BF00]ALIVE[/color][/b]/[b][color=#FF0000]DECEASED[/color][/b]/[b]UNKNOWN[/b]',
    `[b]Status:[/b] ${statusBB}`
  );

  // 5) Known Properties
  if (properties.length > 0) {
    const lines = properties.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace('[list]\n[*] NAMEHERE\n[/list]', `[list]\n${lines}\n[/list]`);
  } else {
    finalText = finalText.replace('[list]\n[*] NAMEHERE\n[/list]', `[list]\n[*] NAMEHERE\n[/list]`);
  }

  // 6) Known Phone Numbers
  if (phones.length > 0) {
    const lines = phones.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace(
      '[b]Known Phone Numbers:[/b]\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Known Phone Numbers:[/b]\n[list]\n${lines}\n[/list]`
    );
  } else {
    finalText = finalText.replace(
      '[b]Known Phone Numbers:[/b]\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Known Phone Numbers:[/b]\n[list]\n[*] NAMEHERE\n[/list]`
    );
  }

  // 7) Known Associates
  if (associates.length > 0) {
    const lines = associates.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace(
      '[b]Known Associates[/b]:\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Known Associates[/b]:\n[list]\n${lines}\n[/list]`
    );
  } else {
    finalText = finalText.replace(
      '[b]Known Associates[/b]:\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Known Associates[/b]:\n[list]\n[*] NAMEHERE\n[/list]`
    );
  }

  // 8) Related IR/CASEFILES
  if (cases.length > 0) {
    const lines = cases.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace(
      '[b]Related IR/CASEFILES[/b]:\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Related IR/CASEFILES[/b]:\n[list]\n${lines}\n[/list]`
    );
  } else {
    finalText = finalText.replace(
      '[b]Related IR/CASEFILES[/b]:\n[list]\n[*] NAMEHERE\n[/list]',
      `[b]Related IR/CASEFILES[/b]:\n[list]\n[*] NAMEHERE\n[/list]`
    );
  }

  // Place the final text in #bbcodeText
  document.getElementById('bbcodeText').textContent = finalText;

  // Auto-highlight the generated BBCode
  const codeElement = document.getElementById('bbcodeText');
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

document.addEventListener('DOMContentLoaded', () => {
  // Listen for form submission
  const poiForm = document.getElementById('poiForm');
  poiForm.addEventListener('submit', generateBBCode);

  // Listen for Clear button
  document.getElementById('clearButton').addEventListener('click', clearForm);

  // Status checkboxes
  document.getElementById('aliveCheck').addEventListener('change', handleStatusCheckboxes);
  document.getElementById('deadCheck').addEventListener('change', handleStatusCheckboxes);
  document.getElementById('unknownCheck').addEventListener('change', handleStatusCheckboxes);

  // Add/Remove dynamic items
  document.getElementById('addProperty').addEventListener('click', () => addListItem('propertiesList'));
  document.getElementById('removeProperty').addEventListener('click', () => removeListItem('propertiesList'));

  document.getElementById('addPhone').addEventListener('click', () => addListItem('phonesList'));
  document.getElementById('removePhone').addEventListener('click', () => removeListItem('phonesList'));

  document.getElementById('addAssociate').addEventListener('click', () => addListItem('associatesList'));
  document.getElementById('removeAssociate').addEventListener('click', removeListItem('associatesList'));

  document.getElementById('addCase').addEventListener('click', () => addListItem('casesList'));
  document.getElementById('removeCase').addEventListener('click', removeListItem('casesList'));
});
