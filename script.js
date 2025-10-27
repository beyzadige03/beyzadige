const stage = document.getElementById('stage');
const characterSlots = document.getElementById('characterSlots');
const backgroundOptionsContainer = document.getElementById('backgroundOptions');
const characterControlsContainer = document.getElementById('characterControls');
const characterControlTemplate = document.getElementById('characterControlTemplate');
const playAnimationButton = document.getElementById('playAnimation');
const resetStageButton = document.getElementById('resetStage');
const sceneForm = document.getElementById('sceneForm');
const sceneList = document.getElementById('sceneList');
const sceneListItemTemplate = document.getElementById('sceneListItemTemplate');

const startRecordingButton = document.getElementById('startRecording');
const stopRecordingButton = document.getElementById('stopRecording');
const recordingStatus = document.getElementById('recordingStatus');
const audioPlayback = document.getElementById('audioPlayback');
const downloadLink = document.getElementById('downloadLink');

const backgrounds = [
  {
    id: 'sunset',
    label: 'Gün Batımı',
    description: 'Sıcak tonlarda akşamüstü ışığı',
    style: 'linear-gradient(180deg, #ff9a8b 0%, #ff6a88 50%, #d66d75 100%)'
  },
  {
    id: 'space',
    label: 'Uzay Üssü',
    description: 'Galaksi manzaralı bilim kurgu sahnesi',
    style: 'radial-gradient(circle at 30% 20%, rgba(76, 201, 240, 0.35), transparent 70%), #0b1026'
  },
  {
    id: 'forest',
    label: 'Orman Sahnesi',
    description: 'Doğal ve sakin bir ortam',
    style: 'linear-gradient(160deg, #8fd3f4 0%, #84fab0 100%)'
  },
  {
    id: 'stage',
    label: 'Sahne Işıkları',
    description: 'Spot ışıklarıyla sahne atmosferi',
    style: 'radial-gradient(circle at 50% 0%, rgba(255, 221, 89, 0.36), transparent 70%), #1f1147'
  }
];

const characterPresets = [
  { id: 'explorer', name: 'Kaşif', emoji: '🧭', defaultColor: '#4cc9f0' },
  { id: 'scientist', name: 'Bilim İnsanı', emoji: '🧪', defaultColor: '#ffd166' },
  { id: 'artist', name: 'Sanatçı', emoji: '🎨', defaultColor: '#ff7b54' },
  { id: 'robot', name: 'Robot', emoji: '🤖', defaultColor: '#c77dff' },
  { id: 'astronaut', name: 'Astronot', emoji: '🧑‍🚀', defaultColor: '#5e60ce' },
  { id: 'storyteller', name: 'Anlatıcı', emoji: '📚', defaultColor: '#4caf50' }
];

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
};

const defaultCharacters = () => [
  {
    active: true,
    presetId: 'explorer',
    name: 'Karakter 1',
    color: '#4cc9f0',
    pose: 'pose-idle',
    expression: 'happy',
    dialogue: 'Merhaba! Ben hazırım.'
  },
  {
    active: true,
    presetId: 'scientist',
    name: 'Karakter 2',
    color: '#ffd166',
    pose: 'pose-wave',
    expression: 'thinking',
    dialogue: 'Bir planım var!'
  },
  {
    active: false,
    presetId: 'artist',
    name: 'Karakter 3',
    color: '#ff7b54',
    pose: 'pose-bounce',
    expression: 'surprised',
    dialogue: 'Harika bir fikir!'
  }
];

let characters = defaultCharacters();
let selectedBackground = backgrounds[0].id;
let scenes = [];

let mediaRecorder;
let recordedChunks = [];
let audioBlobUrl;

function getPreset(presetId) {
  return characterPresets.find((preset) => preset.id === presetId) ?? characterPresets[0];
}

function setBackground(backgroundId) {
  const background = backgrounds.find((item) => item.id === backgroundId) ?? backgrounds[0];
  selectedBackground = background.id;
  stage.style.background = background.style;

  Array.from(backgroundOptionsContainer.children).forEach((option) => {
    option.classList.toggle('active', option.dataset.id === selectedBackground);
    const input = option.querySelector('input');
    if (input) {
      input.checked = input.value === selectedBackground;
    }
  });
}

