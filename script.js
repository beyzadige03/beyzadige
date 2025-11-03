const analysisForm = document.getElementById('analysisForm');
const promptInput = document.getElementById('promptInput');
const showBreakdownToggle = document.getElementById('showBreakdown');
const overallScoreElement = document.getElementById('overallScore');
const analysisIntro = document.getElementById('analysisIntro');
const analysisResults = document.getElementById('analysisResults');
const narrativeSummary = document.getElementById('narrativeSummary');
const criteriaContainer = document.getElementById('criteriaContainer');
const guidanceList = document.getElementById('guidanceList');
const revisedPromptElement = document.getElementById('revisedPrompt');
const copyPromptBtn = document.getElementById('copyPromptBtn');
const copyFeedback = document.getElementById('copyFeedback');
const resetBtn = document.getElementById('resetBtn');

const CRITERIA = [
  { id: 'clarity', label: 'Netlik ve Anlaşılırlık' },
  { id: 'purpose', label: 'Amaç Uyumu' },
  { id: 'context', label: 'Bağlam Sağlama' },
  { id: 'role', label: 'Rol Tanımı' },
  { id: 'tone', label: 'Üslup ve Ton' },
  { id: 'structure', label: 'Yapı ve Format' },
  { id: 'creativity', label: 'Yaratıcılık ve Özgünlük' },
  { id: 'logic', label: 'Mantıksal Akış' },
  { id: 'constraints', label: 'Kısıtlar ve Ölçülebilirlik' },
  { id: 'flexibility', label: 'Geliştirilebilirlik ve Esneklik' }
];

const improvementTips = {
  clarity: [
    'Belirsiz kelimeler yerine doğrudan fiiller ve net eylemler kullanın.',
    'İstenen çıktıyı bir cümlede özetleyip ardından detayları maddeleyin.',
    'Prompt’un başında görevi bir komut fiiliyle ifade edin (ör. “Analiz et”, “Tasarla”).'
  ],
  purpose: [
    'Yapay zekânın ne üretmesini istediğinizi sonuç formatıyla birlikte yazın.',
    'Prompt’un hedefini “Amaç:” gibi kısa bir açıklamayla belirgin hale getirin.',
    'Çıktının nasıl kullanılacağını eklemek amaç uyumunu güçlendirir.'
  ],
  context: [
    'Hedef kitleyi veya kullanım senaryosunu birkaç kelimeyle belirtin.',
    'Önemli arka plan bilgilerini kısa cümlelerle ekleyin.',
    'Prompt’unuza örnek ya da referans bir senaryo eklemeyi düşünün.'
  ],
  role: [
    '“Deneyimli bir eğitmen olarak” gibi rol talimatlarını kullanın.',
    'Uzmanın alanını ve deneyim seviyesini tarif ederek ses tonunu yönetin.',
    'Birden fazla perspektif gerekiyorsa her bir rolü ayrı belirtin.'
  ],
  tone: [
    'Yanıtın tonunu açıkça belirtin (resmi, samimi, mizahi vb.).',
    'Ton beklentisini güçlendirmek için “Nasıl hissettirmeli?” sorusunu yanıtlayın.',
    'Giriş ve kapanış tarzını (“ilham verici bir girişle başla”) ifade edin.'
  ],
  structure: [
    'Çıktının formatını (liste, tablo, madde vb.) açıkça söyleyin.',
    'Uzun metinleri başlıklar veya numaralı adımlarla düzenlemeyi isteyin.',
    'Önce analiz sonra öneri gibi sıralı görevleri netleştirin.'
  ],
  creativity: [
    'Prompt’unuza “X karakteri gibi anlat” veya “farklı bir metafor kullan” gibi yaratıcı kısıtlar ekleyin.',
    'Sıradışı bakış açıları ya da hikâyeleştirme isteyerek özgünlük katın.',
    'Analizden sonra ilginç bir uygulama örneği üretmesini talep edin.'
  ],
  logic: [
    '“Adım adım düşün” gibi yönlendirmelerle mantıksal akışı netleştirin.',
    'Önce analiz, sonra öneri şeklinde görev sırasını yazın.',
    'Gerekiyorsa numaralı adımlarla beklenen süreci tarif edin.'
  ],
  constraints: [
    'Kelime, süre veya çıktı sayısı gibi ölçülebilir sınırlar ekleyin.',
    '“En fazla 5 madde” gibi net limitler belirleyin.',
    'Dil veya araç kısıtlarını (yalnızca Türkçe, yalnızca markdown vb.) eklemeyi unutmayın.'
  ],
  flexibility: [
    'Geri bildirim sonrası revize edilebilir olduğuna dair bir cümle ekleyin.',
    '“Eğer bilgiler yetersizse sorular sor” gibi esneklik notları ekleyin.',
    'Alternatif öneri sunmasını talep ederek cevap çeşitliliğini artırın.'
  ]
};

