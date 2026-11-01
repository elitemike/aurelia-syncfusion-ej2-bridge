/**
 * Consumers must be able to load one control without the rest. Walks the relative import graph of the built package and fails when
 *  - the plugin entry (index) reaches any widget, or
 *  - a widget reaches another widget's own folder (shared helpers directly under widgets/ are allowed).
 * Run after `yarn build`.
 */
const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, '..', 'dist', 'commonjs');
const widgetOf = file => { const m = path.relative(dist, file).split(path.sep); return m[0] === 'widgets' && m.length > 2 ? m[1] : null; };

function closure(entry) {
  const seen = new Set();
  (function visit(file) {
    if (seen.has(file)) { return; }
    seen.add(file);
    const text = fs.readFileSync(file, 'utf8');
    for (const m of text.matchAll(/require\(["'](\.[^"']*)["']\)/g)) {
      const base = path.resolve(path.dirname(file), m[1]);
      const target = [base + '.js', path.join(base, 'index.js')].find(f => fs.existsSync(f));
      if (target) { visit(target); }
    }
  })(entry);
  return seen;
}

const problems = [];
const fromIndex = [...closure(path.join(dist, 'index.js'))].filter(widgetOf);
if (fromIndex.length) { problems.push(`index reaches widgets: ${fromIndex.map(f => path.relative(dist, f)).join(', ')}`); }

let widgets = 0;
fs.readdirSync(path.join(dist, 'widgets'), { withFileTypes: true }).filter(e => e.isDirectory()).forEach(dir => {
  fs.readdirSync(path.join(dist, 'widgets', dir.name)).filter(f => f.endsWith('.js')).forEach(file => {
    widgets++;
    closure(path.join(dist, 'widgets', dir.name, file)).forEach(reached => {
      const other = widgetOf(reached);
      if (other && other !== dir.name) { problems.push(`widgets/${dir.name}/${file} reaches widgets/${other}`); }
    });
  });
});

if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`index loads no widget; ${widgets} widget modules load only their own folder`);
}