function createBackgroundOptions() {
  backgrounds.forEach((background, index) => {
    const option = document.createElement('label');
    option.className = 'background-option';
    option.dataset.id = background.id;
    option.tabIndex = 0;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'stageBackground';
    input.value = background.id;
    input.checked = index === 0;

    const preview = document.createElement('div');
    preview.className = 'background-option__preview';
    preview.style.background = background.style;

    const details = document.createElement('div');
    const title = document.createElement('p');
    title.textContent = background.label;
    title.style.fontWeight = '600';
    const description = document.createElement('p');
    description.textContent = background.description;
    description.style.fontSize = '0.9rem';
    description.style.color = 'var(--text-muted)';

    details.append(title, description);
    option.append(input, preview, details);

    const selectBackground = () => setBackground(background.id);
    option.addEventListener('click', selectBackground);
    option.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        selectBackground();
      }
    });

    backgroundOptionsContainer.appendChild(option);
  });

  setBackground(selectedBackground);
}

function renderCharactersOnStage() {
  characterSlots.innerHTML = '';

  characters.forEach((character, index) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'character';
    wrapper.dataset.index = index.toString();
    if (!character.active) {
      wrapper.classList.add('inactive');
    }
    wrapper.style.background = `linear-gradient(180deg, ${character.color}33 0%, rgba(12, 15, 28, 0.72) 100%)`;

    const avatar = document.createElement('span');
    avatar.className = 'character-avatar';
    avatar.textContent = getPreset(character.presetId).emoji;

    const name = document.createElement('p');
    name.className = 'character-name';
    name.textContent = character.name || `Karakter ${index + 1}`;

    const dialogue = document.createElement('div');
    dialogue.className = 'dialogue';
    if (character.expression === 'thinking') {
      dialogue.classList.add('thinking');
    } else if (character.expression === 'surprised') {
      dialogue.classList.add('surprised');
    }
    dialogue.textContent = character.dialogue || '...';

    wrapper.append(avatar, name, dialogue);
    characterSlots.appendChild(wrapper);
  });
}

function createCharacterControl(character, index) {
  const clone = characterControlTemplate.content.firstElementChild.cloneNode(true);
  clone.dataset.index = index.toString();

  const icon = clone.querySelector('.character-icon');
  const title = clone.querySelector('h3');
  const activeToggle = clone.querySelector('.character-active');
  const avatarSelect = clone.querySelector('.character-avatar');
  const nameInput = clone.querySelector('.character-name');
  const colorInput = clone.querySelector('.character-color');
  const poseSelect = clone.querySelector('.character-pose');
  const expressionSelect = clone.querySelector('.character-expression');
  const dialogueInput = clone.querySelector('.character-dialogue');

  title.textContent = `Karakter ${index + 1}`;
  icon.textContent = getPreset(character.presetId).emoji;
  activeToggle.checked = character.active;

  characterPresets.forEach((preset) => {
    const option = document.createElement('option');
    option.value = preset.id;
    option.textContent = `${preset.emoji} ${preset.name}`;
    if (preset.id === character.presetId) {
      option.selected = true;
    }
    avatarSelect.appendChild(option);
  });

  nameInput.value = character.name;
  colorInput.value = character.color;
  poseSelect.value = character.pose;
  expressionSelect.value = character.expression;
  dialogueInput.value = character.dialogue;

  activeToggle.addEventListener('change', (event) => {
    characters[index].active = event.target.checked;
    renderCharactersOnStage();
  });

  avatarSelect.addEventListener('change', (event) => {
    const previousPreset = getPreset(characters[index].presetId);
    const previousColor = characters[index].color;
    const selectedPreset = getPreset(event.target.value);

    characters[index].presetId = selectedPreset.id;
    icon.textContent = selectedPreset.emoji;

    if (previousColor === previousPreset.defaultColor) {
      characters[index].color = selectedPreset.defaultColor;
      colorInput.value = selectedPreset.defaultColor;
    }

    renderCharactersOnStage();
  });

  nameInput.addEventListener('input', (event) => {
    characters[index].name = event.target.value || `Karakter ${index + 1}`;
    renderCharactersOnStage();
  });

  colorInput.addEventListener('input', (event) => {
    characters[index].color = event.target.value;
    renderCharactersOnStage();
  });

  poseSelect.addEventListener('change', (event) => {
    characters[index].pose = event.target.value;
  });

  expressionSelect.addEventListener('change', (event) => {
    characters[index].expression = event.target.value;
    renderCharactersOnStage();
  });

  dialogueInput.addEventListener('input', (event) => {
    characters[index].dialogue = event.target.value;
    renderCharactersOnStage();
  });

  return clone;
}

function renderCharacterControls() {
  characterControlsContainer.innerHTML = '';
  characters.forEach((character, index) => {
    const control = createCharacterControl(character, index);
    characterControlsContainer.appendChild(control);
  });
}

