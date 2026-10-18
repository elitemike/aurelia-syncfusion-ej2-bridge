/**
 * Compares the bindable names in src/controlBindings.ts with the real Syncfusion model of every wrapper.
 * Reports names that do not exist on the model (typos / removed APIs) and model members that are not exposed.
 *   node tools/check-bindings.js [--missing]   report names that are on the model but not bindable
 *   node tools/check-bindings.js --write       add the missing members (props to oneWay, EmitType to events)
 *                                              and rewrite src/controlBindings.ts
 */
const ts = require('typescript');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const showMissing = process.argv.includes('--missing');
const write = process.argv.includes('--write');
const common = new Set(['enablePersistence', 'enableRtl', 'locale']);

const bindingsSource = fs.readFileSync(path.join(root, 'src/controlBindings.ts'), 'utf8');
const compiled = ts.transpileModule(bindingsSource, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const m = { exports: {} };
// controlBindings.ts imports a widget type for typing only, stub the require
new Function('module', 'exports', 'require', compiled)(m, m.exports, () => ({}));
const bindings = m.exports.ControlBindings;

const files = [];
(function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); } else if (p.endsWith('.ts')) { files.push(p); }
  });
})(path.join(root, 'src/widgets'));

const config = ts.getParsedCommandLineOfConfigFile(path.join(root, 'tsconfig.json'), {}, { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => { } });
const program = ts.createProgram(files, config.options);
const checker = program.getTypeChecker();

let problems = 0;
const output = {};
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const match = text.match(/generateBindables\("(\w+)"\)/);
  if (!match) { continue; }
  const name = match[1];
  const sf = program.getSourceFile(file);
  let modelType = null;
  ts.forEachChild(sf, function visit(node) {
    if (ts.isClassDeclaration(node) && node.heritageClauses) {
      const t = node.heritageClauses[0].types[0];
      if (t.typeArguments && t.typeArguments.length === 2) { modelType = checker.getTypeFromTypeNode(t.typeArguments[1]); }
    }
    ts.forEachChild(node, visit);
  });
  const entry = bindings[name];
  if (!entry) { console.log(`${name}: no entry in controlBindings`); problems++; continue; }
  if (!modelType) { console.log(`${name}: cannot resolve model type (${path.relative(root, file)})`); continue; }
  const members = new Set(checker.getPropertiesOfType(modelType).map(p => p.getName()));
  if (members.size === 0) { console.log(`${name}: model type resolved to no members (any?)`); continue; }

  // additions are collected even when not printed
  const added = { oneWay: [], events: [] };
  const listed = new Set([...(entry.oneWay || []), ...(entry.twoWay || []), ...(entry.fromView || []), ...(entry.events || [])]);
  const unknown = [...listed].filter(n => !members.has(n));
  if (unknown.length) { problems++; console.log(`${name}: not on the model -> ${unknown.join(', ')}`); }
  members.forEach(n => {
    if (listed.has(n) || common.has(n)) { return; }
    const symbol = checker.getPropertiesOfType(modelType).find(p => p.getName() === n);
    const typeText = checker.typeToString(checker.getTypeOfSymbolAtLocation(symbol, sf));
    (/EmitType</.test(typeText) ? added.events : added.oneWay).push(n);
  });
  output[name] = added;
  if (showMissing) {
    const absent = [...members].filter(n => !listed.has(n) && !/Model$/.test(n));
    if (absent.length) { console.log(`${name}: model members not bindable -> ${absent.join(', ')}`); }
  }
}
if (write) {
  const lines = [];
  const list = (key, names) => {
    if (!names || !names.length) { return; }
    const chunks = [];
    let line = '';
    names.forEach(n => {
      const item = JSON.stringify(n);
      if ((line + item).length > 100) { chunks.push(line.trimEnd()); line = ''; }
      line += item + ', ';
    });
    chunks.push(line.replace(/, $/, ''));
    lines.push(`    ${key}: [\n      ${chunks.join('\n      ')}\n    ]`);
  };
  const body = Object.keys(bindings).map(name => {
    lines.length = 0;
    const b = bindings[name];
    const extra = output[name] || { oneWay: [], events: [] };
    list('oneWay', (b.oneWay || []).concat(extra.oneWay.filter(n => (b.oneWay || []).indexOf(n) === -1)));
    list('twoWay', b.twoWay);
    list('fromView', b.fromView);
    list('events', (b.events || []).concat(extra.events.filter(n => (b.events || []).indexOf(n) === -1)));
    return `  ${name}: {\n${lines.join(',\n')}\n  }`;
  });
  fs.writeFileSync(path.join(root, 'src/controlBindings.ts'),
    `// Bindable names per control. Keep in sync with the Syncfusion models: node tools/check-bindings.js --write\nexport const ControlBindings = {\n${body.join(',\n')}\n};\n`);
  console.log('src/controlBindings.ts rewritten');
}
console.log(problems ? `\n${problems} control(s) with problems` : '\nall bindable names exist on their models');
process.exit(problems ? 1 : 0);
