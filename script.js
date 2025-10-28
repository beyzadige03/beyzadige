const sceneListElement = document.getElementById('sceneList');
const sceneTimelineElement = document.getElementById('sceneTimeline');
const backgroundGridElement = document.getElementById('backgroundGrid');
const characterLibraryElement = document.getElementById('characterLibrary');
const stageCanvas = document.getElementById('stageCanvas');
const actorControls = document.getElementById('actorControls');
const sceneTitleInput = document.getElementById('sceneTitleInput');
const sceneDurationInput = document.getElementById('sceneDurationInput');
const sceneDurationLabel = document.getElementById('sceneDurationLabel');
const dialogueForm = document.getElementById('dialogueForm');
const dialogueCharacterSelect = document.getElementById('dialogueCharacterSelect');
const dialogueToneSelect = document.getElementById('dialogueToneSelect');
const dialogueText = document.getElementById('dialogueText');
const dialogueListElement = document.getElementById('dialogueList');
const addSceneButton = document.getElementById('addSceneBtn');
const sceneCountLabel = document.getElementById('sceneCount');
const storyboardStatusLabel = document.getElementById('storyboardStatus');
const storyboardOutput = document.getElementById('storyboardOutput');
const generateStoryboardButton = document.getElementById('generateStoryboard');
const copyStoryboardButton = document.getElementById('copyStoryboard');

const backgrounds = [
  {
    id: 'sunset-city',
    name: 'Gün batımı şehri',
    gradient: 'linear-gradient(140deg, #ff9a8b 0%, #ff6a88 55%, #ff99ac 100%)',
    description: 'Modern şehir manzarası, gün batımı ışıkları.'
  },
  {
    id: 'tech-lab',
    name: 'Teknoloji laboratuvarı',
    gradient: 'linear-gradient(140deg, #1f1c2c 0%, #928dab 100%)',
    description: 'Holografik ekranlar ve neon ışıklar.'
  },
  {
    id: 'studio-light',
    name: 'Stüdyo ışıkları',
    gradient: 'linear-gradient(140deg, #09203f 0%, #537895 100%)',
    description: 'Talk-show hissi veren stüdyo ortamı.'
  },
  {
    id: 'classroom',
    name: 'Yaratıcı sınıf',
    gradient: 'linear-gradient(140deg, #fbd3e9 0%, #bb377d 100%)',
    description: 'Eğitim videoları için sıcak bir ortam.'
  },
  {
    id: 'minimal-office',
    name: 'Minimal ofis',
    gradient: 'linear-gradient(140deg, #4568dc 0%, #b06ab3 100%)',
    description: 'Kurumsal anlatımlar için sade bir ofis.'
  },
  {
    id: 'green-garden',
    name: 'Yeşil bahçe',
    gradient: 'linear-gradient(140deg, #11998e 0%, #38ef7d 100%)',
    description: 'Doğa temalı hikâyeler için ferah sahne.'
  }
];

const characterLibrary = [
  { id: 'ayse', name: 'Ayşe', role: 'Sunucu', color: '#ff7b6e' },
  { id: 'kaan', name: 'Kaan', role: 'Girişimci', color: '#6656ff' },
  { id: 'lale', name: 'Lale', role: 'Öğretmen', color: '#2ab3ff' },
  { id: 'burak', name: 'Burak', role: 'Öğrenci', color: '#f7b733' },
  { id: 'nisa', name: 'Nisa', role: 'Yönetici', color: '#845ef7' },
  { id: 'erol', name: 'Erol', role: 'Anlatıcı', color: '#20c997' }
];

const expressions = [
  { id: 'neutral', label: 'Nötr' },
  { id: 'happy', label: 'Neşeli' },
  { id: 'serious', label: 'Ciddi' },
  { id: 'thinking', label: 'Düşünen' },
  { id: 'surprised', label: 'Şaşkın' }
];

const actions = [
  { id: 'talking', label: 'Konuşma' },
  { id: 'listening', label: 'Dinleme' },
  { id: 'gesturing', label: 'Jest yapma' },
  { id: 'walking', label: 'Yürüme' }
];

let scenes = [];
let activeSceneId = null;
let sceneCounter = 1;
let storyboardDirty = true;

