/**
 * The exact text from poi.txt as a multiline template.
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
 * If "alive" is checked, output [b][color=#00BF00]ALIVE[/color][/b].
 * If "dead" is checked, output [b][color=#FF0000]DECEASED[/color][/b].
 * If "unknown" is checked or none, output [b]UNKNOWN[/b].
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
 * Dynamically adds an item input to a specified list container.
 */
function addListItem(containerId) {
  const container = document.getElementById(containerId);
  const input = document.createElement('input');
  input.type = 'text';
  input.classList.add('list-input');
  input.placeholder = 'NAMEHERE';
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

  // Grab fields
  const poiName = document.getElementById('poiName').value || 'NAMEHERE';
  const race = document.getElementById('race').value || 'NAMEHERE';
  const sex = document.getElementById('sex').value || 'NAMEHERE';
  const age = document.getElementById('age').value || 'NAMEHERE';
  const description = document.getElementById('description').value || 'NAMEHERE';
  const sanGangFile = document.getElementById('sanGangFile').value || 'NAMEHERE';
  const affiliation = document.getElementById('affiliation').value || 'NAMEHERE';
  const statusBB = getStatusBBCode();

  // Lists
  const properties = getListItems('propertiesList');
  const phones = getListItems('phonesList');
  const associates = getListItems('associatesList');
  const cases = getListItems('casesList');

  // Make a copy of the template
  let finalText = poiTemplate;

  // Replace placeholders carefully
  finalText = finalText.replace('[url=NAMEHERE]MDC[/url]', `[url=${poiName}]MDC[/url]`);
  finalText = finalText.replace('[b]NAME:[/b] NAMEHERE', `[b]NAME:[/b] ${poiName}`);
  finalText = finalText.replace('[b]RACE:[/b] NAMEHERE', `[b]RACE:[/b] ${race}`);
  finalText = finalText.replace('[b]SEX:[/b] NAMEHERE', `[b]SEX:[/b] ${sex}`);
  finalText = finalText.replace('[b]AGE:[/b] NAMEHERE', `[b]AGE:[/b] ${age}`);
  finalText = finalText.replace('[b]DESCRIPTION:[/b] NAMEHERE', `[b]DESCRIPTION:[/b] ${description}`);
  finalText = finalText.replace('[b]SAN-GANG File:[/b] [url=NAMEHERE]ACCESS[/url]', 
    `[b]SAN-GANG File:[/b] [url=${sanGangFile}]ACCESS[/url]`);
  finalText = finalText.replace('[b]Affiliation:[/b] NAMEHERE', `[b]Affiliation:[/b] ${affiliation}`);

  // Status line
  finalText = finalText.replace(
    '[b]Status:[/b] [b][color=#00BF00]ALIVE[/color][/b]/[b][color=#FF0000]DECEASED[/color][/b]/[b]UNKNOWN[/b]',
    `[b]Status:[/b] ${statusBB}`
  );

  // Known Properties
  if (properties.length > 0) {
    const lines = properties.map(item => `[*] ${item}`).join('\n');
    finalText = finalText.replace('[list]\n[*] NAMEHERE\n[/list]', `[list]\n${lines}\n[/list]`);
  } else {
    finalText = finalText.replace('[list]\n[*] NAMEHERE\n[/list]', `[list]\n[*] NAMEHERE\n[/list]`);
  }

  // Known Phone Numbers
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

  // Known Associates
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

  // Related IR/CASEFILES
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
