const pdfInput = document.getElementById('pdfInput');
const dropZone = document.getElementById('dropZone');
const selectBtn = document.getElementById('selectBtn');
const statusMessage = document.getElementById('statusMessage');
const resultsSection = document.getElementById('results');
const summaryText = document.getElementById('summaryText');
const highlightList = document.getElementById('highlightList');
const keywordChips = document.getElementById('keywordChips');
const quickStats = document.getElementById('quickStats');
const loadingOverlay = document.getElementById('loading');
const pageCountLabel = document.getElementById('pageCount');

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const STOP_WORDS = new Set([
  've', 'veya', 'bir', 'iki', 'üç', 'ile', 'ama', 'fakat', 'ancak', 'gibi', 'olan', 'olanlar', 'olanları',
  'olarak', 'üzerine', 'hakkında', 'şu', 'bu', 'şey', 'çok', 'daha', 'ise', 'için', 'göre', 'de', 'da',
  'ki', 'değil', 'her', 'en', 'mi', 'mu', 'mü', 'mı', 'ne', 'nasıl', 'neden', 'hangi', 'var', 'yok',
  'olan', 'birkaç', 'kez', 'olarak', 'ise', 'çünkü', 'ancak', 'hem', 'ya', 'ile', 'et', 'ettı', 'etti',
  'ettik', 'ettiğini', 'ettikleri', 'ettikten', 'görev', 'bu', 'şu', 'o', 'olarak', 'vardır', 'olan', 'tarafından',
  'soruşturma', 'dosya', 'dosyası', 'belge', 'belgesi', 'pdf', 'savcı', 'savcılık', 'davaya', 'dava'
]);

function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = `status${type ? ` ${type}` : ''}`;
}

function toggleLoading(show) {
  loadingOverlay.classList.toggle('hidden', !show);
}

function resetResults() {
  resultsSection.classList.add('hidden');
  summaryText.textContent = '';
  highlightList.innerHTML = '';
  keywordChips.innerHTML = '';
  quickStats.innerHTML = '';
  pageCountLabel.textContent = '';
}

function isValidFile(file) {
  if (!file) {
    showStatus('Dosya seçilmedi.', 'error');
    return false;
  }

  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    showStatus('Lütfen sadece PDF uzantılı dosyalar yükleyin.', 'error');
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    showStatus('Dosya boyutu 20 MB sınırını aşıyor.', 'error');
    return false;
  }

  return true;
}

async function extractTextFromPDF(arrayBuffer) {
  if (!window.pdfjsLib) {
    throw new Error('PDF.js kütüphanesi yüklenemedi.');
  }

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    fullText += ` ${strings.join(' ')}`;
  }

  return { text: fullText, pageCount: pdf.numPages };
}

