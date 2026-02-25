async function listModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const text = await response.text();
    console.log("Raw Response:");
    console.log(text);
  } catch (err) {
    console.error("Failed to list models:", err);
  }
}
listModels();
