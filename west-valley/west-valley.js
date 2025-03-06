const westValleyTemplate = `[b]GANG(S) INVOLVED:[/b] [i]NAMEHERE[/i]

[b]SUPPLEMENTARY TO?:[/b] [url=NAMEHERE]GEDWVA IR: NAMEHERE[/url]
[color=transparent](Provide precise post link if your IR is supplementary to a previous IR submission.)[/color]


[altspoiler2=GEDWVA IR: NAMEHERE]
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
  document.getElementById('westValleyForm').reset();
  document.getElementById('bbcodeText').textContent = '';
}

/**
 * Generate BBCode from the template, replacing each NAMEHERE with user input.
 */
function generateBBCode(e) {
  e.preventDefault();

  // 1) Gather user inputs
  const gangsInvolved = document.getElementById('gangsInvolved').value.trim() || 'NAMEHERE';
  const suppUrl       = document.getElementById('suppUrl').value.trim()      || 'NAMEHERE';
  const suppIrTitle   = document.getElementById('suppIrTitle').value.trim()  || 'NAMEHERE';
  const spoilerTitle  = document.getElementById('spoilerTitle').value.trim() || 'NAMEHERE';
  const timeDate      = document.getElementById('timeDate').value.trim()     || 'NAMEHERE';
  const location      = document.getElementById('location').value.trim()     || 'NAMEHERE';
  const employeeName  = document.getElementById('employeeName').value.trim() || 'NAMEHERE';
  const employeeRank  = document.getElementById('employeeRank').value.trim() || 'NAMEHERE';
  const narrative     = document.getElementById('narrative').value.trim()    || 'NAMEHERE';
  const attachments   = document.getElementById('attachments').value.trim()  || 'NAMEHERE';
  const employeeSig   = document.getElementById('employeeSig').value.trim()  || 'NAMEHERE';

  // 2) Copy the template
  let finalText = westValleyTemplate;

  // 3) Replace placeholders

  // GANG(S) INVOLVED => [i]NAMEHERE[/i]
  finalText = finalText.replace('[i]NAMEHERE[/i]', `[i]${gangsInvolved}[/i]`);

  // SUPPLEMENTARY => [url=NAMEHERE]GEDWVA IR: NAMEHERE[/url]
  finalText = finalText.replace('[url=NAMEHERE]GEDWVA IR: NAMEHERE[/url]',
    `[url=${suppUrl}]GEDWVA IR: ${suppIrTitle}[/url]`
  );

  // altspoiler2=GEDWVA IR: NAMEHERE => altspoiler2=GEDWVA IR: spoilerTitle
  finalText = finalText.replace('altspoiler2=GEDWVA IR: NAMEHERE',
    `altspoiler2=GEDWVA IR: ${spoilerTitle}`);

  // TIME AND DATE => [b]TIME AND DATE[/b]: NAMEHERE
  finalText = finalText.replace('[b]TIME AND DATE[/b]: NAMEHERE',
    `[b]TIME AND DATE[/b]: ${timeDate}`);

  // LOCATION => [b]LOCATION[/b]: NAMEHERE
  finalText = finalText.replace('[b]LOCATION[/b]: NAMEHERE',
    `[b]LOCATION[/b]: ${location}`);

  // EMPLOYEE FULL NAME & DEPARTMENTAL RANK
  finalText = finalText.replace(
    '[b]EMPLOYEE FULL NAME:[/b] \n[b]DEPARTMENTAL RANK:[/b] \n',
    `[b]EMPLOYEE FULL NAME:[/b] ${employeeName}\n[b]DEPARTMENTAL RANK:[/b] ${employeeRank}\n`
  );

  // NARRATIVE => "NAMEHERE" with newlines around it
  finalText = finalText.replace('\nNAMEHERE\n\n', `\n${narrative}\n\n`);

  // ATTACHMENTS => "NAMEHERE" with newlines around it
  finalText = finalText.replace('\nNAMEHERE\n\n[/divbox][/aligntable]',
    `\n${attachments}\n\n[/divbox][/aligntable]`);

  // EMPLOYEE SIGNATURE => final "NAMEHERE\n\n"
  finalText = finalText.replace('NAMEHERE\n\n[/divbox][/aligntable]',
    `${employeeSig}\n\n[/divbox][/aligntable]`);

  // 4) Display final text in #bbcodeText
  document.getElementById('bbcodeText').textContent = finalText;

  // 5) Auto-highlight
  const codeElement = document.getElementById('bbcodeText');
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Wire up event listeners on DOM load
 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('westValleyForm').addEventListener('submit', generateBBCode);
  document.getElementById('clearButton').addEventListener('click', clearForm);
});
