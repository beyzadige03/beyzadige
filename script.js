const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const notificationList = document.getElementById('notificationList');
const metricStudentCount = document.getElementById('metricStudentCount');
const metricLastAnswer = document.getElementById('metricLastAnswer');
const metricSuccess = document.getElementById('metricSuccess');
const studentList = document.getElementById('studentList');
const captureFaceBtn = document.getElementById('captureFace');
const scanFrameBtn = document.getElementById('scanFrame');
const questionInput = document.getElementById('questionInput');
const answerInput = document.getElementById('answerInput');
const saveQuestionBtn = document.getElementById('saveQuestion');

const MAX_STUDENTS = 5;
const SAMPLE_SIZE = 64; // px, kare ortalama kıyaslama
const MATCH_THRESHOLD = 28; // ortalama piksel farkı

const state = {
  question: '',
  answer: '',
  students: [], // { id, name, sample, thumb }
  successCount: 0,
};

const faceDetector = 'FaceDetector' in window ? new window.FaceDetector({ fastMode: true }) : null;
const canvas = overlay;
const ctx = canvas.getContext('2d');
const processCanvas = document.createElement('canvas');
const processCtx = processCanvas.getContext('2d');
let stream = null;
let nextId = 1;

function addNotification(message, type = 'info') {
  const entry = document.createElement('article');
  entry.className = `notification-item ${type === 'success' ? 'success' : type === 'warn' ? 'warn' : type === 'danger' ? 'danger' : ''}`;
  const timestamp = new Intl.DateTimeFormat('tr-TR', {
    timeStyle: 'short',
    hour12: false,
  }).format(new Date());
  entry.innerHTML = `
    <header>
      <span class="dot"></span>
      <p>${timestamp}</p>
    </header>
    <p>${message}</p>
  `;
  notificationList.prepend(entry);
}

function updateMetrics(lastAnswerText = null) {
  metricStudentCount.textContent = `${state.students.length} / ${MAX_STUDENTS}`;
  if (lastAnswerText !== null) {
    metricLastAnswer.textContent = lastAnswerText || '—';
  }
  metricSuccess.textContent = state.successCount;
}

function renderStudents() {
  studentList.innerHTML = '';
  if (!state.students.length) {
    studentList.innerHTML = '<p style="color: var(--text-muted); margin: 0;">Henüz kayıt yok. Kameraya bakan öğrenciyi hizalayın ve "Yüzü kaydet"e basın.</p>';
    return;
  }

  state.students.forEach((student) => {
    const card = document.createElement('div');
    card.className = 'student-card';
    card.innerHTML = `
      <img src="${student.thumb}" alt="${student.name} yüz kaydı" />
      <div>
        <p>${student.name}</p>
        <span>ID: ${student.id}</span>
      </div>
    `;
    studentList.appendChild(card);
  });
}

function drawBoxes(detections) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'rgba(91, 140, 253, 0.9)';
  ctx.lineWidth = 2;
  ctx.font = '14px Manrope';
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';

  detections.forEach((det, index) => {
    const { width, height, top, left } = det.boundingBox;
    ctx.strokeRect(left, top, width, height);
    ctx.fillRect(left, Math.max(0, top - 22), width, 22);
    ctx.fillStyle = '#e6f0ff';
    ctx.fillText(`Yüz ${index + 1}`, left + 8, Math.max(14, top - 6));
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  });
}

function grabFrame() {
  if (!video.videoWidth || !video.videoHeight) return false;
  processCanvas.width = video.videoWidth;
  processCanvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  processCtx.drawImage(video, 0, 0, processCanvas.width, processCanvas.height);
  return true;
}

async function detectFaces() {
  if (!faceDetector) {
    // Fallback: tüm kareyi tek yüz gibi kabul et, en azından piksel karşılaştırması çalışır
    return [
      {
        boundingBox: { top: 10, left: 10, width: canvas.width - 20, height: canvas.height * 0.55 },
      },
    ];
  }

  try {
    const faces = await faceDetector.detect(video);
    return faces;
  } catch (error) {
    addNotification('FaceDetector çağrısı başarısız; tüm kare taranacak.', 'warn');
    return [
      {
        boundingBox: { top: 10, left: 10, width: canvas.width - 20, height: canvas.height * 0.55 },
      },
    ];
  }
}

function getImageDataFromBox(box) {
  const { top, left, width, height } = box;
  const temp = document.createElement('canvas');
  temp.width = SAMPLE_SIZE;
  temp.height = SAMPLE_SIZE;
  const tctx = temp.getContext('2d');
  tctx.drawImage(processCanvas, left, top, width, height, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
  return tctx.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE);
}

function computeAverageDiff(dataA, dataB) {
  if (!dataA || !dataB) return Infinity;
  let diff = 0;
  const len = dataA.data.length;
  for (let i = 0; i < len; i += 4) {
    diff +=
      Math.abs(dataA.data[i] - dataB.data[i]) +
      Math.abs(dataA.data[i + 1] - dataB.data[i + 1]) +
      Math.abs(dataA.data[i + 2] - dataB.data[i + 2]);
  }
  return diff / (len / 4);
}

