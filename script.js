const spots = [
  { id: 'A1', name: 'A1', hardwareIndex: 1, reserved: false, side: 'north', mapPosition: 10 },
  { id: 'A2', name: 'A2', hardwareIndex: 2, reserved: false, side: 'north', mapPosition: 24 },
  { id: 'A3', name: 'A3', hardwareIndex: 3, reserved: true, reservedLabel: 'Ev Sahibi', side: 'north', mapPosition: 38 },
  { id: 'B1', name: 'B1', hardwareIndex: 4, reserved: false, side: 'north', mapPosition: 52 },
  { id: 'B2', name: 'B2', hardwareIndex: 5, reserved: true, reservedLabel: 'Engelli', side: 'south', mapPosition: 10 },
  { id: 'B3', name: 'B3', hardwareIndex: 6, reserved: false, side: 'south', mapPosition: 24 },
  { id: 'C1', name: 'C1', hardwareIndex: 7, reserved: true, reservedLabel: 'Dükkan', side: 'south', mapPosition: 38 },
  { id: 'C2', name: 'C2', hardwareIndex: 8, reserved: false, side: 'south', mapPosition: 52 },
  { id: 'D1', name: 'D1', hardwareIndex: 9, reserved: false, side: 'north', mapPosition: 66 },
  { id: 'D2', name: 'D2', hardwareIndex: 10, reserved: false, side: 'south', mapPosition: 66 },
  { id: 'E1', name: 'E1', hardwareIndex: 11, reserved: false, side: 'north', mapPosition: 80 },
  { id: 'E2', name: 'E2', hardwareIndex: 12, reserved: false, side: 'south', mapPosition: 80 }
];

const SPOT_STATES = {
  AVAILABLE: 'available',
  OCCUPIED: 'occupied',
  WARNING: 'warning',
  EXPIRED: 'expired',
  RESERVED: 'reserved'
};

const DEFAULT_DURATION = 60; // seconds
const WARNING_THRESHOLD = 10; // seconds

const spotGrid = document.getElementById('spotGrid');
const streetMap = document.getElementById('streetMap');
const availableCount = document.getElementById('availableCount');
const occupiedCount = document.getElementById('occupiedCount');
const expiredCount = document.getElementById('expiredCount');
const timerList = document.getElementById('timerList');
const notificationFeed = document.getElementById('notificationFeed');
const connectBtn = document.getElementById('connectBtn');
const startDemoBtn = document.getElementById('startDemoBtn');

const spotTemplate = document.getElementById('spotTemplate');
const mapSpotTemplate = document.getElementById('mapSpotTemplate');
const timerTemplate = document.getElementById('timerTemplate');
const notificationTemplate = document.getElementById('notificationTemplate');

const spotStates = new Map();
const timers = new Map();
let demoIntervalId = null;
let serialPort = null;
let serialReader = null;
let serialBuffer = '';

const textDecoder = typeof TextDecoderStream !== 'undefined' ? new TextDecoderStream() : null;

init();

function init() {
  spots.forEach((spot) => {
    const state = spot.reserved ? SPOT_STATES.RESERVED : SPOT_STATES.AVAILABLE;
    spotStates.set(spot.id, { state, warningIssued: false });
  });

  renderSpots();
  updateCounters();
  renderTimers();

  connectBtn?.addEventListener('click', () => {
    connectToArduino().catch((error) => {
      console.error(error);
      pushNotification('Bağlantı hatası', 'Arduino bağlantısı kurulamadı. Tarayıcınız Web Serial API destekliyor mu?');
    });
  });

  startDemoBtn?.addEventListener('click', toggleDemoMode);
}

