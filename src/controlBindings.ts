export const ControlBindings = {
  common: {
    oneWay: []
  },
  accordion: {
    oneWay: ["animation", "enablePersistence", "enableRtl", "expandMode", "height", "items", "locale", "width"],
    events: ["clicked", "created", "destroyed", "expanded", "expanding"]
  },
  button: {
    oneWay: ["disabled", "isPrimary", "content", "cssClass", "enablePersistence", "iconCss", "iconPosition", "isToggle", "enableRtl"],
    events: ["created"]
  },
  checkbox: {
    oneWay: ["cssClass", "disabled", "enablePersistence", "enableRtl", "indeterminate", "label", "labelPosition", "locale", "name", "value"],
    twoWay: ["checked"],
    events: ["change", "created"]
  },
  dashboardLayout: {
    oneWay: ["allowDragging", "allowFloating", "allowResizing", "cellSpacing", "columns", "draggableHandle", "enablePersistence", "enableRtl", "mediaQuery", "panels", "resizableHandles", "showGridLines"],
    events: ["change", "created", "detroyed", "drag", "dragStart", "dragStop", "resize", "resizeStart", "resizeStop"]
  },
  datePicker: {
    oneWay: ["allowEdit", "calendarMode", "cssClass", "dayHeaderFormat", "depth", "enablePersistence", "enableRtl", "enabled", "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "locale", "max", "min", "placeholder", "readonly", "showClearButton", "showTodayButton", "start", "strictMode", "weekNumber", "width", "zindex"],
    twoWay: ["value"],
    events: ["blur", "change", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell"]
  },
  dateRangePicker: {
    oneWay: ["allowEdit", "cssClass", "dayHeaderFormat", "depth", "enablePersistence", "enableRtl", "enabled", "endDate", "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "locale", "max", "maxDays", "min", "minDays", "placeholder", "presets", "readonly", "separator", "showClearButton", "start", "startDate", "strictMode", "weekNumber", "width", "zindex"],
    twoWay: ["value"],
    events: ["blur", "change", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell", "select"]
  },
  dateTimePicker: {
    oneWay: ["allowEdit", "calendarMode", "cssClass", "dayHeaderFormat", "depth", "enablePersistence", "enableRtl", "enabled", "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "locale", "max", "min", "placeholder", "readonly", "scrollTo", "showClearButton", "showTodayButton", "start", "step", "strictMode", "timeFormat", "weekNumber", "width", "zindex"],
    twoWay: ["value"],
    events: ["blur", "change", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell"]
  },
  dropDownList: {
    oneWay: ["actionFailureTemplate", "allowFiltering", "cssClass", "dataSource", "enablePersistence", "enableRtl", "enabled", "fields", "filterBarPlaceholder", "floatLabelType", "footerTemplate", "groupTemplate", "headerTemplate", "htmlAttributes", "ignoreAccent", "index", "itemTemplate", "locale", "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "query", "readonly", "showClearButton", "sortOrder", "text", "valueTemplate", "width", "zindex"],
    twoWay: ["value"],
    events: ["actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created", "dataBound", "destroyed", "filtering", "focus", "open", "select"]
  },
  grid: {
    oneWay: ["aggregates", "allowExcelExport", "disabled", "allowFiltering", "allowGrouping", "allowMultiSorting", "allowPaging", "allowPdfExport",
      "allowReordering", "allowResizing", "allowRowDragAndDrop", "allowSelection", "allowSorting", "allowTextWrap", "childGrid", "clipboardModule",
      "columnMenuItems", "columnMenuModule", "columnQueryMode", "columns", "contextMenuItems", "contextMenuModule", "dataSource",
      "detailTemplate", "editModule", "editSettings", "enableAltRow", "enableAutoFill", "enableColumnVirtualization", "enableHover", "enablePersistence", "enableRtl", "enableVirtualiziation",
      "excelExportModule", "filterModule", "filterSettings", "frozenColumns", "frozenRows", "gridLines", "groupModule", "groupSettings", "height", "hierarchyPrintMode", "keyboardModule", "locale",
      "pageSettings", "pagerModule", "pagerTemplate", "pdfExportModule", "printMode", "printModule", "query", "queryString", "reorderModule", "rowDragAndDropModule", "rowDropSettings", "rowHeight",
      "rowTemplate", "scrollModule", "searchModule", "searchSettings", "selectionModule", "selectionSettings", "showColumnChooser", "showColumnMenu", "showHider", "sortModule",
      "sortSettings", "textWrapSettings", "toolbar", "toolbarModule", "toolbarTemplate", "width"],
    fromView: [
      "currentViewData"
    ],
    twoWay: ["selectedRowIndex"],
    events: ["actionBegins", "actionComplete", "actionFailure", "batchAdd", "batchCancel", "batchDelete", "beforeBatchAdd", "beforeBatchDelete", "beforeBatchSave", "beforeCopy", "beforeDataBound", "beforeExcelExport", "beforeOpenColumnChooser", "beforePaste", "beforePdfExport", "beforePrint", "beginEdit", "cellDeselected", "cellDeselecting", "cellEdit", "cellSave", "cellSaved", "cellSelected", "cellSelecting", "checkBoxChange", "columnDrag", "columnDragStart", "columnDrop", "columnMenuClick", "columnMenuOpen", "commandClick", "contextMenuClick", "contextMenuOpen", "created", "dataBound", "dataSourceChanged", "dataStateChange", "destroyed", "detailDataBound", "excelExportComplete", "excelHeaderQueryCellInfo", "excelQueryCellInfo", "exportDetailDataBound", "headerCellInfo", "keyPressed", "load", "pdfExportComplete", "pdfHeaderQueryCellInfo", "pdfQueryCellInfo", "printComplete", "queryCellInfo", "recordDoubleClick", "resizeStart", "resizeStop", "resizing", "rowDataBound", "rowDeselected", "rowDeselecting", "rowDrag", "rowDragStart", "rowDragStartHelper", "rowDrop", "rowSelected", "rowSelecting", "toolbarClick"]
  },
  maskedTextBox: {
    oneWay: ["cssClass", "customCharacters", "enablePersistence", "enableRtl", "enabled", "floatLabelType", "htmlAttributes", "locale", "mask", "placeholder", "promptChar", "showClearButton", "width"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus", "input"]
  },
  numericTextBox: {
    oneWay: ["cssClass", "currency", "decimals", "enablePersistence", "enableRtl", "enabled", "floatLabelType", "format", "htmlAttributes", "locale", "max", "min", "placeholder", "readonly", "showClearButon", "showSpinButton", "step", "StrictMode", "validateDecimalOnType", "width"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus"]
  },
  progressButton: {
    oneWay: ["animationSettings", "content", "cssClass", "disabled", "duration", "enablePersistence", "enableProgress", "enableRtl", "iconCss", "iconPosition", "isPrimary", "isToggle", "spinSettings"],
    events: ["begin", "created", "end", "fail", "progress"]
  },
  radio: {
    oneWay: ["checked", "cssClass", "disabled", "enablePersistence", "enableRtl", "label", "labelPosition", "locale", "name", "value"],
    events: ["change", "created"]
  },
  slider: {
    oneWay: ["cssClass", "customValues", "enableAnimation", "enablePersistence", "enableRtl", "enabled", "limits", "locale", "max", "min", "orientation", "readonly", "showButtons", "step", "ticks", "tooltip", "type"],
    twoWay: ["value"],
    events: ["change", "changed", "created", "renderedTicks", "renderingTicks", "tooltipChange"]
  },
  switch: {
    oneWay: ["cssClass", "disabled", "enablePersistence", "enableRtl", "locale", "name", "offLabel", "onLabel"],
    twoWay: ["value", "checked"],
    events: ["change", "created"]
  },
  textBox: {
    oneWay: ["cssClass", "enablePersistence", "enableRtl", "enabled", "floatLabelType", "htmlAttributes", "locale", "multiline", "placeholder", "readonly", "showClearButton", "type"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus", "input"]
  },
  treeView: {
    oneWay: ["allowDragAndDrop", "allowEditing", "allowMultiSelection", "animation", "autoCheck", "checkedNodes", "cssClass", "enablePersistence", "enableRtl", "expandOn", "expandedNodes", "fields", "fullRowSelect", "loadOnDemand", "locale", "nodeTemplate", "showCheckBox", "sortOrder"],
    twoWay: ["selectedNodes"],
    events: ["created", "dataBound", "dataSourceChanged", "destroyed", "drawNode", "keyPress", "nodeChecked", "nodeChecking", "nodeClicked", "nodeCollapsed", "nodeCollapsing", "nodeDragStart", "nodeDragStop", "nodeDragging", "nodeDropped", "nodeEdited", "nodeEditing", "nodeExpanded", "nodeExpanding", "nodeSelected", "nodeSelecting"]
  },
  uploader: {
    oneWay: ["allowedExtensions", "asyncSettings", "autoUpload", "buttons", "cssClass", "directoryUpload", "dropArea", "enablePersistence", "enableRtl", "enabled", "files", "htmlAttributes", "locale", "maxFileSize", "minFileSize", "multiple", "sequentialUpload", "showFileList", "template", "formData"],
    events: ["actionComplete", "canceling", "change", "chunkFailure", "chunkSuccess", "chunkUploading", "clearing", "created", "failure", "fileListRendering", "pausing", "progress", "removing", "rendering", "resuming", "selected", "success", "uploading"]
  }
}
