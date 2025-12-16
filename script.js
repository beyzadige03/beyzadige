const promptInput = document.getElementById('promptInput');
const analyzeBtn = document.getElementById('analyzePrompt');
const clearPromptBtn = document.getElementById('clearPrompt');
const clearHistoryBtn = document.getElementById('clearHistory');
const strengthList = document.getElementById('strengthList');
const weaknessList = document.getElementById('weaknessList');
const summaryBox = document.getElementById('summaryBox');
const starRow = document.getElementById('starRow');
const ratingLabel = document.getElementById('ratingLabel');
const topicLabel = document.getElementById('topicLabel');
const scoreValue = document.getElementById('scoreValue');
const historyList = document.getElementById('historyList');
const modelSelect = document.getElementById('model');

const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const authMessage = document.getElementById('authMessage');
const authState = document.getElementById('authState');
const profileName = document.getElementById('profileName');
const profileAvatar = document.getElementById('profileAvatar');
const statCount = document.getElementById('statCount');
const statFive = document.getElementById('statFive');
const statBadges = document.getElementById('statBadges');
const badgeList = document.getElementById('badgeList');
const miniName = document.getElementById('miniName');
const miniAvatar = document.getElementById('miniAvatar');
const miniProfile = document.getElementById('miniProfile');

const STORAGE_KEY = 'prompt-coach-users-v1';
const state = {
  users: {},
  currentUser: null,
  history: [],
};

function loadData() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && typeof stored === 'object') {
      state.users = stored.users || {};
      state.currentUser = stored.currentUser || null;
    }
  } catch (e) {
    // ignore
  }
}

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ users: state.users, currentUser: state.currentUser })
  );
}

function avatarLetter(name) {
  return name ? name[0].toUpperCase() : '?';
}

function setStars(count) {
  starRow.innerHTML = '';
  const labelText = `${count} yıldız`;
  starRow.setAttribute('aria-label', labelText);
  for (let i = 1; i <= 5; i += 1) {
    const span = document.createElement('span');
    span.className = `star ${i <= count ? 'active' : ''}`;
    span.textContent = '★';
    starRow.appendChild(span);
  }
}

function detectTopic(text) {
  const lower = text.toLowerCase();
  const topics = [
    { key: 'kod', label: 'Kod / geliştirme' },
    { key: 'tasarım', label: 'Tasarım / UI' },
    { key: 'pazarlama', label: 'Pazarlama' },
    { key: 'yazı', label: 'Yazma / içerik' },
    { key: 'araştırma', label: 'Araştırma' },
    { key: 'öğren', label: 'Eğitim' },
    { key: 'veri', label: 'Veri / analiz' },
  ];
  const hit = topics.find((t) => lower.includes(t.key));
  if (hit) return hit.label;
  if (lower.includes('seyahat') || lower.includes('gezi')) return 'Seyahat';
  return 'Genel';
}

function evaluatePrompt(text) {
  const clean = text.trim();
  const strengths = [];
  const weaknesses = [];
  let score = 20;

  const wordCount = clean.split(/\s+/).filter(Boolean).length;
  if (wordCount > 80) {
    strengths.push('Detay seviyesi iyi');
    score += 10;
  } else if (wordCount < 20) {
    weaknesses.push('Açıklama kısa kalmış');
    score -= 10;
  }

  if (/gibi davran|rol|act as|roleplay|uzman/.test(clean.toLowerCase())) {
    strengths.push('Model rolünü tanımlamışsın');
    score += 10;
  } else {
    weaknesses.push('Modelden beklenen rolü netleştir');
  }

  if (/format|json|tablo|liste|markdown/.test(clean.toLowerCase())) {
    strengths.push('Çıktı formatını belirtmişsin');
    score += 10;
  } else {
    weaknesses.push('Çıktı formatını veya örnek çıktıyı yaz');
  }

  if (/kısıt|limit|karakter|adım|süre|zaman/.test(clean.toLowerCase())) {
    strengths.push('Kısıt veya sınır eklenmiş');
    score += 8;
  } else {
    weaknesses.push('Karakter, adım sayısı veya süre sınırı ekle');
  }

  if (/örnek|sample|demo/.test(clean.toLowerCase())) {
    strengths.push('Örnek istemişsin');
    score += 6;
  }

  if (/kontrol|değerlendir|doğrula|test/.test(clean.toLowerCase())) {
    strengths.push('Kontrol kriteri eklenmiş');
    score += 6;
  }

  if (!/hedef|amaç|goal|purpose|çıktı/.test(clean.toLowerCase())) {
    weaknesses.push('Amacı ve beklenen çıktıyı netleştir');
  } else {
    strengths.push('Hedef/amaç belirtilmiş');
    score += 8;
  }

  const topic = detectTopic(clean);
  score = Math.max(0, Math.min(100, score - weaknesses.length * 3 + strengths.length * 1));

  let stars = 1;
  if (score > 85) stars = 5;
  else if (score > 70) stars = 4;
  else if (score > 55) stars = 3;
  else if (score > 40) stars = 2;

  const scaleLabels = {
    1: 'Yetersiz',
    2: 'Yeterli',
    3: 'İyi',
    4: 'Çok iyi',
    5: 'Harika',
  };

  const summary = `Bu prompt ${scaleLabels[stars].toLowerCase()} seviyede. ${topic} hakkında ve ${strengths.length} güçlü yön, ${weaknesses.length} gelişim noktası bulundu.`;

  return { strengths, weaknesses, stars, score: Math.round(score), topic, summary, label: scaleLabels[stars] };
}