function renderSpots() {
  if (!spotTemplate) return;
  spotGrid.innerHTML = '';

  spots.forEach((spot) => {
    const fragment = spotTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.spot-card');
    const nameElement = fragment.querySelector('.spot-name');
    const tagElement = fragment.querySelector('.spot-tag');
    const statusElement = fragment.querySelector('.spot-status');
    const toggleButton = fragment.querySelector('.toggle-btn');
    const resetButton = fragment.querySelector('.reset-btn');

    const status = spotStates.get(spot.id) ?? { state: spot.reserved ? SPOT_STATES.RESERVED : SPOT_STATES.AVAILABLE, warningIssued: false };

    nameElement.textContent = spot.name;
    tagElement.textContent = spot.reserved ? (spot.reservedLabel ?? 'Rezerve') : 'Genel';
    statusElement.textContent = getStatusMessage(spot, status.state);

    card.dataset.state = status.state;
    card.dataset.reserved = String(spot.reserved);
    card.setAttribute('aria-label', `${spot.name} kartı. ${getStatusMessage(spot, status.state)}`);

    if (spot.reserved) {
      toggleButton.disabled = true;
      toggleButton.classList.add('is-disabled');
      toggleButton.textContent = 'Rezerve';
      resetButton.disabled = true;
      resetButton.classList.add('is-disabled');
    } else {
      toggleButton.addEventListener('click', () => {
        const currentState = spotStates.get(spot.id)?.state ?? SPOT_STATES.AVAILABLE;
        const nextState = currentState === SPOT_STATES.AVAILABLE ? SPOT_STATES.OCCUPIED : SPOT_STATES.AVAILABLE;
        applyStateChange(spot.id, nextState, { source: 'manual' });
      });

      resetButton.addEventListener('click', () => {
        applyStateChange(spot.id, SPOT_STATES.AVAILABLE, { source: 'manual', reset: true });
      });
    }

    spotGrid.appendChild(fragment);
  });

  renderStreetMap();
}

function renderStreetMap() {
  if (!streetMap || !mapSpotTemplate) return;
  streetMap.innerHTML = '';

  const centerLine = document.createElement('div');
  centerLine.className = 'center-line';
  centerLine.setAttribute('aria-hidden', 'true');
  streetMap.appendChild(centerLine);

  spots.forEach((spot) => {
    const fragment = mapSpotTemplate.content.cloneNode(true);
    const button = fragment.querySelector('.map-spot');
    const label = fragment.querySelector('.map-spot-label');
    const status = spotStates.get(spot.id)?.state ?? (spot.reserved ? SPOT_STATES.RESERVED : SPOT_STATES.AVAILABLE);

    button.dataset.state = status;
    button.dataset.reserved = String(spot.reserved);
    button.dataset.side = spot.side ?? 'north';
    button.style.setProperty('--x', `${spot.mapPosition ?? 0}%`);
    button.style.setProperty('--y', spot.side === 'south' ? '74%' : '26%');
    button.setAttribute('aria-label', `${spot.name} alanı. ${getStatusMessage(spot, status)}`);
    button.title = spot.reserved
      ? `${spot.name} - ${spot.reservedLabel ?? 'Rezerve alan'}`
      : `${spot.name} - Tıkla: durum değiştir, Sağ tık: sıfırla`;

    label.textContent = spot.name;

    if (spot.reserved) {
      button.disabled = true;
      button.classList.add('is-reserved');
    } else {
      button.addEventListener('click', () => {
        const currentState = spotStates.get(spot.id)?.state ?? SPOT_STATES.AVAILABLE;
        const nextState = currentState === SPOT_STATES.AVAILABLE ? SPOT_STATES.OCCUPIED : SPOT_STATES.AVAILABLE;
        applyStateChange(spot.id, nextState, { source: 'map' });
      });

      button.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        applyStateChange(spot.id, SPOT_STATES.AVAILABLE, { source: 'map', reset: true });
      });
    }

    streetMap.appendChild(fragment);
  });
}

