const cameraFeed = document.getElementById('cameraFeed');
const debugCanvas = document.getElementById('debugCanvas');
const pointer = document.getElementById('virtualPointer');
const blinkIndicator = document.getElementById('blinkIndicator');
const cameraStatus = document.getElementById('cameraStatus');
const modelStatus = document.getElementById('modelStatus');
const blinkStatus = document.getElementById('blinkStatus');
const clickStatus = document.getElementById('clickStatus');
const cameraBtn = document.getElementById('cameraBtn');
const calibrateBtn = document.getElementById('calibrateBtn');
const contextMenu = document.getElementById('contextMenu');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const stage = document.getElementById('stage');

const LEFT_EYE_INDICES = [33, 160, 158, 133, 153, 144];
const RIGHT_EYE_INDICES = [362, 385, 387, 263, 373, 380];
const LEFT_IRIS_INDICES = [468, 469, 470, 471];
const RIGHT_IRIS_INDICES = [473, 474, 475, 476];

const BLINK_THRESHOLD = 0.19;
const BLINK_MIN_DURATION = 80;
const BLINK_MAX_DURATION = 400;
const SMOOTHING = 0.15;

let model;
let stream;
let animationId;
let pointerX = 0;
let pointerY = 0;
let targetX = pointerX;
let targetY = pointerY;
let lastBlinkState = false;
let blinkStartTime = 0;
let lastRightClick = 0;

const ctx = debugCanvas.getContext('2d');

function centerPointer() {
  const rect = stage.getBoundingClientRect();
  pointerX = rect.width / 2;
  pointerY = rect.height / 2;
  targetX = pointerX;
  targetY = pointerY;
  pointer.style.left = `${pointerX}px`;
  pointer.style.top = `${pointerY}px`;
}

centerPointer();

async function initModel() {
  try {
    modelStatus.textContent = 'Modeller yükleniyor';
    model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      {
        maxFaces: 1,
        shouldLoadIrisModel: true
      }
    );
    modelStatus.textContent = 'Hazır';
    if (stream) {
      startPredictionLoop();
    }
  } catch (error) {
    console.error(error);
    modelStatus.textContent = 'Yüklenemedi';
  }
}

async function initCamera() {
  try {
    cameraStatus.textContent = 'Kamera isteniyor';
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    cameraFeed.srcObject = stream;
    cameraStatus.textContent = 'Açık';
    calibrateBtn.disabled = false;
    startPredictionLoop();
  } catch (error) {
    console.error(error);
    cameraStatus.textContent = 'İzin verilmedi';
  }
}

function startPredictionLoop() {
  if (!model) {
    console.warn('Model henüz hazır değil.');
    return;
  }

  cancelAnimationFrame(animationId);

  const render = async () => {
    if (cameraFeed.readyState >= 2) {
      adjustCanvasSize();
      const faces = await model.estimateFaces({
        input: cameraFeed,
        flipHorizontal: true,
        predictIrises: true
      });

      if (faces.length) {
        const face = faces[0];
        drawDebug(face);
        updatePointer(face);
        detectBlink(face);
      } else {
        fadeBlinkIndicator(false);
      }
    }
    animationId = requestAnimationFrame(render);
  };

  render();
}

function adjustCanvasSize() {
  const { videoWidth, videoHeight } = cameraFeed;
  if (!videoWidth || !videoHeight) return;

  if (debugCanvas.width !== videoWidth || debugCanvas.height !== videoHeight) {
    debugCanvas.width = videoWidth;
    debugCanvas.height = videoHeight;
  }
}

function drawDebug(face) {
  const keypoints = face.scaledMesh;
  ctx.clearRect(0, 0, debugCanvas.width, debugCanvas.height);
  ctx.lineWidth = 1.6;
  ctx.strokeStyle = 'rgba(90, 200, 250, 0.9)';
  ctx.fillStyle = 'rgba(90, 200, 250, 0.25)';

  drawEye(ctx, keypoints, LEFT_EYE_INDICES);
  drawEye(ctx, keypoints, RIGHT_EYE_INDICES);
}

function drawEye(context, keypoints, indices) {
  context.beginPath();
  indices.forEach((index, idx) => {
    const [x, y] = keypoints[index];
    if (idx === 0) {
      context.moveTo(x, y);
    } else {
      context.lineTo(x, y);
    }
  });
  context.closePath();
  context.fill();
  context.stroke();
}

