const scTemplate = `[b]GANG(S) INVOLVED:[/b] [i]Answer here[/i]

[b]SUPPLEMENTARY TO?:[/b] [url=linkhere]GEDSCA IR: ###[/url]
[color=transparent](Provide precise post link if your IR is supplementary to a previous IR submission.)[/color]


[altspoiler2=GEDSCA IR: XXX]
[divbox=white][aligntable=left,721,0,0,0,0,0][img]https://i.imgur.com/5m4NeKz.png[/img][/aligntable]
[aligntable=left,721,0,0,0,0,0][divbox=black][b][color=#FFFFFF]AREA INCIDENT REPORT[/color][/b][/divbox][/aligntable]
[aligntable=left,360,0,0,0,0,0][divbox=white]
[b]EMPLOYEE FULL NAME:[/b] 
[b]DEPARTMENTAL RANK:[/b] 

[/divbox][/aligntable][aligntable=left,360,1,0,0,0,0][divbox=white]
[b]TIME AND DATE[/b]: 
[b]LOCATION[/b]: 
[/divbox][/aligntable]

[aligntable=left,721,0,0,0,0,0][divbox=black][b][color=#FFFFFF]NARRATIVE[/color][/b][/divbox][/aligntable][aligntable=left,721,0,0,0,0,0][divbox=white]

Full Incident / Intelligence narrative here â€¦




[/divbox][/aligntable]
[aligntable=left,721,0,0,0,0,0][divbox=black][b][color=#FFFFFF]ATTACHMENTS[/color][/b][/divbox][/aligntable][aligntable=left,721,0,0,0,0,0][divbox=white]

Attachments, if any.




[/divbox][/aligntable]
[aligntable=left,721,0,0,0,0,0][divbox=white][b]EMPLOYEE SIGNATURE:[/b]


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
 * Generate BBCode from scTemplate, replacing each placeholder with user input.
 */
function generateBBCode(e) {
  e.preventDefault();

  // Gather user inputs from the form
  const gangsInvolved  = document.getElementById('gangsInvolved').value.trim()  || 'N/A';
  const suppUrl        = document.getElementById('suppUrl').value.trim()       || 'linkhere';
  const suppIrTitle    = document.getElementById('suppIrTitle').value.trim()   || '###';
  const spoilerTitle   = document.getElementById('spoilerTitle').value.trim()  || 'XXX';
  const timeDate       = document.getElementById('timeDate').value.trim()      || 'N/A';
  const location       = document.getElementById('location').value.trim()      || 'N/A';
  const employeeName   = document.getElementById('employeeName').value.trim()  || 'John Doe';
  const departmentRank = document.getElementById('departmentRank').value.trim()|| 'Officer II';
  const narrative      = document.getElementById('narrative').value.trim()     || 'No narrative provided.';
  const attachments    = document.getElementById('attachments').value.trim()   || 'None.';
  const employeeSig    = document.getElementById('employeeSig').value.trim()   || 'Unsigned';

  // Make a copy of the template
  let finalText = scTemplate;

  // 1) GANG(S) INVOLVED => "Answer here"
  finalText = finalText.replace('Answer here', gangsInvolved);

  // 2) SUPPLEMENTARY => [url=linkhere]GEDSCA IR: ###[/url]
  finalText = finalText.replace('linkhere', suppUrl);
  finalText = finalText.replace('###', suppIrTitle);

  // 3) altspoiler2=GEDSCA IR: XXX => altspoiler2=GEDSCA IR: spoilerTitle
  finalText = finalText.replace('altspoiler2=GEDSCA IR: XXX',
    `altspoiler2=GEDSCA IR: ${spoilerTitle}`);

  // 4) TIME AND DATE => blank after [b]TIME AND DATE[/b]:
  finalText = finalText.replace('[b]TIME AND DATE[/b]: \n[b]LOCATION[/b]: ',
    `[b]TIME AND DATE[/b]: ${timeDate}\n[b]LOCATION[/b]: ${location} `);

  // 5) EMPLOYEE FULL NAME & DEPARTMENTAL RANK
  // Currently it's:
  // [b]EMPLOYEE FULL NAME:[/b] 
  // [b]DEPARTMENTAL RANK:[/b]
  finalText = finalText.replace(
    '[b]EMPLOYEE FULL NAME:[/b] \n[b]DEPARTMENTAL RANK:[/b] \n',
    `[b]EMPLOYEE FULL NAME:[/b] ${employeeName}\n[b]DEPARTMENTAL RANK:[/b] ${departmentRank}\n`
  );

  // 6) NARRATIVE => "Full Incident / Intelligence narrative here â€¦"
  finalText = finalText.replace('Full Incident / Intelligence narrative here â€¦', narrative);

  // 7) ATTACHMENTS => "Attachments, if any."
  finalText = finalText.replace('Attachments, if any.', attachments);

  // 8) EMPLOYEE SIGNATURE => after [b]EMPLOYEE SIGNATURE:[/b]
  finalText = finalText.replace('[b]EMPLOYEE SIGNATURE:[/b]\n\n',
    `[b]EMPLOYEE SIGNATURE:[/b]\n${employeeSig}\n\n`);

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

/**
 * Wire up event listeners on DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
  // On submit => generate
  document.getElementById('scrForm').addEventListener('submit', generateBBCode);

  // On Clear => reset
  document.getElementById('clearButton').addEventListener('click', clearForm);
});
