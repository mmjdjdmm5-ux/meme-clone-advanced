document.getElementById("memeForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const topText = document.getElementById("topText").value;
  const bottomText = document.getElementById("bottomText").value;
  const imageUrl = document.getElementById("imageUrl").value;

  try {
    const response = await fetch("https://meme-clone-advanced.onrender.com/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ topText, bottomText, imageUrl })
    });

    const data = await response.json();

    if (data.memeUrl) {
      const img = document.createElement("img");
      img.src = data.memeUrl;
      img.style.maxWidth = "100%";
      img.style.marginTop = "20px";
      document.getElementById("result").innerHTML = "";
      document.getElementById("result").appendChild(img);
    } else {
      alert("❌ Meme not generated!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Server connection failed!");
  }
});
