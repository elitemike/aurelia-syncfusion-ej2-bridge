import { Splitter } from '@syncfusion/ej2-layouts';
export const ControlBindings = {
  common: {
    oneWay: ["enablePersistence", "enableRtl", "locale"]
  },
  accordion: {
    oneWay: ["animation", "dataSource", "enableHtmlSanitizer", "expandMode", "expandedIndices", "height", "itemTemplate", "items", "width"],
    events: ["clicked", "created", "destroyed", "expanded", "expanding"]
  },
  autoComplete: {
    oneWay: ["actionFailureTemplate", "allowCustom", "autofill", "cssClass", "dataSource", "enabled", "fields", "ignoreAccent", "ignoreCase", "itemTemplate", "minLength", "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "query", "readonly", "showClearButton", "showPopupButton", "sortOrder", "suggestionCount", "width", "zIndex"],
    twoWay: ["value"],
    events: ["actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created", "customValueSpecifier", "dataBound", "destroyed", "filtering", "focus", "open", "select"]
  },
  button: {
    oneWay: ["disabled", "isPrimary", "content", "cssClass", "enableHtmlSanitizer", "iconCss", "iconPosition", "isToggle", "enableRtl"],
    events: ["created"]
  },
  checkbox: {
    oneWay: ["cssClass", "disabled", "enableHtmlSanitizer", "htmlAttributes", "indeterminate", "label", "labelPosition", "name", "value"],
    twoWay: ["checked"],
    events: ["change", "created"]
  },
  comboBox: {
    oneWay: ["actionFailureTemplate", "allowCustom", "allowFiltering", "autofill", "cssClass", "dataSource", "enabled", "fields",
      "filterType", "floatLabelType", "footerTemplate", "groupTemplate", "headerTemplate", "htmlAttributes", "ignoreAccent", "ignoreCase", "index", "itemTemplate", "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "query", "readonly", "showClearButton", "sortOrder", "text", "width", "zIndex"],
    twoWay: ["value"],
    events: ["actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created", "customValueSpecifier", "dataBound", "destroyed", "filtering", "focus", "open", "select"]
  },
  dashboardLayout: {
    oneWay: ["allowDragging", "allowFloating", "allowResizing", "cellSpacing", "columns", "draggableHandle",
      "enableHtmlSanitizer", "mediaQuery", "panels", "resizableHandles", "showGridLines"],
    events: ["change", "created", "destroyed", "drag", "dragStart", "dragStop", "resize", "resizeStart", "resizeStop"]
  },
  datePicker: {
    oneWay: ["allowEdit", "calendarMode", "cssClass", "dayHeaderFormat", "depth", "enableMask", "enabled", "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "max", "min", "openOnFocus", "placeholder", "readonly", "serverTimezoneOffset", "showClearButton", "showTodayButton", "start", "strictMode", "weekNumber", "weekRule", "width", "zindex"],
    twoWay: ["value"],
    events: ["blur", "change", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell"]
  },
  dateRangePicker: {
    oneWay: ["allowEdit", "cssClass", "dayHeaderFormat", "depth", "enabled", "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "max", "maxDays", "min", "minDays", "openOnFocus", "placeholder", "presets", "readonly", "separator", "serverTimezoneOffset", "showClearButton", "start", "strictMode", "weekNumber", "weekRule", "width", "zindex"],
    twoWay: ["value", "startDate", "endDate"],
    events: ["blur", "change", "cleared", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell", "select"]
  },
  dateTimePicker: {
    oneWay: ["allowEdit", "calendarMode", "cssClass", "dayHeaderFormat", "depth", "enableMask", "enabled", "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "maskPlaceholder", "max", "min", "openOnFocus", "placeholder", "readonly", "scrollTo", "serverTimezoneOffset", "showClearButton", "showTodayButton", "start", "step", "strictMode", "timeFormat", "weekNumber", "weekRule", "width", "zindex"],
    twoWay: ["value"],
    events: ["blur", "change", "cleared", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell"]
  },
  dropDownList: {
    oneWay: ["actionFailureTemplate", "allowFiltering", "cssClass", "dataSource", "enabled", "fields", "filterBarPlaceholder",
      "filterType", "floatLabelType", "footerTemplate", "groupTemplate", "headerTemplate", "htmlAttributes", "ignoreAccent", "ignoreCase", "index", "itemTemplate", "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "query", "readonly", "showClearButton", "sortOrder", "text", "valueTemplate", "width", "zindex"],
    twoWay: ["value"],
    events: ["actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created", "dataBound", "destroyed", "filtering", "focus", "open", "select"]
  },
  dropDownTree: {
    oneWay: ["actionFailureTemplate", "allowFiltering", "allowMultiSelection", "changeOnBlur", "cssClass", "customTemplate", "delimiterChar", "enabled", "fields", "filterBarPlaceholder", "filterType", "floatLabelType", "footerTemplate", "headerTemplate", "htmlAttributes", "ignoreAccent", "ignoreCase", "itemTemplate", "mode", "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "readonly", "selectAllText", "showCheckBox", "showClearButton", "showDropDownIcon", "showSelectAll", "sortOrder", "treeSettings", "unSelectAllText", "width", "wrapText", "zIndex"],
    twoWay: ["text", "value"],
    events: ["actionFailure", "beforeOpen", "blur", "change", "close", "created", "dataBound", "destroyed", "filtering", "focus", "keyPress", "open", "select"]
  },
  fileManager: {
    oneWay: ["ajaxSettings", "allowDragAndDrop", "allowMultiSelection", "contextMenuSettings", "cssClass", "detailsViewSettings", "enableHtmlSanitizer", "height", "navigationPaneSettings", "path", "popupTarget", "rootAliasName", "searchSettings", "selectedItems", "showFileExtension", "showHiddenItems", "showThumbnail", "sortBy", "sortOrder", "toolbarSettings", "uploadSettings", "view", "width"],
    twoWay: [],
    events: ["beforeDownload", "beforeImageLoad", "beforePopupClose", "beforePopupOpen", "beforeSend", "created", "destroyed", "failure", "fileDragStart", "fileDragStop", "fileDragging", "fileDropped", "fileLoad", "fileOpen", "fileSelect", "fileSelection", "menuClick", "menuOpen", "popupClose", "popupOpen", "success", "toolbarClick", "toolbarCreate", "uploadListCreate"]
  },
  grid: {
    oneWay: ["aggregates", "allowExcelExport", "disabled", "allowFiltering", "allowGrouping", "allowKeyboard", "allowMultiSorting", "allowPaging", "allowPdfExport",
      "allowReordering", "allowResizing", "allowRowDragAndDrop", "allowSelection", "allowSorting", "allowTextWrap", "childGrid", "clipMode", "clipboardModule", "columnChooserSettings",
      "columnMenuItems", "columnMenuModule", "columnQueryMode", "columns", "contextMenuItems", "contextMenuModule", "cssClass", "currentAction", "currentViewData", "dataSource",
      "detailTemplate", "editModule", "editSettings", "ej2StatePersistenceVersion", "enableAdaptiveUI", "enableAltRow", "enableAutoFill", "enableColumnVirtualization", "enableHeaderFocus", "enableHover", "enableImmutableMode", "enableInfinitScrolling", "enableStickyHeader", "enableVirtualMaskRow", "enableVirtualiziation",
      "excelExportModule", "filterModule", "filterSettings", "frozenColumns", "frozenRows", "gridLines", "groupModule", "groupSettings", "height", "hierarchyPrintMode", "infiniteScrollModule", "infiniteScrollSettings", "keyboardModule", "loadingIndicator",
      "pageSettings", "pagerModule", "pagerTemplate", "parentDetails", "pdfExportModule", "printMode", "printModule", "query", "queryString", "reorderModule", "resizeSettings", "rowDragAndDropModule", "rowDropSettings", "rowHeight", "rowRenderingMode",
      "rowTemplate", "scrollModule", "searchModule", "searchSettings", "selectionModule", "selectionSettings", "showColumnChooser", "showColumnMenu", "showHider", "sortModule",
      "sortSettings", "textWrapSettings", "toolbar", "toolbarModule", "toolbarTemplate", "width"],
    fromView: [
      "currentViewData"
    ],
    twoWay: ["selectedRowIndex"],
    events: ["actionBegin", "actionComplete", "actionFailure", "batchAdd", "batchCancel", "batchDelete", "beforeAutoFill", "beforeBatchAdd", "beforeBatchDelete", "beforeBatchSave", "beforeCopy", "beforeDataBound", "beforeExcelExport", "beforeOpenAdaptiveDialog", "beforeOpenColumnChooser", "beforePaste", "beforePdfExport", "beforePrint", "beginEdit", "cellDeselected", "cellDeselecting", "cellEdit", "cellSave", "cellSaved", "cellSelected", "cellSelecting", "checkBoxChange", "columnDataStateChange", "columnDeselected", "columnDeselecting", "columnDrag", "columnDragStart", "columnDrop", "columnMenuClick", "columnMenuOpen", "columnSelected", "columnSelecting", "commandClick", "contextMenuClick", "contextMenuOpen", "created", "dataBound", "dataSourceChanged", "dataStateChange", "destroyed", "detailDataBound", "excelAggregateQueryCellInfo", "excelExportComplete", "excelHeaderQueryCellInfo", "excelQueryCellInfo", "exportDetailDataBound", "exporeGroupCaption", "headerCellInfo", "keyPressed", "lazyLoadGroupCollapse", "lazyLoadGroupExpand", "load", "pdfAggregateQueryCellInfo", "pdfExportComplete", "pdfHeaderQueryCellInfo", "pdfQueryCellInfo", "printComplete", "queryCellInfo", "recordClick", "recordDoubleClick", "resizeStart", "resizeStop", "resizing", "rowDataBound", "rowDeselected", "rowDeselecting", "rowDrag", "rowDragStart", "rowDragStartHelper", "rowDrop", "rowSelected", "rowSelecting", "toolbarClick"]
  },
  listView: {
    oneWay: ["animation", "checkBoxPosition", "cssClass", "dataSource", "enable", "enableHtmlSanitizer", "enableVirtualization", "fields", "groupTemplate", "headerTemplate", "headerTitle", "height", "htmlAttributes", "query", "showCheckBox", "showHeader", "showIcon", "sortOrder", "template", "width"],
    events: ["actionBegin", "actionComplete", "actionFailure", "select"]
  },
  maskedTextBox: {
    oneWay: ["cssClass", "customCharacters", "enabled", "floatLabelType", "htmlAttributes", "mask", "placeholder", "promptChar", "showClearButton", "width"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus"]
  },
  multiSelect: {
    oneWay: ["actionFailureTemplate",
      "addTagOnBlur", "allowCustomValue", "allowFiltering", "changeOnBlur", "closePopupOnSelect", "cssClass", "dataSource", "delimiterChar", "enableGroupCheckBox", "enableHtmlSanitizer", "enableSelectionOrder", "enabled", "fields", "filterBarPlaceholder", "filterType", "floatLabelType", "footerTemplate", "groupTemplate", "headerTemplate", "hideSelectedItem", "htmlAttributes", "ignoreAccent", "ignoreCase", "itemTemplate", "locale", "maximumSelectionLength", "mode", "noRecordsTemplate", "openOnClick", "placeholder", "popupHeight", "popupWidth", "query", "readonly", "selectAllText", "showClearButton", "showDropDownIcon", "showSelectAll", "sortOrder", "text", "unSelectAllText", "valueTemplate", "width", "zIndex"],
    twoWay: ["value"],
    events: ["actionBegin", "actionComplete", "actionFailure", "beforeOpen",
      "beforeSelectAll", "blur", "change", "chipSelection", "close", "created", "customValueSelection", "dataBound", "destroyed", "filtering", "focus", "open", "removed", "removing", "select", "selectedAll", "tagging"]
  },
  numericTextBox: {
    oneWay: ["cssClass", "currency", "decimals", "enabled", "floatLabelType", "format", "htmlAttributes", "max", "min", "placeholder", "readonly", "showClearButton", "showSpinButton", "step", "strictMode", "validateDecimalOnType", "width"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus"]
  },
  pager: {
    oneWay: ["cssClass", "customText", "enableExternalMessage", "enablePagerMessage", "enableQueryString", "externalMessage",
      "pageCount", "pageSize", "pageSizes",
      "template"],
    twoWay: ["currentPage", "totalRecordsCount"],
    events: ["click", "created", "dropDownChanged"]
  },
  progressButton: {
    oneWay: ["animationSettings", "content", "cssClass", "disabled", "duration", "enableHtmlSanitizer", "enableProgress", "iconCss", "iconPosition", "isPrimary", "isToggle", "spinSettings"],
    events: ["begin", "created", "end", "fail", "progress"]
  },
  radio: {
    oneWay: ["checked", "cssClass", "disabled", "enableHtmlSanitizer", "htmlAttributes", "label", "labelPosition", "name", "value"],
    events: ["change", "created"]
  },
  schedule: {
    oneWay: ["agendaDaysCount", "allowDragAndDrop", "allowInline", "allowKeyboardInteraction", "allowMultiCellSelection", "allowMultiDrag", "allowMultiRowSelection", "allowResizing", "calendarMode", "cellHeaderTemplate", "cellTemplate", "cssClass", "currentView", "dateFormat", "dateHeaderTemplate", "editorTemplate", "enableRecurrenceValidation", "endHour", "eventDragArea", "eventSettings", "firstDayOfWeek", "group", "headerRows", "height", "hideEmptyAgendaDays", "maxDate", "minDate", "quickInfoOnSelectionEnd", "quickInfoTemplates", "readonly", "resourceHeaderTemplate", "resources", "rowAutoHeight", "selectedDate", "showHeaderBar", "showQuickInfo", "showTimeIndicator", "showWeekNumber", "showWeekend", "startHour", "timeFormat", "timeScale", "timezone", "views", "weekRule", "width", "workDays", "workHours"],
    events: ["actionBegin", "actionComplete", "actionFailure", "cellClick", "cellDoubleClick", "created", "dataBinding", "dataBound", "destroyed", "drag", "dragStart", "dragStop", "eventClick", "eventRendered", "hover", "moreEventsClick", "navigating", "popupClose", "popupOpen", "renderCell", "resizeStart", "resizeStop", "resizing", "select"]
  },
  sidebar: {
    oneWay: ["animate", "closeOnDocumentClick", "dockSize", "enableDock", "enableGestures", "isOpen", "mediaQuery", "position", "showBackdrop", "target", "type", "width", "zIndex"],
    events: ["change", "close", "created", "destroyed", "open"]
  },
  slider: {
    oneWay: ["cssClass", "customValues", "enableAnimation", "enabled", "limits", "max", "min", "orientation", "readonly", "showButtons", "step", "ticks", "tooltip", "type"],
    twoWay: ["value"],
    events: ["change", "changed", "created", "renderedTicks", "renderingTicks", "tooltipChange"]
  },
  splitter: {
    oneWay: ["cssClass", "enableHtmlSanitizer", "enabled", "height", "orientation", "paneSettings", "separatorSize", "width"],
    events: ["beforeCollapse", "beforeExpand", "beforeSanitizeHtml", "collapsed", "created", "expanded", "resizeStart", "resizeStop", "resizing"]
  },
  switch: {
    oneWay: ["cssClass", "disabled", , "name", "offLabel", "onLabel"],
    twoWay: ["value", "checked"],
    events: ["change", "created"]
  },
  textBox: {
    oneWay: ["cssClass", "enabled", "floatLabelType", "htmlAttributes", "multiline", "placeholder", "readonly", "showClearButton", "type"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus", "input"]
  },
  timePicker: {
    oneWay: ["allowEdit", "cssClass", "enabled", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "placeholder", "readonly", "scrollTo", "showClearButton", "step", "strictMode", "width", "zIndex"],
    twoWay: ["value", "min", "max"],
    events: ["blur", "change", "close", "created", "destroyed", "focus", "itemRender", "open"]
  },
  treeView: {
    oneWay: ["allowDragAndDrop", "allowEditing", "allowMultiSelection", "animation", "autoCheck", "checkedNodes", "cssClass", "expandOn", "expandedNodes", "fields", "fullRowSelect", "loadOnDemand", "nodeTemplate", "showCheckBox", "sortOrder"],
    twoWay: ["selectedNodes"],
    events: ["created", "dataBound", "dataSourceChanged", "destroyed", "drawNode", "keyPress", "nodeChecked", "nodeChecking", "nodeClicked", "nodeCollapsed", "nodeCollapsing", "nodeDragStart", "nodeDragStop", "nodeDragging", "nodeDropped", "nodeEdited", "nodeEditing", "nodeExpanded", "nodeExpanding", "nodeSelected", "nodeSelecting"]
  },
  uploader: {
    oneWay: ["allowedExtensions", "asyncSettings", "autoUpload", "buttons", "cssClass", "directoryUpload", "dropArea", "enabled", "files", "htmlAttributes", "maxFileSize", "minFileSize", "multiple", "sequentialUpload", "showFileList", "template", "formData"],
    events: ["actionComplete", "canceling", "change", "chunkFailure", "chunkSuccess", "chunkUploading", "clearing", "created", "failure", "fileListRendering", "pausing", "progress", "removing", "rendering", "resuming", "selected", "success", "uploading"]
  }
}
