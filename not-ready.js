const draftExists = Boolean(localStorage.getItem('safecaseDraft'));
const reviewLink = document.querySelector('#review-draft-link');
if (!draftExists) {
  reviewLink.hidden = true;
}
