const promptInput = document.getElementById('promptInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const categorySelect = document.getElementById('categorySelect');
const scoreBadge = document.getElementById('scoreBadge');
const scoreMessage = document.getElementById('scoreMessage');
const weaknessList = document.getElementById('weaknessList');
const suggestionText = document.getElementById('suggestionText');

function scorePrompt(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  let score = 0;
  const issues = [];

  if (!trimmed) {
    issues.push('Önce bir prompt yazmalısın. Boş prompta AI bile trip atar 😅');
    return { score, issues, suggestion: '' };
  }

  if (words >= 12) score += 25;
  else issues.push('Prompt biraz kısa. En az 12+ kelime ile niyetini açmayı dene.');

  const intentWords = ['anlat', 'yaz', 'oluştur', 'açıkla', 'karşılaştır', 'listele', 'özetle', 'kod'];
  if (intentWords.some((w) => trimmed.toLowerCase().includes(w))) score += 20;
  else issues.push('Amaç net değil. Ne istediğini fiille belirt: “açıkla”, “listele”, “kodla” gibi.');

  if (/[0-9]/.test(trimmed) || ['madde', 'adım', 'örnek'].some((w) => trimmed.toLowerCase().includes(w))) {
    score += 20;
  } else {
    issues.push('Detay seviyesi düşük. Sayı, adım, örnek veya format beklentisi ekleyebilirsin.');
  }

  if (['seviyesinde', 'öğrenci', 'çocuk', 'başlangıç'].some((w) => trimmed.toLowerCase().includes(w))) {
    score += 15;
  } else {
    issues.push('Hedef kitle/ton yok. Kime göre anlatılacağını yazarsan sonuç çok iyileşir.');
  }

  if (['kısa', 'uzun', 'tablo', 'başlık', 'json', 'markdown'].some((w) => trimmed.toLowerCase().includes(w))) {
    score += 20;
  } else {
    issues.push('Çıktı formatı belirsiz. “3 madde”, “tablo”, “kısa özet” gibi format ekle.');
  }

  return { score: Math.min(score, 100), issues, suggestion: buildSuggestion(trimmed) };
}

function buildSuggestion(text) {
  const categoryHints = {
    general: 'konuyu açık ve ölçülebilir şekilde işle',
    story: 'karakter, ortam ve duygu tonunu belirt',
    code: 'dil, giriş/çıkış ve örnek kullanım ekle',
    explanation: 'seviyeyi sade tutup örneklerle güçlendir',
    summary: 'özet uzunluğunu ve madde sayısını net yaz',
  };

  const selected = categorySelect.value;
  const hint = categoryHints[selected] || categoryHints.general;

  return `Aşağıdaki görevi yerine getir: "${text}". Lütfen ${hint}. Çıktıyı 4 maddede ver, her madde en fazla 2 cümle olsun ve sonunda kısa bir kontrol sorusu ekle.`;
}

function renderResult(result) {
  scoreBadge.textContent = `${result.score} / 100`;

  if (result.score >= 85) {
    scoreMessage.textContent = 'Harika! Bu prompt baya güçlü. Bir üst seviye için daha net kısıt ekleyebilirsin 🏆';
  } else if (result.score >= 60) {
    scoreMessage.textContent = 'İyi gidiyorsun! Birkaç dokunuşla çok daha iyi cevap alırsın 💪';
  } else {
    scoreMessage.textContent = 'Gelişim modu açık! Eksikleri tamamla, puanın hızla artar 🎯';
  }

  weaknessList.innerHTML = '';
  if (!result.issues.length) {
    weaknessList.innerHTML = '<li>Eksik görünmüyor. Promptun net ve güçlü ✅</li>';
  } else {
    result.issues.forEach((issue) => {
      const li = document.createElement('li');
      li.textContent = issue;
      weaknessList.appendChild(li);
    });
  }

  suggestionText.textContent = result.suggestion || 'Öneri oluşturmak için bir prompt yazmalısın.';
}

analyzeBtn.addEventListener('click', () => {
  const result = scorePrompt(promptInput.value);
  renderResult(result);
});

clearBtn.addEventListener('click', () => {
  promptInput.value = '';
  scoreBadge.textContent = '0 / 100';
  scoreMessage.textContent = 'Hazırsan promptunu gönder, birlikte güçlendirelim.';
  weaknessList.innerHTML = '<li>Henüz analiz yapılmadı.</li>';
  suggestionText.textContent = 'Promptunu yazınca burada güçlendirilmiş bir sürüm önereceğim.';
});
