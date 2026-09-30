const form = document.querySelector('#draft-form');
const emptyMessage = document.querySelector('#draft-empty');
const statusMessage = document.querySelector('#draft-status');
const afterSave = document.querySelector('#after-save');

let draft = null;
const requestedId = new URLSearchParams(window.location.search).get('id');
try {
  const savedIncidents = JSON.parse(localStorage.getItem('safecaseIncidents')) || [];
  draft = requestedId
    ? savedIncidents.find((item) => item.id === requestedId) || null
    : JSON.parse(sessionStorage.getItem('safecaseDraft') || localStorage.getItem('safecaseDraft'));
} catch { draft = null; }

function addOrUpdateIncident(incident) {
  let incidents = [];
  try {
    incidents = JSON.parse(localStorage.getItem('safecaseIncidents')) || [];
  } catch {
    incidents = [];
  }
  const existingIndex = incidents.findIndex((item) => item.id === incident.id);
  const isNew = existingIndex === -1;
  if (existingIndex === -1) incidents.push(incident);
  else incidents[existingIndex] = incident;
  localStorage.setItem('safecaseIncidents', JSON.stringify(incidents));
  return { count: incidents.length, isNew };
}

if (!draft) {
  form.hidden = true;
  emptyMessage.hidden = false;
} else {
  const fields = {
    story: document.querySelector('#draft-story'),
    date: document.querySelector('#draft-date'),
    time: document.querySelector('#draft-time'),
    people: document.querySelector('#draft-people'),
    witness: document.querySelector('#draft-witness'),
    witnessNotes: document.querySelector('#draft-witness-notes'),
    disclosed: document.querySelector('#draft-disclosed'),
    disclosureNotes: document.querySelector('#draft-disclosure-notes'),
    materialNotes: document.querySelector('#draft-material-notes'),
    repeat: document.querySelector('#draft-repeat'),
    evidence: document.querySelector('#draft-evidence'),
    location: document.querySelector('#draft-location')
  };
  fields.story.value = draft.story || '';
  fields.date.value = draft.occurredDate || '';
  fields.time.value = draft.occurredTime || '';
  fields.people.value = draft.people || '';
  fields.witness.value = draft.witness || '';
  fields.witnessNotes.value = draft.witnessNotes || '';
  fields.disclosed.value = draft.disclosed || '';
  fields.disclosureNotes.value = draft.disclosureNotes || '';
  fields.materialNotes.value = draft.materialNotes || '';
  fields.repeat.value = draft.details?.[0] || '';
  fields.evidence.value = draft.details?.[1] || '';
  fields.location.value = draft.details?.[2] || '';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    draft = {
      id: draft.id || `draft-${Date.now()}`,
      story: fields.story.value.trim(),
      occurredDate: fields.date.value,
      occurredTime: fields.time.value,
      people: fields.people.value.trim(),
      witness: fields.witness.value,
      witnessNotes: fields.witnessNotes.value.trim(),
      disclosed: fields.disclosed.value,
      disclosureNotes: fields.disclosureNotes.value.trim(),
      materialNotes: fields.materialNotes.value.trim(),
      details: [fields.repeat.value, fields.evidence.value, fields.location.value],
      recordedAt: draft.recordedAt || draft.savedAt || new Date().toISOString(),
      savedAt: new Date().toISOString()
    };
    if (!requestedId || JSON.parse(localStorage.getItem('safecaseDraft') || 'null')?.id === draft.id) {
      localStorage.setItem('safecaseDraft', JSON.stringify(draft));
    }
    const saveResult = addOrUpdateIncident(draft);
    if (!requestedId) sessionStorage.removeItem('safecaseDraft');
    statusMessage.textContent = saveResult.isNew
      ? `Saved as a separate note. You now have ${saveResult.count} saved ${saveResult.count === 1 ? 'note' : 'notes'}; your earlier notes are still here.`
      : 'Your saved note has been updated. Your other saved notes are still here.';
    afterSave.hidden = false;
    afterSave.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.querySelector('#clear-draft').addEventListener('click', () => {
    sessionStorage.removeItem('safecaseDraft');
    try {
      const incidents = JSON.parse(localStorage.getItem('safecaseIncidents')) || [];
      localStorage.setItem('safecaseIncidents', JSON.stringify(incidents.filter((item) => item.id !== draft.id)));
    } catch {
      localStorage.removeItem('safecaseIncidents');
    }
    if (JSON.parse(localStorage.getItem('safecaseDraft') || 'null')?.id === draft.id) localStorage.removeItem('safecaseDraft');
    form.hidden = true;
    afterSave.hidden = true;
    emptyMessage.hidden = false;
    emptyMessage.textContent = 'Your draft has been deleted from this browser on this device. Start again whenever you’re ready.';
  });
}