const randomPhrases = {
  intro: [
    '🔍 Analiz tamamlandı. Sonuçlara hızlıca bakalım.',
    '🧠 Değerlendirme raporu hazır! Öne çıkan noktalar şöyle:',
    '📊 Promptunuzun detaylı incelemesi aşağıda.'
  ],
  strengthLead: [
    'Parladığınız kriterler:',
    'Güçlü taraflarınız özellikle şuralarda öne çıkıyor:',
    'Artı hanesine yazdığımız başlıklar:'
  ],
  improveLead: [
    'İyileştirme fırsatları ise şuralarda yoğunlaşıyor:',
    'Daha etkili olması için aşağıdaki alanlara odaklanın:',
    'Gelişim önerilerimiz:'
  ],
  outro: [
    '🎯 Her revizyonda bu kriterleri hatırlatıp daha tutarlı promptlar yazabilirsiniz.',
    '🚀 Bir sonraki denemede bu önerileri uygulayarak puanı kolayca yükseltebilirsiniz.',
    '✨ Aynı promptu ufak dokunuşlarla tekrar gönderip ilerlemeyi takip edebilirsiniz.'
  ]
};

const roleOptions = [
  'deneyimli bir içerik stratejisti',
  'kıdemli bir ürün yöneticisi',
  'başarılı bir edebiyat öğretmeni',
  'hikâye anlatıcılığı uzmanı',
  'tecrübeli bir kullanıcı deneyimi araştırmacısı',
  'büyüme odaklı bir pazarlama danışmanı'
];

const formatOptions = [
  'numaralı adımlar halinde',
  'başlıklar ve alt başlıklar kullanarak',
  'tablo ve kısa açıklamalarla',
  'madde işaretli listeler şeklinde',
  'kısa paragraflarla'
];

const toneOptions = [
  'samimi ve ilham verici bir tonla',
  'resmi ve akademik bir dilde',
  'mizahi ama öğretici bir tavırla',
  'analitik ve sonuç odaklı bir üslupta'
];

const flexibilityOptions = [
  'Eksik bilgiler varsa bana soru sor.',
  'Önerilerini iki farklı yaklaşım olarak sun.',
  'Geri bildirimime göre revize etmeye hazır ol.',
  'Uygun görürsen ek kaynak önerileri ekle.'
];

