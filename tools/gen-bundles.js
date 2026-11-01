/**
 * Splits the dev-app build into lazily loaded bundles so a demo page only downloads the control it shows:
 *   <control>-bundle.js   the wrapper (src/widgets/<control>) and its demo (dev-app/<control>)
 *   <package>-bundle.js   one per @syncfusion/ej2-* package the wrappers use, directly or transitively
 *   app-bundle.js         the shell and shared code (common, utilities, helpers)
 *   vendor-bundle.js      aurelia, lodash and requirejs only
 * requirejs learns which bundle holds a module from the metadata aurelia-cli writes into vendor-bundle.js.
 * Rewrites the "bundles" list of aurelia_project/aurelia.json, runs before every dev-app build.
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const configPath = path.join(root, 'aurelia_project', 'aurelia.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const ext = '{js,json,css,html}';

const dirs = p => fs.readdirSync(path.join(root, p), { withFileTypes: true }).filter(e => e.isDirectory()).map(e => e.name).sort();
const widgets = dirs('src/widgets');
const demos = new Set(dirs('dev-app'));

const controlBundles = widgets.map(w => ({
  name: `${w}-bundle.js`,
  // aurelia-cli matches these against the absolute file path
  source: [...(demos.has(w) ? [`**/dev-app/${w}/**/*.${ext}`] : []), `**/src/widgets/${w}/**/*.${ext}`]
}));

// every ej2 package the wrappers import, plus whatever those depend on
const wanted = new Set();
const scan = dir => fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
  const file = path.join(dir, e.name);
  if (e.isDirectory()) { return scan(file); }
  if (!/\.ts$/.test(e.name)) { return; }
  for (const m of fs.readFileSync(file, 'utf8').matchAll(/from\s+["'](@syncfusion\/ej2-[a-z0-9-]+)/g)) { wanted.add(m[1]); }
});
scan(path.join(root, 'src'));
const queue = [...wanted];
while (queue.length) {
  const pkgJson = path.join(root, 'node_modules', queue.pop(), 'package.json');
  if (!fs.existsSync(pkgJson)) { continue; }
  Object.keys(JSON.parse(fs.readFileSync(pkgJson, 'utf8')).dependencies || {})
    .filter(d => d.startsWith('@syncfusion/ej2-') && !wanted.has(d))
    .forEach(d => { wanted.add(d); queue.push(d); });
}
// style/font-only packages (ej2-icons) have no JS main to bundle
const hasMain = name => {
  const dir = path.join(root, 'node_modules', name);
  if (!fs.existsSync(path.join(dir, 'package.json'))) { return false; }
  const main = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')).main || 'index.js';
  return fs.existsSync(path.join(dir, main)) || fs.existsSync(path.join(dir, main + '.js'));
};
const packageBundles = [...wanted].filter(hasMain).sort().map(name => ({ name: `${name.replace('@syncfusion/', '')}-bundle.js`, dependencies: [name] }));

const existing = config.build.bundles;
const app = existing.find(b => b.name === 'app-bundle.js');
const vendor = existing.find(b => b.name === 'vendor-bundle.js');
// the first bundle whose source matches a file takes it, so the specific bundles go before app-bundle
config.build.bundles = [...controlBundles, ...packageBundles, app, vendor];

fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n');
console.log(`bundles: ${controlBundles.length} controls, ${packageBundles.length} ej2 packages, app, vendor`);
