# `aurelia-syncfusion-ej-2-bridge`

This wrapper is not fully supported, use at your own risk

# Supported controls
Every control also has a page in the dev app (see below). Properties and events are the Syncfusion model members, listed in `src/controlBindings.ts`.

**Buttons**: Button, CheckBox, Progress Button, Radio Button, Switch, Chip List, Fab, Speed Dial, Smart Paste Button, Drop Down Button, Split Button

**Inputs**: TextBox, Masked TextBox, Numeric TextBox, Slider, Uploader, Rich Text Editor, Color Picker, Text Area, Smart Text Area, Signature, Rating, Otp Input, Speech To Text

**Dropdowns**: AutoComplete, ComboBox, DropDownList, DropDownTree, MultiSelect, List Box, Mention, Multi Column Combo Box

**Calendars**: DatePicker, DateRangePicker, DateTimePicker, TimePicker, Schedule, Calendar, Recurrence Editor

**Data**: Grid, Pager, ListView, TreeView, File Manager, Timeline, Gantt, Kanban, Pivot View, Pivot Field List, Query Builder, Spreadsheet, Tree Grid

**Layout**: Accordion, Dashboard Layout, Sidebar, Splitter

**Barcodes**: Barcode Generator, QR Code Generator, Data Matrix Generator, PDF417 Generator

**Editors**: Block Editor, Form Builder, Form Renderer, In Place Editor, Rich Text Editor UI

**Charts**: Chart, Accumulation Chart, Stock Chart, Range Navigator, Bullet Chart, Smithchart, Sparkline, Chart3 D, Circular Chart3 D, Sankey, Heat Map

**Gauges**: Circular Gauge, Linear Gauge, Progress Bar

**Diagrams**: Diagram, Symbol Palette, Ruler, Overview

**Documents**: Document Editor, Document Editor Container, Image Editor, Pdf Viewer, Pdf Comparer

**AI**: AI Assist View, Chat UI, Inline AI Assist

**Maps**: Maps, Tree Map

**Navigation**: Toolbar, Context Menu, Menu, Tab, Breadcrumb, Carousel, App Bar, Stepper, Ribbon

**Notifications**: Toast, Message, Skeleton

**Popups**: Popup, Dialog, Tooltip

# Dev app and end-to-end tests
`yarn start` serves the dev app on http://localhost:8090. Each control has a page of feature samples
(`dev-app/<control>/`), registered once in `dev-app/nav.ts`, which drives both the router and the sidebar.
Samples are wrapped in `<demo-section id="...">` and located in tests through `data-testid`.

`yarn e2e` runs the Playwright suite in `e2e/` (starts the dev server itself, `yarn e2e:ui` for the UI runner).
* `smoke.spec.ts` visits every registered control and fails on any console or page error.
* One spec per control (`e2e/<control>.spec.ts`) covering bindings, events, widget API and lifecycle (`if.bind`).
* Add a control: register it in `nav.ts`, build the demo sections, add `e2e/<control>.spec.ts`.

`yarn check:bindings` verifies every bindable name in `src/controlBindings.ts` exists on the Syncfusion model of its wrapper,
`yarn sync:bindings` adds members that Syncfusion introduced since (properties as one-way, `EmitType` members as events).

## Keeping the wrappers in sync with Syncfusion
- `yarn check:bindings` validates every bindable name against the Syncfusion models, `yarn sync:bindings` adds missing members.
- `node tools/list-controls.js` lists every control in the installed `@syncfusion/ej2-*` packages and whether it is wrapped.
- `node tools/scaffold-wrappers.js` generates wrapper, bindings entry, ConfigBuilder registration, route and demo skeleton for controls that are not wrapped yet.
- `yarn check:coverage` reports bindable properties/events no demo binds. Each bound member is asserted in `e2e/<control>.spec.ts`.