function getStatusMessage(spot, state) {
  switch (state) {
    case SPOT_STATES.AVAILABLE:
      return 'Alan müsait. Yeşil LED yanar.';
    case SPOT_STATES.OCCUPIED:
      return 'Araç park etti. LED kırmızıya döndü ve sayaç başladı (1 dk).';
    case SPOT_STATES.WARNING:
      return 'Son 10 saniye! Aracınızı çekin, aksi halde ceza uygulanacak.';
    case SPOT_STATES.EXPIRED:
      return 'Süre doldu. Ceza kaydedildi, alan kırmızı yanmaya devam ediyor.';
    case SPOT_STATES.RESERVED:
      return `${spot.reservedLabel ?? 'Rezerve alan'}. Sürekli kırmızı yanar.`;
    default:
      return 'Durum bilinmiyor.';
  }
}

function updateCounters() {
  let available = 0;
  let occupied = 0;
  let expired = 0;

  spots.forEach((spot) => {
    const status = spotStates.get(spot.id);
    if (!status) return;
    switch (status.state) {
      case SPOT_STATES.AVAILABLE:
        available += 1;
        break;
      case SPOT_STATES.OCCUPIED:
      case SPOT_STATES.WARNING:
        occupied += 1;
        break;
      case SPOT_STATES.EXPIRED:
        expired += 1;
        break;
      default:
        break;
    }
  });

  availableCount.textContent = available.toString();
  occupiedCount.textContent = occupied.toString();
  expiredCount.textContent = expired.toString();
}

function applyStateChange(spotId, newState, options = {}) {
  const spot = spots.find((item) => item.id === spotId);
  if (!spot) return;
  const current = spotStates.get(spotId) ?? { state: SPOT_STATES.AVAILABLE, warningIssued: false };

  if (spot.reserved) {
    spotStates.set(spotId, { state: SPOT_STATES.RESERVED, warningIssued: false });
    renderSpots();
    updateCounters();
    return;
  }

  const nextState = newState;
  const updated = { state: nextState, warningIssued: current.warningIssued };

  if (nextState === SPOT_STATES.OCCUPIED) {
    updated.warningIssued = false;
    startTimer(spotId, options.source ?? 'sensor');
  }

  if (nextState === SPOT_STATES.AVAILABLE) {
    stopTimer(spotId, { reset: options.reset });
    updated.warningIssued = false;
  }

  if (nextState === SPOT_STATES.EXPIRED) {
    stopTimer(spotId, { keepExpired: true });
  }

  if (nextState === SPOT_STATES.WARNING) {
    updated.warningIssued = true;
  }

  spotStates.set(spotId, updated);
  renderSpots();
  updateCounters();
}

function startTimer(spotId, source = 'sensor') {
  const active = timers.get(spotId);
  if (active?.interval) {
    clearInterval(active.interval);
  }
  timers.delete(spotId);

  const timer = {
    remaining: DEFAULT_DURATION,
    warningIssued: false,
    expired: false,
    source,
    interval: null
  };

  timer.interval = setInterval(() => {
    timer.remaining -= 1;
    if (timer.remaining <= WARNING_THRESHOLD && !timer.warningIssued && timer.remaining > 0) {
      timer.warningIssued = true;
      applyStateChange(spotId, SPOT_STATES.WARNING);
      pushNotification('Son 10 saniye uyarısı', `Park noktası ${spotId}: Aracınızı çekin yoksa park cezası uygulanacak.`);
      requestBrowserNotification(`Park noktası ${spotId}`, 'Aracınızı çekin yoksa park cezası alacaksınız! Son 10 saniye.');
    }

    if (timer.remaining <= 0) {
      clearInterval(timer.interval);
      timer.remaining = 0;
      timer.expired = true;
      applyStateChange(spotId, SPOT_STATES.EXPIRED);
      pushNotification('Süre doldu', `Park noktası ${spotId} için ceza kaydedildi.`);
      requestBrowserNotification(`Park noktası ${spotId}`, 'Süre doldu. Park cezası uygulandı.');
    }

    renderTimers();
  }, 1000);

  timers.set(spotId, timer);
  renderTimers();
}