function clamp(value, min = 0, max = 10) {
  return Math.max(min, Math.min(max, Number.isFinite(value) ? value : min));
}

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function computeFeatures(rawText) {
  const text = rawText.trim();
  const lower = text.toLowerCase();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const sentences = text ? text.split(/[.!?¿¡…\n]+/).filter((part) => part.trim().length > 0) : [];
  const hasPattern = (pattern) => pattern.test(lower);

  const hasNumbers = /\d/.test(text);
  const ambiguous = /(bir\s+şey|herhangi|vs\.?|vesaire|şeyler|neyse)/i.test(text);
  const hasPurpose = hasPattern(/(yaz|hazırla|oluştur|analiz et|değerlendir|planla|açıkla|tartış)/);
  const hasRole = hasPattern(/(olarak|rolünde|rolüyle|as\s+a|gibi davran)/);
  const hasTone = hasPattern(/(ton|tonta|samimi|resmi|akademik|mizahi|friendly|formal|casual|resmî|sıcak)/);
  const hasFormat = hasPattern(/(liste|madde|tablo|tabular|markdown|başlık|paragraf|format|bullet|outline)/);
  const hasContext = hasPattern(/(için|amacıyla|hedef|kitle|durum|senaryo|bağlam|context|platform|projeye)/);
  const hasAudience = hasPattern(/(hedef kitle|kullanıcı|müşteri|ogrenci|öğrenci|yönetici|ekip|yatırımcı|ebeveyn|yetişkin|genç|çocuk)/);
  const hasCreativeCue = hasPattern(/(hikaye|hikâye|metafor|rol yap|hayal et|imagine|tarihi|kurgusal|farklı bakış|yaratıcı|benzersiz|karakter)/);
  const hasStepCue = hasPattern(/(adım adım|step by step|önce|sonra|aşama|plan|süreci|madde madde)/);
  const hasConstraint = hasNumbers && hasPattern(/(kelime|cümle|dakika|min|gün|sayfa|paragraf|madde|metin|limit|en az|en fazla|en çok|max|min)/);
  const hasFlexibility = hasPattern(/(gerekirse|dilersen|alternatif|revize|geri bildirim|feedback|esnek|isteğe|opsiyonel)/);
  const hasExampleCue = hasPattern(/(örnek|template|model|kılavuz)/);
  const hasQuestion = /\?$/.test(text) || text.includes('?');
  const numberedList = hasPattern(/(1\.|2\.|3\.|\ba\)|\bb\)|\b-\s)/);

  return {
    text,
    lower,
    wordCount: words.length,
    sentenceCount: sentences.length,
    characterCount: text.length,
    ambiguous,
    hasPurpose,
    hasRole,
    hasTone,
    hasFormat,
    hasContext,
    hasAudience,
    hasCreativeCue,
    hasStepCue,
    hasConstraint,
    hasFlexibility,
    hasExampleCue,
    hasNumbers,
    hasQuestion,
    numberedList
  };
}

const evaluators = {
  clarity: (f) => {
    let score = 2;
    if (f.wordCount > 40) score += 4;
    else if (f.wordCount > 25) score += 3;
    else if (f.wordCount > 12) score += 2;
    if (f.sentenceCount >= 2) score += 1.5;
    if (f.hasPurpose) score += 1.5;
    if (f.ambiguous) score -= 2.5;
    if (!f.text) score = 0;
    score = clamp(score);
    const detail = f.ambiguous
      ? 'Bazı ifadeler belirsiz kaldı; daha net komutlar işe yarar.'
      : f.hasPurpose
        ? 'Görev tanımınız net, ifadeler anlaşılır.'
        : 'Temel komut mevcut ancak daha net hedeflerle güçlendirilebilir.';
    return { score, detail };
  },
  purpose: (f) => {
    let score = 2;
    if (f.hasPurpose) score += 4.5;
    if (f.hasContext) score += 1.5;
    if (f.hasExampleCue || f.hasQuestion) score += 1;
    if (f.wordCount > 60) score += 0.5;
    score = clamp(score);
    const detail = f.hasPurpose
      ? 'İstenen çıktı türü anlaşılır biçimde ifade edilmiş.'
      : 'Amaç daha belirgin hale getirildiğinde model daha doğru yanıt verir.';
    return { score, detail };
  },
  context: (f) => {
    let score = 1.5;
    if (f.hasContext) score += 3;
    if (f.hasAudience) score += 2.5;
    if (f.hasExampleCue) score += 1.5;
    if (f.wordCount > 70) score += 1;
    score = clamp(score);
    const detail = f.hasContext
      ? 'Bağlam bilgisi eklenmiş; hedef anlaşılır.'
      : 'Kullanım senaryosu veya hedef kitleyi eklemek bağlamı güçlendirir.';
    return { score, detail };
  },
  role: (f) => {
    let score = 1;
    if (f.hasRole) score += 6;
    if (f.hasRole && f.hasTone) score += 1.5;
    if (f.wordCount > 35) score += 0.5;
    score = clamp(score);
    const detail = f.hasRole
      ? 'Modelin hangi perspektiften yanıt vereceği belirtilmiş.'
      : 'Bir rol veya uzmanlık seviyesi tanımlamak yanıtı daha tutarlı kılar.';
    return { score, detail };
  },
  tone: (f) => {
    let score = 1;
    if (f.hasTone) score += 5.5;
    if (f.hasTone && f.hasRole) score += 1;
    if (f.hasTone && f.hasContext) score += 0.5;
    score = clamp(score);
    const detail = f.hasTone
      ? 'Beklenen ton ve üslup belirtilmiş.'
      : 'Yanıtın duygusunu veya resmiyet seviyesini eklemek iyi olur.';
    return { score, detail };
  },
  structure: (f) => {
    let score = 1.5;
    if (f.hasFormat) score += 4;
    if (f.hasStepCue) score += 2;
    if (f.numberedList) score += 1;
    if (f.wordCount > 50) score += 0.5;
    score = clamp(score);
    const detail = f.hasFormat
      ? 'Çıktının nasıl yapılandırılacağı tarif edilmiş.'
      : 'Cevap biçimini (liste, tablo vb.) belirtmek sonuçları keskinleştirir.';
    return { score, detail };
  },
  creativity: (f) => {
    let score = 2;
    if (f.hasCreativeCue) score += 4.5;
    if (f.hasRole) score += 1;
    if (f.hasTone) score += 0.5;
    if (f.hasStepCue) score += 0.5;
    score = clamp(score);
    const detail = f.hasCreativeCue
      ? 'Prompt yaratıcı yönlendirmeler içeriyor.'
      : 'Yaratıcı bir bakış açısı veya metafor talebi eklemek özgünlüğü artırır.';
    return { score, detail };
  },
  logic: (f) => {
    let score = 1.5;
    if (f.hasStepCue) score += 4.5;
    if (f.hasFormat) score += 1.5;
    if (f.sentenceCount >= 3) score += 1;
    if (f.numberedList) score += 0.5;
    score = clamp(score);
    const detail = f.hasStepCue
      ? 'Mantıksal akış adım adım yönlendirilmiş.'
      : 'Görev sırasını açıklamak yanıtın planlı ilerlemesini sağlar.';
    return { score, detail };
  },
  constraints: (f) => {
    let score = 1;
    if (f.hasConstraint) score += 5.5;
    if (f.hasNumbers) score += 1;
    if (f.hasFormat) score += 0.5;
    score = clamp(score);
    const detail = f.hasConstraint
      ? 'Net ölçülebilir kısıtlar eklenmiş.'
      : 'Kelime, süre veya format limitleri eklemek ölçülebilirlik sağlar.';
    return { score, detail };
  },
  flexibility: (f) => {
    let score = 2;
    if (f.hasFlexibility) score += 4.5;
    if (f.hasQuestion) score += 1;
    if (f.hasStepCue) score += 0.5;
    score = clamp(score);
    const detail = f.hasFlexibility
      ? 'Geri bildirim ve revizyon notlarıyla esneklik sağlanmış.'
      : 'Gerektiğinde soru sormasını veya alternatif önermesini isteyin.';
    return { score, detail };
  }
};

