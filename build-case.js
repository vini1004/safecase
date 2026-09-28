let draft = null;
try { draft = JSON.parse(sessionStorage.getItem('safecaseDraft')); } catch { draft = null; }
const summary = document.querySelector('#case-summary');
const empty = document.querySelector('#case-empty');
const actions = document.querySelector('#case-actions');
if (!draft) {
  empty.hidden = false;
} else {
  summary.hidden = false;
  actions.hidden = false;
  document.querySelector('#summary-story').textContent = draft.story || 'No written description was provided.';
  document.querySelector('#summary-repeat').textContent = draft.details?.[0] || 'Skipped';
  document.querySelector('#summary-evidence').textContent = draft.details?.[1] || 'Skipped';
  document.querySelector('#summary-location').textContent = draft.details?.[2] || 'Skipped';
  const savedDate = draft.savedAt ? new Date(draft.savedAt) : new Date();
  document.querySelector('#summary-date').textContent = `Prepared ${savedDate.toLocaleDateString()}`;
  document.querySelector('#print-summary').addEventListener('click', () => window.print());
}
