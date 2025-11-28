const RESERVED_IDS = [1, 2, 3];
const PARK_DURATION_MS = 5 * 60 * 1000; // 5 dakika
const NOTIFY_MS = 4 * 60 * 1000; // 1 dakika kala bildirim

const slotGrid = document.getElementById('slotGrid');
const slotSelect = document.getElementById('slotSelect');
const enterButton = document.getElementById('enterButton');
const exitButton = document.getElementById('exitButton');
const notificationList = document.getElementById('notificationList');
const metricFree = document.getElementById('metricFree');
const metricNotifications = document.getElementById('metricNotifications');
const metricTotal = document.getElementById('metricTotal');

const slots = Array.from({ length: 10 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    label: `A${id}`,
    reserved: RESERVED_IDS.includes(id),
    occupied: RESERVED_IDS.includes(id),
    timerEndsAt: null,
    timers: { notify: null, release: null }
  };
});

function formatTimeRemaining(slot) {
  if (!slot.timerEndsAt) return '---';
  const msLeft = Math.max(slot.timerEndsAt - Date.now(), 0);
  const minutes = Math.floor(msLeft / 60000);
  const seconds = Math.floor((msLeft % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function addNotification(message) {
  const entry = document.createElement('article');
  entry.className = 'notification-item';
  const timestamp = new Intl.DateTimeFormat('tr-TR', {
    timeStyle: 'short',
    hour12: false
  }).format(new Date());
  entry.innerHTML = `
    <header>
      <span class="dot"></span>
      <p>${timestamp}</p>
    </header>
    <p>${message}</p>
  `;
  notificationList.prepend(entry);
  metricNotifications.textContent = notificationList.childElementCount;
}

function clearTimers(slot) {
  if (slot.timers.notify) {
    clearTimeout(slot.timers.notify);
    slot.timers.notify = null;
  }
  if (slot.timers.release) {
    clearTimeout(slot.timers.release);
    slot.timers.release = null;
  }
  slot.timerEndsAt = null;
}

function scheduleTimers(slot) {
  clearTimers(slot);
  const now = Date.now();
  slot.timerEndsAt = now + PARK_DURATION_MS;

  slot.timers.notify = setTimeout(() => {
    addNotification(`${slot.label} alanındaki aracın süresi 1 dakika sonra doluyor (telefon bildirimi).`);
  }, NOTIFY_MS);

  slot.timers.release = setTimeout(() => {
    releaseSlot(slot.id, true);
  }, PARK_DURATION_MS);
}

function renderSlots() {
  slotGrid.innerHTML = '';

  slots.forEach((slot) => {
    const card = document.createElement('article');
    card.className = `slot-card ${slot.reserved ? 'slot-reserved' : slot.occupied ? 'slot-busy' : 'slot-free'}`;
    card.innerHTML = `
      <header>
        <p class="slot-label">${slot.label}</p>
        <span class="slot-chip">${slot.reserved ? 'Rezerveli' : slot.occupied ? 'Dolu' : 'Boş'}</span>
      </header>
      <p class="slot-status">${slot.reserved ? 'Engelli / dükkan alanı' : slot.occupied ? 'Araç algılandı' : 'Araç bekleniyor'}</p>
      <p class="slot-timer">Süre: ${formatTimeRemaining(slot)}</p>
    `;
    slotGrid.appendChild(card);
  });
}

function updateSelectOptions() {
  slotSelect.innerHTML = '';
  slots.forEach((slot) => {
    const option = document.createElement('option');
    option.value = slot.id;
    option.textContent = `${slot.label} ${slot.reserved ? '(Rezerveli)' : slot.occupied ? '(Dolu)' : '(Boş)'}`;
    slotSelect.appendChild(option);
  });
}

function updateMetrics() {
  metricTotal.textContent = slots.length;
  const freeCount = slots.filter((slot) => !slot.occupied).length;
  metricFree.textContent = freeCount;
}

function occupySlot(slotId) {
  const slot = slots.find((item) => item.id === slotId);
  if (!slot) return;
  if (slot.reserved) {
    addNotification(`${slot.label} rezerveli bir alan; ziyaretçi araç kabul edilmez.`);
    return;
  }
  if (slot.occupied) {
    addNotification(`${slot.label} zaten dolu.`);
    return;
  }
  slot.occupied = true;
  scheduleTimers(slot);
  addNotification(`${slot.label} alanına araç girişi yapıldı. Zamanlayıcı başlatıldı.`);
  updateUI();
}

function releaseSlot(slotId, auto = false) {
  const slot = slots.find((item) => item.id === slotId);
  if (!slot || slot.reserved) return;
  if (!slot.occupied) {
    if (!auto) addNotification(`${slot.label} zaten boş.`);
    return;
  }
  slot.occupied = false;
  clearTimers(slot);
  addNotification(`${slot.label} ${auto ? '5 dakikanın sonunda otomatik olarak boşaltıldı.' : 'alanından araç çıkışı yapıldı.'}`);
  updateUI();
}

function handleEnter() {
  const slotId = Number(slotSelect.value);
  occupySlot(slotId);
}

function handleExit() {
  const slotId = Number(slotSelect.value);
  releaseSlot(slotId);
}

function updateUI() {
  updateMetrics();
  updateSelectOptions();
  renderSlots();
}

function tickTimers() {
  renderSlots();
  requestAnimationFrame(tickTimers);
}

function init() {
  enterButton.addEventListener('click', handleEnter);
  exitButton.addEventListener('click', handleExit);
  updateUI();
  tickTimers();
}

init();
