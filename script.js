// Simple client-side Video Meme maker using canvas + MediaRecorder
const imageInput = document.getElementById('imageInput');
const topTextInput = document.getElementById('topText');
const bottomTextInput = document.getElementById('bottomText');
const generateBtn = document.getElementById('generateBtn');
const downloadLink = document.getElementById('downloadLink');
const autoCaptionBtn = document.getElementById('autoCaptionBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const durationSelect = document.getElementById('duration');

let img = new Image();
let loaded = false;
img.crossOrigin = "anonymous";

const SAMPLE_CAPTIONS = [
  "When code finally works",
  "That look when you forgot semicolon",
  "Deploy succeeded — celebrate",
  "When coffee hits just right",
  "Debugging be like..."
];

// load selected file into image object
imageInput.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if (!f) return;
  const url = URL.createObjectURL(f);
  img = new Image();
  img.onload = () => {
    loaded = true;
    fitCanvasToImage();
    drawFrame(0); // initial draw
  };
  img.src = url;
});

// auto caption (local random)
autoCaptionBtn.addEventListener('click', () => {
  const cap = SAMPLE_CAPTIONS[Math.floor(Math.random() * SAMPLE_CAPTIONS.length)];
  // if caption has '|' split into two lines, else top=cap
  if (cap.includes('|')) {
    const [t,b] = cap.split('|');
    topTextInput.value = t.trim();
    bottomTextInput.value = b.trim();
  } else {
    topTextInput.value = cap;
    bottomTextInput.value = '';
  }
});

// Fit canvas to image (max width for mobile)
function fitCanvasToImage(){
  const maxWidth = Math.min(window.innerWidth - 40, 900);
  let w = img.width;
  let h = img.height;
  const ratio = Math.min(maxWidth / w, 1);
  w = Math.round(w * ratio);
  h = Math.round(h * ratio);
  canvas.width = w;
  canvas.height = h;
}

// draw a single frame with optional progress (0..1)
function drawFrame(progress = 0){
  // clear
  ctx.clearRect(0,0,canvas.width,canvas.height);
  // background image (cover)
  if (loaded) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  } else {
    // placeholder
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // text style
  const topText = (topTextInput.value || "").toUpperCase();
  const bottomText = (bottomTextInput.value || "").toUpperCase();
  const fontSize = Math.max(22, Math.floor(canvas.height / 10));
  ctx.font = `bold ${fontSize}px Impact, Arial Black, sans-serif`;
  ctx.textAlign = "center";
  ctx.lineWidth = Math.max(4, Math.floor(fontSize / 12));
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";

  // animate: top text slides from -20px to 1x at start, bottom text slides up at end
  // top: appear in first half
  if (topText) {
    const topYBase = fontSize + 10;
    const topOffset = Math.max(-fontSize, (-fontSize) + (progress * 2) * fontSize); // slide down
    ctx.strokeText(topText, canvas.width/2, topYBase + topOffset);
    ctx.fillText(topText, canvas.width/2, topYBase + topOffset);
  }

  if (bottomText) {
    const bottomYBase = canvas.height - 10;
    // bottom animate: appears in last half
    const bottomOffset = Math.max(0, (1 - progress) * fontSize);
    ctx.strokeText(bottomText, canvas.width/2, bottomYBase - bottomOffset);
    ctx.fillText(bottomText, canvas.width/2, bottomYBase - bottomOffset);
  }
}

// create a short video by recording canvas stream
async function createVideo(durationMs = 3000){
  if (!loaded) {
    alert("Please choose an image first.");
    return null;
  }

  const fps = 30;
  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
  const chunks = [];
  recorder.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };

  recorder.start();
  const start = performance.now();
  return new Promise((resolve, reject) => {
    function step(now){
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      drawFrame(progress);
      if (elapsed < durationMs) {
        requestAnimationFrame(step);
      } else {
        // finish
        recorder.stop();
      }
    }
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };
    requestAnimationFrame(step);
  });
}

// Generate button handler
generateBtn.addEventListener('click', async () => {
  generateBtn.disabled = true;
  generateBtn.textContent = "Generating...";
  const duration = parseInt(durationSelect.value, 10) || 3000;
  try {
    const videoBlob = await createVideo(duration);
    if (!videoBlob) throw new Error("No video created");
    const url = URL.createObjectURL(videoBlob);
    downloadLink.href = url;
    downloadLink.download = `meme-${Date.now()}.webm`;
    downloadLink.classList.remove('hidden');
    downloadLink.textContent = "Download Video";
    // show temporary preview by loading into video element? (user can download)
    alert("Video ready — click 'Download Video' to save.");
  } catch (err) {
    console.error(err);
    alert("Video creation failed: " + err.message);
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = "Generate Video";
  }
});

// initial canvas placeholder
canvas.width = 640;
canvas.height = 360;
ctx.fillStyle = "#222";
ctx.fillRect(0,0,canvas.width,canvas.height);
ctx.fillStyle = "#aaa";
ctx.font = "20px Arial";
ctx.textAlign = "center";
ctx.fillText("Choose an image to start", canvas.width/2, canvas.height/2);
