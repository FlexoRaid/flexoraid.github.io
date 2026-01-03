const files = [
  // Index
  "index.html",

  // Home
  "Home/home.css",
  "Home/home.js",
  "Home/code-lines.js",

  // Art Gallery
  "Art-Gallery/art-gallery.html",
  "Art-Gallery/art-gallery.css",
  "Art-Gallery/art-gallery.js",

  // JavaScript Page
  "JavaScript/JavaScript.html",
  "JavaScript/JavaScript.css",
  "JavaScript/JavaScript.js",

  // Programming Languages
  "programming-languages/programming-languages.html",
  "programming-languages/programming-languages.css",
  "programming-languages/programming-languages.js",

  // Weather
  "weather/weather.html",
  "weather/weather.css",
  "weather/weather.js"
];

async function countAllLines() {
  let total = 0;

  for (const file of files) {
    try {
      const res = await fetch(file);
      const text = await res.text();

      const lines = text
        .split("\n")
        .filter(line => line.trim() !== "").length;

      total += lines;
    } catch (e) {
      console.warn("Could not load:", file);
    }
  }

  document.getElementById("code-lines").textContent = total;
}

countAllLines();