const questions = [
  {
    key: 'repeat',
    prompt: 'Has something similar happened before?',
    hint: 'It’s okay if you’re not sure, and you can skip this.',
    choices: ['Yes', 'No', 'I’m not sure'],
    replies: {
      'Yes': 'Thank you. We can make a note of that, if you’d like.',
      'No': 'Thanks for letting me know. We’ll take it one step at a time.',
      'I’m not sure': 'That’s okay. You don’t have to be certain right now.'
    }
  },
  {
    key: 'witness',
    prompt: 'Was anyone else nearby, or might someone have heard about it afterward?',
    hint: 'Only share what feels comfortable. You can use a role instead of a name.',
    choices: ['Yes', 'No', 'I’m not sure', 'Prefer not to say'],
    replies: {
      'Yes': 'Thanks. You can add a little more later if you want; you don’t need to name anyone here.',
      'No': 'That’s okay. We can continue without that detail.',
      'I’m not sure': 'That’s okay. We can leave it uncertain.',
      'Prefer not to say': 'Of course. We can leave that blank.'
    }
  },
  {
    key: 'evidence',
    prompt: 'Do you have any messages, screenshots, or other related material?',
    hint: 'Evidence is optional. You don’t need to upload or show anything here.',
    choices: ['Yes, I have something', 'No, I don’t have evidence', 'Not right now', 'Prefer not to say'],
    replies: {
      'Yes, I have something': 'Okay. You don’t need to share it here. You can note what it is and decide what to do later.',
      'No, I don’t have evidence': 'That’s okay. You can still write down your account and choose what feels helpful next.',
      'Not right now': 'No problem. If you find or remember something later, you can add it to your note.',
      'Prefer not to say': 'Of course. We can leave that blank.'
    }
  },
  {
    key: 'disclosed',
    prompt: 'Have you talked to anyone about this since it happened?',
    hint: 'For example, a friend, family member, or someone you trust. You can add details later or skip this.',
    choices: ['Yes', 'No', 'I’m not sure', 'Prefer not to say'],
    replies: {
      'Yes': 'Thank you. If you want, you can note roughly when and who you spoke with later.',
      'No': 'That’s okay. We can leave that as it is.',
      'I’m not sure': 'That’s okay. You don’t have to work it out right now.',
      'Prefer not to say': 'Of course. We can leave that blank.'
    }
  },
  {
    key: 'location',
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

const answers = { story: '', repeat: '', witness: '', evidence: '', disclosed: '', location: '' };
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
  progress.textContent = step === 0 ? `Question 1 of ${questions.length + 1}` : `Question ${step + 1} of ${questions.length + 1}`;
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
        answers[question.key] = choice;
        addTurn('user', choice);
        addTurn('bot', question.replies[choice]);
        step += 1;
        showQuestion();
      }));
    });
    const actions = document.createElement('div');
    actions.className = 'conversation-actions';
    actions.append(makeButton('Skip this question', 'quiet-button', () => {
      answers[question.key] = '';
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
  [
    ['Happened more than once', answers.repeat],
    ['Witnesses or someone who may know', answers.witness],
    ['Related material', answers.evidence],
    ['Told someone afterward', answers.disclosed],
    ['Location', answers.location]
  ].forEach(([label, answer]) => {
    const row = document.createElement('li');
    const name = document.createElement('span');
    name.textContent = label;
    const value = document.createElement('strong');
    value.textContent = answer || 'Skipped';
    row.append(name, value);
    list.append(row);
  });
  const note = document.createElement('p');
  note.className = 'summary-footnote';
  note.textContent = 'These are your own answers, not verified findings. Not having evidence does not stop you from writing down your account.';
  summary.append(list, note);
  const actions = document.createElement('div');
  actions.className = 'conversation-actions';
  actions.append(
    makeButton('Start over', 'quiet-button', () => {
      answers.story = '';
      answers.repeat = '';
      answers.witness = '';
      answers.evidence = '';
      answers.disclosed = '';
      answers.location = '';
      turns.splice(1);
      step = 0;
      showQuestion();
    }),
    makeButton('Review incident draft →', 'primary-link button-link', () => {
      const draft = {
        id: globalThis.crypto?.randomUUID?.() || `draft-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        story: answers.story,
        details: [answers.repeat, answers.evidence, answers.location],
        witness: answers.witness,
        disclosed: answers.disclosed,
        recordedAt: new Date().toISOString(),
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
