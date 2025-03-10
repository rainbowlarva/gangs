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

function clearForm() {
  document.getElementById('scrForm').reset();
  document.getElementById('bbcodeText').textContent = '';
}

function generateBBCode(e) {
  e.preventDefault();

  const gangsInvolved  = document.getElementById('gangsInvolved').value.trim()  || 'N/A';
  const suppUrl        = document.getElementById('suppUrl').value.trim()       || 'N/A';
  const suppIrTitle    = document.getElementById('suppIrTitle').value.trim()   || 'N/A';
  const spoilerTitle   = document.getElementById('spoilerTitle').value.trim()  || 'N/A';
  const timeDate       = document.getElementById('timeDate').value.trim()      || 'N/A';
  const location       = document.getElementById('location').value.trim()      || 'N/A';
  const employeeName   = document.getElementById('employeeName').value.trim()  || 'N/A';
  const departmentRank = document.getElementById('departmentRank').value.trim()|| 'N/A';
  const narrative      = document.getElementById('narrative').value.trim()     || 'N/A';
  const attachments    = document.getElementById('attachments').value.trim()   || 'N/A';
  const employeeSig    = document.getElementById('employeeSig').value.trim()   || 'N/A';

  let finalText = scTemplate;

  finalText = finalText.replace('Answer here', gangsInvolved);

  finalText = finalText.replace('linkhere', suppUrl);
  finalText = finalText.replace('###', suppIrTitle);

  finalText = finalText.replace('altspoiler2=GEDSCA IR: XXX',
    `altspoiler2=GEDSCA IR: ${spoilerTitle}`
  );

  finalText = finalText.replace('[b]TIME AND DATE[/b]: \n[b]LOCATION[/b]: ',
    `[b]TIME AND DATE[/b]: ${timeDate}\n[b]LOCATION[/b]: ${location} `
  );

  finalText = finalText.replace(
    '[b]EMPLOYEE FULL NAME:[/b] \n[b]DEPARTMENTAL RANK:[/b] \n',
    `[b]EMPLOYEE FULL NAME:[/b] ${employeeName}\n[b]DEPARTMENTAL RANK:[/b] ${departmentRank}\n`
  );

  finalText = finalText.replace('Full Incident / Intelligence narrative here â€¦', narrative);

  finalText = finalText.replace('Attachments, if any.', attachments);

  finalText = finalText.replace('[b]EMPLOYEE SIGNATURE:[/b]\n\n',
    `[b]EMPLOYEE SIGNATURE:[/b]\n${employeeSig}\n\n`
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
  document.getElementById('scrForm').addEventListener('submit', generateBBCode);

  document.getElementById('clearButton').addEventListener('click', clearForm);
});