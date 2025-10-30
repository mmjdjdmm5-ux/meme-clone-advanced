// 👇 yahan apna backend link daalo:
const API_URL = "https://your-backend-name.onrender.com";

document.getElementById("memeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const topText = document.getElementById("topText").value;
  const bottomText = document.getElementById("bottomText").value;

  const memeImage = document.getElementById("memeImage");
  memeImage.src = "";
  memeImage.alt = "Generating meme...";

  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topText, bottomText }),
    });

    const data = await response.json();
    memeImage.src = data.imageUrl;
    memeImage.alt = "Generated Meme";
  } catch (error) {
    memeImage.alt = "Error generating meme 😢";
    console.error(error);
  }
});
