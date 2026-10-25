// Bindable names per control. Keep in sync with the Syncfusion models: node tools/check-bindings.js --write
export const ControlBindings = {
  common: {
    oneWay: [
      "enablePersistence", "enableRtl", "locale"
    ]
  },
  accordion: {
    oneWay: [
      "animation", "dataSource", "enableHtmlSanitizer", "expandMode", "expandedIndices", "height",
      "itemTemplate", "items", "width", "headerTemplate"
    ],
    events: [
      "clicked", "created", "destroyed", "expanded", "expanding"
    ]
  },
  autoComplete: {
    oneWay: [
      "actionFailureTemplate", "allowCustom", "autofill", "cssClass", "dataSource", "enabled", "fields",
      "ignoreAccent", "ignoreCase", "itemTemplate", "minLength", "noRecordsTemplate", "placeholder",
      "popupHeight", "popupWidth", "query", "readonly", "showClearButton", "showPopupButton", "sortOrder",
      "suggestionCount", "width", "zIndex", "highlight", "htmlAttributes", "filterType", "index",
      "floatLabelType", "valueTemplate", "filterBarPlaceholder", "allowFiltering", "text",
      "isDeviceFullScreen", "headerTemplate", "footerTemplate", "allowObjectBinding", "debounceDelay",
      "enableVirtualization", "allowResize", "groupTemplate"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created",
      "customValueSpecifier", "dataBound", "destroyed", "filtering", "focus", "open", "select",
      "resizeStop", "resizing", "resizeStart"
    ]
  },
  button: {
    oneWay: [
      "disabled", "isPrimary", "content", "cssClass", "enableHtmlSanitizer", "iconCss", "iconPosition",
      "isToggle", "enableRtl", "enableRepeat", "repeatDelay", "repeatInterval"
    ],
    events: [
      "created", "clicked"
    ]
  },
  checkbox: {
    oneWay: [
      "cssClass", "disabled", "enableHtmlSanitizer", "htmlAttributes", "indeterminate", "label",
      "labelPosition", "name", "value"
    ],
    twoWay: [
      "checked"
    ],
    events: [
      "change", "created"
    ]
  },
  comboBox: {
    oneWay: [
      "actionFailureTemplate", "allowCustom", "allowFiltering", "autofill", "cssClass", "dataSource",
      "enabled", "fields", "filterType", "floatLabelType", "footerTemplate", "groupTemplate",
      "headerTemplate", "htmlAttributes", "ignoreAccent", "ignoreCase", "index", "itemTemplate",
      "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "query", "readonly",
      "showClearButton", "sortOrder", "text", "width", "zIndex", "isDeviceFullScreen", "valueTemplate",
      "filterBarPlaceholder", "allowObjectBinding", "debounceDelay", "enableVirtualization", "allowResize"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created",
      "customValueSpecifier", "dataBound", "destroyed", "filtering", "focus", "open", "select",
      "resizeStop", "resizing", "resizeStart"
    ]
  },
  dashboardLayout: {
    oneWay: [
      "allowDragging", "allowFloating", "allowResizing", "cellSpacing", "columns", "draggableHandle",
      "enableHtmlSanitizer", "mediaQuery", "panels", "resizableHandles", "showGridLines", "allowPushing",
      "cellAspectRatio"
    ],
    events: [
      "change", "created", "destroyed", "drag", "dragStart", "dragStop", "resize", "resizeStart",
      "resizeStop"
    ]
  },
  datePicker: {
    oneWay: [
      "allowEdit", "calendarMode", "cssClass", "dayHeaderFormat", "depth", "enableMask", "enabled",
      "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "max", "min",
      "openOnFocus", "placeholder", "readonly", "serverTimezoneOffset", "showClearButton",
      "showTodayButton", "start", "strictMode", "weekNumber", "weekRule", "width", "zIndex",
      "inputFormats", "fullScreenMode", "values", "isMultiSelection", "maskPlaceholder"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "blur", "change", "close", "created", "destroyed", "focus", "navigated", "open", "renderDayCell",
      "cleared"
    ]
  },
  dateRangePicker: {
    oneWay: [
      "allowEdit", "cssClass", "dayHeaderFormat", "depth", "enabled", "firstDayOfWeek", "floatLabelType",
      "format", "htmlAttributes", "keyConfigs", "max", "maxDays", "min", "minDays", "openOnFocus",
      "placeholder", "presets", "readonly", "separator", "serverTimezoneOffset", "showClearButton",
      "start", "strictMode", "weekNumber", "weekRule", "width", "zIndex", "calendarMode", "fullScreenMode",
      "showTodayButton", "inputFormats"
    ],
    twoWay: [
      "value", "startDate", "endDate"
    ],
    events: [
      "blur", "change", "cleared", "close", "created", "destroyed", "focus", "navigated", "open",
      "renderDayCell", "select"
    ]
  },
  dateTimePicker: {
    oneWay: [
      "allowEdit", "calendarMode", "cssClass", "dayHeaderFormat", "depth", "enableMask", "enabled",
      "firstDayOfWeek", "floatLabelType", "format", "htmlAttributes", "keyConfigs", "maskPlaceholder",
      "max", "min", "openOnFocus", "placeholder", "readonly", "scrollTo", "serverTimezoneOffset",
      "showClearButton", "showTodayButton", "start", "step", "strictMode", "timeFormat", "weekNumber",
      "weekRule", "width", "zIndex", "isMultiSelection", "values", "fullScreenMode", "minTime", "maxTime",
      "inputFormats"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "blur", "change", "cleared", "close", "created", "destroyed", "focus", "navigated", "open",
      "renderDayCell"
    ]
  },
  dropDownList: {
    oneWay: [
      "actionFailureTemplate", "allowFiltering", "cssClass", "dataSource", "enabled", "fields",
      "filterBarPlaceholder", "filterType", "floatLabelType", "footerTemplate", "groupTemplate",
      "headerTemplate", "htmlAttributes", "ignoreAccent", "ignoreCase", "index", "itemTemplate",
      "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "query", "readonly",
      "showClearButton", "sortOrder", "text", "valueTemplate", "width", "zIndex", "debounceDelay",
      "isDeviceFullScreen", "enableVirtualization", "allowResize", "allowObjectBinding"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "beforeOpen", "blur", "change", "close", "created",
      "dataBound", "destroyed", "filtering", "focus", "open", "select", "resizeStop", "resizing",
      "resizeStart"
    ]
  },
  dropDownTree: {
    oneWay: [
      "actionFailureTemplate", "allowFiltering", "allowMultiSelection", "changeOnBlur", "cssClass",
      "customTemplate", "delimiterChar", "enabled", "fields", "filterBarPlaceholder", "filterType",
      "floatLabelType", "footerTemplate", "headerTemplate", "htmlAttributes", "ignoreAccent", "ignoreCase",
      "itemTemplate", "mode", "noRecordsTemplate", "placeholder", "popupHeight", "popupWidth", "readonly",
      "selectAllText", "showCheckBox", "showClearButton", "showDropDownIcon", "showSelectAll", "sortOrder",
      "treeSettings", "unSelectAllText", "width", "wrapText", "zIndex", "destroyPopupOnHide",
      "enableHtmlSanitizer", "disableHtmlEncode", "valueTemplate"
    ],
    twoWay: [
      "text", "value"
    ],
    events: [
      "actionFailure", "beforeOpen", "blur", "change", "close", "created", "dataBound", "destroyed",
      "filtering", "focus", "keyPress", "open", "select"
    ]
  },
  fileManager: {
    oneWay: [
      "ajaxSettings", "allowDragAndDrop", "allowMultiSelection", "contextMenuSettings", "cssClass",
      "detailsViewSettings", "enableHtmlSanitizer", "height", "navigationPaneSettings", "path",
      "popupTarget", "rootAliasName", "searchSettings", "selectedItems", "showFileExtension",
      "showHiddenItems", "showThumbnail", "sortBy", "sortOrder", "toolbarSettings", "uploadSettings",
      "view", "width", "fileSystemData", "navigationPaneTemplate", "largeIconsTemplate",
      "showItemCheckBoxes", "enableVirtualization", "sortComparer", "enableRangeSelection", "toolbarItems",
      "enableWebMcp", "webMcpSettings"
    ],
    events: [
      "beforeDownload", "beforeImageLoad", "beforePopupClose", "beforePopupOpen", "beforeSend", "created",
      "destroyed", "failure", "fileDragStart", "fileDragStop", "fileDragging", "fileDropped", "fileLoad",
      "fileOpen", "fileSelect", "fileSelection", "menuClick", "menuOpen", "popupClose", "popupOpen",
      "success", "toolbarClick", "toolbarCreate", "uploadListCreate", "beforeFolderCreate", "folderCreate",
      "beforeDelete", "delete", "beforeRename", "rename", "beforeMove", "move", "search", "menuClose",
      "beforeWebMcpToolExecute"
    ]
  },
  grid: {
    oneWay: [
      "aggregates", "allowExcelExport", "allowFiltering", "allowGrouping", "allowKeyboard",
      "allowMultiSorting", "allowPaging", "allowPdfExport", "allowReordering", "allowResizing",
      "allowRowDragAndDrop", "allowSelection", "allowSorting", "allowTextWrap", "childGrid", "clipMode",
      "columnChooserSettings", "columnMenuItems", "columnQueryMode", "columns", "contextMenuItems",
      "cssClass", "currentAction", "currentViewData", "dataSource", "detailTemplate", "editSettings",
      "ej2StatePersistenceVersion", "enableAdaptiveUI", "enableAltRow", "enableAutoFill",
      "enableColumnVirtualization", "enableHeaderFocus", "enableHover", "enableImmutableMode",
      "enableInfiniteScrolling", "enableStickyHeader", "enableVirtualMaskRow", "enableVirtualization",
      "filterSettings", "frozenColumns", "frozenRows", "gridLines", "groupSettings", "height",
      "hierarchyPrintMode", "infiniteScrollSettings", "loadingIndicator", "pageSettings", "pagerTemplate",
      "parentDetails", "printMode", "query", "queryString", "resizeSettings", "rowDropSettings",
      "rowHeight", "rowRenderingMode", "rowTemplate", "searchSettings", "selectionSettings",
      "showColumnChooser", "showColumnMenu", "showHider", "sortSettings", "textWrapSettings", "toolbar",
      "toolbarTemplate", "width", "enableHtmlSanitizer", "enableDomVirtualization",
      "domVirtualizationSettings", "detailTemplateHeight", "allowAdvancedFiltering",
      "advancedFilterSettings", "adaptiveUIMode", "enableRowSpan", "enableColumnSpan", "autoFit",
      "formulaSettings", "emptyRecordTemplate", "emptyRecordMode", "headerRowHeight", "footerRowHeight",
      "currencyCode", "exportGrids", "isRowSelectable", "isRowPinned", "setRowHeight", "enableWebMcp",
      "webMcpSettings"
    ],
    twoWay: [
      "selectedRowIndex"
    ],
    fromView: [
      "currentViewData"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "batchAdd", "batchCancel", "batchDelete",
      "beforeAutoFill", "beforeBatchAdd", "beforeBatchDelete", "beforeBatchSave", "beforeCopy",
      "beforeDataBound", "beforeExcelExport", "beforeOpenAdaptiveDialog", "beforeOpenColumnChooser",
      "beforePaste", "beforePdfExport", "beforePrint", "beginEdit", "cellDeselected", "cellDeselecting",
      "cellEdit", "cellSave", "cellSaved", "cellSelected", "cellSelecting", "checkBoxChange",
      "columnDataStateChange", "columnDeselected", "columnDeselecting", "columnDrag", "columnDragStart",
      "columnDrop", "columnMenuClick", "columnMenuOpen", "columnSelected", "columnSelecting",
      "commandClick", "contextMenuClick", "contextMenuOpen", "created", "dataBound", "dataSourceChanged",
      "dataStateChange", "destroyed", "detailDataBound", "excelAggregateQueryCellInfo",
      "excelExportComplete", "excelHeaderQueryCellInfo", "excelQueryCellInfo", "exportDetailDataBound",
      "exportGroupCaption", "headerCellInfo", "keyPressed", "lazyLoadGroupCollapse", "lazyLoadGroupExpand",
      "load", "pdfAggregateQueryCellInfo", "pdfExportComplete", "pdfHeaderQueryCellInfo",
      "pdfQueryCellInfo", "printComplete", "queryCellInfo", "recordClick", "recordDoubleClick",
      "resizeStart", "resizeStop", "resizing", "rowDataBound", "rowDeselected", "rowDeselecting",
      "rowDrag", "rowDragStart", "rowDragStartHelper", "rowDrop", "rowSelected", "rowSelecting",
      "toolbarClick", "cellFocus", "exportDetailTemplate", "detailExpand", "detailCollapse",
      "detailExpanded", "detailCollapsed", "contextMenuClose", "columnMenuClose",
      "beforeWebMcpToolExecute", "beforeDetailTemplateDetach", "beforeCustomFilterOpen",
      "advancedFilterOpen", "advancedFilterClose", "advancedFilterBegin", "advancedFilterComplete"
    ]
  },
  listView: {
    oneWay: [
      "animation", "checkBoxPosition", "cssClass", "dataSource", "enable", "enableHtmlSanitizer",
      "enableVirtualization", "fields", "groupTemplate", "headerTemplate", "headerTitle", "height",
      "htmlAttributes", "query", "showCheckBox", "showHeader", "showIcon", "sortOrder", "template",
      "width", "enabled", "disableHtmlEncode"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "select", "scroll"
    ]
  },
  maskedTextBox: {
    oneWay: [
      "cssClass", "customCharacters", "enabled", "floatLabelType", "htmlAttributes", "mask", "placeholder",
      "promptChar", "showClearButton", "width", "readonly", "prependTemplate", "appendTemplate"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "blur", "change", "created", "destroyed", "focus"
    ]
  },
  multiSelect: {
    oneWay: [
      "actionFailureTemplate", "addTagOnBlur", "allowCustomValue", "allowFiltering", "changeOnBlur",
      "closePopupOnSelect", "cssClass", "dataSource", "delimiterChar", "enableGroupCheckBox",
      "enableHtmlSanitizer", "enableSelectionOrder", "enabled", "fields", "filterBarPlaceholder",
      "filterType", "floatLabelType", "footerTemplate", "groupTemplate", "headerTemplate",
      "hideSelectedItem", "htmlAttributes", "ignoreAccent", "ignoreCase", "itemTemplate", "locale",
      "maximumSelectionLength", "mode", "noRecordsTemplate", "openOnClick", "placeholder", "popupHeight",
      "popupWidth", "query", "readonly", "selectAllText", "showClearButton", "showDropDownIcon",
      "showSelectAll", "sortOrder", "text", "unSelectAllText", "valueTemplate", "width", "zIndex",
      "enableVirtualization", "debounceDelay", "isDeviceFullScreen", "allowResize", "allowObjectBinding",
      "summaryTagCount", "summaryTagTemplate"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "beforeOpen", "beforeSelectAll", "blur", "change",
      "chipSelection", "close", "created", "customValueSelection", "dataBound", "destroyed", "filtering",
      "focus", "open", "removed", "removing", "select", "selectedAll", "tagging", "resizeStop", "resizing",
      "resizeStart"
    ]
  },
  numericTextBox: {
    oneWay: [
      "cssClass", "currency", "decimals", "enabled", "floatLabelType", "format", "htmlAttributes", "max",
      "min", "placeholder", "readonly", "showClearButton", "showSpinButton", "step", "strictMode",
      "validateDecimalOnType", "width", "currencyCode", "allowMouseWheel", "prependTemplate",
      "appendTemplate"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "blur", "change", "created", "destroyed", "focus"
    ]
  },
  pager: {
    oneWay: [
      "cssClass", "customText", "enableExternalMessage", "enablePagerMessage", "enableQueryString",
      "externalMessage", "pageCount", "pageSize", "pageSizes", "template"
    ],
    twoWay: [
      "currentPage", "totalRecordsCount"
    ],
    events: [
      "click", "created", "dropDownChanged"
    ]
  },
  progressButton: {
    oneWay: [
      "animationSettings", "content", "cssClass", "disabled", "duration", "enableHtmlSanitizer",
      "enableProgress", "iconCss", "iconPosition", "isPrimary", "isToggle", "spinSettings"
    ],
    events: [
      "begin", "created", "end", "fail", "progress"
    ]
  },
  radio: {
    oneWay: [
      "checked", "cssClass", "disabled", "enableHtmlSanitizer", "htmlAttributes", "label", "labelPosition",
      "name", "value"
    ],
    events: [
      "change", "created"
    ]
  },
  richTextEditor: {
    oneWay: [
      "autoSaveOnIdle", "backgroundColor", "bulletFormatList", "cssClass", "editorMode",
      "emojiPickerSettings", "enableAutoUrl", "enableHtmlEncode", "enableHtmlSanitizer", "enableResize",
      "enableTabKey", "enableXhtml", "enabled", "enterKey", "exportPdf", "exportWord",
      "fileManagerSettings", "floatingToolbarOffset", "fontColor", "fontFamily", "fontSize", "format",
      "formatPainterSettings", "formatter", "height", "htmlAttributes", "iframeSettings", "importWord",
      "inlineMode", "insertAudioSettings", "insertImageSettings", "insertVideoSettings", "keyConfig",
      "maxLength", "numberFormatList", "pasteCleanupSettings", "placeholder", "quickToolbarSettings",
      "readonly", "saveInterval", "shiftEnterKey", "showCharCount", "showTooltip", "slashMenuSettings",
      "tableSettings", "toolbarSettings", "undoRedoSteps", "undoRedoTimer", "value", "valueTemplate",
      "width", "aiAssistantSettings", "enableClipboardCleanup", "enableMarkdownAutoFormat",
      "codeBlockSettings", "lineHeight", "enableWebMcp", "webMcpSettings"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "actionBegin", "actionComplete", "afterImageDelete", "afterMediaDelete", "afterPasteCleanup",
      "beforeDialogClose", "beforeDialogOpen", "beforeFileUpload", "beforeImageDrop", "beforeImageUpload",
      "beforePasteCleanup", "beforeQuickToolbarOpen", "beforeSanitizeHtml", "blur", "change", "created",
      "destroyed", "dialogClose", "dialogOpen", "fileRemoving", "fileSelected", "fileUploadFailed",
      "fileUploadSuccess", "fileUploading", "focus", "imageRemoving", "imageSelected", "imageUploadFailed",
      "imageUploadSuccess", "imageUploading", "quickToolbarClose", "quickToolbarOpen", "resizeStart",
      "resizeStop", "resizing", "slashMenuItemSelect", "toolbarClick", "toolbarStatusUpdate",
      "updatedToolbarStatus", "beforeClipboardWrite", "beforeMediaDrop", "selectionChanged",
      "aiAssistantToolbarClick", "aiAssistantPromptRequest", "aiAssistantStopRespondingClick",
      "beforePopupOpen", "beforePopupClose", "wordImporting", "documentExporting",
      "beforeWebMcpToolExecute"
    ]
  },
  schedule: {
    oneWay: [
      "agendaDaysCount", "allowDragAndDrop", "allowInline", "allowKeyboardInteraction",
      "allowMultiCellSelection", "allowMultiDrag", "allowMultiRowSelection", "allowResizing",
      "allowSwiping", "calendarMode", "cellHeaderTemplate", "cellTemplate", "cssClass", "currentView",
      "dateFormat", "dateHeaderTemplate", "dayHeaderTemplate", "enableAdaptiveUI", "enableAllDayScroll",
      "editorTemplate", "enableRecurrenceValidation", "endHour", "eventDragArea", "eventSettings",
      "firstDayOfWeek", "firstMonthOfYear", "group", "headerIndentTemplate", "headerRows", "height",
      "hideEmptyAgendaDays", "maxDate", "minDate", "monthHeaderTemplate", "monthsCount",
      "quickInfoOnSelectionEnd", "quickInfoTemplates", "readonly", "resourceHeaderTemplate", "resources",
      "rowAutoHeight", "selectedDate", "showHeaderBar", "showQuickInfo", "showTimeIndicator",
      "showWeekNumber", "showWeekend", "startHour", "timeFormat", "timeScale", "timezone",
      "timezoneDataSource", "views", "weekRule", "width", "workDays", "workHours",
      "currentTimeIndicatorSettings", "allowOverlap", "overscanCount", "enableWebMcp", "webMcpSettings",
      "toolbarItems", "enableHtmlSanitizer", "dateRangeTemplate", "prerenderDialogs",
      "editorHeaderTemplate", "editorFooterTemplate", "selectedResource", "allowClipboard"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "cellClick", "cellDoubleClick", "created",
      "dataBinding", "dataBound", "destroyed", "drag", "dragStart", "dragStop", "eventClick",
      "eventRendered", "hover", "moreEventsClick", "navigating", "popupClose", "popupOpen", "renderCell",
      "resizeStart", "resizeStop", "resizing", "select", "eventDoubleClick", "virtualScrollStart",
      "virtualScrollStop", "beforePaste", "beforePrint", "excelExport", "tooltipOpen",
      "beforeWebMcpToolExecute"
    ]
  },
  sidebar: {
    oneWay: [
      "animate", "closeOnDocumentClick", "dockSize", "enableDock", "enableGestures", "mediaQuery",
      "position", "showBackdrop", "target", "type", "width", "zIndex", "height"
    ],
    twoWay: [
      "isOpen"
    ],
    events: [
      "change", "close", "created", "destroyed", "open"
    ]
  },
  slider: {
    oneWay: [
      "colorRange", "cssClass", "customValues", "enableAnimation", "enableHtmlSanitizer", "enabled",
      "limits", "max", "min", "orientation", "readonly", "showButtons", "step", "ticks", "tooltip", "type",
      "width"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "change", "changed", "created", "renderedTicks", "renderingTicks", "tooltipChange"
    ]
  },
  splitter: {
    oneWay: [
      "cssClass", "enableHtmlSanitizer", "enableReversePanes", "enabled", "height", "orientation",
      "paneSettings", "separatorSize", "width"
    ],
    events: [
      "beforeCollapse", "beforeExpand", "beforeSanitizeHtml", "collapsed", "created", "expanded",
      "resizeStart", "resizeStop", "resizing"
    ]
  },
  switch: {
    oneWay: [
      "cssClass", "disabled", "name", "offLabel", "onLabel", "htmlAttributes"
    ],
    twoWay: [
      "value", "checked"
    ],
    events: [
      "change", "created", "beforeChange"
    ]
  },
  textBox: {
    oneWay: [
      "autocomplete", "cssClass", "enabled", "floatLabelType", "htmlAttributes", "multiline",
      "placeholder", "readonly", "showClearButton", "type", "width", "maxLength", "prependTemplate",
      "appendTemplate"
    ],
    twoWay: [
      "value"
    ],
    events: [
      "blur", "change", "created", "destroyed", "focus", "input"
    ]
  },
  timePicker: {
    oneWay: [
      "allowEdit", "cssClass", "enableMask", "enabled", "floatLabelType", "format", "htmlAttributes",
      "keyConfigs", "maskPlaceholder", "openOnFocus", "placeholder", "readonly", "scrollTo",
      "showClearButton", "step", "strictMode", "width", "zIndex", "fullScreenMode", "serverTimezoneOffset"
    ],
    twoWay: [
      "value", "min", "max"
    ],
    events: [
      "blur", "change", "cleared", "close", "created", "destroyed", "focus", "itemRender", "open"
    ]
  },
  timeline: {
    oneWay: [
      "align", "cssClass", "items", "orientation", "reverse", "template"
    ],
    events: [
      "beforeItemRender", "created"
    ]
  },
  treeView: {
    oneWay: [
      "allowDragAndDrop", "allowEditing", "allowMultiSelection", "allowTextWrap", "animation", "autoCheck",
      "cssClass", "disabled", "dragArea", "enableHtmlSanitizer", "expandOn", "fields", "fullRowNavigable",
      "fullRowSelect", "loadOnDemand", "nodeTemplate", "showCheckBox", "sortOrder", "enableVirtualization",
      "height", "checkDisabledChildren", "disableHtmlEncode", "checkOnClick"
    ],
    twoWay: [
      "selectedNodes", "checkedNodes", "expandedNodes"
    ],
    events: [
      "actionFailure", "created", "dataBound", "dataSourceChanged", "destroyed", "drawNode", "keyPress",
      "nodeChecked", "nodeChecking", "nodeClicked", "nodeCollapsed", "nodeCollapsing", "nodeDragStart",
      "nodeDragStop", "nodeDragging", "nodeDropped", "nodeEdited", "nodeEditing", "nodeExpanded",
      "nodeExpanding", "nodeSelected", "nodeSelecting"
    ]
  },
  uploader: {
    oneWay: [
      "allowedExtensions", "asyncSettings", "autoUpload", "buttons", "cssClass", "directoryUpload",
      "dropArea", "dropEffect", "enabled", "files", "htmlAttributes", "maxFileSize", "minFileSize",
      "multiple", "sequentialUpload", "showFileList", "template", "enableHtmlSanitizer"
    ],
    events: [
      "actionComplete", "beforeRemove", "beforeUpload", "canceling", "change", "chunkFailure",
      "chunkSuccess", "chunkUploading", "clearing", "created", "failure", "fileListRendering", "pausing",
      "progress", "removing", "rendering", "resuming", "selected", "success", "uploading"
    ]
  },
  barcodeGenerator: {
    oneWay: [
      "width", "height", "mode", "type", "value", "enableCheckSum", "displayText", "margin",
      "backgroundColor", "foreColor"
    ],
    events: [
      "invalid"
    ]
  },
  qrCodeGenerator: {
    oneWay: [
      "height", "logo", "width", "mode", "xDimension", "errorCorrectionLevel", "margin", "backgroundColor",
      "foreColor", "displayText", "version", "value"
    ],
    events: [
      "invalid"
    ]
  },
  dataMatrixGenerator: {
    oneWay: [
      "encoding", "size", "mode", "value", "height", "width", "displayText", "margin", "backgroundColor",
      "foreColor", "xDimension"
    ],
    events: [
      "invalid"
    ]
  },
  pdf417Generator: {
    oneWay: [
      "mode", "value", "height", "width", "compactionMode", "errorCorrectionLevel", "columns", "rows",
      "isCompact", "rowHeightRatio", "displayText", "margin", "backgroundColor", "foreColor"
    ],
    events: [
      "invalid"
    ]
  },
  blockEditor: {
    oneWay: [
      "height", "width", "cssClass", "keyConfig", "undoRedoStack", "readOnly", "enableHtmlEncode",
      "enableHtmlSanitizer", "enableDragAndDrop", "blocks", "users", "currentUserId",
      "commandMenuSettings", "inlineToolbarSettings", "transformSettings", "blockActionMenuSettings",
      "contextMenuSettings", "pasteCleanupSettings", "labelSettings", "imageBlockSettings",
      "codeBlockSettings", "fontColorSettings", "backgroundColorSettings", "collaborationSettings"
    ],
    events: [
      "created", "blockChanged", "selectionChanged", "blockDragging", "blockDragStart", "blockDropped",
      "focus", "blur", "beforePasteCleanup", "afterPasteCleanup", "beforeFileUpload", "fileUploading",
      "fileUploadSuccess", "fileUploadFailed"
    ]
  },
  chipList: {
    oneWay: [
      "chips", "text", "avatarText", "avatarIconCss", "htmlAttributes", "leadingIconCss",
      "trailingIconCss", "leadingIconUrl", "trailingIconUrl", "cssClass", "enabled", "selectedChips",
      "selection", "enableDelete", "allowDragAndDrop", "dragArea"
    ],
    events: [
      "created", "click", "beforeClick", "delete", "deleted", "dragStart", "dragging", "dragStop"
    ]
  },
  fab: {
    oneWay: [
      "position", "target", "visible", "isPrimary", "iconPosition", "iconCss", "disabled", "cssClass",
      "content", "isToggle", "enableRepeat", "repeatDelay", "repeatInterval", "enableHtmlSanitizer"
    ],
    events: [
      "created", "clicked"
    ]
  },
  speedDial: {
    oneWay: [
      "animation", "content", "closeIconCss", "cssClass", "direction", "disabled", "iconPosition", "items",
      "itemTemplate", "mode", "openIconCss", "opensOnHover", "position", "modal", "popupTemplate",
      "radialSettings", "target", "visible", "isPrimary"
    ],
    events: [
      "beforeClose", "beforeItemRender", "beforeOpen", "created", "clicked", "onClose", "onOpen"
    ]
  },
  smartPasteButton: {
    oneWay: [
      "aiAssistHandler", "iconPosition", "iconCss", "disabled", "isPrimary", "cssClass", "content",
      "isToggle", "enableRepeat", "repeatDelay", "repeatInterval", "enableHtmlSanitizer"
    ],
    events: [
      "created", "clicked"
    ]
  },
  calendar: {
    oneWay: [
      "value", "values", "isMultiSelection", "min", "enabled", "cssClass", "max", "firstDayOfWeek",
      "calendarMode", "start", "depth", "weekNumber", "weekRule", "showTodayButton", "dayHeaderFormat",
      "keyConfigs", "serverTimezoneOffset"
    ],
    events: [
      "change", "created", "destroyed", "navigated", "renderDayCell"
    ]
  },
  chart: {
    oneWay: [
      "enableWebMcp", "webMcpSettings", "noDataTemplate", "width", "height", "title", "dataSource",
      "titleStyle", "subTitle", "subTitleStyle", "margin", "border", "background", "chartArea",
      "enableHtmlSanitizer", "primaryXAxis", "primaryYAxis", "rows", "columns", "axes", "series",
      "annotations", "palettes", "theme", "tooltip", "crosshair", "legendSettings", "rangeColorSettings",
      "zoomSettings", "highlightColor", "selectionMode", "highlightMode", "selectionPattern",
      "highlightPattern", "isMultiSelect", "allowMultiSelection", "enableExport", "allowExport",
      "selectedDataIndexes", "useGroupingSeparator", "enableAutoIntervalOnBothAxis", "isTransposed",
      "enableCanvas", "backgroundImage", "indicators", "enableAnimation", "description", "tabIndex",
      "enableSideBySidePlacement", "accessibility", "focusBorderColor", "focusBorderWidth",
      "focusBorderMargin", "stackLabels", "currencyCode"
    ],
    events: [
      "resized", "beforeResize", "beforeWebMcpToolExecute", "annotationRender", "beforePrint", "loaded",
      "beforeExport", "afterExport", "load", "animationComplete", "legendRender", "textRender",
      "pointRender", "seriesRender", "axisLabelRender", "axisLabelClick", "axisRangeCalculated",
      "axisMultiLabelRender", "legendClick", "multiLevelLabelClick", "tooltipRender",
      "sharedTooltipRender", "crosshairLabelRender", "chartMouseMove", "chartMouseClick",
      "chartDoubleClick", "pointClick", "pointDoubleClick", "pointMove", "chartMouseLeave",
      "chartMouseDown", "chartMouseUp", "dragComplete", "selectionComplete", "zoomComplete", "onZooming",
      "scrollStart", "scrollEnd", "scrollChanged", "dragStart", "drag", "dragEnd"
    ]
  },
  accumulationChart: {
    oneWay: [
      "noDataTemplate", "width", "height", "title", "backgroundImage", "center", "dataSource",
      "titleStyle", "subTitle", "subTitleStyle", "legendSettings", "tooltip", "centerLabel",
      "selectionMode", "highlightColor", "highlightMode", "selectionPattern", "highlightPattern",
      "enableHtmlSanitizer", "enableBorderOnMouseMove", "isMultiSelect", "enableAnimation",
      "selectedDataIndexes", "margin", "enableSmartLabels", "border", "background", "series",
      "annotations", "theme", "useGroupingSeparator", "enableExport", "allowExport", "accessibility",
      "focusBorderColor", "focusBorderWidth", "focusBorderMargin", "currencyCode"
    ],
    events: [
      "loaded", "legendClick", "load", "seriesRender", "legendRender", "textRender", "tooltipRender",
      "pointRender", "annotationRender", "beforePrint", "chartMouseMove", "chartMouseClick",
      "chartDoubleClick", "pointClick", "pointMove", "animationComplete", "chartMouseDown",
      "chartMouseLeave", "chartMouseUp", "beforeResize", "resized", "beforeExport", "afterExport",
      "selectionComplete"
    ]
  },
  stockChart: {
    oneWay: [
      "noDataTemplate", "width", "height", "dataSource", "margin", "border", "background", "theme",
      "primaryXAxis", "chartArea", "primaryYAxis", "rows", "axes", "series", "stockEvents", "isTransposed",
      "title", "titleStyle", "indicators", "tooltip", "crosshair", "legendSettings", "zoomSettings",
      "enablePeriodSelector", "enableCustomRange", "isSelect", "enableSelector", "periods", "annotations",
      "selectionMode", "isMultiSelect", "selectedDataIndexes", "seriesType", "indicatorType", "exportType",
      "trendlineType"
    ],
    events: [
      "selectorRender", "stockChartMouseMove", "stockChartMouseLeave", "stockChartMouseDown",
      "stockChartMouseUp", "stockChartMouseClick", "pointClick", "pointMove", "onZooming", "legendRender",
      "legendClick", "beforeIndicatorChange", "indicatorChanged", "load", "loaded", "rangeChange",
      "axisLabelRender", "beforeExport", "tooltipRender", "crosshairLabelRender", "seriesRender",
      "stockEventRender"
    ]
  },
  rangeNavigator: {
    oneWay: [
      "width", "height", "dataSource", "xName", "yName", "query", "series", "tooltip", "minimum",
      "maximum", "interval", "intervalType", "labelIntersectAction", "logBase", "valueType",
      "labelPosition", "labelPlacement", "animationDuration", "enableGrouping", "enableDeferredUpdate",
      "disableRangeSelector", "allowSnapping", "allowIntervalData", "useGroupingSeparator", "groupBy",
      "tickPosition", "labelStyle", "majorGridLines", "majorTickLines", "navigatorStyleSettings",
      "periodSelectorSettings", "navigatorBorder", "theme", "value", "background", "labelFormat",
      "skeleton", "skeletonType", "secondaryLabelAlignment", "margin"
    ],
    events: [
      "load", "loaded", "resized", "beforeResize", "labelRender", "changed", "tooltipRender",
      "selectorRender", "beforePrint"
    ]
  },
  bulletChart: {
    oneWay: [
      "width", "height", "majorTickLines", "minorTickLines", "minimum", "maximum", "interval",
      "minorTicksPerInterval", "labelStyle", "categoryLabelStyle", "labelFormat", "title", "titleStyle",
      "subtitle", "subtitleStyle", "orientation", "border", "tooltip", "ranges", "labelPosition",
      "tickPosition", "titlePosition", "opposedPosition", "theme", "animation", "dataLabel",
      "legendSettings", "enableGroupSeparator", "margin", "targetWidth", "targetColor", "valueHeight",
      "valueFill", "valueBorder", "dataSource", "query", "categoryField", "type", "valueField",
      "targetField", "targetTypes", "tabIndex"
    ],
    events: [
      "tooltipRender", "load", "loaded", "bulletChartMouseClick", "legendRender", "beforePrint"
    ]
  },
  smithchart: {
    oneWay: [
      "renderType", "width", "height", "theme", "margin", "font", "border", "title", "series",
      "legendSettings", "horizontalAxis", "radialAxis", "background", "elementSpacing", "radius"
    ],
    events: [
      "beforePrint", "animationComplete", "load", "loaded", "legendRender", "titleRender",
      "subtitleRender", "textRender", "axisLabelRender", "seriesRender", "tooltipRender"
    ]
  },
  sparkline: {
    oneWay: [
      "width", "height", "border", "type", "rangePadding", "dataSource", "query", "valueType", "xName",
      "yName", "fill", "highPointColor", "lowPointColor", "startPointColor", "endPointColor",
      "negativePointColor", "tiePointColor", "palette", "lineWidth", "opacity", "format",
      "useGroupingSeparator", "tooltipSettings", "containerArea", "rangeBandSettings", "axisSettings",
      "markerSettings", "dataLabelSettings", "padding", "theme"
    ],
    events: [
      "loaded", "load", "tooltipInitialize", "seriesRendering", "axisRendering", "pointRendering",
      "pointRegionMouseMove", "pointRegionMouseClick", "sparklineMouseMove", "sparklineMouseClick",
      "dataLabelRendering", "markerRendering", "resize"
    ]
  },
  chart3D: {
    oneWay: [
      "title", "subTitle", "theme", "description", "width", "backgroundImage", "background", "dataSource",
      "height", "depth", "wallSize", "tilt", "enableRotation", "rotation", "enableSideBySidePlacement",
      "perspectiveAngle", "wallColor", "isTransposed", "currencyCode", "enableExport", "margin",
      "titleStyle", "subTitleStyle", "legendSettings", "border", "primaryXAxis", "primaryYAxis", "tooltip",
      "rows", "columns", "axes", "series", "highlightColor", "selectionMode", "highlightMode",
      "selectionPattern", "highlightPattern", "isMultiSelect", "selectedDataIndexes",
      "useGroupingSeparator", "palettes"
    ],
    events: [
      "load", "loaded", "pointClick", "pointMove", "pointRender", "legendRender", "legendClick",
      "seriesRender", "textRender", "tooltipRender", "beforeResize", "resized", "chart3DMouseMove",
      "chart3DMouseClick", "chart3DMouseDown", "chart3DMouseLeave", "chart3DMouseUp", "axisLabelRender",
      "selectionComplete", "beforeExport", "afterExport", "beforePrint"
    ]
  },
  circularChart3D: {
    oneWay: [
      "width", "height", "title", "backgroundImage", "dataSource", "titleStyle", "subTitle",
      "subTitleStyle", "selectionMode", "highlightMode", "series", "legendSettings", "highlightColor",
      "selectionPattern", "highlightPattern", "isMultiSelect", "enableAnimation", "theme",
      "selectedDataIndexes", "margin", "border", "tooltip", "background", "useGroupingSeparator", "depth",
      "tilt", "enableRotation", "rotation", "enableExport"
    ],
    events: [
      "load", "loaded", "legendRender", "legendClick", "selectionComplete", "pointRender", "seriesRender",
      "textRender", "beforeExport", "afterExport", "beforePrint", "beforeResize", "resized",
      "circularChart3DMouseMove", "circularChart3DMouseClick", "circularChart3DMouseDown",
      "circularChart3DMouseLeave", "circularChart3DMouseUp", "pointClick", "pointMove", "tooltipRender"
    ]
  },
  sankey: {
    oneWay: [
      "width", "height", "title", "subTitle", "titleStyle", "subTitleStyle", "background",
      "backgroundImage", "margin", "border", "theme", "links", "nodes", "orientation", "labelSettings",
      "nodeStyle", "linkStyle", "legendSettings", "tooltip", "animation", "enableExport", "allowExport",
      "accessibility", "focusBorderColor", "focusBorderWidth", "focusBorderMargin"
    ],
    events: [
      "legendItemRendering", "legendItemHover", "labelRendering", "nodeRendering", "linkRendering",
      "sizeChanged", "tooltipRendering", "exportCompleted", "nodeClick", "nodeEnter", "nodeLeave",
      "linkClick", "linkEnter", "linkLeave", "loaded", "load", "beforeExport", "afterExport",
      "beforePrint"
    ]
  },
  circularGauge: {
    oneWay: [
      "width", "height", "border", "background", "title", "animationDuration", "titleStyle", "margin",
      "axes", "tooltip", "enablePointerDrag", "enableRangeDrag", "allowPrint", "allowImageExport",
      "allowPdfExport", "allowRangePreRender", "centerX", "centerY", "moveToCenter", "theme",
      "useGroupingSeparator", "description", "tabIndex", "allowMargin", "legendSettings"
    ],
    events: [
      "loaded", "load", "animationComplete", "axisLabelRender", "radiusCalculate", "annotationRender",
      "legendRender", "tooltipRender", "dragStart", "dragMove", "dragEnd", "gaugeMouseMove",
      "gaugeMouseLeave", "gaugeMouseDown", "gaugeMouseUp", "resized", "beforePrint"
    ]
  },
  diagram: {
    oneWay: [
      "width", "enableConnectorSplit", "enableCollaborativeEditing", "enableWebMcp", "webMcpSettings",
      "mode", "height", "segmentThumbShape", "segmentThumbSize", "contextMenuSettings", "constraints",
      "tool", "bridgeDirection", "backgroundColor", "snapSettings", "rulerSettings", "pageSettings",
      "serializationSettings", "nodes", "drawingObject", "connectors", "basicElements", "tooltip",
      "dataSourceSettings", "addInfo", "historyManager", "nodeTemplate", "annotationTemplate",
      "userHandleTemplate", "fixedUserHandleTemplate", "getNodeDefaults", "nodeDefaults",
      "getConnectorDefaults", "connectorDefaults", "setNodeTemplate", "getDescription",
      "getCustomProperty", "getCustomTool", "getCustomCursor", "customCursor", "updateSelection",
      "diagramSettings", "selectedItems", "scrollSettings", "layout", "model", "commandManager", "layers"
    ],
    events: [
      "dataLoaded", "dragEnter", "dragLeave", "dragOver", "click", "historyChange", "historyStateChange",
      "doubleClick", "textEdit", "scrollChange", "mouseWheel", "selectionChange", "sizeChange",
      "connectionChange", "sourcePointChange", "targetPointChange", "propertyChange", "positionChange",
      "keyUp", "keyDown", "animationComplete", "rotateChange", "collectionChange", "fixedUserHandleClick",
      "onUserHandleMouseDown", "onUserHandleMouseUp", "onUserHandleMouseEnter", "onUserHandleMouseLeave",
      "onFixedUserHandleMouseDown", "onFixedUserHandleMouseUp", "onFixedUserHandleMouseEnter",
      "onFixedUserHandleMouseLeave", "segmentCollectionChange", "onImageLoad", "expandStateChange", "load",
      "created", "mouseEnter", "mouseLeave", "mouseOver", "elementDraw", "contextMenuOpen",
      "contextMenuBeforeItemRender", "contextMenuClick", "commandExecute", "drop", "segmentChange",
      "loaded", "layoutUpdated", "diagramImporting", "diagramExporting", "erEntityChanged",
      "beforeWebMcpToolExecute"
    ]
  },
  symbolPalette: {
    oneWay: [
      "accessKey", "width", "height", "palettes", "getSymbolInfo", "symbolInfo", "filterSymbols",
      "ignoreSymbolsOnSearch", "getSymbolTemplate", "symbolWidth", "symbolHeight", "symbolMargin",
      "allowDrag", "symbolPreview", "symbolDragSize", "enableSearch", "enableAnimation", "expandMode",
      "getNodeDefaults", "nodeDefaults", "getConnectorDefaults", "connectorDefaults", "nodeTemplate"
    ],
    events: [
      "paletteSelectionChange", "paletteExpanding"
    ]
  },
  ruler: {
    oneWay: [
      "interval", "segmentWidth", "orientation", "tickAlignment", "markerColor", "thickness",
      "arrangeTick", "length"
    ]
  },
  overview: {
    oneWay: [
      "width", "height", "sourceID"
    ],
    events: [
      "created"
    ]
  },
  documentEditor: {
    oneWay: [
      "enableCollaborativeEditing", "defaultPasteOption", "layoutType", "currentUser", "userColor",
      "pageGap", "documentName", "width", "height", "serviceUrl", "zoomFactor", "zIndex", "isReadOnly",
      "enablePrint", "enableSelection", "enableEditor", "enableEditorHistory", "enableSfdtExport",
      "enableWordExport", "enableAutoFocus", "enableTextExport", "enableOptionsPane", "enableContextMenu",
      "enableHyperlinkDialog", "enableBookmarkDialog", "enableTableOfContentsDialog", "enableSearch",
      "enableParagraphDialog", "enableListDialog", "enableTablePropertiesDialog",
      "enableBordersAndShadingDialog", "enableFootnoteAndEndnoteDialog", "enableColumnsDialog",
      "enablePageSetupDialog", "enableStyleDialog", "enableFontDialog", "enableTableOptionsDialog",
      "enableTableDialog", "enableImageResizer", "enableSpellCheck", "enableComment", "enableTrackChanges",
      "enableFormField", "acceptTab", "useCtrlClickToFollowHyperlink", "pageOutline",
      "enableCursorOnReadOnly", "enableLocalPaste", "enableLockAndEdit", "enableLayout", "enableWebMcp",
      "documentEditorSettings", "documentSettings", "webMcpSettings", "serverActionSettings", "headers",
      "showComments", "showRevisions", "autoResizeOnVisibilityChange"
    ],
    events: [
      "documentChange", "viewChange", "zoomFactorChange", "selectionChange", "requestNavigate",
      "contentChange", "keyDown", "searchResultsChange", "created", "destroyed", "customContextMenuSelect",
      "customContextMenuBeforeOpen", "beforePaneSwitch", "commentBegin", "commentEnd", "beforeFileOpen",
      "commentDelete", "beforeAcceptRejectChanges", "beforeCommentAction", "trackChange",
      "beforeFormFieldFill", "beforePaste", "unsupportedBorderStyleClick", "serviceFailure",
      "afterFormFieldFill", "actionComplete", "contentControl", "beforeXmlHttpRequestSend",
      "documentLoadFailed", "beforeWebMcpToolExecute"
    ]
  },
  documentEditorContainer: {
    oneWay: [
      "showPropertiesPane", "enableToolbar", "restrictEditing", "enableSpellCheck", "enableTrackChanges",
      "layoutType", "currentUser", "userColor", "enableLocalPaste", "serviceUrl", "zIndex", "enableCsp",
      "enableComment", "width", "height", "enableAutoFocus", "enableWebMcp", "enableLockAndEdit",
      "autoResizeOnVisibilityChange", "toolbarMode", "ribbonLayout", "documentEditorSettings",
      "documentSettings", "serverActionSettings", "toolbarItems", "headers", "fileMenuItems",
      "backstageMenu", "webMcpSettings"
    ],
    events: [
      "created", "destroyed", "beforePaste", "contentChange", "beforeWebMcpToolExecute", "selectionChange",
      "documentChange", "toolbarClick", "fileMenuItemClick", "customContextMenuSelect",
      "customContextMenuBeforeOpen", "beforePaneSwitch", "commentDelete", "beforeAcceptRejectChanges",
      "beforeCommentAction", "serviceFailure", "trackChange", "contentControl", "beforeXmlHttpRequestSend"
    ]
  },
  listBox: {
    oneWay: [
      "cssClass", "value", "height", "enabled", "allowDragAndDrop", "maximumSelectionLength",
      "allowFiltering", "scope", "ignoreCase", "filterBarPlaceholder", "sortOrder", "groupTemplate",
      "actionFailureTemplate", "zIndex", "ignoreAccent", "toolbarSettings", "selectionSettings", "fields",
      "itemTemplate", "noRecordsTemplate", "dataSource", "query", "filterType"
    ],
    events: [
      "beforeItemRender", "filtering", "select", "change", "beforeDrop", "dragStart", "drag", "drop",
      "dataBound", "actionBegin", "actionComplete", "actionFailure", "created", "destroyed"
    ]
  },
  mention: {
    oneWay: [
      "cssClass", "mentionChar", "showMentionChar", "allowSpaces", "suffixText", "suggestionCount",
      "minLength", "sortOrder", "ignoreCase", "requireLeadingSpace", "highlight", "popupWidth",
      "popupHeight", "debounceDelay", "displayTemplate", "itemTemplate", "noRecordsTemplate",
      "spinnerTemplate", "target", "dataSource", "query", "filterType", "fields"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "change", "beforeOpen", "opened", "closed",
      "select", "filtering", "created", "destroyed"
    ]
  },
  formBuilder: {
    oneWay: [
      "allowExport", "enablePreview", "mode", "formTemplates", "toolboxCategories", "toolboxItems",
      "schema", "enableHtmlSanitizer"
    ],
    events: [
      "onFieldDragStarted", "onFieldDragOver", "onFieldDropped", "onFieldPropertyChanged"
    ]
  },
  formRenderer: {
    oneWay: [
      "schema", "dataModel", "layout", "className", "customWidgetSettings", "enableHtmlSanitizer"
    ],
    events: [
      "submit", "change", "buttonClick", "failure", "created"
    ]
  },
  gantt: {
    oneWay: [
      "autoUpdatePredecessorOffset", "allowKeyboard", "enableImmutableMode", "allowParentDependency",
      "enableHtmlSanitizer", "disableHtmlEncode", "loadingIndicator", "enableVirtualMaskRow",
      "enableInfiniteTimelineScroll", "loadChildOnDemand", "updateOffsetOnTaskbarEdit",
      "autoCalculateDateScheduling", "autoFocusTasks", "enableAdaptiveUI", "enableWebMcp",
      "webMcpSettings", "enableWBS", "enableAutoWbsUpdate", "enableSerialNumber", "allowSelection",
      "enableHover", "allowSorting", "enablePredecessorValidation", "showColumnMenu", "columnMenuItems",
      "undoRedoActions", "timezone", "collapseAllParentTasks", "highlightWeekends", "treeColumnIndex",
      "dataSource", "durationUnit", "hoursPerDay", "daysPerWeek", "daysPerMonth", "query", "dateFormat",
      "height", "renderBaseline", "baselineTemplate", "calendarSettings", "allowTaskbarDragAndDrop",
      "allowTaskbarOverlap", "gridLines", "labelSettings", "taskbarTemplate", "parentTaskbarTemplate",
      "timelineTemplate", "milestoneTemplate", "baselineColor", "width", "enableVirtualization",
      "enableTimelineVirtualization", "toolbar", "workWeek", "includeWeekend", "allowUnscheduledTasks",
      "showInlineNotes", "rowHeight", "taskbarHeight", "projectStartDate", "projectEndDate",
      "resourceIDMapping", "resourceNameMapping", "resources", "segmentData", "connectorLineBackground",
      "connectorLineWidth", "columns", "addDialogFields", "editDialogFields", "selectedRowIndex",
      "workUnit", "taskType", "viewType", "dayWorkingTime", "weekWorkingTime", "holidays", "eventMarkers",
      "taskFields", "resourceFields", "timelineSettings", "zoomingLevels", "sortSettings", "editSettings",
      "tooltipSettings", "selectionSettings", "allowFiltering", "allowExcelExport", "allowRowDragAndDrop",
      "allowReordering", "readOnly", "allowResizing", "enableContextMenu", "enableCriticalPath",
      "enableUndoRedo", "undoRedoStepsCount", "contextMenuItems", "allowPdfExport",
      "validateManualTasksOnLinking", "enableMultiTaskbar", "showOverAllocation", "taskMode",
      "frozenColumns", "emptyRecordTemplate", "filterSettings", "searchSettings", "splitterSettings",
      "allowedDependencyTypes", "hierarchyCheckboxMode"
    ],
    events: [
      "queryTaskbarInfo", "beforeExcelExport", "excelExportComplete", "excelQueryCellInfo",
      "excelHeaderQueryCellInfo", "rowDrag", "rowDragStart", "rowDragStartHelper", "rowDrop", "collapsing",
      "collapsed", "expanding", "expanded", "actionBegin", "cellSave", "actionComplete", "actionFailure",
      "dataStateChange", "dataSourceChanged", "taskbarEdited", "endEdit", "cellEdit", "load", "created",
      "destroyed", "taskbarEditing", "dataBound", "beforeDataBound", "resizeStart", "resizing",
      "resizeStop", "splitterResizeStart", "splitterResizing", "splitterResized", "columnDragStart",
      "columnDrag", "columnDrop", "beforeTooltipRender", "rowSelecting", "rowSelected", "rowDeselecting",
      "rowDeselected", "cellSelecting", "cellSelected", "cellDeselecting", "cellDeselected",
      "queryCellInfo", "headerCellInfo", "rowDataBound", "columnMenuOpen", "toolbarClick",
      "columnMenuClick", "contextMenuOpen", "contextMenuClick", "onTaskbarClick", "recordDoubleClick",
      "onMouseMove", "beforePdfExport", "beforeWebMcpToolExecute", "pdfExportComplete", "pdfQueryCellInfo",
      "pdfQueryTaskbarInfo", "pdfQueryTimelineCellInfo", "pdfColumnHeaderQueryCellInfo"
    ]
  },
  heatMap: {
    oneWay: [
      "width", "height", "showTooltip", "renderingMode", "dataSource", "dataSourceSettings",
      "backgroundColor", "theme", "allowSelection", "enableMultiSelect", "enableHtmlSanitizer", "margin",
      "titleSettings", "xAxis", "legendSettings", "paletteSettings", "tooltipSettings", "yAxis",
      "cellSettings"
    ],
    events: [
      "tooltipRender", "resized", "loaded", "cellRender", "cellSelected", "created", "load", "cellClick",
      "cellDoubleClick", "legendRender"
    ]
  },
  imageEditor: {
    oneWay: [
      "cssClass", "disabled", "height", "theme", "toolbar", "toolbarTemplate", "width", "allowUndoRedo",
      "showQuickAccessToolbar", "quickAccessToolbarTemplate", "imageSmoothingEnabled", "isReadOnly",
      "finetuneSettings", "zoomSettings", "selectionSettings", "fontFamily", "uploadSettings"
    ],
    events: [
      "beforeSave", "created", "destroyed", "zooming", "panning", "cropping", "rotating", "flipping",
      "shapeChanging", "selectionChanging", "fileOpened", "saved", "toolbarCreated", "toolbarUpdating",
      "toolbarItemClicked", "imageFiltering", "finetuneValueChanging", "click", "shapeChange",
      "quickAccessToolbarOpen", "resizing", "quickAccessToolbarItemClick", "frameChange", "editComplete"
    ]
  },
  inPlaceEditor: {
    oneWay: [
      "name", "template", "enableHtmlSanitizer", "enableHtmlParse", "cssClass", "primaryKey",
      "emptyText", "url", "mode", "adaptor", "type", "editableOn", "textOption", "actionOnBlur",
      "disabled", "showButtons", "enableEditMode", "submitOnEnter", "popupSettings", "model", "saveButton",
      "cancelButton", "validationRules"
    ],
    twoWay: ["value"],
    events: [
      "created", "beforeSanitizeHtml", "actionBegin", "actionSuccess", "actionFailure", "validating",
      "beginEdit", "endEdit", "change", "submitClick", "cancelClick", "destroyed"
    ]
  },
  colorPicker: {
    oneWay: [
      "value", "cssClass", "disabled", "mode", "modeSwitcher", "presetColors", "showButtons", "columns",
      "inline", "noColor", "enableOpacity", "createPopupOnClick", "showRecentColors"
    ],
    events: [
      "select", "change", "beforeTileRender", "beforeOpen", "open", "beforeClose", "beforeModeSwitch",
      "onModeSwitch", "created"
    ]
  },
  textArea: {
    oneWay: [
      "readonly", "value", "floatLabelType", "cssClass", "placeholder", "htmlAttributes", "enabled",
      "showClearButton", "width", "resizeMode", "maxLength", "cols", "rows", "prependTemplate",
      "appendTemplate", "adornmentFlow", "adornmentOrientation"
    ],
    events: [
      "created", "destroyed", "change", "blur", "focus", "input"
    ]
  },
  smartTextArea: {
    oneWay: [
      "userRole", "UserPhrases", "aiSuggestionHandler", "showSuggestionOnPopup", "readonly", "value",
      "floatLabelType", "cssClass", "placeholder", "htmlAttributes", "enabled", "showClearButton", "width",
      "resizeMode", "maxLength", "cols", "rows", "prependTemplate", "appendTemplate", "adornmentFlow",
      "adornmentOrientation"
    ],
    events: [
      "beforeSuggestionInsert", "afterSuggestionInsert", "created", "destroyed", "change", "blur", "focus",
      "input"
    ]
  },
  signature: {
    oneWay: [
      "backgroundColor", "backgroundImage", "disabled", "isReadOnly", "saveWithBackground", "strokeColor",
      "minStrokeWidth", "maxStrokeWidth", "velocity"
    ],
    events: [
      "beforeSave", "change", "created"
    ]
  },
  rating: {
    oneWay: [
      "allowReset", "cssClass", "disabled", "emptyTemplate", "enableAnimation", "enableSingleSelection",
      "fullTemplate", "itemsCount", "labelPosition", "labelTemplate", "min", "precision", "readOnly",
      "showLabel", "showTooltip", "tooltipTemplate", "value", "visible"
    ],
    events: [
      "beforeItemRender", "created", "onItemHover", "valueChanged"
    ]
  },
  otpInput: {
    oneWay: [
      "length", "value", "type", "separator", "placeholder", "stylingMode", "disabled", "cssClass",
      "autoFocus", "textTransform", "htmlAttributes", "ariaLabels"
    ],
    events: [
      "created", "valueChanged", "focus", "blur", "input"
    ]
  },
  speechToText: {
    oneWay: [
      "transcript", "lang", "allowInterimResults", "showTooltip", "listeningState", "buttonSettings",
      "tooltipSettings", "disabled", "cssClass", "htmlAttributes"
    ],
    events: [
      "created", "onStart", "onStop", "onError", "transcriptChanged"
    ]
  },
  aiAssistView: {
    oneWay: [
      "prompt", "promptPlaceholder", "prompts", "promptSuggestions", "promptSuggestionsHeader",
      "showHeader", "toolbarSettings", "activeView", "promptIconCss", "responseIconCss", "width", "height",
      "cssClass", "views", "promptToolbarSettings", "responseToolbarSettings", "footerToolbarSettings",
      "speechToTextSettings", "textToSpeechSettings", "telemetrySettings", "enableAttachments",
      "attachmentSettings", "mentions", "showClearButton", "enableScrollToBottom", "footerTemplate",
      "promptItemTemplate", "responseItemTemplate", "promptSuggestionItemTemplate", "bannerTemplate",
      "blockTemplate", "itemTemplate", "responseAnimationTemplate", "enableStreaming"
    ],
    events: [
      "promptRequest", "promptChanged", "stopRespondingClick", "beforeAttachmentUpload",
      "attachmentUploadSuccess", "attachmentUploadFailure", "attachmentRemoved", "attachmentRemoving",
      "editableContextClicked", "mentionSelect", "created"
    ]
  },
  chatUI: {
    oneWay: [
      "width", "height", "user", "headerText", "headerIconCss", "placeholder", "cssClass", "showHeader",
      "showFooter", "headerToolbar", "suggestions", "showTimeBreak", "messages", "typingUsers",
      "timeStampFormat", "showTimeStamp", "autoScrollToBottom", "loadOnDemand", "mentionUsers",
      "mentionTriggerChar", "suggestionTemplate", "footerTemplate", "emptyChatTemplate", "messageTemplate",
      "timeBreakTemplate", "typingUsersTemplate", "enableCompactMode", "messageToolbarSettings",
      "enableAttachments", "attachmentSettings"
    ],
    events: [
      "messageSend", "userTyping", "mentionSelect", "beforeAttachmentUpload", "attachmentUploadSuccess",
      "attachmentUploadFailure", "attachmentRemoved", "created"
    ]
  },
  inlineAIAssist: {
    oneWay: [
      "target", "relateTo", "responseMode", "cssClass", "prompt", "prompts", "placeholder", "popupHeight",
      "popupWidth", "commandSettings", "responseSettings", "inlineToolbarSettings", "speechToTextSettings",
      "responseTemplate", "editorTemplate", "zIndex", "enableStreaming"
    ],
    events: [
      "promptRequest", "open", "close", "created"
    ]
  },
  kanban: {
    oneWay: [
      "cssClass", "width", "height", "cardHeight", "enableVirtualization", "dataSource", "query",
      "keyField", "constraintType", "externalDropId", "columns", "allowKeyboard", "enableHtmlSanitizer",
      "stackedHeaders", "swimlaneSettings", "cardSettings", "sortSettings", "dialogSettings",
      "allowDragAndDrop", "allowColumnDragAndDrop", "enableTooltip", "showEmptyColumn", "tooltipTemplate"
    ],
    events: [
      "actionBegin", "actionComplete", "actionFailure", "created", "dataBinding", "dataBound", "cardClick",
      "cardDoubleClick", "queryCellInfo", "cardRendered", "dragStart", "drag", "dragStop", "dialogOpen",
      "dialogClose", "columnDragStart", "columnDrag", "columnDrop", "dataStateChange", "dataSourceChanged"
    ]
  },
  linearGauge: {
    oneWay: [
      "width", "allowMargin", "height", "animationDuration", "orientation", "edgeLabelPlacement",
      "allowPrint", "allowImageExport", "allowPdfExport", "margin", "border", "background", "title",
      "titleStyle", "container", "axes", "tooltip", "annotations", "rangePalettes", "useGroupingSeparator",
      "description", "tabIndex", "format", "theme"
    ],
    events: [
      "loaded", "load", "animationComplete", "axisLabelRender", "dragStart", "dragMove", "dragEnd",
      "annotationRender", "tooltipRender", "gaugeMouseMove", "gaugeMouseLeave", "gaugeMouseDown",
      "gaugeMouseUp", "valueChange", "resized", "beforePrint"
    ]
  },
  maps: {
    oneWay: [
      "background", "useGroupingSeparator", "format", "width", "height", "tooltipDisplayMode",
      "allowPrint", "allowImageExport", "allowPdfExport", "titleSettings", "zoomSettings",
      "legendSettings", "layers", "annotations", "margin", "border", "theme", "projectionType",
      "baseLayerIndex", "description", "tabIndex", "centerPosition", "mapsArea"
    ],
    events: [
      "load", "beforePrint", "loaded", "click", "onclick", "doubleClick", "rightClick", "resize",
      "tooltipRender", "legendRendering", "tooltipRenderComplete", "shapeSelected", "itemSelection",
      "itemHighlight", "shapeHighlight", "layerRendering", "shapeRendering", "markerRendering",
      "markerClusterRendering", "markerClick", "markerDragStart", "markerDragEnd", "markerClusterClick",
      "markerClusterMouseMove", "markerMouseMove", "mouseMove", "dataLabelRendering", "bubbleRendering",
      "bubbleClick", "bubbleMouseMove", "animationComplete", "annotationRendering", "zoom", "pan",
      "panComplete", "zoomComplete"
    ]
  },
  multiColumnComboBox: {
    oneWay: [
      "dataSource", "text", "value", "index", "width", "popupHeight", "popupWidth", "placeholder",
      "allowFiltering", "allowSorting", "showClearButton", "cssClass", "fields", "columns", "gridSettings",
      "filterType", "floatLabelType", "sortOrder", "sortType", "enableVirtualization", "disabled",
      "readonly", "query", "itemTemplate", "footerTemplate", "groupTemplate", "actionFailureTemplate",
      "noRecordsTemplate", "htmlAttributes"
    ],
    events: [
      "created", "open", "close", "actionFailure", "actionBegin", "actionComplete", "filtering", "select",
      "change"
    ]
  },
  toolbar: {
    oneWay: [
      "items", "width", "height", "cssClass", "overflowMode", "scrollStep", "enableCollision",
      "enableHtmlSanitizer", "allowKeyboard"
    ],
    events: [
      "clicked", "created", "destroyed", "beforeCreate", "keyDown"
    ]
  },
  contextMenu: {
    oneWay: [
      "target", "filter", "items", "itemTemplate", "enableScrolling", "cssClass", "hoverDelay",
      "showItemOnClick", "template", "enableHtmlSanitizer", "fields", "animationSettings"
    ],
    events: [
      "beforeItemRender", "beforeOpen", "onOpen", "beforeClose", "onClose", "select", "created"
    ]
  },
  menu: {
    oneWay: [
      "orientation", "target", "template", "enableScrolling", "hamburgerMode", "title",
      "enableHtmlSanitizer", "fields", "cssClass", "hoverDelay", "showItemOnClick", "filter", "items",
      "animationSettings"
    ],
    events: [
      "beforeItemRender", "beforeOpen", "onOpen", "beforeClose", "onClose", "select", "created"
    ]
  },
  tab: {
    oneWay: [
      "items", "width", "swipeMode", "height", "cssClass", "selectedItem", "headerPlacement",
      "heightAdjustMode", "overflowMode", "loadOn", "enableHtmlSanitizer", "showCloseButton",
      "reorderActiveTab", "scrollStep", "dragArea", "allowDragAndDrop", "clearTemplates", "animation"
    ],
    events: [
      "created", "adding", "added", "selecting", "selected", "removing", "removed", "onDragStart",
      "dragging", "dragged", "destroyed"
    ]
  },
  breadcrumb: {
    oneWay: [
      "url", "items", "activeItem", "maxItems", "overflowMode", "cssClass", "itemTemplate",
      "separatorTemplate", "enableNavigation", "enableActiveItemNavigation", "disabled"
    ],
    events: [
      "beforeItemRender", "itemClick", "created"
    ]
  },
  carousel: {
    oneWay: [
      "items", "animationEffect", "previousButtonTemplate", "nextButtonTemplate", "indicatorsTemplate",
      "playButtonTemplate", "cssClass", "dataSource", "itemTemplate", "selectedIndex", "width", "height",
      "interval", "autoPlay", "pauseOnHover", "loop", "showPlayButton", "enableTouchSwipe",
      "allowKeyboardInteraction", "showIndicators", "indicatorsType", "buttonsVisibility",
      "partialVisible", "swipeMode", "htmlAttributes"
    ],
    events: [
      "slideChanging", "slideChanged"
    ]
  },
  appBar: {
    oneWay: [
      "mode", "position", "cssClass", "isSticky", "htmlAttributes", "colorMode"
    ],
    events: [
      "created", "destroyed"
    ]
  },
  stepper: {
    oneWay: [
      "activeStep", "animation", "linear", "showTooltip", "template", "tooltipTemplate", "labelPosition",
      "stepType", "steps", "cssClass", "readOnly", "orientation"
    ],
    events: [
      "stepChanged", "stepChanging", "stepClick", "beforeStepRender", "created"
    ]
  },
  toast: {
    oneWay: [
      "width", "height", "title", "content", "enableHtmlSanitizer", "icon", "cssClass", "template",
      "newestOnTop", "showCloseButton", "showProgressBar", "timeOut", "progressDirection",
      "extendedTimeout", "animation", "position", "buttons", "target"
    ],
    events: [
      "created", "beforeSanitizeHtml", "destroyed", "open", "beforeOpen", "beforeClose", "close", "click"
    ]
  },
  message: {
    oneWay: [
      "content", "cssClass", "showIcon", "showCloseIcon", "severity", "variant", "visible"
    ],
    events: [
      "created", "destroyed", "closed"
    ]
  },
  skeleton: {
    oneWay: [
      "width", "height", "visible", "shape", "shimmerEffect", "label", "cssClass"
    ]
  },
  pdfViewer: {
    oneWay: [
      "serviceUrl", "pageCount", "printScaleFactor", "isDocumentEdited", "currentPageNumber",
      "documentPath", "exportAnnotationFileName", "downloadFileName", "height", "width", "enableToolbar",
      "retryCount", "retryStatusCodes", "retryTimeout", "initialRenderPages", "showNotificationDialog",
      "enableNavigationToolbar", "enableCommentPanel", "isCommandPanelOpen", "enableTextMarkupResizer",
      "enableMultiLineOverlap", "isValidFreeText", "isAnnotationToolbarOpen", "isAnnotationToolbarVisible",
      "isFormDesignerToolbarVisible", "isRedactionToolbarVisible", "enableMultiPageAnnotation",
      "enableDownload", "enablePrint", "enablePrintRotation", "customFonts", "enableThumbnail",
      "enablePageOrganizer", "isPageOrganizerOpen", "pageOrganizerSettings", "isThumbnailViewOpen",
      "isSignatureEditable", "enableBookmark", "extractTextOption", "enableLocalStorage",
      "enableBookmarkStyles", "enableHyperlink", "enableHandwrittenSignature", "enableInkAnnotation",
      "enableLinkAnnotation", "restrictZoomRequest", "hyperlinkOpenState", "contextMenuOption",
      "disableContextMenuItems", "formFieldCollections", "enableNavigation", "enableAutoComplete",
      "enableMagnification", "enableShapeLabel", "enableImportAnnotationMeasurement", "enablePinchZoom",
      "enableTextSelection", "enableTextSearch", "enableAnnotation", "enableFormFields",
      "enableFormDesigner", "designerMode", "enableFormFieldsValidation", "enableWebMcp", "webMcpSettings",
      "isFormFieldDocument", "enableDesktopMode", "hideSaveSignature", "enableFreeText",
      "enableTextMarkupAnnotation", "enableShapeAnnotation", "enableMeasureAnnotation",
      "enableStampAnnotations", "enableStickyNotesAnnotation", "enableAnnotationToolbar",
      "enableFormDesignerToolbar", "enableRedactionToolbar", "isBookmarkPanelOpen",
      "enableCollaborativeEditing", "isInitialFieldToolbarSelection", "interactionMode", "zoomMode",
      "signatureFitMode", "printMode", "zoomValue", "minZoom", "maxZoom", "enableZoomOptimization",
      "isExtractText", "isMaintainSelection", "hideEmptyDigitalSignatureFields",
      "showDigitalSignatureAppearance", "enableAccessibilityTags", "enableHtmlSanitizer", "dateTimeFormat",
      "resourceUrl", "toolbarSettings", "cloudSettings", "ajaxRequestSettings", "customStamp",
      "customTextStamps", "serverActionSettings", "signatureFieldSettings", "initialFieldSettings",
      "highlightSettings", "strikethroughSettings", "squigglySettings", "underlineSettings",
      "lineSettings", "annotationDrawingOptions", "arrowSettings", "rectangleSettings",
      "redactionSettings", "shapeLabelSettings", "circleSettings", "webLinkSettings",
      "documentLinkSettings", "polygonSettings", "stampSettings", "customStampSettings",
      "distanceSettings", "perimeterSettings", "areaSettings", "radiusSettings", "volumeSettings",
      "stickyNotesSettings", "freeTextSettings", "calloutSettings", "measurementSettings",
      "annotationSelectorSettings", "textSearchColorSettings", "signatureDialogSettings",
      "initialDialogSettings", "handWrittenSignatureSettings", "inkAnnotationSettings", "enableInkEraser",
      "inkEraserSize", "annotationSettings", "tileRenderingSettings", "scrollSettings",
      "textFieldSettings", "passwordFieldSettings", "checkBoxFieldSettings", "radioButtonFieldSettings",
      "DropdownFieldSettings", "listBoxFieldSettings", "contextMenuSettings", "customContextMenuItems",
      "disableDefaultContextMenu", "showCustomContextMenuBottom", "commandManager", "selectedItems",
      "annotations", "formFields", "drawingObject"
    ],
    events: [
      "created", "resourcesLoaded", "documentLoad", "documentUnload", "documentLoadFailed",
      "ajaxRequestFailed", "ajaxRequestSuccess", "pageRenderComplete", "validateFormFields", "pageClick",
      "pageChange", "hyperlinkClick", "hyperlinkMouseOver", "zoomChange", "annotationAdd",
      "annotationRemove", "annotationPropertiesChange", "annotationChanged", "annotationResize",
      "addSignature", "removeSignature", "moveSignature", "signaturePropertiesChange", "resizeSignature",
      "signatureSelect", "signatureUnselect", "annotationSelect", "annotationUnSelect",
      "annotationDoubleClick", "annotationMove", "annotationMoving", "annotationMouseover",
      "annotationMouseLeave", "pageMouseover", "importStart", "exportStart", "importSuccess",
      "exportSuccess", "importFailed", "exportFailed", "extractTextCompleted", "thumbnailClick",
      "bookmarkClick", "toolbarClick", "textSelectionStart", "textSelectionEnd", "downloadStart",
      "buttonFieldClick", "formFieldClick", "downloadEnd", "printStart", "printEnd", "textSearchStart",
      "textSearchComplete", "textSearchHighlight", "ajaxRequestInitiate", "pageRenderInitiate",
      "commentAdd", "commentEdit", "commentDelete", "commentSelect", "commentStatusChanged",
      "beforeAddFreeText", "formFieldFocusOut", "formFieldAdd", "formFieldRemove",
      "formFieldPropertiesChange", "formFieldChanged", "formFieldMouseLeave", "formFieldMouseover",
      "formFieldMove", "formFieldResize", "formFieldSelect", "formFieldUnselect", "formFieldDoubleClick",
      "customContextMenuSelect", "customContextMenuBeforeOpen", "keyboardCustomCommands",
      "pageOrganizerSaveAs", "pageOrganizerSaved", "documentChanged", "pageOrganizerZoomChanged",
      "beforeWebMcpToolExecute"
    ]
  },
  pdfComparer: {
    oneWay: [
      "originalDocumentPath", "modifiedDocumentPath", "resourceUrl", "comparisonOptions",
      "enableDifferencePanel", "enableSyncScrolling", "height", "width"
    ]
  },
  pivotView: {
    oneWay: [
      "currencyCode", "showFieldList", "gridSettings", "chartSettings", "groupingBarSettings",
      "hyperlinkSettings", "pageSettings", "pagerSettings", "dataSourceSettings", "editSettings",
      "displayOption", "virtualScrollSettings", "pivotValues", "showGroupingBar", "showTooltip",
      "showToolbar", "toolbar", "showValuesButton", "allowCalculatedField", "enableFieldSearching",
      "enableValueSorting", "allowConditionalFormatting", "allowNumberFormatting", "height", "width",
      "allowExcelExport", "enableVirtualization", "enablePaging", "allowDrillThrough", "allowPdfExport",
      "allowDeferLayoutUpdate", "allowDataCompression", "maxNodeLimitInMemberEditor",
      "maxRowsInDrillThrough", "loadOnDemandInMemberEditor", "enableHtmlSanitizer", "cellTemplate",
      "toolbarTemplate", "tooltipTemplate", "spinnerTemplate", "allowGrouping", "exportAllPages",
      "enableWebMcp", "webMcpSettings", "aggregateTypes", "chartTypes", "cssClass"
    ],
    events: [
      "queryCellInfo", "headerCellInfo", "resizing", "resizeStop", "pdfHeaderQueryCellInfo",
      "pdfQueryCellInfo", "excelHeaderQueryCellInfo", "excelQueryCellInfo", "columnDragStart",
      "columnDrag", "columnDrop", "beforePdfExport", "beforeExcelExport", "beforeColumnsRender",
      "selected", "selecting", "cellDeselected", "rowSelected", "rowDeselected", "chartTooltipRender",
      "chartLegendClick", "beforePrint", "animationComplete", "legendRender", "textRender", "pointRender",
      "seriesRender", "chartMouseMove", "chartMouseClick", "pointMove", "chartMouseLeave",
      "chartMouseDown", "chartMouseUp", "dragComplete", "zoomComplete", "scrollStart", "scrollEnd",
      "scrollChanged", "multiLevelLabelRender", "chartLoaded", "chartLoad", "chartResized",
      "chartAxisLabelRender", "multiLevelLabelClick", "chartPointClick", "contextMenuClick",
      "contextMenuOpen", "onPdfCellRender", "saveReport", "fetchReport", "loadReport", "renameReport",
      "removeReport", "newReport", "toolbarRender", "toolbarClick", "load", "enginePopulating",
      "enginePopulated", "onFieldDropped", "fieldDrop", "fieldDragStart", "dataBound", "created",
      "destroyed", "beforeExport", "exportComplete", "conditionalFormatting", "memberFiltering",
      "cellClick", "drillThrough", "editCompleted", "beginDrillThrough", "hyperlinkCellClick",
      "cellSelecting", "drill", "cellSelected", "chartSeriesCreated", "aggregateCellInfo",
      "fieldListRefreshed", "memberEditorOpen", "calculatedFieldCreate", "numberFormatting",
      "aggregateMenuOpen", "fieldRemove", "beforeServiceInvoke", "afterServiceInvoke", "actionBegin",
      "actionComplete", "actionFailure", "onHeadersSort", "beforeWebMcpToolExecute"
    ]
  },
  pivotFieldList: {
    oneWay: [
      "dataSourceSettings", "renderMode", "target", "cssClass", "enableHtmlSanitizer",
      "allowCalculatedField", "enableFieldSearching", "showValuesButton", "allowDeferLayoutUpdate",
      "maxNodeLimitInMemberEditor", "loadOnDemandInMemberEditor", "spinnerTemplate", "aggregateTypes",
      "currencyCode"
    ],
    events: [
      "load", "enginePopulating", "memberFiltering", "enginePopulated", "onFieldDropped", "fieldDrop",
      "fieldDragStart", "aggregateCellInfo", "memberEditorOpen", "calculatedFieldCreate",
      "aggregateMenuOpen", "fieldRemove", "dataBound", "created", "destroyed", "beforeServiceInvoke",
      "afterServiceInvoke", "actionBegin", "actionComplete", "actionFailure", "onHeadersSort"
    ]
  },
  popup: {
    oneWay: [
      "height", "width", "content", "targetType", "viewPortElement", "collision", "relateTo", "position",
      "offsetX", "offsetY", "zIndex", "actionOnScroll", "showAnimation", "hideAnimation"
    ],
    events: [
      "open", "close", "targetExitViewport"
    ]
  },
  dialog: {
    oneWay: [
      "content", "enableHtmlSanitizer", "showCloseIcon", "isModal", "header", "visible", "enableResize",
      "resizeHandles", "height", "minHeight", "width", "cssClass", "zIndex", "target", "footerTemplate",
      "allowDragging", "buttons", "closeOnEscape", "animationSettings", "position"
    ],
    events: [
      "created", "open", "beforeSanitizeHtml", "beforeOpen", "close", "beforeClose", "dragStart",
      "dragStop", "drag", "overlayClick", "resizeStart", "resizing", "resizeStop", "destroyed"
    ]
  },
  tooltip: {
    oneWay: [
      "width", "height", "content", "container", "target", "position", "offsetX", "offsetY",
      "showTipPointer", "enableHtmlParse", "windowCollision", "tipPointerPosition", "opensOn",
      "mouseTrail", "isSticky", "animation", "openDelay", "closeDelay", "cssClass", "enableHtmlSanitizer",
      "htmlAttributes"
    ],
    events: [
      "beforeRender", "beforeOpen", "afterOpen", "beforeClose", "afterClose", "beforeCollision", "created",
      "destroyed"
    ]
  },
  progressBar: {
    oneWay: [
      "type", "value", "secondaryProgress", "secondaryProgressColor", "secondaryProgressThickness",
      "minimum", "maximum", "startAngle", "endAngle", "radius", "innerRadius", "segmentCount", "gapWidth",
      "segmentColor", "cornerRadius", "height", "width", "isIndeterminate", "isActive", "isGradient",
      "isStriped", "role", "labelOnTrack", "trackColor", "progressColor", "trackThickness",
      "progressThickness", "enablePieProgress", "theme", "showProgressValue", "enableProgressSegments",
      "labelStyle", "margin", "animation", "tooltip", "annotations", "rangeColors"
    ],
    events: [
      "load", "textRender", "loaded", "valueChanged", "progressCompleted", "animationComplete",
      "mouseClick", "mouseMove", "mouseUp", "mouseDown", "mouseLeave", "tooltipRender"
    ]
  },
  queryBuilder: {
    oneWay: [
      "showButtons", "summaryView", "allowValidation", "fieldMode", "columns", "fieldModel",
      "operatorModel", "valueModel", "headerTemplate", "cssClass", "dataSource", "displayMode",
      "sortDirection", "maxGroupCount", "height", "width", "matchCase", "immediateModeDelay",
      "enableNotCondition", "readonly", "addRuleToNewGroups", "autoSelectField", "autoSelectOperator",
      "separator", "enableSeparateConnector", "rule", "allowDragAndDrop"
    ],
    events: [
      "created", "destroyed", "actionBegin", "beforeChange", "change", "dataBound", "ruleChange",
      "dragStart", "drag", "drop"
    ]
  },
  ribbon: {
    oneWay: [
      "activeLayout", "cssClass", "enableKeyTips", "layoutSwitcherKeyTip", "fileMenu", "backStageMenu",
      "launcherIconCss", "isMinimized", "selectedTab", "tabAnimation", "tabs", "contextualTabs", "width",
      "helpPaneTemplate", "hideLayoutSwitcher"
    ],
    events: [
      "tabSelecting", "tabSelected", "ribbonExpanding", "ribbonCollapsing", "ribbonLayoutSwitched",
      "launcherIconClick", "created", "overflowPopupOpen", "overflowPopupClose"
    ]
  },
  richTextEditorUI: {
    oneWay: [
      "enable", "readonly", "width", "height", "placeholder", "htmlAttributes", "cssClass", "keyBindings",
      "valueFormat", "saveInterval", "undoRedoSteps", "undoRedoTimer", "toolbarSettings",
      "fontSize", "fontFamily", "quickToolbarSettings", "linkSettings", "tableSettings", "fontColor",
      "backgroundColor", "listSettings", "format", "slashCommandSettings", "interactionSettings",
      "imageSettings"
    ],
    twoWay: ["value"],
    events: [
      "created", "destroyed", "focus", "blur", "actionBegin", "actionComplete", "change",
      "beforeDialogOpen", "beforeDialogClose", "beforeFileUpload", "fileUploading", "fileSelected",
      "fileUploadSuccess", "fileUploadFailed", "fileRemoving", "beforeFileDrop"
    ]
  },
  recurrenceEditor: {
    oneWay: [
      "frequencies", "endTypes", "firstDayOfWeek", "startDate", "dateFormat", "calendarMode", "cssClass",
      "minDate", "maxDate", "selectedType"
    ],
    twoWay: ["value"],
    events: [
      "change", "created", "destroyed"
    ]
  },
  dropDownButton: {
    oneWay: [
      "content", "cssClass", "disabled", "iconCss", "iconPosition", "enableHtmlSanitizer", "items",
      "createPopupOnClick", "target", "closeActionEvents", "itemTemplate", "popupWidth",
      "animationSettings"
    ],
    events: [
      "beforeItemRender", "beforeOpen", "beforeClose", "close", "open", "select", "created"
    ]
  },
  splitButton: {
    oneWay: [
      "content", "cssClass", "disabled", "iconCss", "iconPosition", "createPopupOnClick", "items",
      "target", "enableHtmlSanitizer", "closeActionEvents", "itemTemplate", "popupWidth",
      "animationSettings"
    ],
    events: [
      "beforeItemRender", "beforeOpen", "beforeClose", "click", "close", "open", "select", "created"
    ]
  },
  spreadsheet: {
    oneWay: [
      "cssClass", "allowScrolling", "allowResizing", "showAggregate", "showCommentsPane", "enableAIAssist",
      "enableCollaborativeEditing", "enableClipboard", "enableContextMenu", "enableKeyboardNavigation",
      "enableKeyboardShortcut", "allowUndoRedo", "allowWrap", "selectionSettings", "scrollSettings",
      "aiAssistSettings", "currencyCode", "sheets", "author", "activeSheetIndex", "height",
      "allowFindAndReplace", "filterCollection", "sortCollection", "width", "showRibbon", "showFormulaBar",
      "showSheetTabs", "allowEditing", "allowOpen", "allowSave", "allowSorting", "allowFiltering",
      "allowNumberFormatting", "allowCellFormatting", "allowHyperlink", "enableNotes", "allowInsert",
      "allowDelete", "allowMerge", "allowDataValidation", "allowImage", "allowChart", "allowAutoFill",
      "allowPrint", "calculationMode", "autoFillSettings", "allowConditionalFormat", "cellStyle",
      "openUrl", "openSettings", "saveUrl", "password", "isProtected", "definedNames", "enableWebMcp",
      "webMcpSettings", "allowFreezePane", "listSeparator", "hashValue", "saltValue", "spinCount"
    ],
    events: [
      "promptRequest", "promptResponse", "beforeCellRender", "beforeSelect", "select",
      "contextMenuBeforeOpen", "fileMenuBeforeOpen", "contextMenuBeforeClose", "dialogBeforeOpen",
      "fileMenuBeforeClose", "contextMenuItemSelect", "fileMenuItemSelect", "beforeDataBound", "dataBound",
      "dataSourceChanged", "cellEdit", "cellEditing", "cellEdited", "cellSave", "beforeCellSave",
      "created", "beforeSort", "beforeHyperlinkCreate", "afterHyperlinkCreate", "beforeHyperlinkClick",
      "afterHyperlinkClick", "beforeConditionalFormat", "actionBegin", "actionComplete", "openComplete",
      "sortComplete", "beforeOpen", "openFailure", "beforeSave", "saveComplete", "beforeCellFormat",
      "queryCellInfo", "beforeCellUpdate", "beforeWebMcpToolExecute"
    ]
  },
  treeGrid: {
    oneWay: [
      "frozenRows", "frozenColumns", "clipMode", "columns", "childMapping", "hasChildMapping",
      "treeColumnIndex", "idMapping", "parentIdMapping", "enableCollapseAll", "expandStateMapping",
      "allowRowDragAndDrop", "dataSource", "query", "cloneQuery", "printMode", "allowPaging",
      "loadChildOnDemand", "allowTextWrap", "textWrapSettings", "allowReordering", "allowResizing",
      "autoCheckHierarchy", "hierarchyCheckboxMode", "pageSettings", "rowDropSettings", "currencyCode",
      "pagerTemplate", "showColumnMenu", "showColumnChooser", "columnChooserSettings", "allowSorting",
      "allowMultiSorting", "sortSettings", "aggregates", "editSettings", "allowFiltering",
      "detailTemplate", "filterSettings", "searchSettings", "toolbar", "toolbarTemplate", "gridLines",
      "contextMenuItems", "columnMenuItems", "rowTemplate", "copyHierarchyMode", "rowHeight",
      "enableAltRow", "allowKeyboard", "enableHover", "enableAutoFill", "enableAdaptiveUI",
      "enableImmutableMode", "enableStickyHeader", "emptyRecordTemplate", "height", "width",
      "loadingIndicator", "enableVirtualMaskRow", "enableVirtualization", "enableColumnVirtualization",
      "enableHtmlSanitizer", "enableInfiniteScrolling", "infiniteScrollSettings",
      "enableDomVirtualization", "domVirtualizationSettings", "columnQueryMode", "allowSelection",
      "selectedRowIndex", "isRowSelectable", "selectionSettings", "allowExcelExport", "allowPdfExport",
      "enableColumnSpan", "enableRowSpan"
    ],
    events: [
      "created", "load", "expanding", "expanded", "collapsing", "collapsed", "cellSave", "cellSaved",
      "actionBegin", "actionComplete", "beginEdit", "batchAdd", "batchDelete", "batchCancel",
      "beforeBatchAdd", "beforeBatchDelete", "beforeBatchSave", "cellEdit", "actionFailure", "dataBound",
      "dataSourceChanged", "dataStateChange", "recordDoubleClick", "rowDataBound", "detailDataBound",
      "queryCellInfo", "rowSelecting", "rowSelected", "rowDeselecting", "rowDeselected", "headerCellInfo",
      "cellSelecting", "columnMenuOpen", "columnMenuClick", "cellSelected", "cellDeselecting",
      "cellDeselected", "resizeStart", "resizing", "resizeStop", "columnDragStart", "columnDrag",
      "columnDrop", "checkboxChange", "printComplete", "beforePrint", "toolbarClick", "beforeDataBound",
      "contextMenuOpen", "contextMenuClick", "beforeCopy", "beforePaste", "rowDrag", "rowDragStart",
      "rowDragStartHelper", "rowDrop", "pdfQueryCellInfo", "pdfHeaderQueryCellInfo", "excelQueryCellInfo",
      "pdfAggregateQueryCellInfo", "excelAggregateQueryCellInfo", "excelHeaderQueryCellInfo",
      "beforeExcelExport", "excelExportComplete", "beforePdfExport", "pdfExportComplete"
    ]
  },
  treeMap: {
    oneWay: [
      "allowPrint", "allowImageExport", "allowPdfExport", "width", "height", "border", "margin",
      "background", "theme", "titleSettings", "layoutType", "dataSource", "query", "weightValuePath",
      "rangeColorValuePath", "equalColorValuePath", "colorValuePath", "palette", "renderDirection",
      "enableDrillDown", "enableBreadcrumb", "breadcrumbConnector", "drillDownView", "enableHtmlSanitizer",
      "initialDrillDown", "leafItemSettings", "levels", "highlightSettings", "selectionSettings",
      "tooltipSettings", "legendSettings", "useGroupingSeparator", "description", "tabIndex", "format"
    ],
    events: [
      "load", "beforePrint", "loaded", "itemRendering", "drillStart", "drillEnd", "itemSelected",
      "itemHighlight", "tooltipRendering", "itemClick", "itemMove", "click", "doubleClick", "rightClick",
      "mouseMove", "resize", "legendItemRendering", "legendRendering"
    ]
  }
};
