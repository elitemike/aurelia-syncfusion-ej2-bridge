/**
 * aurelia-cli 1.x parses vendor packages with an old esprima that rejects newer syntax (object spread, ...).
 * Down-level the packages that need it into tools/vendor/<package>, aurelia_project/aurelia.json maps them over the originals.
 * Runs before every dev-app build (see package.json and playwright.config.ts).
 */
const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const packages = ['prosemirror-tables'];

packages.forEach(name => {
  const dir = path.join(root, 'node_modules', name);
  if (!fs.existsSync(dir)) { return; }
  const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
  const main = fs.readFileSync(path.join(dir, pkg.main || 'index.js'), 'utf8');
  const out = ts.transpileModule(main, { compilerOptions: { target: ts.ScriptTarget.ES2015, module: ts.ModuleKind.CommonJS, allowJs: true } }).outputText;
  const target = path.join(__dirname, 'vendor', name);
  fs.mkdirSync(target, { recursive: true });
  fs.writeFileSync(path.join(target, 'index.js'), out);
});
