const roleCards = document.querySelectorAll('.role-card');
const selectionMessage = document.querySelector('#selection-message');
const continueButton = document.querySelector('#continue-button');
const startOptions = document.querySelector('#start-options');
const backButton = document.querySelector('#back-button');
const optionCards = document.querySelectorAll('.start-option');
const optionMessage = document.querySelector('#option-message');
let selectedRole = '';

roleCards.forEach((card) => {
  card.addEventListener('click', () => {
    // Only one role can be selected at a time.
    roleCards.forEach((otherCard) => {
      otherCard.setAttribute('aria-pressed', String(otherCard === card));
    });

    const role = card.dataset.role;
    selectedRole = role;
    continueButton.disabled = false;
    selectionMessage.textContent = role === 'student'
      ? 'Student selected. Continue to choose how you’d like to start.'
      : 'Teacher or staff selected. Continue to choose how you’d like to start.';
  });
});

continueButton.addEventListener('click', () => {
  if (!selectedRole) return;
  startOptions.hidden = false;
  continueButton.hidden = true;
  selectionMessage.hidden = true;
  document.querySelector('.role-grid').hidden = true;
  document.querySelector('.start-heading').hidden = true;
  startOptions.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

backButton.addEventListener('click', () => {
  startOptions.hidden = true;
  continueButton.hidden = false;
  selectionMessage.hidden = false;
  document.querySelector('.role-grid').hidden = false;
  document.querySelector('.start-heading').hidden = false;
  optionCards.forEach((card) => card.setAttribute('aria-pressed', 'false'));
  optionMessage.textContent = 'Choose one to see where it leads.';
});

optionCards.forEach((card) => {
  card.addEventListener('click', () => {
    optionCards.forEach((otherCard) => {
      otherCard.setAttribute('aria-pressed', String(otherCard === card));
    });

    const nextStep = {
      talk: 'Talk it out selected. This will open a gentle, guided conversation.',
      document: 'Document an incident selected. This will open a step-by-step incident form.',
      unsure: 'Explore options selected. This will help you understand possible next steps.'
    };
    optionMessage.textContent = nextStep[card.dataset.option];
  });
});