function createSceneTemplate() {
  const background = backgrounds[(sceneCounter - 1) % backgrounds.length];
  const scene = {
    id: `scene-${sceneCounter}`,
    title: `Sahne ${sceneCounter}`,
    duration: 8,
    background: background.id,
    characters: [],
    dialogues: []
  };
  sceneCounter += 1;
  return scene;
}

function getActiveScene() {
  return scenes.find((scene) => scene.id === activeSceneId) || null;
}

function setActiveScene(sceneId) {
  activeSceneId = sceneId;
  const activeScene = getActiveScene();
  if (!activeScene) {
    return;
  }

  sceneTitleInput.value = activeScene.title;
  sceneDurationInput.value = String(activeScene.duration);
  sceneDurationLabel.textContent = `${activeScene.duration} sn`;

  renderSceneList();
  renderTimeline();
  renderBackgroundGrid();
  renderCharacterLibrary();
  renderStage();
  renderActorControls();
  renderDialogueList();
  renderDialogueCharacterSelect();
}

function markStoryboardDirty() {
  storyboardDirty = true;
  storyboardStatusLabel.textContent = 'Güncel değil';
}

function addScene() {
  const newScene = createSceneTemplate();
  scenes.push(newScene);
  updateSceneCount();
  markStoryboardDirty();
  setActiveScene(newScene.id);
}

function removeScene(sceneId) {
  if (scenes.length === 1) {
    return;
  }
  scenes = scenes.filter((scene) => scene.id !== sceneId);
  if (activeSceneId === sceneId) {
    activeSceneId = scenes[0]?.id || null;
  }
  updateSceneCount();
  markStoryboardDirty();
  setActiveScene(activeSceneId);
}

