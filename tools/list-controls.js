/**
 * Lists every Syncfusion control (exported class deriving from ej2-base Component) in the installed @syncfusion/ej2-* packages
 * and whether a wrapper in src/widgets already uses it.
 *   node tools/list-controls.js [--json]
 */
const ts = require('typescript');
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const sf = path.join(root, 'node_modules/@syncfusion');
const skip = new Set(['ej2', 'ej2-base']);

const wrapped = new Set();
(function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(e => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { walk(p); } else if (p.endsWith('.ts')) {
      const t = fs.readFileSync(p, 'utf8');
      const m = t.match(/extends\s+\w+<\s*(\w+)\s*,\s*(\w+)\s*>/);
      const imp = t.match(/import\s*\{([^}]*)\}\s*from\s*['"](@syncfusion\/[^'"]+)['"]/g) || [];
      if (m) { wrapped.add(m[1]); }
    }
  });
})(path.join(root, 'src/widgets'));

const pkgs = fs.readdirSync(sf).filter(n => n.startsWith('ej2-') && !skip.has(n));
const entries = [];
for (const pkg of pkgs) {
  const dir = path.join(sf, pkg);
  let pj; try { pj = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8')); } catch (e) { continue; }
  const typesFile = pj.types || pj.typings; if (!typesFile) { continue; }
  const entry = path.join(dir, typesFile);
  if (!fs.existsSync(entry)) { continue; }
  const program = ts.createProgram([entry], { target: ts.ScriptTarget.ES2017, moduleResolution: ts.ModuleResolutionKind.NodeJs, skipLibCheck: true, noEmit: true });
  const checker = program.getTypeChecker();
  const source = program.getSourceFile(entry);
  const sym = source && checker.getSymbolAtLocation(source);
  if (!sym) { continue; }
  for (const exp of checker.getExportsOfModule(sym)) {
    let s = exp; if (s.flags & ts.SymbolFlags.Alias) { s = checker.getAliasedSymbol(s); }
    if (!(s.flags & ts.SymbolFlags.Class)) { continue; }
    const decl = s.declarations[0];
    const type = checker.getDeclaredTypeOfSymbol(s);
    const bases = checker.getBaseTypes(type);
    let isComponent = false; let cur = bases[0];
    for (let i = 0; cur && i < 12; i++) {
      const n = cur.symbol && cur.symbol.getName();
      if (n === 'Component' && /ej2-base/.test(cur.symbol.declarations[0].getSourceFile().fileName)) { isComponent = true; break; }
      const b = checker.getBaseTypes(cur.target || cur); cur = b[0];
    }
    if (!isComponent) { continue; }
    const name = s.getName();
    const model = (checker.getExportsOfModule(sym).find(e => e.getName() === name + 'Model')) ? name + 'Model' : null;
    entries.push({ pkg: '@syncfusion/' + pkg, name, model, wrapped: wrapped.has(name) });
  }
}
if (process.argv.includes('--json')) { console.log(JSON.stringify(entries, null, 1)); } else {
  entries.forEach(e => console.log(`${e.wrapped ? 'x' : ' '} ${e.pkg} ${e.name} ${e.model || '(no model export)'}`));
  console.log(`\n${entries.filter(e => e.wrapped).length}/${entries.length} wrapped`);
}
