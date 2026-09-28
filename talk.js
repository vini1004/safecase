const questions = [
  {
    prompt: 'Has this happened more than once?',
    hint: 'It’s okay if you’re not sure.',
    choices: ['Yes', 'No', 'I’m not sure'],
    replies: {
      'Yes': 'Okay, thank you for telling me. We can note that it may have happened more than once.',
      'No': 'Thanks for letting me know. We’ll take it one step at a time.',
      'I’m not sure': 'That’s okay. You don’t have to be certain right now.'
    }
  },
  {
    prompt: 'Do you have any messages, screenshots, or other material related to this?',
    hint: 'You don’t need to upload or show anything here.',
    choices: ['Yes', 'No', 'Not right now'],
    replies: {
      'Yes': 'Okay. You don’t need to share it here; you can decide what to do with it later.',
      'No': 'That’s okay. We can continue without any materials.',
      'Not right now': 'No problem. You can add more details later if you want.'
    }
  },
  {
    prompt: 'Where did this mainly happen?',
    hint: 'Choose the closest option, or skip.',
    choices: ['On campus', 'Online', 'Hostel or residence', 'Somewhere else', 'I’m not sure'],
    replies: {
      'On campus': 'Thanks. I’ve noted that this happened on campus.',
      'Online': 'Thanks. I’ve noted that this happened online.',
      'Hostel or residence': 'Thanks. I’ve noted that this happened in a hostel or residence.',
      'Somewhere else': 'Thanks for letting me know.',
      'I’m not sure': 'That’s okay. You can leave that detail uncertain.'
    }
  }
];

const answers = { story: '', details: [] };
const turns = [{ speaker: 'bot', text: 'Hey, I’m here. Tell me what happened, whenever you’re ready.' }];
let step = 0;
let paused = false;

const content = document.querySelector('#conversation-content');
const progress = document.querySelector('#conversation-progress');
const backButton = document.querySelector('#back-button');
const momentButton = document.querySelector('#moment-button');
const momentMessage = document.querySelector('#moment-message');

function addTurn(speaker, text) {
  turns.push({ speaker, text });
}

