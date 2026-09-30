const form = document.querySelector('#incident-form');
const errorMessage = document.querySelector('#form-error');
const storyField = document.querySelector('#incident-story');
if (new URLSearchParams(window.location.search).get('path') === 'no-evidence') {
  document.querySelector('#no-evidence-note').hidden = false;
}
storyField.addEventListener('input', () => storyField.setCustomValidity(''));

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!storyField.value.trim()) {
    storyField.setCustomValidity('Please add a short description, or go back and choose Talk it out.');
  }
  if (!form.reportValidity()) {
    errorMessage.textContent = 'Please add a short description of what happened, or go back and choose Talk it out.';
    return;
  }

  const draft = {
    id: globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    story: storyField.value.trim(),
    occurredDate: document.querySelector('#incident-date').value,
    occurredTime: document.querySelector('#incident-time').value,
    people: document.querySelector('#incident-people').value.trim(),
    witness: document.querySelector('#incident-witness').value,
    witnessNotes: document.querySelector('#incident-witness-notes').value.trim(),
    disclosed: document.querySelector('#incident-disclosed').value,
    disclosureNotes: document.querySelector('#incident-disclosure-notes').value.trim(),
    materialNotes: document.querySelector('#incident-material-notes').value.trim(),
    details: [
      document.querySelector('#incident-repeat').value,
      document.querySelector('#incident-evidence').value,
      document.querySelector('#incident-location').value
    ],
    recordedAt: new Date().toISOString(),
    savedAt: new Date().toISOString()
  };
  sessionStorage.setItem('safecaseDraft', JSON.stringify(draft));
  window.location.href = 'incident-draft.html';
});
