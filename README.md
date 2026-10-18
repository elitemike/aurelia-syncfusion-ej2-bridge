# `aurelia-syncfusion-ej-2-bridge`

This wrapper is not fully supported, use at your own risk

# Supported controls
* Accoridon
* Auto Complete
* Button
* Checkbox
* Combobox
* Dashboard Layout
* Date Picker
* Date Time Picker
* Dropdown List
* Dropdown Tree
* File Manager
* Grid
* List View
* Masked Textbox
* Numeric Textbox
* Pager
* Progress Button
* Radio
* Rich Text Editor
* Schedule
* Sidebar
* Slider
* Splitter
* Switch
* Textbox
* Timeline
* Time Picker
* Tree View
* Uploader

# Dev app and end-to-end tests
`yarn start` serves the dev app on http://localhost:8090. Each control has a page of feature samples
(`dev-app/<control>/`), registered once in `dev-app/nav.ts`, which drives both the router and the sidebar.
Samples are wrapped in `<demo-section id="...">` and located in tests through `data-testid`.

`yarn e2e` runs the Playwright suite in `e2e/` (starts the dev server itself, `yarn e2e:ui` for the UI runner).
* `smoke.spec.ts` visits every registered control and fails on any console or page error.
* One spec per control for feature coverage (button, dropDownList, datePicker and grid so far).
* Add a control: register it in `nav.ts`, build the demo sections, add `e2e/<control>.spec.ts`.
