const summary = document.querySelector('#case-summary');
const empty = document.querySelector('#case-empty');
const actions = document.querySelector('#case-actions');
const incidentContainer = document.querySelector('#summary-incidents');

let incidents = [];
let latestDraft = null;
try { incidents = JSON.parse(localStorage.getItem('safecaseIncidents')) || []; } catch { incidents = []; }
try { latestDraft = JSON.parse(localStorage.getItem('safecaseDraft')); } catch { latestDraft = null; }
if (latestDraft && !incidents.some((item) => item.id === latestDraft.id)) incidents.push(latestDraft);

function addRow(list, label, value) {
  const row = document.createElement('div');
  const term = document.createElement('dt');
  const description = document.createElement('dd');
  term.textContent = label;
  description.textContent = value || 'Not provided';
  row.append(term, description);
  list.append(row);
}

function displayDate(value) {
  if (!value) return 'Not provided';
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
}

function displayRecordedAt(value) {
  if (!value) return 'Date not available';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Date not available' : date.toLocaleString();
}

incidents.sort((a, b) => {
  const aDate = a.occurredDate ? new Date(`${a.occurredDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
  const bDate = b.occurredDate ? new Date(`${b.occurredDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
  return aDate - bDate;
});

if (incidents.length === 0) {
  empty.hidden = false;
} else {
  summary.hidden = false;
  actions.hidden = false;
  const preparedAt = latestDraft?.savedAt ? new Date(latestDraft.savedAt) : new Date();
  document.querySelector('#summary-date').textContent = `Prepared ${preparedAt.toLocaleDateString()} · ${incidents.length} ${incidents.length === 1 ? 'incident' : 'incidents'}`;

  incidents.forEach((incident, index) => {
    const section = document.createElement('section');
    section.className = 'summary-incident';
    const heading = document.createElement('h2');
    heading.textContent = `Incident ${index + 1} · ${displayDate(incident.occurredDate)}`;
    const recorded = document.createElement('p');
    recorded.className = 'summary-recorded';
    recorded.textContent = `Personal account recorded ${displayRecordedAt(incident.recordedAt || incident.savedAt)}`;
    const story = document.createElement('p');
    story.className = 'summary-story';
    story.textContent = incident.story || 'No written description was provided.';
    const details = document.createElement('dl');
    addRow(details, 'Approximate time', incident.occurredTime);
    addRow(details, 'Location', incident.details?.[2]);
    addRow(details, 'People involved', incident.people);
    addRow(details, 'Happened more than once', incident.details?.[0]);
    addRow(details, 'Witnesses', incident.witness);
    addRow(details, 'Witness notes', incident.witnessNotes);
    addRow(details, 'Told someone afterward', incident.disclosed);
    addRow(details, 'Disclosure notes', incident.disclosureNotes);
    addRow(details, 'Supporting material available', incident.details?.[1]);
    addRow(details, 'Material notes', incident.materialNotes);
    section.append(heading, recorded, story, details);
    incidentContainer.append(section);
  });

  document.querySelector('#print-summary').addEventListener('click', () => window.print());
}
