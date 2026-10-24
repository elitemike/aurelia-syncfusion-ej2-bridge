/**
 * Creates the boilerplate for every Syncfusion control that has no wrapper yet (see tools/list-controls.js):
 *   src/widgets/<name>/ej2-<name>.ts, a controlBindings entry, ConfigBuilder registration, a dev-app route + demo skeleton.
 * Run `node tools/check-bindings.js --write` afterwards to fill the bindable properties/events from the models.
 *   node tools/scaffold-wrappers.js [--dry]
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const dry = process.argv.includes('--dry');

// internal bases, helpers of another control, or duplicates of a control that is already wrapped from another package
const skip = new Set(['CalendarBase', 'DropDownBase', 'AIAssistBase', 'InterActiveChatBase', 'StepperBase', 'SignatureBase', 'HScroll', 'VScroll',
  'Workbook', 'RibbonBackstage', 'Tooltip@@ej2-svg-base']);
// host element the widget is appended to; everything else is a div
const elements = {
  ColorPicker: 'input', MultiColumnComboBox: 'input', Rating: 'input', TextArea: 'textarea', SmartTextArea: 'textarea', Signature: 'canvas',
  SpeechToText: 'button', Fab: 'button', SpeedDial: 'button', SmartPasteButton: 'button', DropDownButton: 'button', SplitButton: 'button',
  ContextMenu: 'ul', Menu: 'ul', ListBox: 'select'
};
const categories = {
  'ej2-buttons': 'Buttons', 'ej2-splitbuttons': 'Buttons', 'ej2-inputs': 'Inputs', 'ej2-dropdowns': 'Dropdowns', 'ej2-multicolumn-combobox': 'Dropdowns',
  'ej2-calendars': 'Calendars', 'ej2-schedule': 'Calendars', 'ej2-grids': 'Data', 'ej2-treegrid': 'Data', 'ej2-lists': 'Data', 'ej2-pivotview': 'Data',
  'ej2-kanban': 'Data', 'ej2-gantt': 'Data', 'ej2-querybuilder': 'Data', 'ej2-spreadsheet': 'Data', 'ej2-layouts': 'Layout',
  'ej2-navigations': 'Navigation', 'ej2-ribbon': 'Navigation', 'ej2-popups': 'Popups', 'ej2-notifications': 'Notifications',
  'ej2-charts': 'Charts', 'ej2-circulargauge': 'Gauges', 'ej2-lineargauge': 'Gauges', 'ej2-progressbar': 'Gauges', 'ej2-heatmap': 'Charts',
  'ej2-maps': 'Maps', 'ej2-treemap': 'Maps', 'ej2-diagrams': 'Diagrams', 'ej2-barcode-generator': 'Barcodes',
  'ej2-documenteditor': 'Documents', 'ej2-pdfviewer': 'Documents', 'ej2-image-editor': 'Documents', 'ej2-blockeditor': 'Editors',
  'ej2-richtexteditor-ui': 'Editors', 'ej2-inplace-editor': 'Editors', 'ej2-form-builder': 'Editors', 'ej2-form-renderer': 'Editors',
  'ej2-interactive-chat': 'AI'
};

const lowerFirst = n => n.replace(/^PDF417/, 'pdf417').replace(/^([A-Z]+)(?=[A-Z][a-z])/, m => m.toLowerCase()).replace(/^[A-Z]/, c => c.toLowerCase());
const kebab = n => n.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2').toLowerCase();
const words = n => n.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');

const list = JSON.parse(execFileSync('node', [path.join(__dirname, 'list-controls.js'), '--json'], { maxBuffer: 1 << 26 }).toString());
const todo = list.filter(c => !c.wrapped && c.model && !skip.has(c.name) && !skip.has(`${c.name}@${c.pkg.replace('@syncfusion/', '@')}`));
const seen = new Set();
const controls = todo.filter(c => !seen.has(c.name) && seen.add(c.name)).map(c => ({
  ...c, key: lowerFirst(c.name), tag: 'ej2-' + kebab(c.name), cls: 'Ej2' + c.name, el: elements[c.name] || 'div',
  category: categories[c.pkg.replace('@syncfusion/', '')] || 'Other'
}));

const inner = c => ({ input: '<input element.ref="widgetElement" />', textarea: '<textarea element.ref="widgetElement"></textarea>',
  canvas: '<canvas element.ref="widgetElement"></canvas>', button: '<button element.ref="widgetElement"><slot></slot></button>',
  ul: '<ul element.ref="widgetElement"></ul>', select: '<select element.ref="widgetElement"></select>', div: '<div element.ref="widgetElement"></div>' })[c.el];

const wrapperSource = c => `import { ${c.name}, ${c.model} } from '${c.pkg}';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("${c.key}")
@inlineView('<template>${inner(c)}</template>')
@customElement('${c.tag}')
export class ${c.cls} extends SyncfusionWrapper<${c.name}, ${c.model}> {
  protected syncfusionWidgetType = ${c.name};

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
`;

const demoHtml = c => `<template>
  <h2>${words(c.name)}</h2>

  <demo-section id="${c.key}-basic" title="Basic" description="${words(c.name)} rendered with its default options.">
    <${c.tag} data-testid="${c.key}-basic"></${c.tag}>
  </demo-section>
</template>
`;
const demoTs = c => `export class ${c.name}Demo {
}
`;

if (dry) { controls.forEach(c => console.log(`${c.category.padEnd(14)} ${c.key.padEnd(24)} ${c.tag.padEnd(28)} <${c.el}> ${c.pkg}`)); console.log(controls.length); process.exit(0); }

// wrappers + demos
controls.forEach(c => {
  const wdir = path.join(root, 'src/widgets', c.key); fs.mkdirSync(wdir, { recursive: true });
  fs.writeFileSync(path.join(wdir, `ej2-${c.key}.ts`), wrapperSource(c));
  const ddir = path.join(root, 'dev-app', c.key); fs.mkdirSync(ddir, { recursive: true });
  fs.writeFileSync(path.join(ddir, `${c.key}Demo.html`), demoHtml(c));
  fs.writeFileSync(path.join(ddir, `${c.key}Demo.ts`), demoTs(c));
});

// controlBindings: empty entries, filled by check-bindings --write
const bPath = path.join(root, 'src/controlBindings.ts');
let b = fs.readFileSync(bPath, 'utf8');
b = b.replace(/\n\};\n$/, ',\n' + controls.map(c => `  ${c.key}: {\n  }`).join(',\n') + '\n};\n');
fs.writeFileSync(bPath, b);

// ConfigBuilder
const cPath = path.join(root, 'src/configBuider.ts');
let cfg = fs.readFileSync(cPath, 'utf8');
cfg = cfg.replace(/^/, controls.map(c => `import { ${c.cls} } from './widgets/${c.key}/ej2-${c.key}';`).join('\n') + '\n');
cfg = cfg.replace(/(\.ej2Uploader\(\))\n(\s*)return this;/, `$1\n      ${controls.map(c => `.ej2${c.name}()`).join('\n      ')};\n$2return this;`);
cfg = cfg.replace(/\n\}\n$/, '\n' + controls.map(c => `\n  ej2${c.name}(): ConfigBuilder {\n    this.resources.push(${c.cls});\n    return this;\n  }`).join('\n') + '\n}\n');
fs.writeFileSync(cPath, cfg);

// nav
const nPath = path.join(root, 'dev-app/nav.ts');
let nav = fs.readFileSync(nPath, 'utf8');
const rows = controls.map(c => `  { route: '${c.key}', title: '${words(c.name)}', category: '${c.category}', moduleId: PLATFORM.moduleName('${c.key}/${c.key}Demo') }`);
nav = nav.replace(/\n\];\n?$/, ',\n\n' + rows.join(',\n') + '\n];\n');
fs.writeFileSync(nPath, nav);
console.log(`scaffolded ${controls.length} controls`);
