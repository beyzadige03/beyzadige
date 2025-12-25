const notificationList = document.getElementById('notificationList');
const metricAvailable = document.getElementById('metricAvailable');
const metricOccupied = document.getElementById('metricOccupied');
const metricAlerts = document.getElementById('metricAlerts');
const spotList = document.getElementById('spotList');
const mapGrid = document.getElementById('mapGrid');
const zoneSelect = document.getElementById('zoneSelect');
const availableToggle = document.getElementById('availableToggle');
const refreshStatusBtn = document.getElementById('refreshStatus');

const ALERT_DELAY_MS = 60000;

const state = {
  alertsSent: 0,
  spots: [
    {
      id: 'GOP-01',
      name: 'GOP Meydan',
      zone: 'Gazi Osman Paşa',
      type: 'Genel',
      status: 'available',
    },
    {
      id: 'GOP-02',
      name: 'GOP Kültür Merkezi',
      zone: 'Gazi Osman Paşa',
      type: 'Genel',
      status: 'occupied',
    },
    {
      id: 'BL-01',
      name: 'Bağlık Sağlık Ocağı',
      zone: 'Bağlık',
      type: 'Engelli',
      status: 'reserved',
      reservedReason: 'Engelli (sürekli dolu)',
    },
    {
      id: 'BL-02',
      name: 'Bağlık Site Girişi',
      zone: 'Bağlık',
      type: 'Konut Sahibi',
      status: 'reserved',
      reservedReason: 'Konut sahibi (sürekli dolu)',
    },
    {
      id: 'CM-01',
      name: 'Cumhuriyet Bulvarı',
      zone: 'Cumhuriyet',
      type: 'Ev Sahibi',
      status: 'reserved',
      reservedReason: 'Ev sahibi (sürekli dolu)',
    },
    {
      id: 'CM-02',
      name: 'Cumhuriyet Parkı',
      zone: 'Cumhuriyet',
      type: 'Genel',
      status: 'available',
    },
    {
      id: 'CM-03',
      name: 'Cumhuriyet Hastane',
      zone: 'Cumhuriyet',
      type: 'Genel',
      status: 'occupied',
    },
    {
      id: 'GOP-03',
      name: 'GOP Spor Salonu',
      zone: 'Gazi Osman Paşa',
      type: 'Genel',
      status: 'available',
    },
  ],
  timers: new Map(),
};

function formatTime(date) {
  return new Intl.DateTimeFormat('tr-TR', {
    timeStyle: 'short',
    hour12: false,
  }).format(date);
}

function addNotification(message, type = 'info') {
  const entry = document.createElement('article');
  entry.className = `notification-item ${type === 'success' ? 'success' : type === 'warn' ? 'warn' : type === 'danger' ? 'danger' : ''}`;
  const timestamp = formatTime(new Date());
  entry.innerHTML = `
    <header>
      <span class="dot"></span>
      <p>${timestamp}</p>
    </header>
    <p>${message}</p>
  `;
  notificationList.prepend(entry);
}

function updateMetrics() {
  const availableCount = state.spots.filter((spot) => spot.status === 'available').length;
  const occupiedCount = state.spots.filter((spot) => spot.status !== 'available').length;
  metricAvailable.textContent = availableCount;
  metricOccupied.textContent = occupiedCount;
  metricAlerts.textContent = state.alertsSent;
}

function getFilteredSpots() {
  const selectedZone = zoneSelect.value;
  return state.spots.filter((spot) => {
    const zoneMatch = selectedZone === 'all' || spot.zone === selectedZone;
    const availabilityMatch = !availableToggle.checked || spot.status === 'available';
    return zoneMatch && availabilityMatch;
  });
}

function renderMap() {
  mapGrid.innerHTML = '';
  getFilteredSpots().forEach((spot) => {
    const tile = document.createElement('div');
    tile.className = 'map-tile';
    const statusClass = spot.status === 'available' ? 'available' : spot.status === 'reserved' ? 'reserved' : 'occupied';
    tile.innerHTML = `
      <header>
        <strong>${spot.id}</strong>
        <span class="map-dot ${statusClass}"></span>
      </header>
      <p>${spot.name}</p>
      <p>${spot.zone}</p>
    `;
    mapGrid.appendChild(tile);
  });
}

