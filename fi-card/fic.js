const ficTemplate = `[divbox=white]
[center][size=115][u]FIELD INTERVIEW CARD[/u][/size][/center]
[hr][/hr]
[aligntable=right,0,0,0,0,0,0]
[b]DATE/TIME[/b]: NAMEHERE
[b]LOCATION[/b]: NAMEHERE
[/aligntable]
[b]OFFICER NAME[/b]: NAMEHERE
[b]SERIAL #[/b]: NAMEHERE
[hr][/hr]
[b]SUBJECT NAME[/b]: NAMEHERE
[cb] [b]§ 305 GANG MEMBER[/b]
[hr][/hr]
[b]CIRCUMSTANCE[/b]: [cb]CONSENSUAL / [cb]DETAIN / [cb]ARREST / [cb]OTHER
[b]PERSONS WITH SUBJECT[/b]: NAMEHERE
[b]NARRATIVE[/b]
[quote]
NAMEHERE
[/quote]
[hr][/hr]
[b]ATTACHMENTS[/b]
NAMEHERE
[hr][/hr]
[b]EMPLOYEE SIGNATURE[/b]
NAMEHERE
[/divbox]`;

// Make GANG MEMBER line [cbx] if checked, else [cb].
function getGangMemberBBCode() {
  const gangCheck = document.getElementById('gangCheck').checked;
  return gangCheck 
    ? `[cbc] [b]§ 305 GANG MEMBER[/b]`
    : `[cb] [b]§ 305 GANG MEMBER[/b]`;
}

function getCircumstanceBBCode() {
  const consensual = document.getElementById('consensualCheck').checked;
  const detain     = document.getElementById('detainCheck').checked;
  const arrest     = document.getElementById('arrestCheck').checked;
  const circOther  = document.getElementById('circOtherCheck').checked;
  const circOtherValue = document.getElementById('circOtherInput').value.trim();

  const cConsensual = consensual ? `[cbc]CONSENSUAL` : `[cb]CONSENSUAL`;
  const cDetain     = detain     ? `[cbc]DETAIN`    : `[cb]DETAIN`;
  const cArrest     = arrest     ? `[cbc]ARREST`    : `[cb]ARREST`;
  const cOther      = circOther  
    ? `[cbc]OTHER: ${circOtherValue || 'N/A'}`
    : `[cb]OTHER`;

  // Then combine them in the same line with " / "
  return `${cConsensual} / ${cDetain} / ${cArrest} / ${cOther}`;
}

function handleCircumstanceCheck(e) {
  const clickedId = e.target.id;
  const all = ['consensualCheck','detainCheck','arrestCheck','circOtherCheck'];
  all.forEach(id => {
    if (id !== clickedId) {
      document.getElementById(id).checked = false;
    }
  });
  const container = document.getElementById('circOtherInputContainer');
  container.style.display = (clickedId === 'circOtherCheck' && e.target.checked)
    ? 'block'
    : 'none';
}

function clearForm() {
  document.getElementById('ficForm').reset();
  // Hide the otherCircum input
  document.getElementById('circOtherInputContainer').style.display = 'none';
  // Clear output
  document.getElementById('bbcodeText').textContent = '';
}

function generateBBCode(event) {
  event.preventDefault();

  // Gather inputs
  const dateTime    = document.getElementById('dateTime').value.trim()    || 'NAMEHERE';
  const location    = document.getElementById('location').value.trim()    || 'NAMEHERE';
  const officerName = document.getElementById('officerName').value.trim() || 'NAMEHERE';
  const serialNo    = document.getElementById('serialNo').value.trim()    || 'NAMEHERE';
  const subjectName = document.getElementById('subjectName').value.trim() || 'NAMEHERE';

  const gangLine    = getGangMemberBBCode(); // [cbx] or [cb]
  const circumstanceLine = getCircumstanceBBCode();

  const personsWithSubject = document.getElementById('personsWithSubject').value.trim() || 'NAMEHERE';
  const narrative = document.getElementById('narrative').value.trim() || 'NAMEHERE';
  const attachments = document.getElementById('attachments').value.trim() || 'NAMEHERE';
  const employeeSig = document.getElementById('employeeSig').value.trim() || 'NAMEHERE';

  let finalText = ficTemplate;

  // 1) Date/Time
  finalText = finalText.replace('[b]DATE/TIME[/b]: NAMEHERE', `[b]DATE/TIME[/b]: ${dateTime}`);
  // 2) Location
  finalText = finalText.replace('[b]LOCATION[/b]: NAMEHERE', `[b]LOCATION[/b]: ${location}`);
  // 3) Officer Name
  finalText = finalText.replace('[b]OFFICER NAME[/b]: NAMEHERE', `[b]OFFICER NAME[/b]: ${officerName}`);
  // 4) Serial #
  finalText = finalText.replace('[b]SERIAL #[/b]: NAMEHERE', `[b]SERIAL #[/b]: ${serialNo}`);
  // 5) Subject Name
  finalText = finalText.replace('[b]SUBJECT NAME[/b]: NAMEHERE', `[b]SUBJECT NAME[/b]: ${subjectName}`);

  finalText = finalText.replace('[cb] [b]§ 305 GANG MEMBER[/b]', gangLine);

  const circRegex = /\[cb\]CONSENSUAL\s*\/\s*\[cb\]DETAIN\s*\/\s*\[cb\]ARREST\s*\/\s*\[cb\]OTHER/;
  finalText = finalText.replace(circRegex, circumstanceLine);

  // PERSONS WITH SUBJECT => NAMEHERE
  finalText = finalText.replace('[b]PERSONS WITH SUBJECT[/b]: NAMEHERE',
    `[b]PERSONS WITH SUBJECT[/b]: ${personsWithSubject}`);

  // NARRATIVE => in [quote]NAMEHERE[/quote]
  finalText = finalText.replace('\nNAMEHERE\n[/quote]', `\n${narrative}\n[/quote]`);

  // ATTACHMENTS => next line is NAMEHERE
  finalText = finalText.replace('\nNAMEHERE\n[hr][/hr]', `\n${attachments}\n[hr][/hr]`);

  // EMPLOYEE SIGNATURE => next line is NAMEHERE
  finalText = finalText.replace('NAMEHERE\n[/divbox]', `${employeeSig}\n[/divbox]`);

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
 * On DOMContentLoaded, wire up everything
 */
document.addEventListener('DOMContentLoaded', () => {
  // Submit => generate
  document.getElementById('ficForm').addEventListener('submit', generateBBCode);

  // Clear
  document.getElementById('clearButton').addEventListener('click', clearForm);

  const circBoxes = ['consensualCheck','detainCheck','arrestCheck','circOtherCheck'];
  circBoxes.forEach(id => {
    document.getElementById(id).addEventListener('change', (e) => {
      // Uncheck all except the one that was clicked
      circBoxes.forEach(otherId => {
        if (otherId !== e.target.id) {
          document.getElementById(otherId).checked = false;
        }
      });
      const container = document.getElementById('circOtherInputContainer');
      container.style.display = (e.target.id === 'circOtherCheck' && e.target.checked)
        ? 'block'
        : 'none';
    });
  });
});
