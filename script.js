// Meme Generator Script Connected with Render Backend
const form = document.getElementById("memeForm");
const resultDiv = document.getElementById("result");
const loadingText = document.getElementById("loadingText");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = document.getElementById("text").value.trim();

  if (!text) {
    alert("Please enter a meme idea first!");
    return;
  }

  loadingText.style.display = "block";
  resultDiv.innerHTML = "";

  try {
    const response = await fetch("https://meme-clone-advanced.onrender.com/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate meme. Try again later!");
    }

    const data = await response.json();

    // Display meme image
    const img = document.createElement("img");
    img.src = data.imageUrl;
    img.alt = "Generated Meme";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "10px";
    img.style.marginTop = "15px";

    resultDiv.appendChild(img);
  } catch (error) {
    console.error(error);
    alert("Something went wrong while generating meme!");
  } finally {
    loadingText.style.display = "none";
  }
});
