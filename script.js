const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
let backgroundImage = null;
let textElements = [];

document.getElementById("imageUpload").addEventListener("change", function (e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    const img = new Image();
    img.onload = function () {
      backgroundImage = img;
      drawMeme();
    };
    img.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

document.getElementById("addTextBtn").addEventListener("click", function () {
  const text = prompt("Enter text:");
  if (text) {
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    textElements.push({ text, x, y });
    drawMeme();
  }
});

function drawMeme() {
  if (!backgroundImage) return;
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
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

// 🔹 AI Meme Caption Generator
document.getElementById("generateBtn").addEventListener("click", async () => {
  const imageInput = document.getElementById("imageUpload");
  if (!imageInput.files[0]) {
    alert("Please upload an image first!");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageInput.files[0]);

  // Apna backend ya AI API yahan likhna hoga
  const response = await fetch("https://your-backend-url.com/generate-meme", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();
  alert("AI Caption: " + data.caption);
});