function buildCriterionCard({ id, label, score, detail }) {
  const card = document.createElement('article');
  card.className = 'criteria-card';
  if (score <= 0) {
    card.setAttribute('data-empty', 'true');
  }

  const header = document.createElement('header');
  const title = document.createElement('h3');
  title.textContent = label;
  const value = document.createElement('span');
  value.className = 'score';
  if (score >= 8) value.classList.add('high');
  else if (score >= 5) value.classList.add('mid');
  else value.classList.add('low');
  value.textContent = score.toFixed(1);
  header.append(title, value);

  const paragraph = document.createElement('p');
  paragraph.textContent = detail;

  card.append(header, paragraph);
  return card;
}

function createNarrative(summary, strengths, improvements) {
  const fragments = [];
  fragments.push(`<p>${summary}</p>`);

  if (strengths.length) {
    const lead = pickRandom(randomPhrases.strengthLead);
    fragments.push(`<p><strong>${lead}</strong> ${strengths.join(', ')}.</p>`);
  }

  if (improvements.length) {
    const lead = pickRandom(randomPhrases.improveLead);
    fragments.push(`<p><strong>${lead}</strong> ${improvements.join(', ')}.</p>`);
  }

  fragments.push(`<p>${pickRandom(randomPhrases.outro)}</p>`);
  return fragments.join('');
}

function generateGuidanceItems(results) {
  guidanceList.innerHTML = '';
  const weakPoints = results.filter((item) => item.score < 7).sort((a, b) => a.score - b.score);
  const selection = weakPoints.length ? weakPoints : results.slice(0, 2);

  selection.forEach((item) => {
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = `${item.label} (${item.score.toFixed(1)}/10)`;
    li.appendChild(strong);
    const tipPool = improvementTips[item.id] || ['Bu alanı güçlendirmek için daha fazla örnek ekleyin.'];
    li.appendChild(document.createTextNode(pickRandom(tipPool)));
    guidanceList.appendChild(li);
  });
}