function stopTimer(spotId, options = {}) {
  const timer = timers.get(spotId);
  if (!timer) return;

  if (timer.interval) {
    clearInterval(timer.interval);
  }

  if (options.keepExpired && timer.expired) {
    timer.interval = null;
    timers.set(spotId, timer);
  } else {
    timers.delete(spotId);
  }

  if (options.reset) {
    pushNotification('Alan sıfırlandı', `Park noktası ${spotId} tekrar kullanılabilir durumda.`);
  }

  renderTimers();
}

function renderTimers() {
  if (!timerTemplate) return;
  timerList.innerHTML = '';

  timers.forEach((timer, spotId) => {
    const spot = spots.find((item) => item.id === spotId);
    if (!spot) return;

    const fragment = timerTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.timer-card');
    const title = fragment.querySelector('h3');
    const timeLabel = fragment.querySelector('.time-remaining');
    const statusText = fragment.querySelector('.timer-status');
    const stopButton = fragment.querySelector('.stop-btn');

    title.textContent = `Alan ${spot.name}`;
    timeLabel.textContent = formatTime(timer.remaining);

    card.dataset.warning = String(timer.warningIssued);
    card.dataset.expired = String(timer.expired);

    if (timer.expired) {
      statusText.textContent = 'Süre doldu. Alan manuel onay bekliyor.';
    } else if (timer.warningIssued) {
      statusText.textContent = 'Son 10 saniye! Sürücüye bildirim gönderildi.';
    } else {
      statusText.textContent = 'Araç park halinde. Süre dolmadan çıkış yapılmalı.';
    }

    stopButton.addEventListener('click', () => {
      stopTimer(spotId);
      applyStateChange(spotId, SPOT_STATES.AVAILABLE, { reset: true });
    });

    timerList.appendChild(fragment);
  });
}