function renderTurns(transcript) {
  turns.forEach((turn) => {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${turn.speaker === 'bot' ? 'chat-bot' : 'chat-user'}`;
    bubble.textContent = turn.text;
    transcript.append(bubble);
  });
}

function makeButton(label, className, onClick) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = className;
  button.textContent = label;
  button.addEventListener('click', onClick);
  return button;
}

function showQuestion() {
  paused = false;
  momentMessage.hidden = true;
  momentButton.textContent = 'I need a moment';
  backButton.disabled = step === 0;
  progress.textContent = step === 0 ? 'Question 1 of 4' : `Question ${step + 1} of 4`;
  content.replaceChildren();

  const transcript = document.createElement('div');
  transcript.className = 'chat-transcript';
  transcript.setAttribute('aria-live', 'polite');
  renderTurns(transcript);
  content.append(transcript);

  if (step === 0) {
    const hint = document.createElement('p');
    hint.className = 'gentle-hint';
    hint.textContent = 'You can keep it brief, or skip this question.';
    const label = document.createElement('label');
    label.className = 'visually-hidden';
    label.htmlFor = 'story-input';
    label.textContent = 'Tell SAFECASE what happened';
    const textarea = document.createElement('textarea');
    textarea.id = 'story-input';
    textarea.maxLength = 1200;
    textarea.placeholder = 'Start wherever feels easiest…';
    textarea.value = answers.story;
    const count = document.createElement('div');
    count.className = 'character-count';
    count.textContent = `${textarea.value.length} / 1200`;
    textarea.addEventListener('input', () => { count.textContent = `${textarea.value.length} / 1200`; });
    const actions = document.createElement('div');
    actions.className = 'conversation-actions';
    actions.append(
      makeButton('Skip this question', 'quiet-button', () => {
        answers.story = '';
        addTurn('user', 'I’d like to skip that question.');
        addTurn('bot', 'That’s okay. We can move on at your pace.');
        step = 1;
        showQuestion();
      }),
      makeButton('Continue →', 'primary-link button-link', () => {
        answers.story = textarea.value.trim();
        addTurn('user', answers.story || 'I’m not ready to write anything yet.');
        addTurn('bot', answers.story
          ? 'Thank you for sharing that with me. We can take it one step at a time.'
          : 'That’s okay. You don’t have to explain everything right now.');
        step = 1;
        showQuestion();
      })
    );
    content.append(hint, label, textarea, count, actions);
    textarea.focus();
    return;
  }

  if (step <= questions.length) {
    const question = questions[step - 1];
    const currentPrompt = document.createElement('div');
    currentPrompt.className = 'chat-bubble chat-bot';
    currentPrompt.textContent = question.prompt;
    const hint = document.createElement('p');
    hint.className = 'gentle-hint';
    hint.textContent = question.hint;
    const choices = document.createElement('div');
    choices.className = 'choice-list';
    choices.setAttribute('role', 'group');
    choices.setAttribute('aria-label', 'Choose an answer');
    question.choices.forEach((choice) => {
      choices.append(makeButton(choice, 'choice-button', () => {
        answers.details[step - 1] = choice;
        addTurn('user', choice);
        addTurn('bot', question.replies[choice]);
        step += 1;
        showQuestion();
      }));
    });
    const actions = document.createElement('div');
    actions.className = 'conversation-actions';
    actions.append(makeButton('Skip this question', 'quiet-button', () => {
      answers.details[step - 1] = '';
      addTurn('user', 'I’d like to skip that question.');
      addTurn('bot', 'Of course. We can leave that detail blank.');
      step += 1;
      showQuestion();
    }));
    content.append(currentPrompt, hint, choices, actions);
    return;
  }

  showSummary();
}

function showSummary() {
  step = questions.length + 1;
  progress.textContent = 'Review your notes';
  backButton.disabled = false;
  const transcript = content.querySelector('.chat-transcript');
  const closing = document.createElement('div');
  closing.className = 'chat-bubble chat-bot';
  closing.textContent = 'Thanks for taking this at your own pace. Here’s a summary of what you chose to share. You can go back and change any answer.';
  content.append(closing);

  const summary = document.createElement('div');
  summary.className = 'summary-card';
  const heading = document.createElement('h2');
  heading.textContent = 'Your notes';
  const story = document.createElement('p');
  story.className = 'summary-story';
  story.textContent = answers.story || 'You skipped this question.';
  summary.append(heading, story);
  const list = document.createElement('ul');
  ['Happened more than once', 'Related material available', 'Location'].forEach((label, index) => {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = label;
    const value = document.createElement('strong');
    value.textContent = answers.details[index] || 'Skipped';
    row.append(name, value);
    list.append(row);
  });
  const note = document.createElement('p');
  note.className = 'summary-footnote';
  note.textContent = 'These are your answers, not verified findings. This prototype does not save them after you leave this page.';
  summary.append(list, note);
  const actions = document.createElement('div');
  actions.className = 'conversation-actions';
  actions.append(
    makeButton('Start over', 'quiet-button', () => {
      answers.story = '';
      answers.details = [];
      turns.splice(1);
      step = 0;
      showQuestion();
    }),
    makeButton('Review incident draft →', 'primary-link button-link', () => {
      const draft = {
        story: answers.story,
        details: answers.details,
        savedAt: new Date().toISOString()
      };
      sessionStorage.setItem('safecaseDraft', JSON.stringify(draft));
      window.location.href = 'incident-draft.html';
    })
  );
  content.append(summary, actions);
}

document.querySelector('#back-button').addEventListener('click', () => {
  if (step === questions.length + 1) {
    step = questions.length;
    if (turns.length >= 2) turns.splice(-2);
  } else if (step > 0) {
    step -= 1;
    if (turns.length >= 2) turns.splice(-2);
  }
  showQuestion();
});

document.querySelector('#moment-button').addEventListener('click', () => {
  paused = !paused;
  momentMessage.hidden = !paused;
  momentButton.textContent = paused ? 'I’m ready to continue' : 'I need a moment';
});

showQuestion();
