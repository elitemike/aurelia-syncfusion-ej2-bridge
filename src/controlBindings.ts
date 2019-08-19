export const ControlBindings = {
  common: {
    oneWay: []
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
  progressButton: {
    oneWay: ["animationSettings", "content", "cssClass", "disabled", "duration", "enablePersistence", "enableProgress", "enableRtl", "iconCss", "iconPosition", "isPrimary", "isToggle", "spinSettings"],
    events: ["begin", "created", "end", "fail", "progress"]
  },
  radio: {
    oneWay: ["checked", "cssClass", "disabled", "enablePersistence", "enableRtl", "label", "labelPosition", "locale", "name", "value"],
    events: ["change", "created"]
  },
  textBox: {
    oneWay: ["cssClass", "enablePersistence", "enableRtl", "enabled", "floatLabelType", "htmlAttributes", "locale", "multiline", "placeholder", "readonly", "showClearButton", "type"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus", "input"]
  },
  uploader: {
    oneWay: ["allowedExtensions", "asyncSettings", "autoUpload", "buttons", "cssClass", "directoryUpload", "dropArea", "enablePersistence", "enableRtl", "enabled", "files", "htmlAttributes", "locale", "maxFileSize", "minFileSize", "multiple", "sequentialUpload", "showFileList", "template", "formData"],
    events: ["actionComplete", "canceling", "change", "chunkFailure", "chunkSuccess", "chunkUploading", "clearing", "created", "failure", "fileListRendering", "pausing", "progress", "removing", "rendering", "resuming", "selected", "success", "uploading"]
  }
}
