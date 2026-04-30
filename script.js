const parkGrid = document.getElementById('parkGrid');
const summary = document.getElementById('summary');
const notifications = document.getElementById('notifications');

const PARK_MS = 60_000;
const WARNING_MS = 10_000;

const parks = [
  { id: 'P1', label: 'P1', type: 'normal', occupied: false, endTime: null },
  { id: 'P2', label: 'P2', type: 'normal', occupied: false, endTime: null },
  { id: 'P3', label: 'P3', type: 'normal', occupied: false, endTime: null },
  { id: 'P4', label: 'P4', type: 'normal', occupied: false, endTime: null },
  { id: 'P5', label: 'Ev Sahibi Özel', type: 'reserved', occupied: true },
  { id: 'P6', label: 'Engelli Özel', type: 'reserved', occupied: true },
  { id: 'P7', label: 'Dükkan Özel', type: 'reserved', occupied: true },
  { id: 'P8', label: 'Normal', type: 'normal', occupied: false, endTime: null },
];

function notify(msg) {
  const box = document.createElement('div');
  box.className = 'note';
  box.textContent = msg;
  notifications.prepend(box);

  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(msg);
  }
}

function formatSeconds(ms) {
  return Math.max(0, Math.ceil(ms / 1000));
}

function render() {
  parkGrid.innerHTML = '';
  const normalParks = parks.filter((p) => p.type === 'normal');
  const empty = normalParks.filter((p) => !p.occupied).length;

  parks.forEach((park) => {
    const card = document.createElement('article');
    card.className = `slot ${park.occupied ? 'occupied' : 'free'} ${park.type === 'reserved' ? 'reserved' : ''}`;

    const now = Date.now();
    const remaining = park.endTime ? park.endTime - now : 0;
    const warning = park.occupied && park.type === 'normal' && remaining <= WARNING_MS;

    card.innerHTML = `
      <h3>${park.label}</h3>
      <p>${park.type === 'reserved' ? 'Özel Yer (Sürekli Kırmızı)' : park.occupied ? 'Dolu' : 'Müsait'}</p>
      <p class="timer">${park.occupied && park.type === 'normal' ? `Kalan: ${formatSeconds(remaining)} sn` : '---'}</p>
    `;

    if (park.type === 'normal') {
      const button = document.createElement('button');
      button.className = 'btn';
      button.textContent = park.occupied ? 'Araç Çıkışı' : 'Araç Girişi (Arduino)';
      button.addEventListener('click', () => toggleParking(park.id));
      card.appendChild(button);
    }

    if (warning) card.classList.add('warning');
    parkGrid.appendChild(card);
  });

  summary.textContent = `Normal alanlarda ${empty} boş / ${normalParks.length} toplam yer var.`;
}

function toggleParking(id) {
  const park = parks.find((p) => p.id === id);
  if (!park || park.type === 'reserved') return;

  if (!park.occupied) {
    park.occupied = true;
    park.endTime = Date.now() + PARK_MS;
    notify(`${park.label}: Araç park etti. Süre başladı (60 sn).`);
  } else {
    park.occupied = false;
    park.endTime = null;
    notify(`${park.label}: Araç çıktı, yer tekrar yeşil (müsait).`);
  }

  render();
}

function tick() {
  const now = Date.now();

  parks.forEach((park) => {
    if (park.type !== 'normal' || !park.occupied || !park.endTime) return;

    const remaining = park.endTime - now;
    if (remaining <= WARNING_MS && !park.warned) {
      park.warned = true;
      notify(`${park.label}: Son 10 saniye! Aracınızı çekin yoksa park cezası alacaksınız.`);
    }

    if (remaining <= 0) {
      park.occupied = false;
      park.endTime = null;
      park.warned = false;
      notify(`${park.label}: Süre doldu, yer otomatik boşaltıldı.`);
    }
  });

  render();
}

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

render();
setInterval(tick, 1000);