function renderLists(items, target) {
  target.innerHTML = '';
  if (!items.length) {
    const li = document.createElement('li');
    li.textContent = 'Henüz bilgi yok';
    target.appendChild(li);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    target.appendChild(li);
  });
}

function renderHistory() {
  historyList.innerHTML = '';
  if (!state.history.length) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Henüz kayıt yok.';
    historyList.appendChild(p);
    return;
  }
  state.history.slice().reverse().forEach((item) => {
    const card = document.createElement('div');
    card.className = 'history-item';
    card.innerHTML = `
      <header>
        <div>
          <p class="muted">${item.model} • ${item.topic}</p>
          <strong>${item.label} (${item.stars}★)</strong>
        </div>
        <span class="score">${item.score}/100</span>
      </header>
      <p class="muted">${item.preview}</p>
    `;
    historyList.appendChild(card);
  });
}

function getUserData() {
  if (!state.currentUser) return null;
  return state.users[state.currentUser];
}

function updateProfileUI() {
  const userData = getUserData();
  const name = state.currentUser || 'Misafir';
  profileName.textContent = name;
  miniName.textContent = name;
  profileAvatar.textContent = avatarLetter(name);
  miniAvatar.textContent = avatarLetter(name);
  authState.textContent = state.currentUser ? 'Giriş yapıldı' : 'Misafir';
  statCount.textContent = userData?.promptCount || 0;
  statFive.textContent = userData?.fiveStar || 0;
  statBadges.textContent = userData?.badges?.length || 0;

  badgeList.innerHTML = '';
  const badges = [
    { id: 'first', label: 'İlk yorum', icon: '✨', unlocked: (userData?.promptCount || 0) >= 1 },
    { id: 'five20', label: '20 Harika', icon: '🏆', unlocked: (userData?.fiveStar || 0) >= 20 },
  ];
  const unlockedIds = badges.filter((b) => b.unlocked).map((b) => b.id);
  if (userData) {
    userData.badges = Array.from(new Set([...(userData.badges || []), ...unlockedIds]));
  }
  badges.forEach((badge) => {
    const pill = document.createElement('span');
    pill.className = `badge-pill ${badge.unlocked ? '' : 'locked'}`;
    pill.innerHTML = `<span class="icon">${badge.icon}</span>${badge.label}`;
    badgeList.appendChild(pill);
  });
  if (userData) saveData();
}

function syncHistoryWithUser() {
  const userData = getUserData();
  if (userData) {
    state.history = userData.history || [];
  } else {
    state.history = [];
  }
  renderHistory();
}

function handleAuth() {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    authMessage.textContent = 'Lütfen kullanıcı adı ve şifre gir.';
    return;
  }
  const existing = state.users[username];
  if (existing && existing.password !== password) {
    authMessage.textContent = 'Şifre uyuşmadı. Tekrar deneyin.';
    return;
  }
  if (!existing) {
    state.users[username] = {
      password,
      promptCount: 0,
      fiveStar: 0,
      badges: [],
      history: [],
    };
    authMessage.textContent = 'Yeni hesap oluşturuldu ve giriş yapıldı.';
  } else {
    authMessage.textContent = 'Giriş yapıldı.';
  }
  state.currentUser = username;
  saveData();
  syncHistoryWithUser();
  updateProfileUI();
}

function recordResult(result, promptText) {
  const userData = getUserData();
  if (!userData) return;
  userData.promptCount += 1;
  if (result.stars === 5) userData.fiveStar += 1;
  const entry = {
    model: modelSelect.value,
    topic: result.topic,
    stars: result.stars,
    score: result.score,
    label: result.label,
    preview: promptText.slice(0, 120) + (promptText.length > 120 ? '…' : ''),
  };
  userData.history = [...(userData.history || []), entry].slice(-30);
  state.history = userData.history;
  saveData();
  updateProfileUI();
  renderHistory();
}

function renderAnalysis(result) {
  setStars(result.stars);
  ratingLabel.textContent = `${result.stars} yıldız · ${result.label}`;
  topicLabel.textContent = `Konu: ${result.topic}`;
  scoreValue.textContent = result.score;
  renderLists(result.strengths, strengthList);
  renderLists(result.weaknesses, weaknessList);
  summaryBox.textContent = `${result.summary} 5 yıldız: ${result.stars === 5 ? 'Harika' : 'Henüz değil'} (${result.score}/100).`;
}

function handleAnalyze() {
  const text = promptInput.value;
  if (!text.trim()) {
    summaryBox.textContent = 'Önce promptunu yazmalısın.';
    return;
  }
  const result = evaluatePrompt(text);
  renderAnalysis(result);
  recordResult(result, text);
}

function handleClear() {
  promptInput.value = '';
  summaryBox.textContent = 'Metin temizlendi.';
}

function handleClearHistory() {
  const userData = getUserData();
  if (userData) {
    userData.history = [];
    saveData();
  }
  state.history = [];
  renderHistory();
}

function init() {
  loadData();
  updateProfileUI();
  syncHistoryWithUser();
  setStars(0);
  analyzeBtn.addEventListener('click', handleAnalyze);
  clearPromptBtn.addEventListener('click', handleClear);
  clearHistoryBtn.addEventListener('click', handleClearHistory);
  loginBtn.addEventListener('click', handleAuth);
  miniProfile.addEventListener('click', () => {
    document.getElementById('profile').scrollIntoView({ behavior: 'smooth' });
  });
}

init();
