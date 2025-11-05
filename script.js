const lessonModules = [
  {
    id: 'lines',
    title: 'Modül 1 · Çizgi Kontrolü',
    duration: '40 dk',
    focus: ['Kalem hakimiyeti', 'Sürekli çizgi', 'Ton skalası'],
    milestone: 'Moda figürünün temel hareket çizgilerini kontrollü çizebileceksin.',
    workbook: 'https://cdn.design.tutsplus.com/uploads/2017/03/fashion-sketching-template.pdf',
    steps: [
      {
        id: 'toolkit',
        title: 'Malzeme ve duruş hazırlığı',
        stage: 'Isınma',
        description: 'Masanı düzenle, kalem tutuşunu ayarla ve kısa süreli çizgi ısınmaları yap.',
        checklist: [
          '2B veya 4B kurşun kalem ile rahat bir tutuş dene',
          'Omuzdan çizgi atabilmek için bileği serbest bırak',
          'A4 kâğıtta 30 saniyelik sürekli çizgi egzersizi yap'
        ],
        tips: [
          'Çizgi basıncını sabitlemek için kalemi orta noktadan tutmaya çalış.',
          'Kolu masaya tamamen yaslamadan omuzdan gelen hareketi hisset.'
        ],
        outcome: 'Çizgi ağırlığını kontrol ederek daha uzun ve titreşimsiz çizgiler atarsın.',
        resources: [
          { label: 'Tasarımcılar için doğru kalem tutuşu', url: 'https://www.youtube.com/watch?v=q1j8OgJqfYw', type: 'video' }
        ]
      },
      {
        id: 'long-lines',
        title: '9 baş boyu kılavuz çizimi',
        stage: 'Temel',
        description: 'Moda figüründe kullanılan standart orana göre dikey aks çizgilerini oluştur.',
        checklist: [
          'Dikey merkez çizgisini sayfaya yerleştir',
          'Baş yüksekliğini ölçerek 9 eşit bölüm işaretle',
          'Omuz, bel, kalça hizalarını hafif çizgilerle bağla'
        ],
        tips: [
          'Çizgileri önce çok hafif basınçla at, daha sonra gerektikçe güçlendir.',
          'Cetvel kullanmak yerine serbest el pratiği daha hızlı gelişmeni sağlar.'
        ],
        outcome: 'Figürün yüksekliği ve hizaları sabit bir ölçüye kavuşur.',
        resources: [
          { label: '9-head fashion proportion guide', url: 'https://www.pinterest.com/pin/165367236083887036/', type: 'şablon' }
        ]
      },
      {
        id: 'flow-line',
        title: 'Hareket çizgisi arayışı',
        stage: 'Temel',
        description: 'Figürün ağırlık merkezini belirleyen akış çizgisini bul.',
        checklist: [
          'Poz seç ve ağırlık ayağını not al',
          'Omurgayı temsil eden tek akıcı çizgiyi çiz',
          'Baş ve ayak hizalarını akış çizgisine göre yerleştir'
        ],
        tips: [
          'Hareket çizgisi figürün enerjisini belirler; tek hamlede çizmekten çekinme.',
          'Çizgiyi dizler ve kalça ile hafif kırarak poz hissini ver.'
        ],
        outcome: 'Figürün duruş yönü ve enerjisi doğru aktarılır.',
        resources: [
          { label: 'Gesture drawing for fashion designers', url: 'https://design.tutsplus.com/tutorials/gesture-drawing-for-fashion--cms-26609', type: 'makale' }
        ]
      },
      {
        id: 'tonal-scales',
        title: 'Ton skalası',
        stage: 'Pekiştirme',
        description: 'Aynı kalemle 5 ton elde ederek gölgelere hazırlık yap.',
        checklist: [
          'Açık tondan koyuya doğru beş kutu çiz',
          'Her kutuyu farklı basınçla doldur',
          'Çizgileri aynı yönde ve ritmik tut'
        ],
        tips: [
          'Omuz hareketini kullanarak hatları üst üste bindir, böylece doku yumuşar.',
          'Ton geçişlerinde kalemi hafif döndürerek grafiti eşit dağıt.'
        ],
        outcome: 'Giysi gölgelendirmelerinde ton kontrolü kurulur.',
        resources: [
          { label: 'Shade practice worksheet', url: 'https://www.drawinghowtodraw.com/drawing-lessons/learning-how-to-draw/shading/worksheet.pdf', type: 'pdf' }
        ]
      }
    ]
  },
  {
    id: 'proportion',
    title: 'Modül 2 · İskelet ve Oran',
    duration: '55 dk',
    focus: ['Gestür çizimi', 'Oran ilişkisi', 'Ağırlık dağılımı'],
    milestone: 'Gestür çizimini anatomi bloklarına dönüştürerek modaya uygun oranları yerleştirirsin.',
    workbook: 'https://images.squarespace-cdn.com/content/v1/54f0b588e4b0f2fe5bc1f66a/1525376839405-5YH27AAZAHH7YCNHPUUN/Fashion+Figure+Templates.pdf',
    steps: [
      {
        id: 'gesture',
        title: '30 saniyelik gestür serisi',
        stage: 'Isınma',
        description: 'Hızlı gestürler çizerek figürdeki hareket enerjisini yakala.',
        checklist: [
          '3 farklı poz seç',
          'Her poz için maksimum 30 saniye kullan',
          'Çizgileri tek hamlede bitirmeye odaklan'
        ],
        tips: [
          'Zamanlayıcı kurarak çizgilerini bilinçli hızlandır.',
          'Bütün poz boyunca kalemi kaldırmadan çizgiyi dolaştır.'
        ],
        outcome: 'Figürün hareket yönünü hızlı ve doğru yakalarsın.',
        resources: [
          { label: 'Gesture pose tool', url: 'https://line-of-action.com/practice-tools/figure-drawing', type: 'uygulama' }
        ]
      },
      {
        id: 'balance',
        title: 'Ağırlık dengesi analizi',
        stage: 'Temel',
        description: 'Karşı ayak ve kalça dengesini ayarlayarak figürü yere bastır.',
        checklist: [
          'Omuz ve kalça çizgilerinin eğimini karşılaştır',
          'Destek ayağını dikey aksa hizala',
          'Serbest ayağı hafifçe dışa çevir'
        ],
        tips: [
          'Kalça çizgisini destek ayağına doğru düşürerek ağırlık hissi ver.',
          'Omuz çizgisini ters açıya getirerek contrapposto etkisi yarat.'
        ],
        outcome: 'Figürün ağırlık merkezi dengeli görünür.',
        resources: [
          { label: 'Contrapposto breakdown', url: 'https://www.pinterest.com/pin/contrapposto-drawing-guide/', type: 'makale' }
        ]
      },
      {
        id: 'block-in',
        title: 'Bloklama yöntemi',
        stage: 'Temel',
        description: 'Gövdeyi geometrik bloklara bölerek hacim ve yön verir.',
        checklist: [
          'Göğüs kafesi için hafif perspektifli bir kutu çiz',
          'Pelvis için ters yönde ikinci kutu ekle',
          'Kutuları gestür çizgisi üzerinden birleştir'
        ],
        tips: [
          'Kutuların ön yüzlerini hafifçe koyulaştır, arka yüzleri açık bırak.',
          'Kutu perspektifini belirlerken ufuk çizgisine karar ver.'
        ],
        outcome: 'Gövdede hacim ve perspektif hissi oluşur.',
        resources: [
          { label: 'Figure drawing block-in', url: 'https://www.youtube.com/watch?v=2r9pQh4BoXo', type: 'video' }
        ]
      },
      {
        id: 'limbs',
        title: 'Kollar ve bacak oranı',
        stage: 'Pekiştirme',
        description: 'Uzun kollar ve bacaklarla moda figürünün uzatılmış proporsiyonunu uygula.',
        checklist: [
          'Üst kolu 2 baş yüksekliği, alt kolu 1.5 baş yüksekliği olarak hizala',
          'Bacakları diz üstünde hafif uzat',
          'El ve ayak boyunu incele ve ayarla'
        ],
        tips: [
          'Diz çizgisini merkez çizgiye paralel tutarak bacak uzunluğunu hisset.',
          'Ellerin uçlarını uyluk ortasına denk getir.'
        ],
        outcome: 'Moda figürünün zarif ve uzun oranları oluşur.',
        resources: [
          { label: 'Fashion limbs proportion chart', url: 'https://www.pinterest.com/pin/160300067961663986/', type: 'şablon' }
        ]
      },
      {
        id: 'silhouette-variations',
        title: 'Üç siluet varyasyonu',
        stage: 'Proje',
        description: 'Aynı ölçülerle üç farklı pozisyonda figür üret.',
        checklist: [
          'Farklı ağırlık dağılımlarını dene',
          'Bir pozda hafif yürüyüş hareketi ver',
          'Siluetleri tek sayfada karşılaştır'
        ],
        tips: [
          'Silüeti kontrol etmek için figürü gölgeli kütle şeklinde düşün.',
          'Her pozun negatif alanlarını kıyasla.'
        ],
        outcome: 'Çeşitli pozlarla proporsiyon becerini pekiştirirsin.',
        resources: [
          { label: 'Fashion silhouette inspiration', url: 'https://fashionary.org/blogs/tutorials', type: 'galeri' }
        ]
      }
    ]
  },
  {
    id: 'garment',
    title: 'Modül 3 · Hacim ve Giysi Yerleşimi',
    duration: '65 dk',
    focus: ['Drapaj mantığı', 'Hacim', 'Kumaş akışı'],
    milestone: 'Figür üzerinde giysi formunu katmanlayıp hacim hissi verebilirsin.',
    workbook: 'https://assets-global.website-files.com/5f277480f1c1e6140f7a7901/6051d23329b8881fa5321f95_Fashion-Figure-Template.pdf',
    steps: [
      {
        id: 'anatomy-overview',
        title: 'Anatomi üstünden yüzey taraması',
        stage: 'Isınma',
        description: 'Kas gruplarını hafif çizgilerle belirleyerek giysi oturuşunu planla.',
        checklist: [
          'Omuzdan bileğe çizgisel kas yönleri ekle',
          'Göğüs ve bel kıvrımlarını işaretle',
          'Kalça ve uylukta hacim çizgileri çiz'
        ],
        tips: [
          'Kas çizgilerini hafif tut, giysi çiziminde rehber olarak kullan.',
          'Kıvrım yönlerini ağırlık merkezine göre belirle.'
        ],
        outcome: 'Giysi çizgilerinin oturduğu anatomik yönleri okursun.',
        resources: [
          { label: 'Muscle map for fashion drawing', url: 'https://www.pinterest.com/pin/164663548782624973/', type: 'şablon' }
        ]
      },
      {
        id: 'drape',
        title: 'Temel drapaj kırışıkları',
        stage: 'Temel',
        description: 'Kumaşın ağırlıkla oluşturduğu U ve V kıvrımlarını uygula.',
        checklist: [
          'Kumaşın ağırlık noktalarını belirle',
          'Yer çekimi yönüne paralel çizgiler ekle',
          'Gevşek bölgelerde dalga formu oluştur'
        ],
        tips: [
          'Kırışıkların başlangıcını giysinin sıkıldığı noktalara yerleştir.',
          'U kıvrımları yumuşak kumaşı, V kıvrımları sert kumaşı anlatır.'
        ],
        outcome: 'Kumaşın davranışını çizgiyle aktarabilirsin.',
        resources: [
          { label: 'Fabric folds cheat sheet', url: 'https://www.proko.com/course-lesson/fabric-folds-cheat-sheet/assignments', type: 'pdf' }
        ]
      },
      {
        id: 'volume',
        title: 'Hacimsel giysi ekleme',
        stage: 'Temel',
        description: 'Figüre etek, ceket gibi hacimli parçalar ekleyerek silueti genişlet.',
        checklist: [
          'Giysinin ana formunu hafif geometrik blokla belirle',
          'Hacmi göstermek için iç ve dış çizgiler kullan',
          'Figürle giysi arasında boşluk bırakmayı unutma'
        ],
        tips: [
          'Giysi kenarlarında kalemi daha koyu bastır, iç çizgileri hafif tut.',
          'Eteklerde dış çizgiyi dalgalandırarak hareket ver.'
        ],
        outcome: 'Giysi ile figür arasındaki boşluk ve hacim ilişkisini kurarsın.',
        resources: [
          { label: 'Voluminous fashion sketches', url: 'https://www.youtube.com/watch?v=AE6Cec6gTnU', type: 'video' }
        ]
      },
      {
        id: 'texture',
        title: 'Doku ve detay',
        stage: 'Pekiştirme',
        description: 'Kumaş dokusu, dikiş ve aksesuar detaylarını seçerek çizime yerleştir.',
        checklist: [
          '3 farklı doku örneği belirle (ipek, denim, örgü vb.)',
          'Her doku için çizgi yönünü karar ver',
          'Aksesuar çizgilerini ana forma bağlı çiz'
        ],
        tips: [
          'Tekrarlayan çizgilerde ritmi bozmamak için kalemi kaldırmadan kısa seriler kullan.',
          'Dikiş çizgilerini hafif ton farkıyla belirginleştir.'
        ],
        outcome: 'Giysi üzerinde malzeme hissi oluşur.',
        resources: [
          { label: 'Textile rendering tips', url: 'https://fashionillustrationtribe.com/fashion-illustration-texture', type: 'makale' }
        ]
      },
      {
        id: 'color-pass',
        title: 'Hızlı renk geçişi',
        stage: 'Proje',
        description: 'Alkol bazlı marker veya dijital fırçayla tek renkli tonlama uygula.',
        checklist: [
          'Ana ışık yönünü belirle',
          'Açık-orta-koyu tonları ayrı katmanlarda boya',
          'Kenarları yumuşatmak için blender kullan'
        ],
        tips: [
          'Marker kullanıyorsan kağıdın altına ekstra sayfa koyarak taşmayı engelle.',
          'Gölge alanlarda çizgiyi takip eden firça darbeleri kullan.'
        ],
        outcome: 'Çizime hacim ve ışık hissi kazandırırsın.',
        resources: [
          { label: 'Marker rendering demo', url: 'https://www.youtube.com/watch?v=J5Xaj8hZ5OA', type: 'video' }
        ]
      }
    ]
  },
  {
    id: 'styling',
    title: 'Modül 4 · Stil ve Sunum',
    duration: '50 dk',
    focus: ['Silüet', 'Styling', 'Sunum sayfası'],
    milestone: 'Kendi koleksiyon hikâyeni figür üzerine taşıyıp sunuma hazır hale getirirsin.',
    workbook: 'https://fashion-sketches.com/wp-content/uploads/2020/04/Fashion-Portfolio-Template.pdf',
    steps: [
      {
        id: 'mood',
        title: 'Mood board analizi',
        stage: 'Hazırlık',
        description: 'İlham tahtandan öne çıkan üç ana unsuru (renk, form, doku) belirle.',
        checklist: [
          'Ana renk paletini seç',
          'İki ana siluet referansı çıkar',
          'Kullanacağın kumaş/doku notlarını al'
        ],
        tips: [
          'Mood boardu üç kelimeyle özetleyip çizim köşene yaz.',
          'Tekrar eden desenleri mood boarddan seçip figürde kullan.'
        ],
        outcome: 'Çizimlerin tutarlı bir hikâyeye bağlanır.',
        resources: [
          { label: 'Fashion mood board tips', url: 'https://www.vogue.com/article/how-to-create-a-fashion-mood-board', type: 'makale' }
        ]
      },
      {
        id: 'pose-design',
        title: 'Poz ve styling seçimi',
        stage: 'Temel',
        description: 'Koleksiyon ruhuna uygun pozu belirle ve aksesuarları kararlaştır.',
        checklist: [
          'Pozu jest çizgiyle hızlıca karala',
          'Giysi katmanlarını (üst, alt, dış giyim) not al',
          'Aksesuarların (çanta, ayakkabı, takı) yerini planla'
        ],
        tips: [
          'Pozu dramatize etmek için gövdeyi hafifçe S veya C formuna getir.',
          'Aksesuarların figürü bölmemesine dikkat et.'
        ],
        outcome: 'Styling, figürle bütünleşik bir hikâye sunar.',
        resources: [
          { label: 'Styling tips for illustration', url: 'https://fashionillustrationtribe.com/fashion-illustration-styling', type: 'makale' }
        ]
      },
      {
        id: 'lineart',
        title: 'Temiz lineart',
        stage: 'Pekiştirme',
        description: 'Tasarımını net çizgilerle tekrar çizerek sunuma hazırla.',
        checklist: [
          'Kaba eskizi hafifçe sil',
          'Tek darbede akıcı hatlar kullan',
          'Detayları (yaka, cep, pliseler) belirginleştir'
        ],
        tips: [
          'İç çizgileri daha açık tutarak derinlik ver.',
          'Kalem basıncını başlangıç ve bitişte hafiflet.'
        ],
        outcome: 'Çizim sunum kalitesine ulaşır.',
        resources: [
          { label: 'Clean lineart demo', url: 'https://www.youtube.com/watch?v=uxcGdBeyZ34', type: 'video' }
        ]
      },
      {
        id: 'presentation',
        title: 'Sunum sayfası düzeni',
        stage: 'Proje',
        description: 'Çizimini tipografi, renk blokları ve notlarla sunum sayfasına taşı.',
        checklist: [
          'Arka plan için iki tonlu basit blok oluştur',
          'Koleksiyon adını ve kısa notu ekle',
          'Alternatif detay çizimlerini küçük kutulara yerleştir'
        ],
        tips: [
          'Çizimi merkeze alırken beyaz boşluk bırakmayı unutma.',
          'Notları sol kenarda, teknik çizimleri sağ alt köşede toparla.'
        ],
        outcome: 'Tasarımların portföy formatında sunulur.',
        resources: [
          { label: 'Portfolio layout inspiration', url: 'https://www.behance.net/search/projects?search=fashion%20portfolio', type: 'galeri' }
        ]
      }
    ]
  }
];