function playAnimation() {
  const characterElements = Array.from(characterSlots.children);
  if (!characterElements.length) {
    return;
  }

  characterElements.forEach((element, index) => {
    const avatar = element.querySelector('.character-avatar');
    const poseClass = characters[index].pose;

    avatar.classList.remove('pose-idle', 'pose-wave', 'pose-bounce', 'pose-slide');

    if (characters[index].active) {
      void avatar.offsetWidth;
      avatar.classList.add(poseClass);
    }
  });

  playAnimationButton.disabled = true;
  setTimeout(() => {
    characterElements.forEach((element) => {
      const avatar = element.querySelector('.character-avatar');
      avatar.classList.remove('pose-idle', 'pose-wave', 'pose-bounce', 'pose-slide');
    });
    playAnimationButton.disabled = false;
  }, 4000);
}

function handleSceneFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(sceneForm);
  const title = formData.get('sceneTitle').toString().trim();
  const summary = formData.get('sceneSummary').toString().trim();
  const duration = Number(formData.get('sceneDuration'));

  if (!title || !summary || Number.isNaN(duration)) {
    return;
  }

  const snapshotDialogues = characters
    .filter((character) => character.active && character.dialogue)
    .map((character) => `${character.name}: "${character.dialogue}"`);

  scenes.push({
    id: createId(),
    title,
    summary,
    duration,
    backgroundId: selectedBackground,
    dialogues: snapshotDialogues
  });

  renderScenes();
  sceneForm.reset();
  sceneForm.querySelector('#sceneDuration').value = '8';
}

function renderScenes() {
  sceneList.innerHTML = '';

  if (!scenes.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Henüz sahne eklenmedi.';
    empty.style.color = 'var(--text-muted)';
    sceneList.appendChild(empty);
    return;
  }

  scenes.forEach((scene) => {
    const element = sceneListItemTemplate.content.firstElementChild.cloneNode(true);
    const name = element.querySelector('.scene-name');
    const details = element.querySelector('.scene-details');
    const removeButton = element.querySelector('.remove-scene');

    const backgroundLabel = backgrounds.find((bg) => bg.id === scene.backgroundId)?.label ?? '';
    const dialogueSummary = scene.dialogues.length
      ? scene.dialogues.join(' · ')
      : 'Diyalog eklenmedi.';

    name.textContent = scene.title;
    details.innerHTML = `
      <span>${scene.summary}</span>
      <span class="scene-meta">${scene.duration} saniye · ${backgroundLabel} · ${dialogueSummary}</span>
    `;

    removeButton.addEventListener('click', () => {
      scenes = scenes.filter((item) => item.id !== scene.id);
      renderScenes();
    });

    sceneList.appendChild(element);
  });
}

function resetStage() {
  characters = defaultCharacters();
  selectedBackground = backgrounds[0].id;
  scenes = [];

  renderCharacterControls();
  renderCharactersOnStage();
  renderScenes();
  setBackground(selectedBackground);
}

async function startRecording() {
  if (!navigator.mediaDevices?.getUserMedia) {
    recordingStatus.textContent = 'Tarayıcınız mikrofon kaydını desteklemiyor.';
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener('stop', () => {
      const blob = new Blob(recordedChunks, { type: 'audio/webm' });
      if (audioBlobUrl) {
        URL.revokeObjectURL(audioBlobUrl);
      }
      audioBlobUrl = URL.createObjectURL(blob);
      audioPlayback.src = audioBlobUrl;
      audioPlayback.load();
      downloadLink.href = audioBlobUrl;
      downloadLink.hidden = false;
      recordingStatus.textContent = 'Kayıt tamamlandı. Dinleyebilir veya indirebilirsiniz.';

      stream.getTracks().forEach((track) => track.stop());
      stopRecordingButton.disabled = true;
      startRecordingButton.disabled = false;
    });

    mediaRecorder.start();
    recordingStatus.textContent = 'Kayıt yapılıyor...';
    startRecordingButton.disabled = true;
    stopRecordingButton.disabled = false;
    downloadLink.hidden = true;
    audioPlayback.removeAttribute('src');
    audioPlayback.load();
  } catch (error) {
    console.error(error);
    recordingStatus.textContent = 'Mikrofon erişimi alınamadı.';
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    recordingStatus.textContent = 'Kaydedilen ses hazırlanıyor...';
  }
}

playAnimationButton.addEventListener('click', playAnimation);
resetStageButton.addEventListener('click', resetStage);
sceneForm.addEventListener('submit', handleSceneFormSubmit);
startRecordingButton.addEventListener('click', startRecording);
stopRecordingButton.addEventListener('click', stopRecording);

createBackgroundOptions();
renderCharacterControls();
renderCharactersOnStage();
renderScenes();
