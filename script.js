const imageUpload = document.getElementById("imageUpload");
const memeCanvas = document.getElementById("memeCanvas");
const ctx = memeCanvas.getContext("2d");
const addTextBtn = document.getElementById("addTextBtn");
const exportBtn = document.getElementById("exportBtn");

let backgroundImage = null;
let textElements = [];

imageUpload.addEventListener("change", handleImageUpload);
addTextBtn.addEventListener("click", addText);
exportBtn.addEventListener("click", exportMeme);

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const img = new Image();
  img.onload = () => {
    memeCanvas.width = img.width;
    memeCanvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    backgroundImage = img;
  };
  img.src = URL.createObjectURL(file);
}

function addText() {
  const text = prompt("Enter meme text:");
  if (!text) return;

  const x = memeCanvas.width / 2;
  const y = memeCanvas.height / 2;

  textElements.push({ text, x, y });
  drawMeme();
}

function drawMeme() {
  if (!backgroundImage) return;
  ctx.drawImage(backgroundImage, 0, 0);
  ctx.font = "40px Impact";
  ctx.textAlign = "center";
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;

  textElements.forEach((t) => {
    ctx.fillText(t.text, t.x, t.y);
    ctx.strokeText(t.text, t.x, t.y);
  });
}

function exportMeme() {
  const link = document.createElement("a");
  link.download = "meme.png";
  link.href = memeCanvas.toDataURL("image/png");
  link.click();
}
