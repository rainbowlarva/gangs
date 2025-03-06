/****************************************************
 * scr.js
 * SCR Area Notes Generator
 ****************************************************/

/**
 * The exact text from west-valley.txt, but with “WVA” replaced by “SCR.”
 */
const scrTemplate = `[b]GANG(S) INVOLVED:[/b] [i]NAMEHERE[/i]

[b]SUPPLEMENTARY TO?:[/b] [url=NAMEHERE]GEDSCA IR: NAMEHERE[/url]
[color=transparent](Provide precise post link if your IR is supplementary to a previous IR submission.)[/color]


[altspoiler2=GEDSCA IR: NAMEHERE]
[divbox=white][aligntable=left,721,0,0,0,0,0][img]https://i.imgur.com/5m4NeKz.png[/img][/aligntable]
[aligntable=left,721,0,0,0,0,0][divbox=black][b][color=#FFFFFF]AREA INCIDENT REPORT[/color][/b][/divbox][/aligntable]
[aligntable=left,360,0,0,0,0,0][divbox=white]
[b]EMPLOYEE FULL NAME:[/b] 
[b]DEPARTMENTAL RANK:[/b] 

[/divbox][/aligntable][aligntable=left,360,1,0,0,0,0][divbox=white]
[b]TIME AND DATE[/b]: NAMEHERE
[b]LOCATION[/b]: NAMEHERE
[/divbox][/aligntable]

[aligntable=left,721,0,0,0,0,0][divbox=black][b][color=#FFFFFF]NARRATIVE[/color][/b][/divbox][/aligntable][aligntable=left,721,0,0,0,0,0][divbox=white]

NAMEHERE




[/divbox][/aligntable]
[aligntable=left,721,0,0,0,0,0][divbox=black][b][color=#FFFFFF]ATTACHMENTS[/color][/b][/divbox][/aligntable][aligntable=left,721,0,0,0,0,0][divbox=white]

NAMEHERE




[/divbox][/aligntable]
[aligntable=left,721,0,0,0,0,0][divbox=white][b]EMPLOYEE SIGNATURE:[/b]
NAMEHERE

[/divbox][/aligntable]

[hr][/hr][/divbox]
[/altspoiler2]`;

/**
 * Clears the form and output.
 */
function clearForm() {
  document.getElementById('scrForm').reset();
  document.getElementById('bbcodeText').textContent = '';
}

/**
 * Generate BBCode from scrTemplate, replacing each NAMEHERE with user input.
 */
function generateBBCode(e) {
  e.preventDefault();

  // Gather user inputs
  const gangsInvolved = document.getElementById('gangsInvolved').value.trim() || 'NAMEHERE';
  const suppUrl       = document.getElementById('suppUrl').value.trim()      || 'NAMEHERE';
  const suppIrTitle   = document.getElementById('suppIrTitle').value.trim()  || 'NAMEHERE';
  const spoilerTitle  = document.getElementById('spoilerTitle').value.trim() || 'NAMEHERE';
  const timeDate      = document.getElementById('timeDate').value.trim()     || 'NAMEHERE';
  const location      = document.getElementById('location').value.trim()     || 'NAMEHERE';
  const narrative     = document.getElementById('narrative').value.trim()    || 'NAMEHERE';
  const attachments   = document.getElementById('attachments').value.trim()  || 'NAMEHERE';
  const employeeSig   = document.getElementById('employeeSig').value.trim()  || 'NAMEHERE';

  // Make a copy of the template
  let finalText = scrTemplate;

  // 1) GANG(S) INVOLVED => [i]NAMEHERE[/i]
  finalText = finalText.replace('[i]NAMEHERE[/i]', `[i]${gangsInvolved}[/i]`);

  // 2) SUPPLEMENTARY => [url=NAMEHERE]GEDSCR IR: NAMEHERE[/url]
  finalText = finalText.replace('[url=NAMEHERE]GEDSCA IR: NAMEHERE[/url]',
    `[url=${suppUrl}]GEDSCR IR: ${suppIrTitle}[/url]`
  );

  // 3) altspoiler2=GEDSCR IR: NAMEHERE => altspoiler2=GEDSCR IR: spoilerTitle
  finalText = finalText.replace('altspoiler2=GEDSCR IR: NAMEHERE',
    `altspoiler2=GEDSCA IR: ${spoilerTitle}`);

  // 4) TIME AND DATE => "NAMEHERE"
  finalText = finalText.replace('[b]TIME AND DATE[/b]: NAMEHERE',
    `[b]TIME AND DATE[/b]: ${timeDate}`);

  // 5) LOCATION => "NAMEHERE"
  finalText = finalText.replace('[b]LOCATION[/b]: NAMEHERE',
    `[b]LOCATION[/b]: ${location}`);

  // 6) NARRATIVE => "NAMEHERE" with extra newlines
  finalText = finalText.replace('\nNAMEHERE\n\n', `\n${narrative}\n\n`);

  // 7) ATTACHMENTS => "NAMEHERE" with extra newlines
  finalText = finalText.replace('\nNAMEHERE\n\n[/divbox][/aligntable]',
    `\n${attachments}\n\n[/divbox][/aligntable]`);

  // 8) EMPLOYEE SIGNATURE => final "NAMEHERE\n\n"
  finalText = finalText.replace('NAMEHERE\n\n[/divbox][/aligntable]',
    `${employeeSig}\n\n[/divbox][/aligntable]`);

  // Place final text
  document.getElementById('bbcodeText').textContent = finalText;

  // Auto-highlight
  const codeElement = document.getElementById('bbcodeText');
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Wire up event listeners on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // Submit => generate
  document.getElementById('scrForm').addEventListener('submit', generateBBCode);

  // Clear
  document.getElementById('clearButton').addEventListener('click', clearForm);
});
