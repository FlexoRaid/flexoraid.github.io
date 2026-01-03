const files = [
  "/index.html",

  "/Home/home.css",
  "/Home/home.js",
  "/Home/code-lines.js",

  "/Art-Gallery/art-gallery.html",
  "/Art-Gallery/art-gallery.css",
  "/Art-Gallery/art-gallery.js",

  "/JavaScript/JavaScript.html",
  "/JavaScript/JavaScript.css",
  "/JavaScript/JavaScript.js",

  "/programming-languages/programming-languages.html",
  "/programming-languages/programming-languages.css",
  "/programming-languages/programming-languages.js",

  "/weather/weather.html",
  "/weather/weather.css",
  "/weather/weather.js"
];

async function countAllLines() {
  let total = 0;

  for (const file of files) {
    try {
      const res = await fetch(file);

      if (!res.ok) {
        console.error("❌ NOT FOUND:", file);
        continue;
      }

      const text = await res.text();

      // 🔥 KORREKT für Windows + Linux
      const lines = text.split(/\r\n|\n|\r/).length;

      console.log(`✔ ${file}: ${lines}`);
      total += lines;

    } catch (err) {
      console.error("⚠️ ERROR:", file);
    }
  }

  document.getElementById("code-lines").textContent = total;
}

countAllLines();