const rubricCriteria = [
  {
    id: 'line',
    title: 'Çizgi hakimiyeti',
    description: 'Çizgilerin netliği, titreşimi ve amaçlı kullanımı.'
  },
  {
    id: 'proportion',
    title: 'Oran ve anatomi',
    description: '9 baş boyu, ağırlık dengesi ve eklem hizalarının doğruluğu.'
  },
  {
    id: 'volume',
    title: 'Hacim ve giysi yerleşimi',
    description: 'Giysi ile figür ilişkisi, doku ve katman hissi.'
  },
  {
    id: 'story',
    title: 'Stil hikâyesi',
    description: 'Mood board ile uyum, styling ve sunum dili.'
  }
];

const routineItems = [
  '5 dakikalık çizgi ısınması',
  '2 hızlı gestür çizimi',
  'Aktif modül adımı uygulaması',
  'Yüklediğin çizime göre düzeltme notu',
  '1 yeni referans incelemesi'
];

const resourceItems = [
  {
    title: 'Moda figürü anatomi kartı',
    description: 'Her baş yüksekliğine karşılık gelen kilit noktaları öğren.',
    type: 'pdf',
    link: 'https://fabulousfashionista.files.wordpress.com/2015/11/fashion-figure-template.pdf'
  },
  {
    title: 'Marker ile render teknikleri',
    description: 'Giysi gölgelendirmesine dair kısa video ders.',
    type: 'video',
    link: 'https://www.youtube.com/watch?v=F5GU5PSW9Lk'
  },
  {
    title: 'Stil hikâyesi çalışma sayfası',
    description: 'Mood board ve styling notlarını tek sayfada topla.',
    type: 'şablon',
    link: 'https://images.squarespace-cdn.com/content/v1/51a2973ae4b0e0d4d0e8f9ab/1397492763045-QOXYMP5BS9VXFDZSA7J9/Fashion+Story+Template.pdf'
  },
  {
    title: 'Online poz referansı',
    description: 'Farklı pozlar için zamanlayıcıyla çalış.',
    type: 'uygulama',
    link: 'https://line-of-action.com/'
  }
];

