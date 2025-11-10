const AFAD_ENDPOINT = 'https://deprem.afad.gov.tr/apiv2/event/filter';
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

const faultLines = [
  {
    id: 'naf',
    name: 'Kuzey Anadolu Fayı',
    description: "Marmara Denizi'nden Erzincan'a uzanan sağ yanal atımlı ana fay zonu.",
    color: '#ef4444',
    segments: [
      [
        [40.76, 26.5],
        [40.84, 27.4],
        [40.88, 29.1]
      ],
      [
        [40.85, 30.2],
        [40.62, 32.4],
        [40.28, 34.6],
        [40.03, 36.9]
      ],
      [
        [39.96, 38.7],
        [39.72, 40.2],
        [39.45, 41.3]
      ]
    ]
  },
  {
    id: 'daf',
    name: 'Doğu Anadolu Fayı',
    description: "Hatay'dan Elazığ ve Bingöl'e uzanan sol yanal fay zonu.",
    color: '#f97316',
    segments: [
      [
        [36.2, 36.1],
        [36.8, 36.8],
        [37.4, 37.5],
        [37.9, 38.3]
      ],
      [
        [38.2, 38.9],
        [38.5, 39.5],
        [38.8, 40.3]
      ]
    ]
  },
  {
    id: 'ege',
    name: 'Ege Graben Sistemi',
    description: 'Ege Denizi kıyıları boyunca normal faylardan oluşan graben sistemi.',
    color: '#fb7185',
    segments: [
      [
        [39.2, 26.2],
        [38.8, 26.8],
        [38.6, 27.5],
        [38.3, 28.2],
        [38.0, 28.9]
      ],
      [
        [38.4, 29.4],
        [38.1, 29.9],
        [37.7, 30.3]
      ]
    ]
  },
  {
    id: 'bati-toros',
    name: 'Batı Toroslar & Fethiye-Burdur Zonu',
    description: 'Akdeniz kıyısından Isparta havzasına uzanan karmaşık fay zonu.',
    color: '#facc15',
    segments: [
      [
        [36.4, 29.0],
        [36.7, 29.6],
        [37.1, 30.3],
        [37.4, 30.9]
      ],
      [
        [37.6, 31.2],
        [37.9, 31.8],
        [38.3, 32.5]
      ]
    ]
  }
];

const regions = [
  {
    id: 'marmara',
    name: 'Marmara',
    faultFocus: 'Kuzey Anadolu Fayı (batı segmenti)',
    bounds: L.latLngBounds(
      L.latLng(39.0, 26.0),
      L.latLng(42.5, 31.5)
    )
  },
  {
    id: 'ege',
    name: 'Ege',
    faultFocus: 'Ege graben sistemi',
    bounds: L.latLngBounds(
      L.latLng(36.0, 26.0),
      L.latLng(39.5, 30.5)
    )
  },
  {
    id: 'akdeniz',
    name: 'Akdeniz',
    faultFocus: 'Fethiye-Burdur ve Doğu Akdeniz fayları',
    bounds: L.latLngBounds(
      L.latLng(35.5, 28.0),
      L.latLng(38.5, 36.5)
    )
  },
  {
    id: 'dogu',
    name: 'Doğu Anadolu',
    faultFocus: 'Doğu Anadolu Fayı',
    bounds: L.latLngBounds(
      L.latLng(36.0, 35.5),
      L.latLng(40.5, 44.0)
    )
  },
  {
    id: 'guneydogu',
    name: 'Güneydoğu',
    faultFocus: 'Arabistan levhası sınır zonu',
    bounds: L.latLngBounds(
      L.latLng(36.0, 37.0),
      L.latLng(38.7, 43.5)
    )
  },
  {
    id: 'icanadolu',
    name: 'İç Anadolu & Karadeniz',
    faultFocus: 'Kuzey Anadolu orta segmentleri',
    bounds: L.latLngBounds(
      L.latLng(38.0, 31.0),
      L.latLng(41.5, 39.5)
    )
  }
];

const map = L.map('faultMap', {
  center: [39.1, 35.0],
  zoom: 6,
  minZoom: 5,
  maxZoom: 12,
  zoomControl: false,
  attributionControl: false
});

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap katkıcıları, Humanitarian Style'
}).addTo(map);

L.control.zoom({ position: 'bottomright' }).addTo(map);

const faultLayer = L.layerGroup().addTo(map);
const quakeLayer = L.layerGroup().addTo(map);

const faultList = document.querySelector('#faultList');
const regionActivity = document.querySelector('#regionActivity');
const eventList = document.querySelector('#eventList');

const statTotal = document.querySelector('#statTotal');
const statStrongest = document.querySelector('#statStrongest');
const statAverage = document.querySelector('#statAverage');
const updatedAt = document.querySelector('#updatedAt');

function drawFaultLines() {
  faultLayer.clearLayers();
  faultList.innerHTML = '';

  faultLines.forEach((line) => {
    line.segments.forEach((segment) => {
      L.polyline(segment, {
        color: line.color,
        weight: 3,
        opacity: 0.85,
        dashArray: '6 8'
      }).addTo(faultLayer);
    });

    const item = document.createElement('li');
    item.innerHTML = `<strong>${line.name}</strong><span>${line.description}</span>`;
    faultList.appendChild(item);
  });
}

