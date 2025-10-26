const analysisForm = document.getElementById('analysisForm');
const eventDateTimeInput = document.getElementById('eventDateTime');
const eventLatInput = document.getElementById('eventLat');
const eventLonInput = document.getElementById('eventLon');
const timeToleranceInput = document.getElementById('timeTolerance');
const distanceToleranceInput = document.getElementById('distanceTolerance');
const speedEquivalentInput = document.getElementById('speedEquivalent');
const htsDataInput = document.getElementById('htsData');
const formError = document.getElementById('formError');

const resultsSection = document.getElementById('results');
const emptyState = document.getElementById('emptyState');
const summaryCard = document.getElementById('summaryCard');
const statsBox = document.getElementById('stats');
const statsList = document.getElementById('statsList');
const tableWrapper = document.getElementById('tableWrapper');
const matchTableBody = document.querySelector('#matchTable tbody');

analysisForm.addEventListener('submit', (event) => {
  event.preventDefault();
  clearFeedback();

  const eventDateTime = parseDateTimeInput(eventDateTimeInput.value);
  if (!eventDateTime) {
    return setError('Lütfen geçerli bir olay tarih ve saat bilgisi girin.');
  }

  const latitude = parseNumber(eventLatInput.value);
  const longitude = parseNumber(eventLonInput.value);
  if (latitude === null || longitude === null) {
    return setError('Enlem ve boylam değerlerini ondalık formatta girin.');
  }

  const rawData = htsDataInput.value.trim();
  if (!rawData) {
    return setError('HTS verisi boş olamaz. En azından bir satır veri girin.');
  }

  const records = parseHTSData(rawData);
  if (!records.length) {
    return setError('Geçerli satır bulunamadı. Başlık adlarını ve tarih/konum formatını kontrol edin.');
  }

  const speedEquivalent = Math.max(0, parseNumber(speedEquivalentInput.value) ?? 15);
  const timeToleranceMinutes = Math.max(0, parseNumber(timeToleranceInput.value) ?? 0);
  const distanceToleranceMeters = Math.max(0, parseNumber(distanceToleranceInput.value) ?? 0);

  const matches = records
    .map((record) => enrichRecord(record, { latitude, longitude, eventDateTime, speedEquivalent }))
    .filter((record) => Number.isFinite(record.score))
    .sort((a, b) => a.score - b.score);

  if (!matches.length) {
    return setError('Tüm satırlar hatalı görünüyor. Koordinatların ondalık, tarihin tanınabilir olduğundan emin olun.');
  }

  renderSummary(matches[0], eventDateTime, speedEquivalent);
  renderStats(matches, { timeToleranceMinutes, distanceToleranceMeters });
  renderTable(matches.slice(0, 5));
  showResults();
});

function clearFeedback() {
  formError.textContent = '';
  formError.classList.remove('visible');
  summaryCard.classList.add('hidden');
  statsBox.classList.add('hidden');
  tableWrapper.classList.add('hidden');
}

function setError(message) {
  formError.textContent = message;
  formError.classList.add('visible');
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showResults() {
  emptyState.classList.add('hidden');
  summaryCard.classList.remove('hidden');
  statsBox.classList.remove('hidden');
  tableWrapper.classList.remove('hidden');
}

function parseNumber(value) {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  const normalized = String(value).replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseDateTimeInput(value) {
  if (!value) return null;
  const direct = new Date(value);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }
  return null;
}

function parseHTSData(text) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headerLine = lines[0];
  const delimiter = detectDelimiter(headerLine);
  const headers = headerLine.split(delimiter).map((column) => column.trim().toLowerCase());

  const timeIndex = headers.findIndex((header) => /tarih|timestamp|datetime|zaman/.test(header));
  const latIndex = headers.findIndex((header) => /enlem|lat/i.test(header));
  const lonIndex = headers.findIndex((header) => /boylam|lon|lng/i.test(header));
  const cellIndex = headers.findIndex((header) => /(cid|cell|lac|ci)/i.test(header));
  const phoneIndex = headers.findIndex((header) => /(hat|msisdn|numara|imei)/i.test(header));

  if (timeIndex === -1 || latIndex === -1 || lonIndex === -1) {
    return [];
  }

  const parsedRecords = [];

  for (let i = 1; i < lines.length; i += 1) {
    const parts = lines[i].split(delimiter).map((part) => part.trim());
    if (parts.length < headers.length) {
      continue;
    }

    const timestamp = parseFlexibleDate(parts[timeIndex]);
    const lat = parseNumber(parts[latIndex]);
    const lon = parseNumber(parts[lonIndex]);

    if (!timestamp || lat === null || lon === null) {
      continue;
    }

    parsedRecords.push({
      timestamp,
      latitude: lat,
      longitude: lon,
      phone: phoneIndex > -1 ? parts[phoneIndex] : '—',
      cell: cellIndex > -1 ? parts[cellIndex] : '—',
      rawIndex: i,
    });
  }

  return parsedRecords;
}

function detectDelimiter(line) {
  if (line.includes('\t')) return '\t';
  if ((line.match(/;/g) || []).length > 1) return ';';
  return ',';
}