const metricDefinitions = [
  {
    id: 'lineQuality',
    label: 'Çizgi netliği',
    description: 'Sabit basınç, tutarlı çizgi yönü ve titreşim kontrolünü ölçer.'
  },
  {
    id: 'proportion',
    label: 'Oran dengesi',
    description: 'Figürün genişlik/yükseklik ilişkisi ve ağırlık merkezini analiz eder.'
  },
  {
    id: 'shading',
    label: 'Ton dağılımı',
    description: 'Kullanılan ton çeşitliliği ve kontrastı inceler.'
  },
  {
    id: 'composition',
    label: 'Kompozisyon',
    description: 'Çizimin sayfaya yerleşimi ve boşluk yönetimine bakar.'
  }
];

const moduleList = document.getElementById('moduleList');
const stepDetail = document.getElementById('stepDetail');
const stepMeta = stepDetail?.querySelector('.step-meta');
const stepTitle = stepDetail?.querySelector('h3');
const stepDescription = stepDetail?.querySelector('.step-description');
const stepChecklist = document.getElementById('stepChecklist');
const stepTips = document.getElementById('stepTips');
const stepOutcome = document.getElementById('stepOutcome');
const stepResources = document.getElementById('stepResources');
const markStepDoneButton = document.getElementById('markStepDone');
const openWorkbookButton = document.getElementById('openWorkbook');
const overallProgress = document.getElementById('overallProgress');
const overallProgressBar = document.getElementById('overallProgressBar');
const moduleProgressLabel = document.getElementById('moduleProgressLabel');
const startFirstLesson = document.getElementById('startFirstLesson');
const scrollToWorkspaceBtn = document.getElementById('scrollToWorkspace');
const notesField = document.getElementById('notesField');
const saveNotesBtn = document.getElementById('saveNotes');
const notesSaved = document.getElementById('notesSaved');
const selfReviewList = document.getElementById('selfReview');
const dailyRoutineList = document.getElementById('dailyRoutine');
const resourceGrid = document.getElementById('resourceGrid');
const metricList = document.getElementById('metricList');
const overallScore = document.getElementById('overallScore');
const scoreComment = document.getElementById('scoreComment');
const feedbackList = document.getElementById('feedbackList');
const drawingUpload = document.getElementById('drawingUpload');
const drawingPreview = document.getElementById('drawingPreview');
const previewPlaceholder = document.getElementById('previewPlaceholder');
const historyBody = document.getElementById('historyBody');
const uploadDropzone = document.querySelector('.upload-dropzone');
const notesStorageKey = 'fashion-design-notes';
const rubricStorageKey = 'fashion-design-rubric';
const completedStepsKey = 'fashion-design-completed-steps';
const canvas = document.getElementById('analysisCanvas');
const ctx = canvas?.getContext('2d', { willReadFrequently: true });

