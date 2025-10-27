const missionBtn = document.getElementById('missionBtn');
const missionTitle = document.getElementById('missionTitle');
const missionGoal = document.getElementById('missionGoal');
const missionSupport = document.getElementById('missionSupport');
const missionTips = document.getElementById('missionTips');

const mixStoryBtn = document.getElementById('mixStory');
const saveStoryBtn = document.getElementById('saveStory');
const storyCharacter = document.getElementById('storyCharacter');
const storySetting = document.getElementById('storySetting');
const storyChallenge = document.getElementById('storyChallenge');
const storyBonus = document.getElementById('storyBonus');
const storyJournal = document.getElementById('storyJournal');

const dialogueBtn = document.getElementById('dialogueBtn');
const dialogueScenario = document.getElementById('dialogueScenario');
const dialogueFocus = document.getElementById('dialogueFocus');
const dialoguePhrases = document.getElementById('dialoguePhrases');

const reflectionBtn = document.getElementById('reflectionBtn');
const reflectionPrompt = document.getElementById('reflectionPrompt');

const xpValue = document.getElementById('xpValue');
const xpBar = document.getElementById('xpBar');
const xpTasks = document.getElementById('xpTasks');
const reflectionNotes = document.getElementById('reflectionNotes');

const missionData = [
  {
    title: 'STEM Innovation Pitch',
    goal: 'Introduce a prototype that helps your school save energy during makerspace sessions.',
    support: 'Start with “Our mission today is to…” and explain what problem you solve.',
    tips: [
      'Use modal verbs: can, could, will.',
      'Add at least one measurable impact sentence (e.g. save 30% energy).',
      'Invite your teammates to add ideas by asking “What else can we improve?”'
    ]
  },
  {
    title: 'Global Citizenship Newsflash',
    goal: 'Prepare a 90-second breaking news update about a student-led social responsibility project.',
    support: 'Include the 5Ws: who, what, where, when, why.',
    tips: [
      'Use strong opening phrases: “Breaking news from our BİLSEM team…”.',
      'Describe how the project creates positive change.',
      'End with a call to action for the listeners.'
    ]
  },
  {
    title: 'Future Skills Debate',
    goal: 'Argue why creative coding should be part of every gifted learner’s timetable.',
    support: 'Use “Firstly… Secondly… Finally…” to structure your ideas.',
    tips: [
      'Include at least one example from your own learning.',
      'Use persuasive connectors: therefore, as a result, consequently.',
      'Offer a question to the other team to keep the debate active.'
    ]
  },
  {
    title: 'Eco-Inventors Podcast',
    goal: 'Record a short podcast segment describing an invention that protects biodiversity in your city.',
    support: 'Explain the invention, its materials, and the benefit for nature.',
    tips: [
      'Use descriptive adjectives and relative clauses.',
      'Mention a real-world inspiration or scientist.',
      'Invite the audience to imagine using the invention.'
    ]
  },
  {
    title: 'Art & Design Gallery Talk',
    goal: 'Guide visitors through an interactive exhibition that combines art and technology.',
    support: 'Use the present continuous to describe what is happening in each zone.',
    tips: [
      'Teach at least one art-related vocabulary item.',
      'Ask two reflective questions to the audience.',
      'Connect the exhibition to a Sustainable Development Goal.'
    ]
  },
  {
    title: 'Mindful Maker Workshop',
    goal: 'Lead a workshop on designing calm-down tools for stressed students.',
    support: 'Give clear step-by-step instructions using sequence words.',
    tips: [
      'Use imperatives and supportive language (“Remember to breathe…”).',
      'Add one collaborative mini-task.',
      'Summarise the benefits at the end.'
    ]
  },
  {
    title: 'Space Colony Briefing',
    goal: 'Present a plan for a sustainable habitat on Mars for young explorers.',
    support: 'Cover energy, food, communication, and wellbeing.',
    tips: [
      'Use future tense structures (will, going to).',
      'Explain how teams will collaborate remotely.',
      'End with a motivational slogan.'
    ]
  },
  {
    title: 'Innovation Interview',
    goal: 'Interview a classmate who has developed a prototype supporting inclusive education.',
    support: 'Prepare open-ended questions and follow-up prompts.',
    tips: [
      'Use active listening phrases: “I see”, “That means…”.',
      'Summarise the main idea before closing.',
      'Share one improvement suggestion kindly.'
    ]
  }
];