function parseFlexibleDate(value) {
  if (!value) return null;
  const trimmed = value.trim();

  const direct = new Date(trimmed.replace(' ', 'T'));
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  const fullMatch = trimmed.match(/^(\d{2})[./-](\d{2})[./-](\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (fullMatch) {
    const [, day, month, year, hour = '00', minute = '00', second = '00'] = fullMatch;
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }

  const shortMatch = trimmed.match(/^(\d{2})[./-](\d{2})[./-](\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (shortMatch) {
    const [, day, month, yearShort, hour = '00', minute = '00', second = '00'] = shortMatch;
    const year = Number(yearShort) + (Number(yearShort) > 70 ? 1900 : 2000);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}`);
  }

  return null;
}

function enrichRecord(record, { latitude, longitude, eventDateTime, speedEquivalent }) {
  const timeDiffSeconds = Math.abs((record.timestamp.getTime() - eventDateTime.getTime()) / 1000);
  const distanceMeters = haversineDistance(latitude, longitude, record.latitude, record.longitude);
  const score = distanceMeters + timeDiffSeconds * speedEquivalent;

  return {
    ...record,
    timeDiffSeconds,
    distanceMeters,
    score,
  };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371000; // metre
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function renderSummary(match, eventDateTime, speedEquivalent) {
  const timeDiff = formatTimeDifference(match.timeDiffSeconds);
  const distance = formatDistance(match.distanceMeters);

  summaryCard.innerHTML = `
    <h2>En Yakın Kayıt</h2>
    <div class="summary-grid">
      <div>
        <p class="label">Hat / IMEI</p>
        <p class="value">${match.phone}</p>
      </div>
      <div>
        <p class="label">Kayıt Tarihi</p>
        <p class="value">${formatDate(match.timestamp)}</p>
      </div>
      <div>
        <p class="label">CID / Hücre</p>
        <p class="value">${match.cell}</p>
      </div>
    </div>
    <div class="summary-insights">
      <div>
        <p class="insight-label">Zaman farkı</p>
        <p class="insight-value">${timeDiff}</p>
      </div>
      <div>
        <p class="insight-label">Mesafe</p>
        <p class="insight-value">${distance}</p>
      </div>
      <div>
        <p class="insight-label">Skor</p>
        <p class="insight-value">${formatNumber(match.score)} m</p>
      </div>
    </div>
    <p class="summary-note">Skor, mesafe ile zaman farkının (× ${speedEquivalent} m/s) toplamıdır. Olay zamanı: ${formatDate(eventDateTime)}</p>
  `;
}

function renderStats(matches, { timeToleranceMinutes, distanceToleranceMeters }) {
  const items = [];
  items.push(`Toplam analiz edilen kayıt: <strong>${matches.length}</strong>`);
  items.push(`En kısa zaman farkı: <strong>${formatTimeDifference(matches[0].timeDiffSeconds)}</strong>`);
  items.push(`En kısa mesafe: <strong>${formatDistance(matches[0].distanceMeters)}</strong>`);

  if (timeToleranceMinutes > 0) {
    const withinTime = matches.filter((match) => match.timeDiffSeconds <= timeToleranceMinutes * 60).length;
    items.push(`${timeToleranceMinutes} dk içinde kalan kayıt: <strong>${withinTime}</strong>`);
  }

  if (distanceToleranceMeters > 0) {
    const withinDistance = matches.filter((match) => match.distanceMeters <= distanceToleranceMeters).length;
    items.push(`${distanceToleranceMeters} m içinde kalan kayıt: <strong>${withinDistance}</strong>`);
  }

  statsList.innerHTML = items.map((item) => `<li>${item}</li>`).join('');
}

function renderTable(matches) {
  matchTableBody.innerHTML = matches
    .map((match, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${match.phone}</td>
        <td>${formatDate(match.timestamp)}</td>
        <td>${formatTimeDifference(match.timeDiffSeconds)}</td>
        <td>${formatDistance(match.distanceMeters)}</td>
        <td>${match.cell}</td>
        <td>${formatNumber(match.score)} m</td>
      </tr>
    `)
    .join('');
}

function formatTimeDifference(seconds) {
  if (!Number.isFinite(seconds)) return '—';
  const absSeconds = Math.round(seconds);
  const minutes = Math.floor(absSeconds / 60);
  const remainingSeconds = absSeconds % 60;

  if (minutes >= 120) {
    const hours = Math.round(absSeconds / 3600 * 10) / 10;
    return `${hours.toLocaleString('tr-TR')} saat`;
  }

  if (minutes >= 1) {
    return `${minutes} dk ${remainingSeconds.toString().padStart(2, '0')} sn`;
  }

  return `${remainingSeconds} sn`;
}

function formatDistance(meters) {
  if (!Number.isFinite(meters)) return '—';
  if (meters >= 1000) {
    const km = meters / 1000;
    return `${km.toFixed(2).replace('.', ',')} km`;
  }
  return `${Math.round(meters)} m`;
}

function formatDate(date) {
  return date.toLocaleString('tr-TR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatNumber(value) {
  return Math.round(value).toLocaleString('tr-TR');
}