function renderSceneList() {
  sceneListElement.innerHTML = '';

  if (!scenes.length) {
    const empty = document.createElement('p');
    empty.className = 'panel-hint';
    empty.textContent = 'Henüz sahne yok. "Yeni sahne" düğmesine tıklayın.';
    sceneListElement.appendChild(empty);
    return;
  }

  scenes.forEach((scene, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `scene-card${scene.id === activeSceneId ? ' active' : ''}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-selected', scene.id === activeSceneId);
    button.innerHTML = `
      <div>
        <strong>${scene.title}</strong>
        <span>${getBackgroundById(scene.background)?.name || 'Arka plan yok'} · ${scene.duration} sn</span>
      </div>
      <span>#${index + 1}</span>
    `;
    button.addEventListener('click', () => {
      setActiveScene(scene.id);
    });
    button.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      removeScene(scene.id);
    });

    sceneListElement.appendChild(button);
  });
}

function renderTimeline() {
  sceneTimelineElement.innerHTML = '';

  scenes.forEach((scene, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `timeline-item${scene.id === activeSceneId ? ' active' : ''}`;
    button.innerHTML = `<span>${scene.duration} sn</span> ${scene.title}`;
    button.title = 'Seçmek için tıklayın, kaldırmak için sağ tıklayın';
    button.addEventListener('click', () => {
      setActiveScene(scene.id);
    });
    button.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      removeScene(scene.id);
    });

    sceneTimelineElement.appendChild(button);

    if (index < scenes.length - 1) {
      const spacer = document.createElement('div');
      spacer.className = 'timeline-spacer';
      sceneTimelineElement.appendChild(spacer);
    }
  });
}

function renderBackgroundGrid() {
  backgroundGridElement.innerHTML = '';
  const activeScene = getActiveScene();

  backgrounds.forEach((background) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = `background-card${activeScene?.background === background.id ? ' active' : ''}`;
    card.style.background = background.gradient;
    card.dataset.name = background.name;
    card.title = background.description;
    card.addEventListener('click', () => {
      if (!activeScene) return;
      activeScene.background = background.id;
      renderBackgroundGrid();
      renderStage();
      markStoryboardDirty();
    });

    backgroundGridElement.appendChild(card);
  });
}

function renderCharacterLibrary() {
  characterLibraryElement.innerHTML = '';
  const activeScene = getActiveScene();

  characterLibrary.forEach((character) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'character-card';
    card.title = `${character.name} · ${character.role}`;
    card.innerHTML = `
      <div class="character-avatar" style="background: ${character.color}">${character.name.charAt(0)}</div>
      <strong>${character.name}</strong>
      <p class="character-role">${character.role}</p>
    `;

    card.addEventListener('click', () => {
      if (!activeScene) return;
      const exists = activeScene.characters.some((actor) => actor.id === character.id);
      if (!exists) {
        activeScene.characters.push({
          id: character.id,
          name: character.name,
          role: character.role,
          color: character.color,
          expression: 'neutral',
          action: 'talking'
        });
        renderStage();
        renderActorControls();
        renderDialogueCharacterSelect();
        markStoryboardDirty();
      }
    });

    const isActive = activeScene?.characters.some((actor) => actor.id === character.id);
    card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    if (isActive) {
      card.classList.add('active');
    }

    characterLibraryElement.appendChild(card);
  });
}

function renderStage() {
  const activeScene = getActiveScene();
  stageCanvas.innerHTML = '';

  if (!activeScene) {
    stageCanvas.innerHTML = '<p class="empty-stage">Önce bir sahne ekleyin.</p>';
    return;
  }

  const background = getBackgroundById(activeScene.background);
  if (background) {
    stageCanvas.style.background = background.gradient;
    stageCanvas.setAttribute('aria-label', `${activeScene.title} sahnesi, ${background.name} arka planı`);
  } else {
    stageCanvas.removeAttribute('style');
  }

  if (!activeScene.characters.length) {
    stageCanvas.innerHTML = '<p class="empty-stage">Karakter ekleyin veya arka plan seçin. Sahne önizlemesi burada görünecek.</p>';
    return;
  }

  activeScene.characters.forEach((actor) => {
    const characterEl = document.createElement('div');
    characterEl.className = 'stage-character';

    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.style.background = `linear-gradient(135deg, ${actor.color}, rgba(255, 255, 255, 0.18))`;
    avatar.textContent = actor.name.charAt(0);

    const nameBadge = document.createElement('div');
    nameBadge.className = 'badge';
    nameBadge.textContent = `${actor.name} · ${getExpressionLabel(actor.expression)}`;

    const actionBadge = document.createElement('span');
    actionBadge.className = 'badge';
    actionBadge.textContent = getActionLabel(actor.action);

    characterEl.appendChild(avatar);
    characterEl.appendChild(nameBadge);
    characterEl.appendChild(actionBadge);
    stageCanvas.appendChild(characterEl);
  });
}

function renderActorControls() {
  const activeScene = getActiveScene();
  actorControls.innerHTML = '';

  if (!activeScene) {
    const info = document.createElement('p');
    info.className = 'panel-hint';
    info.textContent = 'Önce bir sahne seçin.';
    actorControls.appendChild(info);
    return;
  }

  if (!activeScene.characters.length) {
    const hint = document.createElement('p');
    hint.className = 'panel-hint';
    hint.textContent = 'Bu sahnede henüz karakter yok. Soldaki kütüphaneden ekleyin.';
    actorControls.appendChild(hint);
    return;
  }

  activeScene.characters.forEach((actor) => {
    const card = document.createElement('div');
    card.className = 'actor-card';

    const avatar = document.createElement('div');
    avatar.className = 'character-avatar';
    avatar.style.background = actor.color;
    avatar.textContent = actor.name.charAt(0);

    const info = document.createElement('div');
    const name = document.createElement('strong');
    name.textContent = actor.name;
    const meta = document.createElement('p');
    meta.className = 'actor-meta';
    meta.textContent = actor.role;

    const actionsWrapper = document.createElement('div');
    actionsWrapper.className = 'actor-actions';

    const expressionSelect = document.createElement('select');
    expressions.forEach((expression) => {
      const option = document.createElement('option');
      option.value = expression.id;
      option.textContent = expression.label;
      expressionSelect.appendChild(option);
    });
    expressionSelect.value = actor.expression;
    expressionSelect.addEventListener('change', (event) => {
      actor.expression = event.target.value;
      renderStage();
      renderDialogueList();
      markStoryboardDirty();
    });

    const actionSelect = document.createElement('select');
    actions.forEach((action) => {
      const option = document.createElement('option');
      option.value = action.id;
      option.textContent = action.label;
      actionSelect.appendChild(option);
    });
    actionSelect.value = actor.action;
    actionSelect.addEventListener('change', (event) => {
      actor.action = event.target.value;
      renderStage();
      markStoryboardDirty();
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-btn';
    removeButton.textContent = 'Karakteri kaldır';
    removeButton.addEventListener('click', () => {
      removeActorFromScene(actor.id);
    });

    actionsWrapper.appendChild(expressionSelect);
    actionsWrapper.appendChild(actionSelect);
    actionsWrapper.appendChild(removeButton);

    info.appendChild(name);
    info.appendChild(meta);
    info.appendChild(actionsWrapper);

    card.appendChild(avatar);
    card.appendChild(info);
    actorControls.appendChild(card);
  });
}

function removeActorFromScene(actorId) {
  const activeScene = getActiveScene();
  if (!activeScene) return;

  activeScene.characters = activeScene.characters.filter((actor) => actor.id !== actorId);
  activeScene.dialogues = activeScene.dialogues.filter((dialogue) => dialogue.characterId !== actorId);

  renderStage();
  renderActorControls();
  renderCharacterLibrary();
  renderDialogueList();
  renderDialogueCharacterSelect();
  markStoryboardDirty();
}

function renderDialogueCharacterSelect() {
  const activeScene = getActiveScene();
  dialogueCharacterSelect.innerHTML = '';

  const narratorOption = document.createElement('option');
  narratorOption.value = 'narrator';
  narratorOption.textContent = 'Anlatıcı';
  dialogueCharacterSelect.appendChild(narratorOption);

  if (!activeScene) {
    return;
  }

  activeScene.characters.forEach((actor) => {
    const option = document.createElement('option');
    option.value = actor.id;
    option.textContent = actor.name;
    dialogueCharacterSelect.appendChild(option);
  });
}

function renderDialogueList() {
  const activeScene = getActiveScene();
  dialogueListElement.innerHTML = '';

  if (!activeScene || !activeScene.dialogues.length) {
    const empty = document.createElement('p');
    empty.className = 'panel-hint';
    empty.textContent = 'Bu sahne için henüz replik yazılmadı.';
    dialogueListElement.appendChild(empty);
    return;
  }

  activeScene.dialogues.forEach((dialogue, index) => {
    const card = document.createElement('div');
    card.className = 'dialogue-card';

    const header = document.createElement('div');
    header.className = 'dialogue-header';
    const speaker = document.createElement('strong');
    speaker.textContent = `${index + 1}. ${dialogue.characterName}`;
    const tone = document.createElement('span');
    tone.className = 'dialogue-tone';
    tone.textContent = dialogue.tone;

    header.appendChild(speaker);
    const actor = dialogue.characterId === 'narrator'
      ? null
      : activeScene.characters.find((item) => item.id === dialogue.characterId);
    if (actor) {
      const expression = document.createElement('span');
      expression.className = 'dialogue-meta';
      expression.textContent = getExpressionLabel(actor.expression);
      header.appendChild(expression);
    }
    header.appendChild(tone);

    const text = document.createElement('p');
    text.className = 'dialogue-text';
    text.textContent = dialogue.text;

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-btn';
    removeButton.textContent = 'Repliği sil';
    removeButton.addEventListener('click', () => {
      deleteDialogue(dialogue.id);
    });

    card.appendChild(header);
    card.appendChild(text);
    card.appendChild(removeButton);

    dialogueListElement.appendChild(card);
  });
}

function deleteDialogue(dialogueId) {
  const activeScene = getActiveScene();
  if (!activeScene) return;

  activeScene.dialogues = activeScene.dialogues.filter((dialogue) => dialogue.id !== dialogueId);
  renderDialogueList();
  markStoryboardDirty();
}

function handleDialogueSubmit(event) {
  event.preventDefault();
  const activeScene = getActiveScene();
  if (!activeScene) return;

  const text = dialogueText.value.trim();
  if (!text) {
    dialogueText.focus();
    return;
  }

  const characterId = dialogueCharacterSelect.value;
  const tone = dialogueToneSelect.value;
  const dialogueId = `dlg-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;

  let characterName = 'Anlatıcı';
  if (characterId !== 'narrator') {
    const actor = activeScene.characters.find((item) => item.id === characterId);
    characterName = actor ? actor.name : 'Karakter';
  }

  activeScene.dialogues.push({
    id: dialogueId,
    characterId,
    characterName,
    tone,
    text
  });

  dialogueText.value = '';
  renderDialogueList();
  markStoryboardDirty();
}

function getBackgroundById(id) {
  return backgrounds.find((background) => background.id === id) || null;
}

function getExpressionLabel(expressionId) {
  return expressions.find((expression) => expression.id === expressionId)?.label || 'Nötr';
}

function getActionLabel(actionId) {
  return actions.find((action) => action.id === actionId)?.label || 'Konuşma';
}

function updateSceneCount() {
  sceneCountLabel.textContent = scenes.length.toString();
}

function generateStoryboard() {
  if (!scenes.length) {
    storyboardOutput.textContent = 'Storyboard oluşturmak için en az bir sahne ekleyin.';
    storyboardStatusLabel.textContent = 'Hazır değil';
    storyboardDirty = true;
    return;
  }

  const blocks = scenes.map((scene, index) => {
    const background = getBackgroundById(scene.background);
    const characterSummary = scene.characters.length
      ? scene.characters.map((actor) => `${actor.name} (${getExpressionLabel(actor.expression)}, ${getActionLabel(actor.action)})`).join(', ')
      : 'Karakter eklenmedi';

    const dialogueSummary = scene.dialogues.length
      ? scene.dialogues.map((dialogue) => `  - ${dialogue.characterName} [${dialogue.tone}]: ${dialogue.text}`).join('\n')
      : '  - Replik eklenmedi';

    return `Sahne ${index + 1}: ${scene.title}\nSüre: ${scene.duration} sn | Arka plan: ${background?.name || 'Belirlenmedi'}\nKarakterler: ${characterSummary}\nDiyaloglar:\n${dialogueSummary}`;
  });

  storyboardOutput.textContent = blocks.join('\n\n');
  storyboardStatusLabel.textContent = 'Güncel';
  storyboardDirty = false;
}

async function copyStoryboardToClipboard() {
  const content = storyboardOutput.textContent.trim();
  if (!content) {
    storyboardStatusLabel.textContent = 'Kopyalanacak içerik yok';
    return;
  }

  if (!navigator.clipboard) {
    storyboardStatusLabel.textContent = 'Tarayıcı panoya yazmayı desteklemiyor';
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    storyboardStatusLabel.textContent = 'Panoya kopyalandı';
    if (!storyboardDirty) {
      setTimeout(() => {
        storyboardStatusLabel.textContent = 'Güncel';
      }, 1800);
    }
  } catch (error) {
    storyboardStatusLabel.textContent = 'Kopyalama başarısız';
  }
}

function handleTitleChange(event) {
  const activeScene = getActiveScene();
  if (!activeScene) return;
  activeScene.title = event.target.value || 'Adsız sahne';
  renderSceneList();
  renderTimeline();
  markStoryboardDirty();
}

function handleDurationChange(event) {
  const activeScene = getActiveScene();
  if (!activeScene) return;
  const value = Number.parseInt(event.target.value, 10);
  activeScene.duration = value;
  sceneDurationLabel.textContent = `${value} sn`;
  renderSceneList();
  renderTimeline();
  markStoryboardDirty();
}

function initialise() {
  addSceneButton.addEventListener('click', addScene);
  sceneTitleInput.addEventListener('input', handleTitleChange);
  sceneDurationInput.addEventListener('input', handleDurationChange);
  dialogueForm.addEventListener('submit', handleDialogueSubmit);
  generateStoryboardButton.addEventListener('click', generateStoryboard);
  copyStoryboardButton.addEventListener('click', copyStoryboardToClipboard);

  addScene();
  renderBackgroundGrid();
  renderCharacterLibrary();
  renderDialogueCharacterSelect();
  updateSceneCount();
}

initialise();