const storyData = {
  characters: [
    'Curious maker twins',
    'Eco-hacker siblings',
    'Time-travelling science mentors',
    'Empathy-driven game designers',
    'Young social entrepreneurs',
    'Biodiversity guardians',
    'AI-assisted storytellers',
    'Global problem solvers'
  ],
  settings: [
    'Solar-powered art studio',
    'Floating STEAM laboratory',
    'Community innovation bus',
    'Zero-waste makerspace',
    'Virtual reality culture museum',
    'Forest classroom observatory',
    'Underwater research dome',
    'Mars habitat simulation hub'
  ],
  challenges: [
    'Design a sustainable community solution',
    'Reconnect neighbourhoods after a storm',
    'Teach robotics to younger learners in 3 steps',
    'Create an inclusive festival experience',
    'Protect endangered species through storytelling',
    'Invent a bilingual learning tool',
    'Transform waste into art with a message',
    'Launch a kindness campaign across schools'
  ],
  bonuses: [
    'Ekstra görev: En az 5 cümlelik işbirlikçi bir plan yaz.',
    'Ekstra görev: Hikâyenin sonunda “What if…?” sorusu sor.',
    'Ekstra görev: Çözümünü bir infografik olarak tasvir et.',
    'Ekstra görev: Diyalog içinde en az 3 duyu ifadesi kullan.',
    'Ekstra görev: STEM + sanat bağlantısını vurgulayan bir paragraf ekle.',
    'Ekstra görev: Hikâyeyi iki bakış açısından anlat.',
    'Ekstra görev: Problem ve çözüm için mini bir SWOT analizi yap.',
    'Ekstra görev: Hikâyeni podcast intro cümleleriyle başlat.'
  ]
};

const dialogueData = [
  {
    scenario: 'Team up to pitch a smart greenhouse to city council.',
    focus: 'Focus: persuasive & solution-oriented language',
    phrases: [
      '“Imagine a greenhouse that texts us when plants need water.”',
      '“One benefit for our community is…”',
      '“How might we collaborate with local farmers?”',
      '“To conclude, we invite you to support…”'
    ]
  },
  {
    scenario: 'Plan a global online hackathon for eco-inventions.',
    focus: 'Focus: negotiation & collaboration',
    phrases: [
      '“Could we schedule the mentoring sessions on…?”',
      '“Let’s balance time zones by…”',
      '“I appreciate your idea because…”',
      '“Shall we vote on the final toolkit?”'
    ]
  },
  {
    scenario: 'Design a museum tour about future cities for visiting families.',
    focus: 'Focus: descriptive & interactive language',
    phrases: [
      '“In this zone, families explore…”',
      '“Would you like to test our prototype?”',
      '“This feature is inspired by…”',
      '“Please share how you would improve it.”'
    ]
  },
  {
    scenario: 'Prepare a student TED-style talk on inclusive playgrounds.',
    focus: 'Focus: storytelling & empathy',
    phrases: [
      '“Let me introduce you to…”',
      '“The challenge we discovered is…”',
      '“To make every child feel welcome, we…”',
      '“Join us in building a playground where…”'
    ]
  },
  {
    scenario: 'Host a maker fair stand about rethinking daily plastic use.',
    focus: 'Focus: informative & problem-solution language',
    phrases: [
      '“Our prototype reduces plastic because…”',
      '“Can you imagine replacing this with…?”',
      '“A quick demonstration shows…”',
      '“We invite you to pledge to…”'
    ]
  },
  {
    scenario: 'Organise a peer coaching circle for creative writing portfolios.',
    focus: 'Focus: feedback & supportive language',
    phrases: [
      '“One thing I admire is…”',
      '“Have you considered adding…?”',
      '“What if we include a reflection section?”',
      '“Let’s set a shared deadline for…”'
    ]
  }
];

const reflectionPrompts = [
  'Which new words helped you express your idea clearly today?',
  'How did your team show creativity and collaboration during the task?',
  'What feedback did you give or receive that improved the project?',
  'If you repeated today’s mission, what would you upgrade?',
  'Describe one cultural or global connection you noticed.',
  'Which sentence starter supported your fluency?',
  'How did you balance English and Turkish to solve the problem?',
  'What evidence shows that your solution is impactful?'
];

