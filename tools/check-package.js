/**
 * Packs the plugin, installs the tarball into an empty project and checks that every bare import in dist resolves there.
 * The dev-app resolves some paths through tsconfig baseUrl, which a consumer does not have, so e2e cannot catch those.
 * Run after `yarn build`.
 */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const name = require(path.join(root, 'package.json')).name;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'bridge-pack-'));
const run = (cmd, cwd) => execSync(cmd, { cwd, stdio: ['ignore', 'pipe', 'inherit'] }).toString().trim();

try {
  const tgz = run(`npm pack --silent --pack-destination "${tmp}"`, root).split('\n').pop();
  fs.writeFileSync(path.join(tmp, 'package.json'), '{"name":"consumer","version":"1.0.0"}');
  run(`npm install --silent --no-audit --no-fund "./${tgz}"`, tmp);

  const dist = path.join(tmp, 'node_modules', name, 'dist');
  const specs = new Map();
  const add = (spec, file) => {
    if (!/^(\.|exports$|require$)/.test(spec) && spec !== 'text' && !specs.has(spec)) { specs.set(spec, file); }
  };
  (function walk(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) { return walk(file); }
      if (!/\.js$/.test(entry.name)) { return; }
      const text = fs.readFileSync(file, 'utf8');
      for (const m of text.matchAll(/(?:require\(|from\s+)["']([^"']+)["']/g)) { add(m[1], file); }
      for (const m of text.matchAll(/define\(\[([^\]]*)\]/g)) {
        for (const s of m[1].matchAll(/["']([^"']+)["']/g)) { add(s[1], file); }
      }
    });
  })(dist);

  const missing = [];
  specs.forEach((file, spec) => {
    const pkg = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
    try { require.resolve(`${pkg}/package.json`, { paths: [tmp] }); } catch (e) {
      try { require.resolve(spec, { paths: [tmp] }); } catch (e2) { missing.push(`${spec}  (from ${path.relative(dist, file)})`); }
    }
  });

  if (missing.length) {
    console.error(`unresolved imports in the published package:\n  ${missing.join('\n  ')}`);
    process.exitCode = 1;
  } else {
    console.log(`all ${specs.size} imports in dist resolve from a clean install of ${name}`);
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