let currentModuleIndex = 0;
let currentStepIndex = 0;
let completedSteps = new Set();
let rubricScores = loadRubricScores();
const historyRecords = [];

init();

function init() {
  if (!moduleList) return;
  loadCompletedSteps();
  renderModules();
  renderCurrentStep();
  renderRubric();
  renderRoutine();
  renderResources();
  createMetricList();
  restoreNotes();
  attachEvents();
  updateOverallProgress();
}

function loadCompletedSteps() {
  try {
    const stored = localStorage.getItem(completedStepsKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        completedSteps = new Set(parsed);
      }
    }
  } catch (error) {
    console.warn('Tamamlanan adımlar okunamadı', error);
  }
}

function saveCompletedSteps() {
  try {
    localStorage.setItem(completedStepsKey, JSON.stringify([...completedSteps]));
  } catch (error) {
    console.warn('Tamamlanan adımlar kaydedilemedi', error);
  }
}

function renderModules() {
  moduleList.innerHTML = '';
  lessonModules.forEach((module, moduleIndex) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'module-card';
    button.setAttribute('data-module', module.id);
    if (moduleIndex === currentModuleIndex) {
      button.classList.add('is-active');
    }

    const completedCount = module.steps.filter((step) => completedSteps.has(stepKey(module.id, step.id))).length;
    const stepCount = module.steps.length;

    button.innerHTML = `
      <header>
        <div>
          <h3>${module.title}</h3>
          <p>${module.milestone}</p>
        </div>
        <span class="module-progress">${completedCount}/${stepCount}</span>
      </header>
      <div class="module-meta">
        <span>${module.duration}</span>
        <span>${module.focus.join(' · ')}</span>
      </div>
      <div class="module-steps">
        ${module.steps
          .map((step, index) => {
            const done = completedSteps.has(stepKey(module.id, step.id));
            return `<span class="step-pill${done ? ' is-done' : ''}">${index + 1}. ${step.title}</span>`;
          })
          .join('')}
      </div>
    `;

    button.addEventListener('click', () => {
      currentModuleIndex = moduleIndex;
      currentStepIndex = 0;
      renderModules();
      renderCurrentStep();
      scrollToSection(stepDetail);
    });

    moduleList.appendChild(button);
  });
}

