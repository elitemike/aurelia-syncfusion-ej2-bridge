// Copies the PDF viewer's pdfium worker/WASM resources next to the dev-app bundle so `resourceUrl`
// can point at the local server (/scripts/ej2-pdfviewer-lib) instead of the Syncfusion CDN.
const fs = require('fs');
const path = require('path');
const from = path.join(__dirname, '..', 'node_modules', '@syncfusion', 'ej2-pdfviewer', 'dist', 'ej2-pdfviewer-lib');
const to = path.join(__dirname, '..', 'scripts', 'ej2-pdfviewer-lib');
if (fs.existsSync(from)) {
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(f => fs.copyFileSync(path.join(from, f), path.join(to, f)));
}
