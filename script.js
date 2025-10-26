const promptInput = document.getElementById('promptInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const helper = document.getElementById('helper');
const feedback = document.getElementById('feedback');
const analysisList = document.getElementById('analysisList');
const tipsList = document.getElementById('tips');
const suggestionBox = document.getElementById('suggestion');
const aiCommentBox = document.getElementById('aiComment');
const scoreValue = document.getElementById('scoreValue');
const scoreLabel = document.getElementById('scoreLabel');
const progressBar = document.getElementById('progressBar');

const actionVerbs = [
  'açıkla', 'analiz', 'karşılaştır', 'listele', 'özetle', 'tasarla', 'üret', 'oluştur',
  'araştır', 'planla', 'öner', 'değerlendir', 'hesapla', 'tasnif et', 'yorumla', 'bul'
];

const contextWords = [
  'için', 'hakkında', 'üzerine', 'adımlar', 'detaylı', 'özgün', 'örnek', 'adım adım',
  'nasıl', 'neden', 'amacı', 'bağlam', 'senaryo', 'hedef'
];

const outputHints = ['madde', 'liste', 'tablo', 'plan', 'özet', 'öneri', 'ipucu', 'ipuçları'];

function resetState() {
  promptInput.classList.remove('error');
  helper.classList.remove('error');
  helper.textContent = 'Sorunu yapay zekânın anlayacağı şekilde yazmaya çalış.';
}

function setError(message) {
  promptInput.classList.add('error');
  helper.classList.add('error');
  helper.textContent = message;
  feedback.classList.add('hidden');
}

function analysePrompt(prompt) {
  const cleanPrompt = prompt.trim();
  const words = cleanPrompt.split(/\s+/).filter(Boolean);
  const wordCount = cleanPrompt ? words.length : 0;

  if (wordCount < 2) {
    return { valid: false, error: 'Promptun çok kısa. En az 2 kelime kullanmayı dene.' };
  }

  if (wordCount > 10) {
    return { valid: false, error: 'Promptun çok uzun. 10 kelimeyi geçmeyecek şekilde sadeleştir.' };
  }

  let score = 50;
  const analysis = [];
  const tips = [];

  const hasQuestionMark = /\?/.test(cleanPrompt);
  const hasContext = contextWords.some((word) => cleanPrompt.toLowerCase().includes(word));
  const hasActionVerb = actionVerbs.some((verb) => cleanPrompt.toLowerCase().includes(verb));
  const hasOutputHint = outputHints.some((hint) => cleanPrompt.toLowerCase().includes(hint));
  const hasWho = /(öğrenci|uzman|çocuk|lise|uzaya|öğretmen|mühendis|doktor)/i.test(cleanPrompt);
  const hasPrecision = /(tarihini|sayısını|karşılaştır|adım adım|detaylı|örnek)/i.test(cleanPrompt);

  const idealWordBonus = Math.max(0, 18 - Math.abs(6 - wordCount) * 4);
  score += idealWordBonus;

  analysis.push(`Kelime sayısı ${wordCount}. 5-8 arası jüriyi en çok etkileyen aralık.`);

  if (hasActionVerb) {
    score += 10;
    analysis.push('Yapay zekâya net bir görev veriyorsun. Bu harika!');
  } else {
    tips.push('Cümleye bir eylem fiili ekle: "açıkla", "özetle", "listele" gibi.');
    analysis.push('Promptunda doğrudan eylem çağrısı eksik, görev netliği düşüyor.');
  }

  if (hasContext) {
    score += 10;
    analysis.push('Bağlam eklemişsin, yapay zekâ konuyu daha iyi kavrar.');
  } else {
    tips.push('Sorunun neden önemli olduğunu kısaca belirt. "... için" kalıbı çok işe yarar.');
    analysis.push('Bağlam zayıf. Bir hedef, kitle ya da amaç eklemek promptu güçlendirir.');
  }

  if (hasOutputHint) {
    score += 7;
    analysis.push('Beklediğin çıktı tipini yazmışsın, bu büyük avantaj.');
  } else {
    tips.push('Çıktının formatını söyle: "3 madde", "kısa plan", "liste" gibi.');
  }

  if (hasQuestionMark) {
    score += 3;
    analysis.push('Soru formatı iletişimi güçlendiriyor.');
  }

  if (hasWho) {
    score += 5;
    analysis.push('Hedef kitleyi işaretlemen yapay zekâya ton ve seviye hakkında ipucu veriyor.');
  } else {
    tips.push('Yanıt kimin için? Öğrenci, öğretmen, jüri... belirtirsen cevap daha isabetli olur.');
  }

  if (hasPrecision) {
    score += 5;
    analysis.push('Özel bir beklenti (tarih, sayı veya yöntem) belirtmişsin.');
  } else {
    tips.push('Tek bir ihtiyaca odaklan: bir sayı, karşılaştırma ya da "adım adım" iste.');
  }

  score = Math.min(100, Math.max(0, Math.round(score)));

  const levelLabel = getScoreLabel(score);
  const aiComment = buildAIComment(score, wordCount, hasContext, hasActionVerb);
  const suggestion = buildSuggestion(words);

  return {
    valid: true,
    score,
    levelLabel,
    analysis,
    tips: [...new Set(tips)].slice(0, 4),
    suggestion,
    aiComment,
    wordCount
  };
}

function getScoreLabel(score) {
  if (score >= 85) {
    return 'Jüri Dostu Usta 🎯';
  }
  if (score >= 70) {
    return 'Meraklı Kâşif 🚀';
  }
  if (score >= 55) {
    return 'Yükselen Yıldız ✨';
  }
  return 'İlk Adımlar 🌱';
}

function buildAIComment(score, wordCount, hasContext, hasActionVerb) {
  if (score >= 85) {
    return 'Bu prompt tam jüri toplantısında kullanılacak cinsten! Net, öz ve etkili.';
  }
  if (score >= 70) {
    return 'Çok iyi gidiyorsun. Biraz daha bağlam ve hedef ekleyebilirsen seviye atlayacaksın.';
  }
  if (score >= 55) {
    const needsContext = !hasContext ? ' Bağlam ekleyerek soruyu derinleştir.' : '';
    const needsVerb = !hasActionVerb ? ' Güçlü bir eylem fiili seçmeyi dene.' : '';
    return `Potansiyelin yüksek!${needsContext}${needsVerb}`;
  }
  if (wordCount <= 3) {
    return 'Mini bir cümle olmuş. Yapay zekâ ne istediğini çıkaramayabilir. Biraz detay ekleyelim.';
  }
  return 'Bu hâliyle belirsiz. Bir amaç ve çıktı tarifi ekleyerek yapay zekâya pusula verebilirsin.';
}

function buildSuggestion(words) {
  if (!words.length) {
    return 'Örneğin: "Solar enerji verimini artırma yollarını 3 maddeyle açıkla" gibi net bir görev verebilirsin.';
  }

  const firstWord = words[0].toLowerCase();
  const topic = words.slice(1).join(' ');
  const action = actionVerbs.find((verb) => firstWord.includes(verb)) || 'açıkla';
  const richerTopic = topic || 'TÜBİTAK 4006B proje posteri sunumu';

  return `${capitalize(action)} ${richerTopic} için jüriye uygun 3 maddelik bir özet hazırla.`;
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function renderFeedback(result) {
  scoreValue.textContent = result.score;
  scoreLabel.textContent = result.levelLabel;
  progressBar.style.width = `${result.score}%`;
  analysisList.innerHTML = '';
  tipsList.innerHTML = '';

  result.analysis.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    analysisList.appendChild(li);
  });

  result.tips.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  suggestionBox.textContent = result.suggestion;
  aiCommentBox.textContent = result.aiComment;

  feedback.classList.remove('hidden');
}

analyzeBtn.addEventListener('click', () => {
  resetState();
  const prompt = promptInput.value;
  const result = analysePrompt(prompt);

  if (!result.valid) {
    setError(result.error);
    return;
  }

  renderFeedback(result);
});

promptInput.addEventListener('input', () => {
  if (promptInput.classList.contains('error')) {
    resetState();
  }
});
