// Builds the per-example source shown in the demo-section tabs (Markup / TypeScript).
// For every routed demo it writes scripts/demo-src/<route>.json: { <section id>: { markup, ts, file } }
//  - markup: the content of the <demo-section> block, dedented
//  - ts: only the parts of the demo's view-model that example uses: class members named in its bindings, anything
//    those reach through `this.`, and the imports / module-level declarations they in turn need.
// nav.ts is the registry of routed demos; composed demos (PLATFORM.moduleName inside a view-model) belong to the route.
const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const root = path.join(__dirname, '..', 'dev-app');
const out = path.join(__dirname, '..', 'scripts', 'demo-src');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));

function demoModules(moduleId, seen) {
  if (seen.has(moduleId) || !exists(`${moduleId}.html`)) { return; }
  seen.add(moduleId);
  if (!exists(`${moduleId}.ts`)) { return; }
  for (const m of read(`${moduleId}.ts`).matchAll(/PLATFORM\.moduleName\('([^']+)'\)/g)) { demoModules(m[1], seen); }
}

function dedent(text) {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
  return lines.map(l => l.slice(indent)).join('\n');
}

/** Identifiers that appear in binding expressions and interpolations (not plain attribute text). */
function bindingIdentifiers(markup) {
  const exprs = [];
  for (const m of markup.matchAll(/\$\{([^}]*)\}/g)) { exprs.push(m[1]); }
  for (const m of markup.matchAll(/[\w.:@-]+\.(?:bind|delegate|capture|trigger|call|two-way|one-way|one-time|to-view|from-view|ref)\s*=\s*("[^"]*"|'[^']*')/g)) { exprs.push(m[1].slice(1, -1)); }
  for (const m of markup.matchAll(/\b(?:repeat\.for|compose|view-model\.bind|ref)\s*=\s*"([^"]*)"/g)) { exprs.push(m[1]); }
  const ids = new Set();
  for (const e of exprs) {
    // strip quoted strings, then property accesses after a dot (a.b -> a)
    for (const m of e.replace(/'[^']*'|"[^"]*"/g, ' ').matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)/g)) { ids.add(m[1]); }
  }
  return ids;
}

function identifiersIn(node, sf) {
  const ids = new Set();
  (function walk(n) { if (ts.isIdentifier(n)) { ids.add(n.text); } ts.forEachChild(n, walk); })(node);
  return ids;
}

function thisMembersIn(node) {
  const names = new Set();
  (function walk(n) {
    if (ts.isPropertyAccessExpression(n) && n.expression.kind === ts.SyntaxKind.ThisKeyword) { names.add(n.name.text); }
    ts.forEachChild(n, walk);
  })(node);
  return names;
}

function analyse(tsText) {
  const sf = ts.createSourceFile('vm.ts', tsText, ts.ScriptTarget.Latest, true);
  const model = { sf, imports: [], decls: [], cls: null, members: [] };
  for (const st of sf.statements) {
    if (ts.isImportDeclaration(st)) { model.imports.push(st); }
    else if (ts.isClassDeclaration(st) && st.name && !model.cls) { model.cls = st; }
    else { model.decls.push(st); }
  }
  if (model.cls) {
    for (const m of model.cls.members) {
      const name = m.name && (ts.isIdentifier(m.name) || ts.isStringLiteral(m.name)) ? m.name.text : ts.isConstructorDeclaration(m) ? 'constructor' : null;
      model.members.push({ node: m, name });
    }
  }
  return model;
}

const declNames = st => {
  if (ts.isVariableStatement(st)) { return st.declarationList.declarations.map(d => d.name.getText()); }
  return st.name ? [st.name.text] : [];
};

/** Long module-level sample data keeps its first two entries; the result stays valid TypeScript. Anything else is shown whole. */
function elide(stmt, text) {
  const full = text.slice(stmt.getStart(), stmt.getEnd());
  if (full.split('\n').length <= 14 || !ts.isVariableStatement(stmt) || stmt.declarationList.declarations.length !== 1) { return full; }
  const init = stmt.declarationList.declarations[0].initializer;
  const list = init && (ts.isArrayLiteralExpression(init) ? init.elements : ts.isObjectLiteralExpression(init) ? init.properties : null);
  if (!list || list.length <= 3) { return full; }
  const open = init.getStart();
  const close = init.getEnd();
  const kept = list.slice(0, 2).map(n => '  ' + text.slice(n.getStart(), n.getEnd()).replace(/\n/g, '\n  '));
  const [lb, rb] = ts.isArrayLiteralExpression(init) ? ['[', ']'] : ['{', '}'];
  return `${text.slice(stmt.getStart(), open)}${lb}\n${kept.join(',\n')},\n  // ... ${list.length - 2} more\n${rb}${text.slice(close, stmt.getEnd())}`;
}

function extractTs(model, wanted, fileName) {
  if (!model.cls) { return null; }
  const chosen = new Set();
  const queue = [...wanted].filter(n => model.members.some(m => m.name === n));
  const constructor = model.members.find(m => m.name === 'constructor');
  while (queue.length) {
    const name = queue.pop();
    if (chosen.has(name)) { continue; }
    chosen.add(name);
    for (const m of model.members.filter(x => x.name === name)) {
      for (const ref of thisMembersIn(m.node)) { if (model.members.some(x => x.name === ref)) { queue.push(ref); } }
    }
  }
  // the constructor is kept when it touches something this example uses
  if (constructor && !chosen.has('constructor') && [...thisMembersIn(constructor.node)].some(r => chosen.has(r))) {
    queue.push('constructor');
    while (queue.length) {
      const name = queue.pop();
      if (chosen.has(name)) { continue; }
      chosen.add(name);
      for (const m of model.members.filter(x => x.name === name)) {
        for (const ref of thisMembersIn(m.node)) { if (model.members.some(x => x.name === ref)) { queue.push(ref); } }
      }
    }
  }
  const members = model.members.filter(m => m.name && chosen.has(m.name));
  if (!members.length) { return null; }

  // module-level declarations and imports needed by the chosen members, transitively
  const needed = new Set();
  members.forEach(m => identifiersIn(m.node).forEach(i => needed.add(i)));
  (model.cls.heritageClauses || []).forEach(h => identifiersIn(h).forEach(i => needed.add(i)));
  const decls = new Set();
  let grew = true;
  while (grew) {
    grew = false;
    for (const d of model.decls) {
      if (!decls.has(d) && declNames(d).some(n => needed.has(n))) {
        decls.add(d);
        identifiersIn(d).forEach(i => needed.add(i));
        grew = true;
      }
    }
  }
  const importLines = [];
  for (const imp of model.imports) {
    const c = imp.importClause;
    const from = imp.moduleSpecifier.getText();
    if (!c) { continue; }
    const named = c.namedBindings && ts.isNamedImports(c.namedBindings) ? c.namedBindings.elements.filter(e => needed.has(e.name.text)).map(e => e.getText()) : [];
    const def = c.name && needed.has(c.name.text) ? c.name.text : null;
    const ns = c.namedBindings && ts.isNamespaceImport(c.namedBindings) && needed.has(c.namedBindings.name.text) ? `* as ${c.namedBindings.name.text}` : null;
    const parts = [def, ns, named.length ? `{ ${named.join(', ')} }` : null].filter(Boolean);
    if (parts.length) { importLines.push(`import ${parts.join(', ')} from ${from};`); }
  }
  const text = model.sf.text;
  const isProp = m => ts.isPropertyDeclaration(m.node);
  let body = '';
  members.forEach((m, i) => {
    const t = text.slice(m.node.getFullStart(), m.node.getEnd()).replace(/^(\s*\n)+/, '');
    body += (i ? (isProp(m) && isProp(members[i - 1]) ? '\n' : '\n\n') : '') + t;
  });
  const heritage = (model.cls.heritageClauses || []).map(h => ' ' + h.getText()).join('');
  const parts = [];
  if (importLines.length) { parts.push(importLines.join('\n')); }
  [...decls].forEach(d => parts.push(elide(d, text)));
  parts.push(`export class ${model.cls.name.text}${heritage} {\n${body}\n}`);
  return parts.join('\n\n');
}

/** Local files a view-model imports (sample data, helpers), the other files a reader needs for the full picture. */
function relatedFiles(moduleId) {
  if (!exists(`${moduleId}.ts`)) { return []; }
  const dir = path.posix.dirname(moduleId);
  const found = [];
  for (const m of read(`${moduleId}.ts`).matchAll(/from '(\.{1,2}\/[^']+)'/g)) {
    const dep = path.posix.normalize(path.posix.join(dir, m[1]));
    if (exists(`${dep}.ts`) && dep !== 'nav' && dep !== 'environment') { found.push(`${dep}.ts`); }
  }
  return found;
}

const nav = read('nav.ts');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
let sections = 0;
let withTs = 0;
for (const r of nav.matchAll(/route: '([^']+)'.*?PLATFORM\.moduleName\('([^']+)'\)/g)) {
  const [, route, moduleId] = r;
  const modules = new Set();
  demoModules(moduleId, modules);
  const result = { sections: {}, files: {}, related: {} };
  const addFile = f => { if (!result.files[f]) { result.files[f] = read(f); } };
  for (const mod of modules) {
    const html = read(`${mod}.html`);
    const model = exists(`${mod}.ts`) ? analyse(read(`${mod}.ts`)) : null;
    addFile(`${mod}.html`);
    if (exists(`${mod}.ts`)) { addFile(`${mod}.ts`); }
    result.related[mod] = relatedFiles(mod);
    result.related[mod].forEach(addFile);
    for (const m of html.matchAll(/<demo-section\b([^>]*)>([\s\S]*?)<\/demo-section>/g)) {
      const id = (m[1].match(/\bid="([^"]+)"/) || [])[1];
      if (!id) { throw new Error(`${mod}.html: <demo-section> without an id`); }
      if (result.sections[id]) { throw new Error(`${route}: duplicate demo-section id "${id}"`); }
      const markup = dedent(m[2]);
      const wanted = bindingIdentifiers(markup);
      const tsText = model && extractTs(model, wanted, `${mod}.ts`);
      if (tsText) {
        // guards: the extract must be valid TypeScript and contain every view-model member the markup binds to
        const diagnostics = ts.transpileModule(tsText, { reportDiagnostics: true, compilerOptions: { target: ts.ScriptTarget.ES2019 } }).diagnostics;
        if (diagnostics && diagnostics.length) { if (process.env.DEBUG_GEN) { console.log(tsText); } throw new Error(`${route}/${id}: extract is not valid TypeScript: ${diagnostics[0].messageText}`); }
        for (const member of model.members) {
          if (member.name && member.name !== 'constructor' && wanted.has(member.name) && !new RegExp(`\\b${member.name}\\b`).test(tsText)) {
            throw new Error(`${route}/${id}: binding to "${member.name}" is missing from the extract`);
          }
        }
      }
      result.sections[id] = { markup, ts: tsText || '// This example needs no view-model code: it only uses the markup.', module: mod };
      sections++;
      if (tsText) { withTs++; }
    }
  }
  fs.writeFileSync(path.join(out, `${route}.json`), JSON.stringify(result));
}
console.log(`demo sections: ${sections} (${withTs} with view-model code)`);
