// Copies every Syncfusion EJ2 theme stylesheet next to the dev-app bundle so the shell can swap the
// active theme at runtime (<link id="theme-link">) and writes themes.json listing what was copied.
const fs = require('fs');
const path = require('path');
const from = path.join(__dirname, '..', 'node_modules', '@syncfusion', 'ej2');
const to = path.join(__dirname, '..', 'scripts', 'themes');
if (fs.existsSync(from)) {
  fs.mkdirSync(to, { recursive: true });
  const themes = fs.readdirSync(from)
    .filter(f => f.endsWith('.css') && !f.endsWith('-lite.css'))
    .map(f => f.slice(0, -4))
    .sort();
  themes.forEach(t => fs.copyFileSync(path.join(from, t + '.css'), path.join(to, t + '.css')));
  fs.writeFileSync(path.join(to, 'themes.json'), JSON.stringify(themes));
}
