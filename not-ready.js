const draftExists = Boolean(sessionStorage.getItem('safecaseDraft'));
const reviewLink = document.querySelector('#review-draft-link');
if (!draftExists) {
  reviewLink.hidden = true;
<<<<<<< HEAD
}
=======
}
>>>>>>> f27178a4627c50569972c68658e0f2e08aaa8cfb
