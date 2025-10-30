const generateBtn = document.getElementById("generateBtn");
const topTextInput = document.getElementById("topText");
const bottomTextInput = document.getElementById("bottomText");
const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("memeCanvas");
const ctx = canvas.getContext("2d");
const downloadLink = document.getElementById("downloadLink");

generateBtn.addEventListener("click", () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Please select an image!");
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const topText = topTextInput.value.toUpperCase();
      const bottomText = bottomTextInput.value.toUpperCase();

      ctx.font = `${canvas.width / 15}px Impact`;
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 3;
      ctx.textAlign = "center";

      ctx.fillText(topText, canvas.width / 2, 50);
      ctx.strokeText(topText, canvas.width / 2, 50);

      ctx.fillText(bottomText, canvas.width / 2, canvas.height - 20);
      ctx.strokeText(bottomText, canvas.width / 2, canvas.height - 20);

      downloadLink.href = canvas.toDataURL("image/png");
      downloadLink.style.display = "block";
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
});