function renderCurrentStep() {
  const module = lessonModules[currentModuleIndex];
  const step = module.steps[currentStepIndex];

  if (!step || !stepMeta || !stepTitle || !stepDescription) return;

  const done = completedSteps.has(stepKey(module.id, step.id));
  if (markStepDoneButton) {
    markStepDoneButton.textContent = done ? 'Tamamlandı ✓' : 'Adımı tamamladım';
    markStepDoneButton.disabled = done;
  }

  stepMeta.textContent = `${module.title} · ${step.stage}`;
  stepTitle.textContent = step.title;
  stepDescription.textContent = step.description;
  renderList(stepChecklist, step.checklist, 'li');
  renderList(stepTips, step.tips, 'li');
  stepOutcome.textContent = step.outcome;
  renderResourceList(stepResources, step.resources);

  if (moduleProgressLabel) {
    moduleProgressLabel.textContent = `${module.steps.filter((s) => completedSteps.has(stepKey(module.id, s.id))).length} / ${module.steps.length}`;
  }
}

function renderList(container, items, tagName) {
  if (!container) return;
  container.innerHTML = '';
  items.forEach((item) => {
    const element = document.createElement(tagName);
    element.textContent = item;
    container.appendChild(element);
  });
}

function renderResourceList(container, resources) {
  if (!container) return;
  container.innerHTML = '';
  resources.forEach((resource) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = resource.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${resource.label} · ${resource.type}`;
    item.appendChild(link);
    container.appendChild(item);
  });
}

function renderRubric() {
  if (!selfReviewList) return;
  selfReviewList.innerHTML = '';
  rubricCriteria.forEach((criteria) => {
    const li = document.createElement('li');
    const container = document.createElement('div');
    container.className = 'rubric-control';

    const title = document.createElement('strong');
    title.textContent = criteria.title;
    const description = document.createElement('span');
    description.textContent = criteria.description;

    const range = document.createElement('input');
    range.type = 'range';
    range.min = '1';
    range.max = '4';
    range.step = '1';
    range.value = rubricScores[criteria.id] ?? 3;
    range.setAttribute('aria-label', `${criteria.title} puanı`);

    const scoreLabel = document.createElement('span');
    scoreLabel.className = 'rubric-score';
    scoreLabel.textContent = range.value;

    range.addEventListener('input', () => {
      scoreLabel.textContent = range.value;
    });

    range.addEventListener('change', () => {
      rubricScores[criteria.id] = Number(range.value);
      saveRubricScores();
    });

    container.append(title, description, range, scoreLabel);
    li.appendChild(container);
    selfReviewList.appendChild(li);
  });
}

function loadRubricScores() {
  try {
    const stored = localStorage.getItem(rubricStorageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === 'object' ? parsed : {};
    }
  } catch (error) {
    console.warn('Rubrik puanları okunamadı', error);
  }
  return {};
}

function saveRubricScores() {
  try {
    localStorage.setItem(rubricStorageKey, JSON.stringify(rubricScores));
  } catch (error) {
    console.warn('Rubrik puanları kaydedilemedi', error);
  }
}

function renderRoutine() {
  if (!dailyRoutineList) return;
  dailyRoutineList.innerHTML = '';
  routineItems.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    dailyRoutineList.appendChild(li);
  });
}

function renderResources() {
  if (!resourceGrid) return;
  resourceGrid.innerHTML = '';
  resourceItems.forEach((resource) => {
    const article = document.createElement('article');
    article.className = 'resource-card';
    article.tabIndex = 0;
    const title = document.createElement('h3');
    title.textContent = resource.title;
    const description = document.createElement('p');
    description.textContent = resource.description;
    const type = document.createElement('small');
    type.textContent = `Tür: ${resource.type}`;
    const link = document.createElement('a');
    link.href = resource.link;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Kaynağı aç';
    article.append(title, description, type, link);
    resourceGrid.appendChild(article);
  });
}

function createMetricList() {
  if (!metricList) return;
  metricList.innerHTML = '';
  metricDefinitions.forEach((metric) => {
    const li = document.createElement('li');
    li.className = 'metric-item';
    li.dataset.metricId = metric.id;

    const header = document.createElement('div');
    header.className = 'metric-header';
    const label = document.createElement('span');
    label.textContent = metric.label;
    const value = document.createElement('span');
    value.className = 'metric-value';
    value.textContent = '-';
    header.append(label, value);

    const bar = document.createElement('div');
    bar.className = 'metric-bar';
    const barFill = document.createElement('span');
    bar.appendChild(barFill);

    const description = document.createElement('p');
    description.className = 'metric-description';
    description.textContent = metric.description;

    li.append(header, bar, description);
    metricList.appendChild(li);
  });
}

function attachEvents() {
  markStepDoneButton?.addEventListener('click', () => {
    const module = lessonModules[currentModuleIndex];
    const step = module.steps[currentStepIndex];
    completedSteps.add(stepKey(module.id, step.id));
    saveCompletedSteps();
    renderModules();
    renderCurrentStep();
    updateOverallProgress();
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < module.steps.length) {
      currentStepIndex = nextIndex;
      renderCurrentStep();
    } else if (currentModuleIndex + 1 < lessonModules.length) {
      currentModuleIndex += 1;
      currentStepIndex = 0;
      renderModules();
      renderCurrentStep();
    }
  });

  openWorkbookButton?.addEventListener('click', () => {
    const module = lessonModules[currentModuleIndex];
    const workbookUrl = module.workbook || 'https://fashionary.org/pages/downloads';
    window.open(workbookUrl, '_blank', 'noopener');
  });

  startFirstLesson?.addEventListener('click', () => {
    currentModuleIndex = 0;
    currentStepIndex = 0;
    renderModules();
    renderCurrentStep();
    scrollToSection(document.getElementById('lessonMap'));
  });

  scrollToWorkspaceBtn?.addEventListener('click', () => {
    scrollToSection(document.getElementById('workspace'));
  });

  saveNotesBtn?.addEventListener('click', () => {
    if (!notesField) return;
    try {
      localStorage.setItem(notesStorageKey, notesField.value);
      notesSaved.textContent = 'Kaydedildi!';
      setTimeout(() => {
        notesSaved.textContent = '';
      }, 2400);
    } catch (error) {
      console.warn('Notlar kaydedilemedi', error);
      notesSaved.textContent = 'Kaydedilemedi, tarayıcı izinlerini kontrol et.';
    }
  });

  drawingUpload?.addEventListener('change', handleFileSelection);

  if (uploadDropzone) {
    ['dragenter', 'dragover'].forEach((eventName) => {
      uploadDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        uploadDropzone.classList.add('is-dragging');
      });
    });

    ['dragleave', 'dragend'].forEach((eventName) => {
      uploadDropzone.addEventListener(eventName, () => {
        uploadDropzone.classList.remove('is-dragging');
      });
    });

    uploadDropzone.addEventListener('drop', (event) => {
      event.preventDefault();
      uploadDropzone.classList.remove('is-dragging');
      const file = event.dataTransfer?.files?.[0];
      if (file) {
        processImageFile(file);
      }
    });
  }
}

function restoreNotes() {
  if (!notesField) return;
  try {
    const stored = localStorage.getItem(notesStorageKey);
    if (stored) {
      notesField.value = stored;
    }
  } catch (error) {
    console.warn('Notlar okunamadı', error);
  }
}

function handleFileSelection(event) {
  const file = event.target.files?.[0];
  if (file) {
    processImageFile(file);
  }
}

function processImageFile(file) {
  if (!file.type.startsWith('image/')) {
    alert('Lütfen PNG veya JPG formatında bir dosya yükle.');
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert('Dosya boyutu 10 MB sınırını aşıyor.');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      if (!drawingPreview) return;
      drawingPreview.src = image.src;
      drawingPreview.alt = `${file.name} çizimi`; 
      drawingPreview.hidden = false;
      if (previewPlaceholder) {
        previewPlaceholder.textContent = '';
      }
      evaluateDrawing(image, file.name);
    };
    if (typeof reader.result === 'string') {
      image.src = reader.result;
    }
  };
  reader.readAsDataURL(file);
}

function evaluateDrawing(image, fileName) {
  if (!canvas || !ctx) return;
  const maxSize = 640;
  const scale = Math.min(maxSize / image.width, maxSize / image.height, 1);
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  canvas.width = width;
  canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(image, 0, 0, width, height);

  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const totalPixels = width * height;

  let inkPixels = 0;
  let inkIntensity = 0;
  let minLum = 255;
  let maxLum = 0;
  let sumX = 0;
  let sumY = 0;
  let edgeStrength = 0;
  let lumSum = 0;
  let lumSquaredSum = 0;
  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const r = data[index];
      const g = data[index + 1];
      const b = data[index + 2];
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      const inkValue = 1 - luminance / 255;

      lumSum += luminance;
      lumSquaredSum += luminance * luminance;

      if (luminance < minLum) minLum = luminance;
      if (luminance > maxLum) maxLum = luminance;

      if (inkValue > 0.2) {
        inkPixels += 1;
        inkIntensity += inkValue;
        sumX += x;
        sumY += y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }

      if (x < width - 1) {
        const nextIndex = index + 4;
        const nextLum = 0.299 * data[nextIndex] + 0.587 * data[nextIndex + 1] + 0.114 * data[nextIndex + 2];
        edgeStrength += Math.abs(luminance - nextLum);
      }
      if (y < height - 1) {
        const belowIndex = index + width * 4;
        const belowLum = 0.299 * data[belowIndex] + 0.587 * data[belowIndex + 1] + 0.114 * data[belowIndex + 2];
        edgeStrength += Math.abs(luminance - belowLum);
      }
    }
  }

  const inkRatio = inkPixels / totalPixels;
  const inkDensity = inkPixels > 0 ? inkIntensity / inkPixels : 0;
  const contrast = maxLum - minLum;
  const meanLum = lumSum / totalPixels;
  const variance = lumSquaredSum / totalPixels - meanLum * meanLum;
  const stdDev = Math.sqrt(Math.max(variance, 0));
  const centroidX = inkPixels > 0 ? sumX / inkPixels : width / 2;
  const centroidY = inkPixels > 0 ? sumY / inkPixels : height / 2;
  const horizontalBalance = 1 - Math.min(1, Math.abs(centroidX - width / 2) / (width / 2));
  const verticalBalance = 1 - Math.min(1, Math.abs(centroidY - height / 2) / (height / 2));
  const bboxWidth = maxX - minX;
  const bboxHeight = maxY - minY;
  const proportionRatio = bboxHeight > 0 ? bboxWidth / bboxHeight : 0;

  const lineScore = clampToScore(edgeStrength / (totalPixels * 255 * 2) * 180);
  const proportionScore = clampToScore((1 - Math.min(1, Math.abs(proportionRatio - 0.35) / 0.35)) * 100 * 1.05);
  const shadingScore = clampToScore((stdDev / 110) * 100 + inkDensity * 25);
  const compositionScore = clampToScore(((horizontalBalance + verticalBalance) / 2) * 70 + Math.min(1, inkRatio / 0.45) * 30);

  const metrics = {
    lineQuality: Math.round(lineScore),
    proportion: Math.round(proportionScore),
    shading: Math.round(shadingScore),
    composition: Math.round(compositionScore)
  };

  const overall = Math.round((metrics.lineQuality + metrics.proportion + metrics.shading + metrics.composition) / 4);
  const comment = overallComment(overall);

  updateMetricList(metrics);
  updateOverallScore(overall, comment);
  updateFeedback(metrics);
  pushHistoryRecord({ fileName, score: overall, comment });
}

function clampToScore(value) {
  return Math.max(0, Math.min(100, value));
}

function overallComment(score) {
  if (score >= 85) {
    return 'Harika! Moda figürün güçlü ve sunuma hazır görünüyor.';
  }
  if (score >= 70) {
    return 'Gelişim net; çizgileri biraz daha temizleyerek skorunu yükseltebilirsin.';
  }
  if (score >= 55) {
    return 'Temel yapı doğru. Oran ve ton kontrastını güçlendirmeye odaklan.';
  }
  return 'Çizgileri daha netleştirip figürün dengesini gözden geçirmeni öneririz.';
}

function updateMetricList(scores) {
  metricDefinitions.forEach((metric) => {
    const item = metricList?.querySelector(`li[data-metric-id="${metric.id}"]`);
    if (!item) return;
    const valueEl = item.querySelector('.metric-value');
    const barFill = item.querySelector('.metric-bar span');
    const score = scores[metric.id];
    if (valueEl) valueEl.textContent = Number.isFinite(score) ? `${score}` : '-';
    if (barFill) barFill.style.width = Number.isFinite(score) ? `${score}%` : '0';
  });
}

function updateOverallScore(score, comment) {
  if (overallScore) overallScore.textContent = Number.isFinite(score) ? `${score}` : '-';
  if (scoreComment) scoreComment.textContent = comment || '';
}

function updateFeedback(metrics) {
  if (!feedbackList) return;
  const feedback = [];

  if (metrics.lineQuality < 60) {
    feedback.push('Çizgi netliğini artırmak için kalem basıncını sabitleyip uzun çizgileri tek hamlede dene.');
  } else if (metrics.lineQuality > 80) {
    feedback.push('Çizgi kontrolün iyi, hassas detaylarda farklı kalem sertlikleriyle çeşitlilik kat.');
  }

  if (metrics.proportion < 55) {
    feedback.push('Oranlar için 9 baş boyu kılavuzunu tekrar çizerek kalça ve omuz genişliklerini kıyasla.');
  }

  if (metrics.shading < 50) {
    feedback.push('Ton dağılımını güçlendirmek adına ton skalası egzersizini tekrar et ve koyu bölgeleri katmanla.');
  }

  if (metrics.composition < 50) {
    feedback.push('Kompozisyonu güçlendirmek için figürü sayfa merkezinden hafifçe kaydırıp negatif alanları dengele.');
  }

  if (feedback.length === 0) {
    feedback.push('Harika bir ilerleme! Şimdi stil detayları ve sunum katmanları üzerinde deneyler yapabilirsin.');
  }

  feedbackList.innerHTML = '';
  feedback.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    feedbackList.appendChild(li);
  });
}

function pushHistoryRecord(record) {
  historyRecords.unshift({ ...record, date: new Date() });
  renderHistory();
}

function renderHistory() {
  if (!historyBody) return;
  historyBody.innerHTML = '';
  historyRecords.slice(0, 6).forEach((record) => {
    const row = document.createElement('tr');
    const dateCell = document.createElement('td');
    dateCell.textContent = record.date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    const fileCell = document.createElement('td');
    fileCell.textContent = record.fileName;
    const scoreCell = document.createElement('td');
    scoreCell.textContent = `${record.score}`;
    const commentCell = document.createElement('td');
    commentCell.textContent = record.comment;
    row.append(dateCell, fileCell, scoreCell, commentCell);
    historyBody.appendChild(row);
  });
}

function updateOverallProgress() {
  const totalSteps = lessonModules.reduce((total, module) => total + module.steps.length, 0);
  const doneSteps = completedSteps.size;
  const progress = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;
  if (overallProgress) overallProgress.textContent = `${progress}%`;
  if (overallProgressBar) overallProgressBar.style.width = `${progress}%`;
}

function scrollToSection(element) {
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function stepKey(moduleId, stepId) {
  return `${moduleId}:${stepId}`;
}
*** End of File