function bestMatch(sample) {
  let best = { student: null, score: Infinity };
  state.students.forEach((student) => {
    const score = computeAverageDiff(sample, student.sample);
    if (score < best.score) {
      best = { student, score };
    }
  });
  return best;
}

async function readAnswerText() {
  if (!window.Tesseract) {
    addNotification('Tesseract.js yüklenemedi, cevap okuma devre dışı.', 'warn');
    return '';
  }
  // Alt şerit: çerçevenin alt %28'i
  const regionHeight = Math.floor(canvas.height * 0.28);
  const regionY = canvas.height - regionHeight;
  const temp = document.createElement('canvas');
  temp.width = canvas.width;
  temp.height = regionHeight;
  const tctx = temp.getContext('2d');
  tctx.drawImage(processCanvas, 0, regionY, canvas.width, regionHeight, 0, 0, canvas.width, regionHeight);
  const { data } = await Tesseract.recognize(temp, 'tur');
  const cleaned = data.text?.trim();
  return cleaned || '';
}

async function captureFace() {
  if (state.students.length >= MAX_STUDENTS) {
    addNotification('5 öğrenciye ulaşıldı. Yeni kayıt eklenemez.', 'warn');
    return;
  }

  const hasFrame = grabFrame();
  if (!hasFrame) {
    addNotification('Kamera hazırlanmadı. Birkaç saniye bekleyip tekrar deneyin.', 'warn');
    return;
  }

  const detections = await detectFaces();
  if (!detections.length) {
    addNotification('Karede yüz algılanmadı. Işığı artırın ve kameraya bakın.', 'danger');
    return;
  }

  const sampleBox = detections[0].boundingBox;
  const sample = getImageDataFromBox(sampleBox);
  const thumbCanvas = document.createElement('canvas');
  thumbCanvas.width = 96;
  thumbCanvas.height = 96;
  thumbCanvas.getContext('2d').drawImage(canvas, sampleBox.left, sampleBox.top, sampleBox.width, sampleBox.height, 0, 0, 96, 96);
  const thumb = thumbCanvas.toDataURL('image/png');

  const name = `Öğrenci ${nextId}`;
  state.students.push({ id: nextId, name, sample, thumb });
  nextId += 1;
  addNotification(`${name} yüz kaydı eklendi.`, 'success');
  renderStudents();
  updateMetrics();
}

async function runScan() {
  if (!state.students.length) {
    addNotification('Önce en az bir öğrencinin yüzünü kaydedin.', 'warn');
    return;
  }
  if (!state.answer) {
    addNotification('Soru ve doğru cevabı kaydedin.', 'warn');
    return;
  }

  const hasFrame = grabFrame();
  if (!hasFrame) {
    addNotification('Kamera henüz kare sağlamıyor. Lütfen akışı kontrol edin.', 'warn');
    return;
  }

  const detections = await detectFaces();
  drawBoxes(detections);
  if (!detections.length) {
    addNotification('Bu karede yüz bulunamadı.', 'warn');
    return;
  }

  const answerText = (await readAnswerText()) || '';
  updateMetrics(answerText);

  detections.forEach((det, index) => {
    const sample = getImageDataFromBox(det.boundingBox);
    const { student, score } = bestMatch(sample);
    if (!student || score > MATCH_THRESHOLD) {
      addNotification(`Yüz ${index + 1} bilinen kayıtlarla eşleşmedi (fark: ${score.toFixed(1)}).`, 'danger');
      return;
    }

    const normalizedAnswer = answerText.toLowerCase().replace(/\s+/g, '');
    const normalizedCorrect = state.answer.toLowerCase().replace(/\s+/g, '');

    if (normalizedAnswer && normalizedAnswer === normalizedCorrect) {
      state.successCount += 1;
      updateMetrics(answerText);
      addNotification(`${student.name}: Yağız doğru bildin ✅`, 'success');
    } else {
      addNotification(`${student.name} için cevap uyuşmadı. Okunan: "${answerText || '—'}"`, 'info');
    }
  });
}

function saveQuestion() {
  state.question = questionInput.value.trim();
  state.answer = answerInput.value.trim();
  if (!state.question || !state.answer) {
    addNotification('Soru ve doğru cevap alanlarını doldurun.', 'warn');
    return;
  }
  addNotification(`Soru kaydedildi. Doğru cevap: "${state.answer}"`, 'info');
}

function fitCanvasToVideo() {
  const width = video.videoWidth || video.clientWidth;
  const height = video.videoHeight || video.clientHeight;
  canvas.width = width;
  canvas.height = height;
}

async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      fitCanvasToVideo();
    });
  } catch (error) {
    addNotification('Kamera açılamadı. Tarayıcı izinlerini kontrol edin.', 'danger');
  }
}

function init() {
  initCamera();
  window.addEventListener('resize', fitCanvasToVideo);
  captureFaceBtn.addEventListener('click', captureFace);
  scanFrameBtn.addEventListener('click', runScan);
  saveQuestionBtn.addEventListener('click', saveQuestion);
  renderStudents();
  updateMetrics();
}

init();