function composeRevisedPrompt(features, results) {
  const baseSentence = features.text.split(/[.!?\n]/).find((part) => part.trim().length > 0) || 'verilen konuda bilgi paylaş';
  const trimmedGoal = baseSentence.trim();
  const role = pickRandom(roleOptions);
  const format = pickRandom(formatOptions);
  const tone = pickRandom(toneOptions);
  const flexibility = pickRandom(flexibilityOptions);
  const targetLength = features.hasConstraint
    ? 'Belirttiğim sınırları koru.'
    : 'Yanıtı 3 kısa paragrafı geçmeyecek şekilde tut.';

  const extras = [];
  if (!features.hasStepCue) {
    extras.push('Önce kısa bir durum analizi yap, ardından önerilerini sun.');
  }
  if (!features.hasAudience) {
    extras.push('Hedef kitlenin özelliklerini ilk paragrafta vurgula.');
  }
  if (!features.hasTone) {
    extras.push('Tonun boyunca seçtiğin duyguyu tutarlı sürdür.');
  }

  const revised = ` ${trimmedGoal.charAt(0).toUpperCase()}${trimmedGoal.slice(1)}\n- ${role} olarak yanıt ver.\n- Çıktıyı ${format} paylaş ve ${tone}.\n- ${targetLength}\n- ${flexibility}${extras.length ? `\n- ${extras.join('\n- ')}` : ''}`.trim();

  revisedPromptElement.textContent = revised;
}

function buildAnalysis(text) {
  const features = computeFeatures(text);
  const results = CRITERIA.map((criterion) => {
    const evaluation = evaluators[criterion.id](features);
    return { ...criterion, ...evaluation };
  });

  const overallScore = clamp(results.reduce((total, item) => total + item.score, 0), 0, 100);
  const strengths = results.filter((item) => item.score >= 8).map((item) => item.label);
  const improvementAreas = results.filter((item) => item.score < 7).map((item) => item.label);

  const intro = pickRandom(randomPhrases.intro);
  const summary = `${intro} Genel puanınız <strong>${overallScore.toFixed(1)}</strong>.`;
  narrativeSummary.innerHTML = createNarrative(summary, strengths, improvementAreas);

  criteriaContainer.innerHTML = '';
  results.forEach((item) => {
    criteriaContainer.appendChild(buildCriterionCard(item));
  });

  generateGuidanceItems(results);
  composeRevisedPrompt(features, results);

  return overallScore;
}

analysisForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = promptInput.value.trim();
  if (!text) {
    promptInput.focus();
    return;
  }

  const score = buildAnalysis(text);
  overallScoreElement.textContent = score.toFixed(1);
  analysisIntro.classList.add('hidden');
  analysisResults.classList.remove('hidden');
  copyFeedback.textContent = '';
  toggleBreakdown(showBreakdownToggle.checked);
});

showBreakdownToggle.addEventListener('change', (event) => {
  toggleBreakdown(event.target.checked);
});

function toggleBreakdown(visible) {
  if (visible) {
    criteriaContainer.classList.remove('hidden');
  } else {
    criteriaContainer.classList.add('hidden');
  }
}

copyPromptBtn.addEventListener('click', async () => {
  const content = revisedPromptElement.textContent.trim();
  if (!content) {
    copyFeedback.textContent = 'Kopyalanacak içerik yok.';
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    copyFeedback.textContent = 'Örnek prompt panoya kopyalandı.';
    setTimeout(() => {
      copyFeedback.textContent = '';
    }, 2200);
  } catch (error) {
    copyFeedback.textContent = 'Panoya kopyalama başarısız oldu.';
  }
});

resetBtn.addEventListener('click', () => {
  overallScoreElement.textContent = '–';
  analysisIntro.classList.remove('hidden');
  analysisResults.classList.add('hidden');
  narrativeSummary.innerHTML = '';
  criteriaContainer.innerHTML = '';
  guidanceList.innerHTML = '';
  revisedPromptElement.textContent = '';
  copyFeedback.textContent = '';
});

// ilk yüklemede breakdown görünür olsun
toggleBreakdown(showBreakdownToggle.checked);