function formatTime(seconds) {
  const safeSeconds = Math.max(0, seconds);
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function pushNotification(title, message) {
  if (!notificationTemplate) return;
  const fragment = notificationTemplate.content.cloneNode(true);
  const titleElement = fragment.querySelector('.notification-title');
  const messageElement = fragment.querySelector('.notification-message');
  const timeElement = fragment.querySelector('.notification-time');

  titleElement.textContent = title;
  messageElement.textContent = message;
  const now = new Date();
  timeElement.dateTime = now.toISOString();
  timeElement.textContent = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  notificationFeed.prepend(fragment);

  while (notificationFeed.children.length > 8) {
    notificationFeed.removeChild(notificationFeed.lastElementChild);
  }
}

async function connectToArduino() {
  if (!('serial' in navigator)) {
    pushNotification('Desteklenmeyen tarayıcı', 'Web Serial API sadece Chrome, Edge gibi tarayıcılarda çalışır.');
    throw new Error('Serial API not available');
  }

  if (serialPort) {
    await disconnectSerial();
  }

  serialPort = await navigator.serial.requestPort();
  await serialPort.open({ baudRate: 9600 });

  pushNotification('Bağlandı', 'Arduino cihazı ile seri bağlantı kuruldu.');

  if (textDecoder && serialPort.readable) {
    const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
    serialReader = textDecoder.readable.getReader();
    readSerialLoop(readableStreamClosed).catch((error) => {
      console.error('Serial read error', error);
      pushNotification('Veri akışı durdu', 'Seri bağlantıdan veri okunamadı.');
    });
  } else if (serialPort.readable) {
    serialReader = serialPort.readable.getReader();
    readLegacySerialLoop().catch((error) => {
      console.error('Serial read error', error);
      pushNotification('Veri akışı durdu', 'Seri bağlantıdan veri okunamadı.');
    });
  }
}

async function disconnectSerial() {
  if (serialReader) {
    await serialReader.cancel();
    serialReader = null;
  }
  if (serialPort) {
    await serialPort.close();
    serialPort = null;
  }
}

async function readSerialLoop(readableStreamClosedPromise) {
  try {
    while (true) {
      const { value, done } = await serialReader.read();
      if (done) break;
      if (value) {
        handleSerialData(value);
      }
    }
  } finally {
    serialReader?.releaseLock();
    await readableStreamClosedPromise.catch(() => {});
  }
}

async function readLegacySerialLoop() {
  try {
    while (true) {
      const { value, done } = await serialReader.read();
      if (done) break;
      if (value && value.length) {
        const chunk = new TextDecoder().decode(value);
        handleSerialData(chunk);
      }
    }
  } finally {
    serialReader?.releaseLock();
  }
}

function handleSerialData(chunk) {
  serialBuffer += chunk;
  let newlineIndex = serialBuffer.indexOf('\n');
  while (newlineIndex >= 0) {
    const line = serialBuffer.slice(0, newlineIndex).trim();
    serialBuffer = serialBuffer.slice(newlineIndex + 1);
    if (line) {
      processSerialLine(line);
    }
    newlineIndex = serialBuffer.indexOf('\n');
  }
}

function processSerialLine(line) {
  try {
    const payload = JSON.parse(line);
    const spotId = resolveSpotId(payload);
    if (!spotId) {
      pushNotification('Bilinmeyen sensör', `Veri eşleştirilemedi: ${line}`);
      return;
    }

    if (payload.state === 'occupied') {
      applyStateChange(spotId, SPOT_STATES.OCCUPIED, { source: 'sensor' });
    } else if (payload.state === 'available') {
      applyStateChange(spotId, SPOT_STATES.AVAILABLE, { source: 'sensor' });
    } else if (payload.state === 'reset') {
      applyStateChange(spotId, SPOT_STATES.AVAILABLE, { source: 'sensor', reset: true });
    } else {
      pushNotification('Bilinmeyen durum', `Sensörden gelen durum anlaşılamadı: ${payload.state}`);
    }
  } catch (error) {
    console.error('JSON parse error', error, line);
    pushNotification('Seri veri hatası', `Okunan satır çözümlenemedi: ${line}`);
  }
}

function resolveSpotId(payload) {
  if (payload.spotId) {
    return String(payload.spotId).toUpperCase();
  }

  if (typeof payload.spot === 'number') {
    const byIndex = spots.find((spot) => spot.hardwareIndex === payload.spot);
    if (byIndex) {
      return byIndex.id;
    }
  }

  if (payload.pin) {
    const byPin = spots.find((spot) => spot.hardwareIndex === Number(payload.pin));
    if (byPin) {
      return byPin.id;
    }
  }

  return null;
}

function toggleDemoMode() {
  if (demoIntervalId) {
    clearInterval(demoIntervalId);
    demoIntervalId = null;
    startDemoBtn.textContent = 'Demo modunu başlat';
    pushNotification('Demo durduruldu', 'Sensör simülasyonu kapatıldı.');
    return;
  }

  pushNotification('Demo modu aktif', 'Her 8 saniyede rastgele sensör olayları tetiklenecek.');
  startDemoBtn.textContent = 'Demo modunu durdur';

  demoIntervalId = setInterval(() => {
    const publicSpots = spots.filter((spot) => !spot.reserved);
    const spot = publicSpots[Math.floor(Math.random() * publicSpots.length)];
    const status = spotStates.get(spot.id)?.state ?? SPOT_STATES.AVAILABLE;

    if (status === SPOT_STATES.AVAILABLE) {
      applyStateChange(spot.id, SPOT_STATES.OCCUPIED, { source: 'demo' });
    } else {
      applyStateChange(spot.id, SPOT_STATES.AVAILABLE, { source: 'demo', reset: true });
    }
  }, 8000);
}

function requestBrowserNotification(title, message) {
  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    new Notification(title, { body: message });
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, { body: message });
      }
    });
  }
}

window.addEventListener('beforeunload', () => {
  if (demoIntervalId) {
    clearInterval(demoIntervalId);
  }
  if (serialPort) {
    disconnectSerial().catch(() => {});
  }
});
