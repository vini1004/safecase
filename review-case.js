const panel = document.querySelector('#review-panel');
const empty = document.querySelector('#review-empty');
let draft = null;
try { draft = JSON.parse(localStorage.getItem('safecaseDraft')); } catch { draft = null; }

if (!draft) {
  empty.hidden = false;
} else {
  panel.hidden = false;
  document.querySelector('#review-story').textContent = draft.story || 'No written description was added.';
  const details = [
    ['Note recorded', draft.recordedAt ? new Date(draft.recordedAt).toLocaleString() : 'Date not available'],
    ['Date', draft.occurredDate ? new Date(`${draft.occurredDate}T00:00:00`).toLocaleDateString() : 'Not provided'],
    ['Approximate time', draft.occurredTime || 'Not provided'],
    ['People involved', draft.people || 'Not provided'],
    ['Location', draft.details?.[2] || 'Not provided'],
    ['Happened more than once', draft.details?.[0] || 'Not provided'],
    ['Witnesses', draft.witness || 'Not provided'],
    ['Told someone afterward', draft.disclosed || 'Not provided'],
    ['Disclosure notes', draft.disclosureNotes || 'Not provided'],
    ['Related material', draft.details?.[1] || 'Not provided']
  ];
  const detailsList = document.querySelector('#review-details');
  details.forEach(([label, value]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = value;
    row.append(term, description);
    detailsList.append(row);
  });

  const optionalContext = details.filter(([label, value]) => ['Date', 'Location', 'People involved'].includes(label) && value === 'Not provided');
  document.querySelector('#review-guidance').textContent = optionalContext.length
    ? 'A date, place, or people involved are not listed. If you remember and want to add them, you can. It is okay to leave any detail blank.'
    : 'You have added details across these prompts. Read through them once and change anything that does not feel right.';
  const missingList = document.querySelector('#review-missing');
  optionalContext.forEach(([label]) => {
    const item = document.createElement('li');
    item.textContent = `${label} is not listed`;
    missingList.append(item);
  });
}
