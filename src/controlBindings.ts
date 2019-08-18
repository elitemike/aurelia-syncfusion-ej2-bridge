export const ControlBindings = {
  common: {
    oneWay: []
  },
  button: {
    oneWay: ["disabled", "isPrimary", "content", "cssClass", "enablePersistence", "iconCss", "iconPosition", "isToggle", "enableRtl"]
  },
  checkbox: {
    oneWay: ["cssClass", "disabled", "enablePersistence", "enableRtl", "indeterminate", "label", "labelPosition", "locale", "name", "value"],
    twoWay: ["checked"]
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
    twoWay: ["selectedRowIndex"]
  },
  progressButton: {
    oneWay: ["animationSettings", "content", "cssClass", "disabled", "duration", "enablePersistence", "enableProgress", "enableRtl", "iconCss", "iconPosition", "isPrimary", "isToggle", "spinSettings"]
  },
  radio: {
    oneWay: ["checked", "cssClass", "disabled", "enablePersistence", "enableRtl", "label", "labelPosition", "locale", "name", "value"]
  },
  textBox: {
    oneWay: ["cssClass", "enablePersistence", "enableRtl", "enabled", "floatLabelType", "htmlAttributes", "locale", "multiline", "placeholder", "readonly", "showClearButton", "type"],
    twoWay: ["value"],
    events: ["blur", "change", "created", "destroyed", "focus", "input"]
  },
  uploader: {
    oneWay: ["allowedExtensions", "asyncSettings", "autoUpload", "buttons", "cssClass", "directoryUpload", "dropArea", "enablePersistence", "enableRtl", "enabled", "files", "htmlAttributes", "locale", "maxFileSize", "minFileSize", "multiple", "sequentialUpload", "showFileList", "template", "formData"]
  }
}