const xpTasksData = [
  { id: 'xp-1', label: 'Mission Spinner görevini tamamladım ve konuşmamı kaydettim.', xp: 20 },
  { id: 'xp-2', label: 'Story Lab karışımından özgün bir yazı taslağı oluşturdum.', xp: 15 },
  { id: 'xp-3', label: 'Dialogue Challenge için 8 satırlık diyalog yazdım ve canlandırdım.', xp: 20 },
  { id: 'xp-4', label: 'Reflection Sparks günlük notunu doldurdum.', xp: 10 },
  { id: 'xp-5', label: 'Takım arkadaşımın çalışmasına yapıcı geri bildirim verdim.', xp: 15 },
  { id: 'xp-6', label: 'Ürettiğim içeriği dijital bir araçla görselleştirdim.', xp: 20 }
];

let currentStory = {
  character: storyCharacter.textContent,
  setting: storySetting.textContent,
  challenge: storyChallenge.textContent,
  bonus: storyBonus.textContent
};

let totalXP = 0;

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function renderMission() {
  const mission = getRandomItem(missionData);
  missionTitle.textContent = mission.title;
  missionGoal.textContent = mission.goal;
  missionSupport.textContent = mission.support;
  missionTips.innerHTML = '';

  mission.tips.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    missionTips.appendChild(li);
  });
}

function mixStory() {
  const character = getRandomItem(storyData.characters);
  const setting = getRandomItem(storyData.settings);
  const challenge = getRandomItem(storyData.challenges);
  const bonus = getRandomItem(storyData.bonuses);

  storyCharacter.textContent = character;
  storySetting.textContent = setting;
  storyChallenge.textContent = challenge;
  storyBonus.textContent = bonus;

  currentStory = { character, setting, challenge, bonus };
}

function saveStoryToJournal() {
  const entry = `${currentStory.character} @ ${currentStory.setting} → ${currentStory.challenge} | ${currentStory.bonus}`;
  const li = document.createElement('li');
  li.textContent = entry;
  storyJournal.prepend(li);

  const maxEntries = 6;
  while (storyJournal.children.length > maxEntries) {
    storyJournal.removeChild(storyJournal.lastChild);
  }
}

function renderDialogue() {
  const dialogue = getRandomItem(dialogueData);
  dialogueScenario.textContent = dialogue.scenario;
  dialogueFocus.textContent = dialogue.focus;
  dialoguePhrases.innerHTML = '';

  dialogue.phrases.forEach((phrase) => {
    const li = document.createElement('li');
    li.textContent = phrase;
    dialoguePhrases.appendChild(li);
  });
}

function renderReflection() {
  const prompt = getRandomItem(reflectionPrompts);
  reflectionPrompt.textContent = prompt;
  reflectionNotes.focus();
}

function updateXP() {
  totalXP = Array.from(xpTasks.querySelectorAll('input[type="checkbox"]')).reduce((sum, checkbox) => {
    if (checkbox.checked) {
      return sum + Number(checkbox.dataset.xp);
    }
    return sum;
  }, 0);

  xpValue.textContent = totalXP;
  xpBar.style.width = `${Math.min(totalXP, 100)}%`;
}

function renderXPTasks() {
  xpTasksData.forEach((task) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    label.setAttribute('for', task.id);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = task.id;
    checkbox.dataset.xp = String(task.xp);

    const span = document.createElement('span');
    span.textContent = `${task.label} (+${task.xp} XP)`;

    checkbox.addEventListener('change', updateXP);

    label.appendChild(checkbox);
    label.appendChild(span);
    li.appendChild(label);
    xpTasks.appendChild(li);
  });
}

missionBtn.addEventListener('click', renderMission);
mixStoryBtn.addEventListener('click', mixStory);
saveStoryBtn.addEventListener('click', saveStoryToJournal);
dialogueBtn.addEventListener('click', renderDialogue);
reflectionBtn.addEventListener('click', renderReflection);

mixStory();
renderDialogue();
renderXPTasks();
renderReflection();
updateXP();
