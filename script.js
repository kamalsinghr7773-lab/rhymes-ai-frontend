const BACKEND_URL = "BACKEND_ROOT"; // replace e.g. "https://rhymes-ai-backend-1.onrender.com"

const promptEl = document.getElementById("prompt");
const durEl = document.getElementById("duration");
const outEl = document.getElementById("output");
const btn = document.getElementById("generate");

btn.addEventListener("click", async () => {
  const prompt = (promptEl.value || "").trim();
  const duration = Number(durEl.value) || 30;
  if (!prompt) { alert("Please enter prompt"); return; }

  outEl.innerText = "⏳ Generating... please wait.";

  try {
    const res = await fetch(`${BACKEND_URL}/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, duration })
    });

    if (!res.ok) {
      const text = await res.text();
      outEl.innerText = `Server error: ${res.status} ${text}`;
      return;
    }

    const data = await res.json();
    // Try common fields
    const textOut = data.rhyme || data.result || JSON.stringify(data, null, 2);
    outEl.innerText = textOut;
  } catch (err) {
    console.error(err);
    outEl.innerText = "Network or server error. Check backend logs.";
  }
});
