const form = document.querySelector('#draft-form');
const emptyMessage = document.querySelector('#draft-empty');
const statusMessage = document.querySelector('#draft-status');
const afterSave = document.querySelector('#after-save');

let draft = null;
try {
  draft = JSON.parse(sessionStorage.getItem('safecaseDraft'));
} catch {
  draft = null;
}

if (!draft) {
  form.hidden = true;
  emptyMessage.hidden = false;
} else {
  const storyField = document.querySelector('#draft-story');
  const repeatField = document.querySelector('#draft-repeat');
  const evidenceField = document.querySelector('#draft-evidence');
  const locationField = document.querySelector('#draft-location');
  storyField.value = draft.story || '';
  repeatField.value = draft.details?.[0] || '';
  evidenceField.value = draft.details?.[1] || '';
  locationField.value = draft.details?.[2] || '';

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    draft = {
      story: storyField.value.trim(),
      details: [repeatField.value, evidenceField.value, locationField.value],
      savedAt: new Date().toISOString()
    };
    sessionStorage.setItem('safecaseDraft', JSON.stringify(draft));
    statusMessage.textContent = 'Saved in this browser tab for this session.';
    afterSave.hidden = false;
    afterSave.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  document.querySelector('#clear-draft').addEventListener('click', () => {
    sessionStorage.removeItem('safecaseDraft');
    form.hidden = true;
    afterSave.hidden = true;
    emptyMessage.hidden = false;
    emptyMessage.textContent = 'Your draft has been cleared from this browser tab. Start Talk it out again whenever you’re ready.';
  });
<<<<<<< HEAD
}
=======
}
>>>>>>> f27178a4627c50569972c68658e0f2e08aaa8cfb