function normaliseText(text) {
  return text
    .replace(/\u0000/g, ' ')
    .replace(/[\r\f\t]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitSentences(text) {
  if (!text) {
    return [];
  }
  return text.match(/[^.!?]+[.!?]?/g) || [];
}

function buildSummary(sentences) {
  if (!sentences.length) {
    return 'Belgeden anlamlı bir cümle çıkarılamadı.';
  }

  const sentenceScores = [];
  const wordFrequencies = new Map();

  sentences.forEach((sentence) => {
    const words = (sentence.toLowerCase().match(/[\p{L}0-9']+/gu) || [])
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

    words.forEach((word) => {
      const current = wordFrequencies.get(word) || 0;
      wordFrequencies.set(word, current + 1);
    });
  });

  const maxFrequency = Math.max(...wordFrequencies.values(), 1);

  sentences.forEach((sentence, index) => {
    const words = (sentence.toLowerCase().match(/[\p{L}0-9']+/gu) || [])
      .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

    const score = words.reduce((total, word) => total + (wordFrequencies.get(word) || 0) / maxFrequency, 0);
    sentenceScores.push({ index, sentence: sentence.trim(), score });
  });

  sentenceScores.sort((a, b) => b.score - a.score);
  const summaryCount = Math.min(5, Math.max(2, Math.round(sentences.length / 6)));
  const selected = sentenceScores.slice(0, summaryCount).sort((a, b) => a.index - b.index);

  return selected.map((item) => item.sentence).join(' ');
}

function extractEntities(text) {
  const dates = new Set();
  const amounts = new Set();
  const caseNumbers = new Set();
  const names = new Set();

  const datePatterns = [
    /\b\d{1,2}[.\/]\d{1,2}[.\/]\d{2,4}\b/g,
    /\b\d{4}-\d{2}-\d{2}\b/g,
    /\b\d{1,2}\s+(ocak|şubat|mart|nisan|mayıs|haziran|temmuz|ağustos|eylül|ekim|kasım|aralık)\s+\d{4}\b/gi
  ];
  datePatterns.forEach((regex) => {
    const matches = text.match(regex);
    if (matches) {
      matches.forEach((match) => dates.add(match));
    }
  });

  const amountMatches = text.match(/\b\d{1,3}(?:[.\s]\d{3})*(?:,\d+)?\s*(?:tl|₺|türk lirası|usd|dolar|euro|€)\b/gi);
  if (amountMatches) {
    amountMatches.forEach((match) => amounts.add(match));
  }

  const caseMatches = text.match(/\b\d{4}\/\d{1,4}\b/g);
  if (caseMatches) {
    caseMatches.forEach((match) => caseNumbers.add(match));
  }

  const nameMatches = text.match(/\b([A-ZÇĞİÖŞÜ][a-zçğıöşü]+\s+[A-ZÇĞİÖŞÜ][a-zçğıöşü]+)\b/g);
  if (nameMatches) {
    nameMatches.forEach((match) => names.add(match));
  }

  return {
    dates: Array.from(dates).slice(0, 6),
    amounts: Array.from(amounts).slice(0, 6),
    caseNumbers: Array.from(caseNumbers).slice(0, 6),
    names: Array.from(names).slice(0, 6)
  };
}

function buildHighlights(entities) {
  const highlights = [];

  if (entities.dates.length) {
    highlights.push(`Tespit edilen tarihler: ${entities.dates.join(', ')}`);
  }

  if (entities.amounts.length) {
    highlights.push(`Finansal kayıtlar: ${entities.amounts.join(', ')}`);
  }

  if (entities.caseNumbers.length) {
    highlights.push(`Dosya / karar numaraları: ${entities.caseNumbers.join(', ')}`);
  }

  if (entities.names.length) {
    highlights.push(`Olası kişi veya kurum isimleri: ${entities.names.join(', ')}`);
  }

  if (!highlights.length) {
    highlights.push('Belgede açıkça ayrıştırılabilen kritik kayıt bulunamadı. Manuel gözden geçirme önerilir.');
  }

  return highlights;
}

function extractKeywords(text) {
  const words = text.toLowerCase().match(/[\p{L}0-9']+/gu) || [];
  const frequencies = new Map();

  words.forEach((word) => {
    if (word.length <= 3 || STOP_WORDS.has(word)) {
      return;
    }
    const current = frequencies.get(word) || 0;
    frequencies.set(word, current + 1);
  });

  const sorted = Array.from(frequencies.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);

  return sorted;
}

function buildQuickStats(text, pageCount, entities) {
  const words = text.split(/\s+/).filter(Boolean);
  const sentences = splitSentences(text);
  const readingMinutes = Math.max(1, Math.round(words.length / 180));
  const highlightTotal = entities.dates.length + entities.amounts.length + entities.caseNumbers.length + entities.names.length;

  return [
    `Sayfa sayısı: ${pageCount}`,
    `Kelime sayısı: ${words.length}`,
    `Cümle sayısı: ${sentences.length}`,
    `Tahmini okuma süresi: ${readingMinutes} dakika`,
    `Otomatik yakalanan kritik kayıtlar: ${highlightTotal}`
  ];
}

function renderList(listElement, items) {
  listElement.innerHTML = '';
  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    listElement.appendChild(li);
  });
}

function renderChips(container, items) {
  container.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('p');
    empty.className = 'hint';
    empty.textContent = 'Anahtar kelime çıkarılamadı.';
    container.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const span = document.createElement('span');
    span.className = 'chip';
    span.textContent = item;
    container.appendChild(span);
  });
}

function renderResults(analysis) {
  summaryText.textContent = analysis.summary;
  pageCountLabel.textContent = `${analysis.pageCount} sayfa`;
  renderList(highlightList, analysis.highlights);
  renderChips(keywordChips, analysis.keywords);
  renderList(quickStats, analysis.quickStats);
  resultsSection.classList.remove('hidden');
}

async function handleFile(file) {
  resetResults();

  if (!isValidFile(file)) {
    return;
  }

  showStatus('Dosya alındı, analiz başlatılıyor...', '');
  toggleLoading(true);

  try {
    const arrayBuffer = await file.arrayBuffer();
    const { text, pageCount } = await extractTextFromPDF(arrayBuffer);
    const cleanedText = normaliseText(text);

    if (!cleanedText) {
      showStatus('Belgeden metin çıkarılamadı. Tarama kalitesini kontrol edin.', 'error');
      return;
    }

    const sentences = splitSentences(cleanedText);
    const summary = buildSummary(sentences);
    const entities = extractEntities(cleanedText);
    const highlights = buildHighlights(entities);
    const keywords = extractKeywords(cleanedText);
    const stats = buildQuickStats(cleanedText, pageCount, entities);

    renderResults({
      summary,
      pageCount,
      highlights,
      keywords,
      quickStats: stats
    });

    showStatus(`"${file.name}" başarıyla analiz edildi.`, 'success');
  } catch (error) {
    console.error(error);
    showStatus('Dosya analiz edilirken bir hata oluştu.', 'error');
  } finally {
    toggleLoading(false);
  }
}

selectBtn.addEventListener('click', () => {
  pdfInput.click();
});

dropZone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    pdfInput.click();
  }
});

pdfInput.addEventListener('change', (event) => {
  const [file] = event.target.files;
  if (file) {
    handleFile(file);
  }
});

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  dropZone.classList.remove('dragover');
  const file = event.dataTransfer.files[0];
  if (file) {
    handleFile(file);
  }
});

resultsSection.classList.add('hidden');
showStatus('Hazır. PDF yüklediğinizde otomatik analiz başlayacak.');
