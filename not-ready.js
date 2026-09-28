const draftExists = Boolean(sessionStorage.getItem('safecaseDraft'));
const reviewLink = document.querySelector('#review-draft-link');
if (!draftExists) {
  reviewLink.hidden = true;
}
