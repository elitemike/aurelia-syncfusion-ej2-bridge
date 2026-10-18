import { PLATFORM } from 'aurelia-pal';

export interface DemoRoute {
  route: string;
  title: string;
  category: string;
  moduleId: string;
}

// Single source of truth for router + sidebar nav. PLATFORM.moduleName needs string literals.
export const demoRoutes: DemoRoute[] = [
  { route: 'button', title: 'Button', category: 'Buttons', moduleId: PLATFORM.moduleName('button/buttonDemo') },
  { route: 'checkbox', title: 'CheckBox', category: 'Buttons', moduleId: PLATFORM.moduleName('checkbox/checkboxDemo') },
  { route: 'progressButton', title: 'Progress Button', category: 'Buttons', moduleId: PLATFORM.moduleName('progressButton/progressButtonDemo') },
  { route: 'radio', title: 'Radio Button', category: 'Buttons', moduleId: PLATFORM.moduleName('radio/radioDemo') },
  { route: 'switch', title: 'Switch', category: 'Buttons', moduleId: PLATFORM.moduleName('switch/switchDemo') },

  { route: 'textBox', title: 'TextBox', category: 'Inputs', moduleId: PLATFORM.moduleName('textBox/textBoxDemo') },
  { route: 'maskedTextBox', title: 'Masked TextBox', category: 'Inputs', moduleId: PLATFORM.moduleName('maskedTextBox/maskedTextBoxDemo') },
  { route: 'numericTextBox', title: 'Numeric TextBox', category: 'Inputs', moduleId: PLATFORM.moduleName('numericTextBox/numericTextBoxDemo') },
  { route: 'slider', title: 'Slider', category: 'Inputs', moduleId: PLATFORM.moduleName('slider/sliderDemo') },
  { route: 'uploader', title: 'Uploader', category: 'Inputs', moduleId: PLATFORM.moduleName('uploader/uploaderDemo') },
  { route: 'richTextEditor', title: 'Rich Text Editor', category: 'Inputs', moduleId: PLATFORM.moduleName('richTextEditor/richTextEditorDemo') },

  { route: 'autoComplete', title: 'AutoComplete', category: 'Dropdowns', moduleId: PLATFORM.moduleName('autoComplete/autoCompleteDemo') },
  { route: 'combobox', title: 'ComboBox', category: 'Dropdowns', moduleId: PLATFORM.moduleName('comboBox/comboBoxDemo') },
  { route: 'dropDownList', title: 'DropDownList', category: 'Dropdowns', moduleId: PLATFORM.moduleName('dropDownList/dropDownListDemo') },
  { route: 'dropDownTree', title: 'DropDownTree', category: 'Dropdowns', moduleId: PLATFORM.moduleName('dropDownTree/dropDownTreeDemo') },
  { route: 'multiSelect', title: 'MultiSelect', category: 'Dropdowns', moduleId: PLATFORM.moduleName('multiSelect/multiSelectDemo') },

  { route: 'datePicker', title: 'DatePicker', category: 'Calendars', moduleId: PLATFORM.moduleName('datePicker/datePickerDemo') },
  { route: 'dateRangePicker', title: 'DateRangePicker', category: 'Calendars', moduleId: PLATFORM.moduleName('dateRangePicker/dateRangePickerDemo') },
  { route: 'dateTimePicker', title: 'DateTimePicker', category: 'Calendars', moduleId: PLATFORM.moduleName('dateTimePicker/dateTimePickerDemo') },
  { route: 'timePicker', title: 'TimePicker', category: 'Calendars', moduleId: PLATFORM.moduleName('timePicker/timePickerDemo') },
  { route: 'schedule', title: 'Schedule', category: 'Calendars', moduleId: PLATFORM.moduleName('schedule/scheduleDemo') },

  { route: 'grid', title: 'Grid', category: 'Data', moduleId: PLATFORM.moduleName('grid/gridDemo') },
  { route: 'gridFlags', title: 'Grid (feature flags)', category: 'Data', moduleId: PLATFORM.moduleName('grid/gridFlagsDemo') },
  { route: 'pager', title: 'Pager', category: 'Data', moduleId: PLATFORM.moduleName('pager/pagerDemo') },
  { route: 'listView', title: 'ListView', category: 'Data', moduleId: PLATFORM.moduleName('listView/listViewDemo') },
  { route: 'treeView', title: 'TreeView', category: 'Data', moduleId: PLATFORM.moduleName('treeView/treeViewDemo') },
  { route: 'fileManager', title: 'File Manager', category: 'Data', moduleId: PLATFORM.moduleName('fileManager/fileManagerDemo') },
  { route: 'timeline', title: 'Timeline', category: 'Data', moduleId: PLATFORM.moduleName('timeline/timelineDemo') },

  { route: 'accordion', title: 'Accordion', category: 'Layout', moduleId: PLATFORM.moduleName('accordion/accordionDemo') },
  { route: 'dashboardLayout', title: 'Dashboard Layout', category: 'Layout', moduleId: PLATFORM.moduleName('dashboardLayout/dashboardLayoutDemo') },
  { route: 'sidebar', title: 'Sidebar', category: 'Layout', moduleId: PLATFORM.moduleName('sidebar/sidebarDemo') },
  { route: 'splitter', title: 'Splitter', category: 'Layout', moduleId: PLATFORM.moduleName('splitter/splitterDemo') }
];
