// --- IMPORTANT: Set your backend base URL here (replace with your Render backend) ---
const API_BASE = "https://backend-1-691r.onrender.com"; // <-- change if different

const generateBtn = document.getElementById("generateBtn");
const promptInput = document.getElementById("prompt");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");
const durationInput = document.getElementById("duration");

generateBtn.addEventListener("click", generateRhyme);

async function generateRhyme() {
  const prompt = promptInput.value.trim();
  const duration = durationInput.value.trim();

  if (!prompt) {
    statusEl.innerText = "Please type a prompt first.";
    return;
  }

  statusEl.innerText = "Generating rhyme... Please wait...";
  outputEl.innerText = "";

  // Common endpoint candidates — if one fails we'll try the next
  const endpoints = [
    "/api/generate",
    "/generate",
    "/api/generate_video",
    "/generate_video",
    "/generate-rhyme"
  ];

  const payload = { prompt };
  if (duration) payload.duration = duration;

  let got = null;
  for (const ep of endpoints) {
    const url = API_BASE.replace(/\/$/, "") + ep;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // if 404 or other error, continue to next endpoint
        console.warn("Endpoint", url, "returned", res.status);
        continue;
      }

      // try parse json
      const data = await res.json();
      got = data;
      statusEl.innerText = "Generated from: " + url;
      break;
    } catch (err) {
      console.warn("Error calling", url, err);
      continue;
    }
  }

  if (!got) {
    statusEl.innerText = "Could not contact backend endpoints. Check API_BASE and routes.";
    outputEl.innerText = "Try:\n1) Ensure API_BASE is correct.\n2) Check your backend logs for accepted POST path (e.g. /api/generate).\n3) Open backend URL + /api/test in browser to confirm.";
    return;
  }

  // Try to find a readable field from backend
  const possible = [
    "rhyme","text","result","data","output","message","result_text","generated"
  ];

  let shown = null;
  for (const k of possible) {
    if (got[k]) { shown = got[k]; break; }
  }

  // sometimes backend returns plain string, or nested object
  if (!shown) {
    if (typeof got === "string") shown = got;
    else shown = JSON.stringify(got, null, 2);
  }

  outputEl.innerText = shown;
  statusEl.innerText = "Done — check output below.";
}
