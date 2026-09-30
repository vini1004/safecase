const list = document.querySelector('#timeline-list');
const count = document.querySelector('#incident-count');
const empty = document.querySelector('#incident-empty');
const buildCaseLink = document.querySelector('#build-case-link');
const reviewCaseLink = document.querySelector('#review-case-link');

let incidents = [];
try { incidents = JSON.parse(localStorage.getItem('safecaseIncidents')) || []; } catch { incidents = []; }
let activeDraft = null;
try { activeDraft = JSON.parse(localStorage.getItem('safecaseDraft')); } catch { activeDraft = null; }
if (activeDraft && !incidents.some((incident) => incident.id === activeDraft.id)) {
  incidents.push(activeDraft);
  localStorage.setItem('safecaseIncidents', JSON.stringify(incidents));
}

const datedFirst = [...incidents].sort((a, b) => {
  const aDate = a.occurredDate ? new Date(`${a.occurredDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
  const bDate = b.occurredDate ? new Date(`${b.occurredDate}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
  if (aDate !== bDate) return aDate - bDate;
  return new Date(a.savedAt || 0) - new Date(b.savedAt || 0);
});

function addDetail(container, label, value) {
  if (!value) return;
  const row = document.createElement('div');
  row.className = 'timeline-detail';
  const name = document.createElement('span');
  name.textContent = label;
  const detail = document.createElement('strong');
  detail.textContent = value;
  row.append(name, detail);
  container.append(row);
}

count.textContent = `${datedFirst.length} ${datedFirst.length === 1 ? 'incident' : 'incidents'}`;
empty.hidden = datedFirst.length > 0;
buildCaseLink.hidden = datedFirst.length === 0;
reviewCaseLink.hidden = !activeDraft;

datedFirst.forEach((incident, index) => {
  const card = document.createElement('article');
  card.className = 'timeline-card';
  const marker = document.createElement('span');
  marker.className = 'timeline-marker';
  marker.setAttribute('aria-hidden', 'true');
  const header = document.createElement('div');
  header.className = 'timeline-card-header';
  const date = document.createElement('span');
  date.className = 'timeline-date';
  date.textContent = incident.occurredDate ? new Date(`${incident.occurredDate}T00:00:00`).toLocaleDateString() : 'Date not provided';
  const tag = document.createElement('span');
  tag.className = 'timeline-tag';
  tag.textContent = `Your account · recorded ${incident.recordedAt ? new Date(incident.recordedAt).toLocaleDateString() : new Date(incident.savedAt || Date.now()).toLocaleDateString()}`;
  header.append(date, tag);
  const title = document.createElement('h3');
  title.textContent = `Incident ${index + 1}`;
  const story = document.createElement('p');
  story.className = 'timeline-story';
  story.textContent = incident.story || 'No written description was provided.';
  const details = document.createElement('div');
  details.className = 'timeline-details';
  addDetail(details, 'Time', incident.occurredTime);
  addDetail(details, 'Location', incident.details?.[2]);
  addDetail(details, 'Similar happened before', incident.details?.[0]);
  addDetail(details, 'Witnesses', incident.witness);
  addDetail(details, 'Told someone afterward', incident.disclosed);
  addDetail(details, 'Disclosure notes', incident.disclosureNotes);
  addDetail(details, 'Related material', incident.details?.[1]);
  addDetail(details, 'Material notes', incident.materialNotes);
  const editButton = document.createElement('a');
  editButton.className = 'edit-incident-link';
  editButton.href = `incident-draft.html?id=${encodeURIComponent(incident.id)}`;
  editButton.textContent = 'Add to or edit this note';
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'delete-incident-button';
  removeButton.textContent = 'Delete this draft';
  removeButton.addEventListener('click', () => {
    const shouldDelete = window.confirm('Delete this incident draft from this browser on this device? This cannot be undone here.');
    if (!shouldDelete) return;
    const remaining = incidents.filter((item) => item.id !== incident.id);
    localStorage.setItem('safecaseIncidents', JSON.stringify(remaining));
    if (activeDraft?.id === incident.id) {
      localStorage.removeItem('safecaseDraft');
      sessionStorage.removeItem('safecaseDraft');
    }
    window.location.reload();
  });
  card.append(marker, header, title, story, details, editButton, removeButton);
  list.append(card);
});