drawFaultLines();

function normaliseEvents(rawItems) {
  const items = Array.isArray(rawItems)
    ? rawItems
    : Array.isArray(rawItems?.data)
    ? rawItems.data
    : Array.isArray(rawItems?.result)
    ? rawItems.result
    : [];

  return items
    .map((item) => {
      const latitude = Number(item?.latitude ?? item?.lat ?? item?.Latitude);
      const longitude = Number(item?.longitude ?? item?.lon ?? item?.Longitude);
      const magnitude = Number(item?.magnitude ?? item?.mag ?? item?.Magnitude);
      const depth = Number(item?.depth ?? item?.depthKm ?? item?.Depth);
      const dateString =
        item?.date ?? item?.time ?? item?.eventDate ?? item?.eventDateTime ?? item?.originTime;
      const region = item?.location ?? item?.title ?? item?.locationName ?? item?.Place ?? item?.place;

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || !dateString) {
        return null;
      }

      const when = new Date(dateString);
      if (Number.isNaN(when.getTime())) {
        return null;
      }

      return {
        id: item?.eventId ?? item?.id ?? item?.eventID ?? `${when.getTime()}-${latitude}-${longitude}`,
        latitude,
        longitude,
        magnitude: Number.isFinite(magnitude) ? magnitude : null,
        depth: Number.isFinite(depth) ? depth : null,
        when,
        region: region ?? 'Belirtilmedi'
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.when.getTime() - a.when.getTime());
}

function magnitudeLabel(value) {
  if (value == null) {
    return 'M -';
  }
  return `M ${value.toFixed(1)}`;
}

function depthLabel(value) {
  if (value == null) {
    return 'Derinlik: - km';
  }
  return `Derinlik: ${value.toFixed(1)} km`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat('tr-TR', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
}

function getRegionForEvent(event) {
  const point = L.latLng(event.latitude, event.longitude);
  const region = regions.find((area) => area.bounds.contains(point));
  return region ?? null;
}

function describeRisk(level) {
  switch (level) {
    case 'high':
      return 'Son 24 saatte güçlü sarsıntılar gözlendi. Yapısal inceleme ve yerel uyarıları takip edin.';
    case 'medium':
      return 'Sarsıntılar ortalamanın üzerinde. Bölgesel AFAD duyurularını izleyin.';
    default:
      return 'Düşük ölçekli hareketlilik gözleniyor. Olağan seyrinde takipte kalın.';
  }
}

function renderRegionActivity(events) {
  regionActivity.innerHTML = '';

  const baseStats = regions.map((region) => ({
    region,
    events: [],
    count: 0,
    maxMag: 0,
    average: 0,
    risk: 'low'
  }));

  const unmatched = {
    region: {
      id: 'genel',
      name: 'Genel Türkiye',
      faultFocus: 'Belirli bir fay zonu değil',
      bounds: null
    },
    events: [],
    count: 0,
    maxMag: 0,
    average: 0,
    risk: 'low'
  };

  events.forEach((event) => {
    const target = getRegionForEvent(event);
    const bucket = target ? baseStats.find((item) => item.region.id === target.id) : unmatched;
    bucket.events.push(event);
  });

  const allBuckets = [...baseStats, unmatched].filter((bucket) => bucket.events.length > 0);

  if (allBuckets.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Son 24 saat içinde AFAD tarafından yayımlanan deprem bulunamadı.';
    regionActivity.appendChild(empty);
    return;
  }

  allBuckets.forEach((bucket) => {
    bucket.count = bucket.events.length;
    const magnitudes = bucket.events
      .map((event) => event.magnitude)
      .filter((value) => typeof value === 'number' && Number.isFinite(value));
    bucket.maxMag = magnitudes.length ? Math.max(...magnitudes) : 0;
    bucket.average = magnitudes.length
      ? magnitudes.reduce((acc, value) => acc + value, 0) / magnitudes.length
      : 0;

    if (bucket.maxMag >= 5 || bucket.count >= 6) {
      bucket.risk = 'high';
    } else if (bucket.maxMag >= 4 || bucket.count >= 3) {
      bucket.risk = 'medium';
    } else {
      bucket.risk = 'low';
    }

    const card = document.createElement('article');
    card.className = 'activity-card';

    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.textContent = bucket.region.name;

    const risk = document.createElement('span');
    risk.className = `risk-tag risk-${bucket.risk}`;
    risk.textContent =
      bucket.risk === 'high' ? 'Yüksek' : bucket.risk === 'medium' ? 'Orta' : 'Düşük';

    header.append(title, risk);

    const summary = document.createElement('dl');

    const countTitle = document.createElement('dt');
    countTitle.textContent = 'Deprem sayısı';
    const countValue = document.createElement('dd');
    countValue.textContent = bucket.count;

    const magTitle = document.createElement('dt');
    magTitle.textContent = 'En büyük magnitüd';
    const magValue = document.createElement('dd');
    magValue.textContent = bucket.maxMag ? bucket.maxMag.toFixed(1) : '-';

    const avgTitle = document.createElement('dt');
    avgTitle.textContent = 'Ortalama magnitüd';
    const avgValue = document.createElement('dd');
    avgValue.textContent = bucket.average ? bucket.average.toFixed(1) : '-';

    summary.append(countTitle, countValue, magTitle, magValue, avgTitle, avgValue);

    const focus = document.createElement('p');
    focus.innerHTML = `<strong>Öne çıkan fay zonu:</strong> ${bucket.region.faultFocus}`;

    const detail = document.createElement('p');
    detail.textContent = describeRisk(bucket.risk);

    card.append(header, summary, focus, detail);
    regionActivity.appendChild(card);
  });
}

function renderEventList(events) {
  eventList.innerHTML = '';

  if (!events.length) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Listelenecek deprem bulunamadı. Veri alınamadıysa sayfayı daha sonra yenileyin.';
    eventList.appendChild(empty);
    return;
  }

  events.forEach((event) => {
    const item = document.createElement('article');
    item.className = 'event-item';

    const header = document.createElement('header');
    const title = document.createElement('h3');
    title.textContent = event.region;

    const magnitude = document.createElement('span');
    magnitude.className = 'event-mag';
    magnitude.textContent = magnitudeLabel(event.magnitude);

    header.append(title, magnitude);

    const meta = document.createElement('div');
    meta.className = 'event-meta';

    const date = document.createElement('span');
    date.textContent = formatDate(event.when);

    const location = document.createElement('span');
    location.textContent = `Lat ${event.latitude.toFixed(2)}°, Lon ${event.longitude.toFixed(2)}°`;

    const depth = document.createElement('span');
    depth.textContent = depthLabel(event.depth);

    meta.append(date, location, depth);

    item.append(header, meta);
    eventList.appendChild(item);
  });
}

function updateStats(events) {
  if (!events.length) {
    statTotal.textContent = '-';
    statStrongest.textContent = '-';
    statAverage.textContent = '-';
    updatedAt.textContent = '-';
    updatedAt.removeAttribute('datetime');
    return;
  }

  const total = events.length;
  const magnitudes = events
    .map((event) => event.magnitude)
    .filter((value) => typeof value === 'number' && Number.isFinite(value));

  const strongest = magnitudes.length ? Math.max(...magnitudes) : null;
  const strongestEvent = strongest
    ? events.find((event) => event.magnitude === strongest)
    : null;
  const average = magnitudes.length
    ? magnitudes.reduce((acc, value) => acc + value, 0) / magnitudes.length
    : null;

  statTotal.textContent = total;
  statStrongest.textContent = strongestEvent
    ? `${magnitudeLabel(strongestEvent.magnitude)} · ${strongestEvent.region}`
    : '-';
  statAverage.textContent = average ? average.toFixed(1) : '-';

  const newest = events[0];
  updatedAt.textContent = formatDate(newest.when);
  updatedAt.setAttribute('datetime', newest.when.toISOString());
}

function renderMarkers(events) {
  quakeLayer.clearLayers();

  events.forEach((event) => {
    const radius = event.magnitude ? Math.max(event.magnitude * 2.2, 5) : 5;
    const color = event.magnitude >= 5 ? '#ef4444' : event.magnitude >= 4 ? '#f97316' : '#38bdf8';

    const marker = L.circleMarker([event.latitude, event.longitude], {
      radius,
      color,
      fillColor: color,
      fillOpacity: 0.65,
      weight: 1.2
    });

    const popup = `
      <strong>${event.region}</strong><br>
      ${magnitudeLabel(event.magnitude)} · ${formatDate(event.when)}<br>
      ${depthLabel(event.depth)}
    `;

    marker.bindPopup(popup);
    quakeLayer.addLayer(marker);
  });
}

async function fetchEarthquakes() {
  const now = new Date();
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const params = new URLSearchParams({
    start: start.toISOString(),
    end: now.toISOString(),
    minmag: '0',
    maxmag: '10',
    orderby: 'timedesc',
    limit: '200'
  });

  const response = await fetch(`${AFAD_ENDPOINT}?${params.toString()}`, {
    headers: {
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`AFAD API isteği başarısız oldu: ${response.status}`);
  }

  const data = await response.json();
  return normaliseEvents(data);
}

async function refresh() {
  document.body.dataset.loading = 'true';
  try {
    const events = await fetchEarthquakes();
    renderMarkers(events);
    renderRegionActivity(events);
    renderEventList(events);
    updateStats(events);
  } catch (error) {
    console.error(error);
    renderMarkers([]);
    renderRegionActivity([]);
    renderEventList([]);
    updateStats([]);

    const errorMessage = document.createElement('p');
    errorMessage.className = 'empty-state';
    errorMessage.textContent = 'Canlı veri alınamadı. AFAD servisine erişim sağlanınca bilgiler otomatik güncellenecek.';
    eventList.innerHTML = '';
    eventList.appendChild(errorMessage);
  } finally {
    document.body.dataset.loading = 'false';
  }
}

refresh();
setInterval(refresh, REFRESH_INTERVAL);