function updatePointer(face) {
  const { videoWidth, videoHeight } = cameraFeed;
  const stageRect = stage.getBoundingClientRect();
  if (!stageRect.width || !stageRect.height) {
    return;
  }
  const keypoints = face.scaledMesh;

  const leftIris = averagePoint(LEFT_IRIS_INDICES.map((index) => keypoints[index]));
  const rightIris = averagePoint(RIGHT_IRIS_INDICES.map((index) => keypoints[index]));
  const iris = [(leftIris[0] + rightIris[0]) / 2, (leftIris[1] + rightIris[1]) / 2];

  const normalizedX = iris[0] / videoWidth;
  const normalizedY = iris[1] / videoHeight;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  targetX = clamp(normalizedX * stageRect.width, 16, stageRect.width - 16);
  targetY = clamp(normalizedY * stageRect.height, 16, stageRect.height - 16);

  pointerX += (targetX - pointerX) * SMOOTHING;
  pointerY += (targetY - pointerY) * SMOOTHING;

  pointer.style.left = `${pointerX}px`;
  pointer.style.top = `${pointerY}px`;
}

function detectBlink(face) {
  const keypoints = face.scaledMesh;
  const leftEAR = eyeAspectRatio(keypoints, LEFT_EYE_INDICES);
  const rightEAR = eyeAspectRatio(keypoints, RIGHT_EYE_INDICES);
  const isBlink = leftEAR < BLINK_THRESHOLD && rightEAR < BLINK_THRESHOLD;

  if (isBlink && !lastBlinkState) {
    blinkStartTime = performance.now();
  }

  if (!isBlink && lastBlinkState) {
    const duration = performance.now() - blinkStartTime;
    if (duration >= BLINK_MIN_DURATION && duration <= BLINK_MAX_DURATION) {
      registerBlink();
    }
  }

  lastBlinkState = isBlink;
  fadeBlinkIndicator(isBlink);
}

function eyeAspectRatio(keypoints, indices) {
  const [p1, p2, p3, p4, p5, p6] = indices.map((index) => keypoints[index]);
  const vertical1 = distance(p2, p6);
  const vertical2 = distance(p3, p5);
  const horizontal = distance(p1, p4);
  return (vertical1 + vertical2) / (2 * horizontal);
}

function distance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function averagePoint(points) {
  const total = points.reduce(
    (acc, point) => {
      acc[0] += point[0];
      acc[1] += point[1];
      return acc;
    },
    [0, 0]
  );
  return [total[0] / points.length, total[1] / points.length];
}

function registerBlink() {
  blinkStatus.textContent = 'Algılandı';
  pointer.classList.add('active');
  setTimeout(() => pointer.classList.remove('active'), 200);

  const now = performance.now();
  if (now - lastRightClick > 1000) {
    triggerRightClick();
    lastRightClick = now;
  }
}

function triggerRightClick() {
  clickStatus.textContent = 'Sağ tık gönderildi';
  showContextMenu(pointerX, pointerY);
  setTimeout(() => {
    clickStatus.textContent = 'Hazır';
  }, 1500);
}

function fadeBlinkIndicator(isVisible) {
  if (isVisible) {
    blinkIndicator.classList.add('visible');
  } else {
    blinkIndicator.classList.remove('visible');
  }
}

function showContextMenu(x, y) {
  const stageRect = stage.getBoundingClientRect();
  const absoluteX = stageRect.left + x;
  const absoluteY = stageRect.top + y;
  const menuWidth = 220;
  const menuHeight = 120;
  const margin = 16;
  const clampedX = Math.min(Math.max(absoluteX, margin), window.innerWidth - menuWidth - margin);
  const clampedY = Math.min(Math.max(absoluteY, margin), window.innerHeight - menuHeight - margin);

  contextMenu.style.left = `${clampedX}px`;
  contextMenu.style.top = `${clampedY}px`;
  contextMenu.classList.remove('hidden');
}

function hideContextMenu() {
  contextMenu.classList.add('hidden');
}

cameraBtn.addEventListener('click', () => {
  if (!stream) {
    initCamera();
  }
});

calibrateBtn.addEventListener('click', () => {
  clickStatus.textContent = 'Kalibrasyon';
  centerPointer();
  setTimeout(() => {
    if (stream) {
      clickStatus.textContent = 'Hazır';
    }
  }, 1200);
});

closeMenuBtn.addEventListener('click', hideContextMenu);
document.addEventListener('click', (event) => {
  if (!contextMenu.contains(event.target)) {
    hideContextMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideContextMenu();
  }
});

window.addEventListener('resize', centerPointer);

tf.setBackend('webgl')
  .then(() => tf.ready())
  .then(() => initModel())
  .catch((error) => {
    console.error('TensorFlow.js başlatılırken hata oluştu', error);
    modelStatus.textContent = 'Yüklenemedi';
  });
