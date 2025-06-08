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

function clearForm() {
  document.getElementById('westValleyForm').reset();
  document.getElementById('bbcodeText').textContent = '';
}

function generateBBCode(e) {
  e.preventDefault();

  const gangsInvolved = document.getElementById('gangsInvolved').value.trim() || 'N/A';
  const suppUrl       = document.getElementById('suppUrl').value.trim()      || 'N/A';
  const suppIrTitle   = document.getElementById('suppIrTitle').value.trim()  || 'N/A';
  const spoilerTitle  = document.getElementById('spoilerTitle').value.trim() || 'N/A';
  const timeDate      = document.getElementById('timeDate').value.trim()     || 'N/A';
  const location      = document.getElementById('location').value.trim()     || 'N/A';
  const employeeName  = document.getElementById('employeeName').value.trim() || 'N/A';
  const employeeRank  = document.getElementById('employeeRank').value.trim() || 'N/A';
  const narrative     = document.getElementById('narrative').value.trim()    || 'N/A';
  const attachments   = document.getElementById('attachments').value.trim()  || 'N/A';
  const employeeSig   = document.getElementById('employeeSig').value.trim()  || 'N/A';

  let finalText = westValleyTemplate;


  finalText = finalText.replace('[i]NAMEHERE[/i]', `[i]${gangsInvolved}[/i]`);

  finalText = finalText.replace('[url=NAMEHERE]GEDWVA IR: NAMEHERE[/url]',
    `[url=${suppUrl}]GEDWVA IR: ${suppIrTitle}[/url]`
  );

  finalText = finalText.replace('altspoiler2=GEDWVA IR: NAMEHERE',
    `altspoiler2=GEDWVA IR: ${spoilerTitle}`
  );

  finalText = finalText.replace('[b]TIME AND DATE[/b]: NAMEHERE',
    `[b]TIME AND DATE[/b]: ${timeDate}`
  );

  finalText = finalText.replace('[b]LOCATION[/b]: NAMEHERE',
    `[b]LOCATION[/b]: ${location}`
  );

  finalText = finalText.replace(
    '[b]EMPLOYEE FULL NAME:[/b] \n[b]DEPARTMENTAL RANK:[/b] \n',
    `[b]EMPLOYEE FULL NAME:[/b] ${employeeName}\n[b]DEPARTMENTAL RANK:[/b] ${employeeRank}\n`
  );

  finalText = finalText.replace('\nNAMEHERE\n\n', `\n${narrative}\n\n`);

  finalText = finalText.replace(/(\n\s*)NAMEHERE(\s*\n\[\/divbox\]\[\/aligntable\])/, `\n${attachments}$2`);

  finalText = finalText.replace('NAMEHERE\n\n[/divbox][/aligntable]',
    `${employeeSig}\n\n[/divbox][/aligntable]`
  );

  document.getElementById('bbcodeText').textContent = finalText;

  const codeElement = document.getElementById('bbcodeText');
  const range = document.createRange();
  range.selectNodeContents(codeElement);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('westValleyForm').addEventListener('submit', generateBBCode);
  document.getElementById('clearButton').addEventListener('click', clearForm);
});