const imageUpload = document.getElementById('imageUpload');
const topText = document.getElementById('topText');
const bottomText = document.getElementById('bottomText');
const generateBtn = document.getElementById('generateBtn');
const videoContainer = document.getElementById('videoContainer');

generateBtn.addEventListener('click', async () => {
  const file = imageUpload.files[0];
  if (!file) {
    alert('Please upload an image!');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => generateVideo(img, topText.value, bottomText.value);
  };
  reader.readAsDataURL(file);
});

function generateVideo(img, topText, bottomText) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  const stream = canvas.captureStream(30); // 30fps
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
  const chunks = [];

  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const videoURL = URL.createObjectURL(blob);

    const video = document.createElement('video');
    video.src = videoURL;
    video.controls = true;
    videoContainer.innerHTML = '';
    videoContainer.appendChild(video);

    const link = document.createElement('a');
    link.href = videoURL;
    link.download = 'meme-video.webm';
    link.textContent = '⬇️ Download Meme Video';
    videoContainer.appendChild(link);
  };

  recorder.start();

  let frame = 0;
  const totalFrames = 150; // 5 seconds at 30fps

  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const zoom = 1 + 0.002 * frame;
    const offsetX = Math.sin(frame * 0.05) * 10;

    ctx.save();
    ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.drawImage(img, -img.width / 4, -img.height / 4, img.width / 2, img.height / 2);
    ctx.restore();

    ctx.font = 'bold 30px Impact';
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.fillText(topText, canvas.width / 2, 50);
    ctx.strokeText(topText, canvas.width / 2, 50);
    ctx.fillText(bottomText, canvas.width / 2, canvas.height - 30);
    ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 30);

    frame++;
    if (frame < totalFrames) {
      requestAnimationFrame(animate);
    } else {
      recorder.stop();
    }
  };

  animate();
}