function renderSpots() {
  spotList.innerHTML = '';
  const filteredSpots = getFilteredSpots();

  if (!filteredSpots.length) {
    spotList.innerHTML = '<p class="panel-hint">Bu filtrelere uygun park alanı bulunamadı.</p>';
    return;
  }

  filteredSpots.forEach((spot) => {
    const card = document.createElement('article');
    card.className = 'spot-card';
    const statusText = spot.status === 'available' ? 'Boş' : spot.status === 'reserved' ? 'Sürekli dolu' : 'Dolu';
    const statusClass = spot.status === 'available' ? '' : spot.status === 'reserved' ? 'reserved' : 'occupied';
    const tagClass = spot.status === 'reserved' ? 'tag reserved' : 'tag';
    const parkedInfo = spot.parkedAt ? `Park edildi: ${formatTime(new Date(spot.parkedAt))}` : 'Sensör aktif';

    card.innerHTML = `
      <header>
        <div class="spot-meta">
          <h3>${spot.name}</h3>
          <span class="tag ${tagClass}">${spot.type}</span>
        </div>
        <div class="status ${statusClass}">${statusText}</div>
      </header>
      <p class="spot-details">Bölge: ${spot.zone} · ${parkedInfo}</p>
      ${spot.status === 'reserved' ? `<p class="spot-details">${spot.reservedReason}</p>` : ''}
      <div class="spot-actions">
        ${spot.status === 'available' ? `<button class="btn small primary" data-action="park" data-id="${spot.id}">Park et</button>` : ''}
        ${spot.status === 'occupied' ? `<button class="btn small danger" data-action="release" data-id="${spot.id}">Çıkış yap</button>` : ''}
      </div>
    `;

    spotList.appendChild(card);
  });
}

function renderAll() {
  renderMap();
  renderSpots();
  updateMetrics();
}

function scheduleAlert(spot) {
  if (state.timers.has(spot.id)) {
    clearTimeout(state.timers.get(spot.id));
  }

  const timerId = setTimeout(() => {
    if (spot.status === 'occupied') {
      state.alertsSent += 1;
      addNotification(`${spot.name} için uyarı: Aracınızı çekin, para cezası uygulanacaktır.`, 'danger');
      updateMetrics();
    }
  }, ALERT_DELAY_MS);

  state.timers.set(spot.id, timerId);
}

function handleSpotAction(event) {
  const actionBtn = event.target.closest('button[data-action]');
  if (!actionBtn) return;

  const spotId = actionBtn.dataset.id;
  const spot = state.spots.find((entry) => entry.id === spotId);
  if (!spot || spot.status === 'reserved') return;

  if (actionBtn.dataset.action === 'park') {
    spot.status = 'occupied';
    spot.parkedAt = Date.now();
    addNotification(`${spot.name} park edildi. 1 dakika sonra uyarı gönderilecek.`, 'success');
    scheduleAlert(spot);
  }

  if (actionBtn.dataset.action === 'release') {
    spot.status = 'available';
    spot.parkedAt = null;
    addNotification(`${spot.name} boşaldı.`, 'info');
  }

  renderAll();
}

function refreshSensorData() {
  state.spots.forEach((spot) => {
    if (spot.status === 'reserved') return;
    const random = Math.random();
    if (random > 0.55) {
      spot.status = 'occupied';
      spot.parkedAt = spot.parkedAt || Date.now();
      scheduleAlert(spot);
    } else {
      spot.status = 'available';
      spot.parkedAt = null;
    }
  });
  addNotification('Sensör verisi güncellendi.', 'info');
  renderAll();
}

function init() {
  renderAll();
  spotList.addEventListener('click', handleSpotAction);
  zoneSelect.addEventListener('change', renderAll);
  availableToggle.addEventListener('change', renderAll);
  refreshStatusBtn.addEventListener('click', refreshSensorData);
}

init();
