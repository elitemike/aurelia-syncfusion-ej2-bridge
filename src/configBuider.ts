import { PLATFORM } from "aurelia-pal";

export class ConfigBuilder {
  /** Module ids relative to this package, resolved lazily by the loader (nothing here imports a widget). */
  public resources: string[] = [];
  public useGlobalResources: boolean = true;

  /**
  * Globally register all EJ wrappers including templating support
  */
  public useAll(): ConfigBuilder {
    this
      .ej2Accordion()
      .ej2AutoComplete()
      .ej2Button()
      .ej2Checkbox()
      .ej2CheckboxList()
      .ej2ComboBox()
      .ej2DatePicker()
      .ej2DateRangePicker()
      .ej2DateTimePicker()
      .ej2DashboardLayout()
      .ej2DropDownList()
      .ej2DropDownTree()
      .ej2FileManager()
      .ej2Grid()
      .ej2ListView()
      .ej2MaskedTextBox()
      .ej2MultiSelect()
      .ej2NumericTextBox()
      .ej2Pager()
      .ej2ProgressButton()
      .ej2Radio()
      .ej2RichTextEditor()
      .ej2Schedule()
      .ej2Sidebar()
      .ej2Slider()
      .ej2Splitter()
      .ej2Switch()
      .ej2TextBox()
      .ej2Timeline()
      .ej2TimePicker()
      .ej2TreeView()
      .ej2Uploader()
      .ej2BarcodeGenerator()
      .ej2QRCodeGenerator()
      .ej2DataMatrixGenerator()
      .ej2PDF417Generator()
      .ej2BlockEditor()
      .ej2ChipList()
      .ej2Fab()
      .ej2SpeedDial()
      .ej2SmartPasteButton()
      .ej2Calendar()
      .ej2Chart()
      .ej2AccumulationChart()
      .ej2StockChart()
      .ej2RangeNavigator()
      .ej2BulletChart()
      .ej2Smithchart()
      .ej2Sparkline()
      .ej2Chart3D()
      .ej2CircularChart3D()
      .ej2Sankey()
      .ej2CircularGauge()
      .ej2Diagram()
      .ej2SymbolPalette()
      .ej2Ruler()
      .ej2Overview()
      .ej2DocumentEditor()
      .ej2DocumentEditorContainer()
      .ej2ListBox()
      .ej2Mention()
      .ej2FormBuilder()
      .ej2FormRenderer()
      .ej2Gantt()
      .ej2HeatMap()
      .ej2ImageEditor()
      .ej2InPlaceEditor()
      .ej2ColorPicker()
      .ej2TextArea()
      .ej2SmartTextArea()
      .ej2Signature()
      .ej2Rating()
      .ej2OtpInput()
      .ej2SpeechToText()
      .ej2AIAssistView()
      .ej2ChatUI()
      .ej2InlineAIAssist()
      .ej2Kanban()
      .ej2LinearGauge()
      .ej2Maps()
      .ej2MultiColumnComboBox()
      .ej2Toolbar()
      .ej2ContextMenu()
      .ej2Menu()
      .ej2Tab()
      .ej2Breadcrumb()
      .ej2Carousel()
      .ej2AppBar()
      .ej2Stepper()
      .ej2Toast()
      .ej2Message()
      .ej2Skeleton()
      .ej2PdfViewer()
      .ej2PdfComparer()
      .ej2PivotView()
      .ej2PivotFieldList()
      .ej2Popup()
      .ej2Dialog()
      .ej2Tooltip()
      .ej2ProgressBar()
      .ej2QueryBuilder()
      .ej2Ribbon()
      .ej2RichTextEditorUI()
      .ej2RecurrenceEditor()
      .ej2DropDownButton()
      .ej2SplitButton()
      .ej2Spreadsheet()
      .ej2TreeGrid()
      .ej2TreeMap();
    return this;
  }

  public useDefaults() {
    return this.useAll().useTheme("material");
  }

  public useTheme(theme: "material" | "bootstrap" | "bootstrap4" | "fabric" | "highcontrast") {
    switch (theme) {
      case "material":
        return this.materialTheme();
      // case "fabric":
      //   return this.fabricTheme();
      // case "bootstrap":
      //   return this.bootstrapTheme();
      // case "bootstrap4":
      //   return this.bootstrap4Theme();
      // case "highcontrast":
      //   return this.highcontrastTheme();
      default:
        return this;
    }
  }

  materialTheme() {
    // this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/material.css"));
    return this;
  }

  // fabricTheme() {
  //   this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/fabric.css"));
  //   return this;
  // }

  // bootstrapTheme() {
  //   this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/bootstrap.css"));
  //   return this;
  // }

  // bootstrap4Theme() {
  //   this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/bootstrap4.css"));
  //   return this;
  // }

  // highcontrastTheme() {
  //   this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/highcontrast.css"));
  //   return this;
  // }

  withoutGlobalResources(): ConfigBuilder {
    this.useGlobalResources = false;
    return this;
  }

  ej2Accordion(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/accordion/ej2-accordion'));
    return this;
  }

  ej2AutoComplete(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/autoComplete/ej2-autoComplete'));
    return this;
  }

  ej2Button(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/button/ej2-button'));
    return this;
  }

  ej2Checkbox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/checkbox/ej2-checkbox'));
    return this;
  }

  ej2CheckboxList(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/checkbox/ej2-checkbox-list'));
    return this;
  }

  ej2ComboBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/comboBox/ej2-comboBox'));
    return this;
  }

  ej2DashboardLayout(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dashboardLayout/ej2-dashboardLayout'));
    return this;
  }

  ej2DatePicker(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/datePicker/ej2-DatePicker'));
    return this;
  }

  ej2DateRangePicker(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dateRangePicker/ej2-dateRangePicker'));
    return this;
  }

  ej2DateTimePicker(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dateTimePicker/ej2-dateTimePicker'));
    return this;
  }

  ej2DropDownList(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dropDownList/ej2-dropDownList'));
    return this;
  }

  ej2DropDownTree(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dropDownTree/ej2-dropDownTree'));
    return this;
  }

  ej2FileManager(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/fileManager/ej2-fileManager'));
    return this;
  }

  ej2Grid(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/grid/ej2-grid'));
    return this;
  }

  ej2ListView(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/listView/ej2-listView'));
    return this;
  }

  ej2MaskedTextBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/maskedTextBox/ej2-maskedTextBox'));
    return this;
  }

  ej2MultiSelect(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/multiSelect/ej2-multiSelect'));
    return this;
  }

  ej2NumericTextBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/numericTextBox/ej2-numericTextBox'));
    return this;
  }

  ej2Pager(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pager/ej2-pager'));
    return this;
  }

  ej2ProgressButton(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/progressButton/ej2-progress-button'));
    return this;
  }

  ej2Radio(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/radio/ej2-radio'));
    return this;
  }

  ej2Schedule(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/schedule/ej2-schedule'));
    return this;
  }

  ej2Sidebar(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/sidebar/ej2-sidebar'));
    return this;
  }

  ej2Slider(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/slider/ej2-slider'));
    return this;
  }

  ej2Splitter(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/splitter/ej2-splitter'));
    return this;
  }

  ej2Switch(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/switch/ej2-switch'));
    return this;
  }

  ej2TextBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/textBox/ej2-textBox'));
    return this;
  }

  ej2TimePicker(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/timePicker/ej2-timePicker'));
    return this;
  }

  ej2Timeline(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/timeline/ej2-timeline'));
    return this;
  }


  ej2TreeView(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/treeView/ej2-treeView'));
    return this;
  }

  ej2Uploader(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/uploader/ej2-uploader'));
    return this;
  }

  ej2RichTextEditor(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/richTextEditor/ej2-richTextEditor'));
    return this;
  }

  ej2BarcodeGenerator(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/barcodeGenerator/ej2-barcodeGenerator'));
    return this;
  }

  ej2QRCodeGenerator(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/qrCodeGenerator/ej2-qrCodeGenerator'));
    return this;
  }

  ej2DataMatrixGenerator(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dataMatrixGenerator/ej2-dataMatrixGenerator'));
    return this;
  }

  ej2PDF417Generator(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pdf417Generator/ej2-pdf417Generator'));
    return this;
  }

  ej2BlockEditor(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/blockEditor/ej2-blockEditor'));
    return this;
  }

  ej2ChipList(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/chipList/ej2-chipList'));
    return this;
  }

  ej2Fab(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/fab/ej2-fab'));
    return this;
  }

  ej2SpeedDial(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/speedDial/ej2-speedDial'));
    return this;
  }

  ej2SmartPasteButton(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/smartPasteButton/ej2-smartPasteButton'));
    return this;
  }

  ej2Calendar(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/calendar/ej2-calendar'));
    return this;
  }

  ej2Chart(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/chart/ej2-chart'));
    return this;
  }

  ej2AccumulationChart(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/accumulationChart/ej2-accumulationChart'));
    return this;
  }

  ej2StockChart(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/stockChart/ej2-stockChart'));
    return this;
  }

  ej2RangeNavigator(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/rangeNavigator/ej2-rangeNavigator'));
    return this;
  }

  ej2BulletChart(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/bulletChart/ej2-bulletChart'));
    return this;
  }

  ej2Smithchart(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/smithchart/ej2-smithchart'));
    return this;
  }

  ej2Sparkline(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/sparkline/ej2-sparkline'));
    return this;
  }

  ej2Chart3D(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/chart3D/ej2-chart3D'));
    return this;
  }

  ej2CircularChart3D(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/circularChart3D/ej2-circularChart3D'));
    return this;
  }

  ej2Sankey(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/sankey/ej2-sankey'));
    return this;
  }

  ej2CircularGauge(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/circularGauge/ej2-circularGauge'));
    return this;
  }

  ej2Diagram(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/diagram/ej2-diagram'));
    return this;
  }

  ej2SymbolPalette(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/symbolPalette/ej2-symbolPalette'));
    return this;
  }

  ej2Ruler(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/ruler/ej2-ruler'));
    return this;
  }

  ej2Overview(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/overview/ej2-overview'));
    return this;
  }

  ej2DocumentEditor(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/documentEditor/ej2-documentEditor'));
    return this;
  }

  ej2DocumentEditorContainer(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/documentEditorContainer/ej2-documentEditorContainer'));
    return this;
  }

  ej2ListBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/listBox/ej2-listBox'));
    return this;
  }

  ej2Mention(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/mention/ej2-mention'));
    return this;
  }

  ej2FormBuilder(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/formBuilder/ej2-formBuilder'));
    return this;
  }

  ej2FormRenderer(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/formRenderer/ej2-formRenderer'));
    return this;
  }

  ej2Gantt(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/gantt/ej2-gantt'));
    return this;
  }

  ej2HeatMap(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/heatMap/ej2-heatMap'));
    return this;
  }

  ej2ImageEditor(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/imageEditor/ej2-imageEditor'));
    return this;
  }

  ej2InPlaceEditor(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/inPlaceEditor/ej2-inPlaceEditor'));
    return this;
  }

  ej2ColorPicker(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/colorPicker/ej2-colorPicker'));
    return this;
  }

  ej2TextArea(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/textArea/ej2-textArea'));
    return this;
  }

  ej2SmartTextArea(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/smartTextArea/ej2-smartTextArea'));
    return this;
  }

  ej2Signature(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/signature/ej2-signature'));
    return this;
  }

  ej2Rating(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/rating/ej2-rating'));
    return this;
  }

  ej2OtpInput(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/otpInput/ej2-otpInput'));
    return this;
  }

  ej2SpeechToText(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/speechToText/ej2-speechToText'));
    return this;
  }

  ej2AIAssistView(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/aiAssistView/ej2-aiAssistView'));
    return this;
  }

  ej2ChatUI(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/chatUI/ej2-chatUI'));
    return this;
  }

  ej2InlineAIAssist(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/inlineAIAssist/ej2-inlineAIAssist'));
    return this;
  }

  ej2Kanban(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/kanban/ej2-kanban'));
    return this;
  }

  ej2LinearGauge(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/linearGauge/ej2-linearGauge'));
    return this;
  }

  ej2Maps(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/maps/ej2-maps'));
    return this;
  }

  ej2MultiColumnComboBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/multiColumnComboBox/ej2-multiColumnComboBox'));
    return this;
  }

  ej2Toolbar(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/toolbar/ej2-toolbar'));
    return this;
  }

  ej2ContextMenu(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/contextMenu/ej2-contextMenu'));
    return this;
  }

  ej2Menu(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/menu/ej2-menu'));
    return this;
  }

  ej2Tab(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/tab/ej2-tab'));
    return this;
  }

  ej2Breadcrumb(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/breadcrumb/ej2-breadcrumb'));
    return this;
  }

  ej2Carousel(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/carousel/ej2-carousel'));
    return this;
  }

  ej2AppBar(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/appBar/ej2-appBar'));
    return this;
  }

  ej2Stepper(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/stepper/ej2-stepper'));
    return this;
  }

  ej2Toast(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/toast/ej2-toast'));
    return this;
  }

  ej2Message(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/message/ej2-message'));
    return this;
  }

  ej2Skeleton(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/skeleton/ej2-skeleton'));
    return this;
  }

  ej2PdfViewer(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pdfViewer/ej2-pdfViewer'));
    return this;
  }

  ej2PdfComparer(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pdfComparer/ej2-pdfComparer'));
    return this;
  }

  ej2PivotView(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pivotView/ej2-pivotView'));
    return this;
  }

  ej2PivotFieldList(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pivotFieldList/ej2-pivotFieldList'));
    return this;
  }

  ej2Popup(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/popup/ej2-popup'));
    return this;
  }

  ej2Dialog(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dialog/ej2-dialog'));
    return this;
  }

  ej2Tooltip(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/tooltip/ej2-tooltip'));
    return this;
  }

  ej2ProgressBar(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/progressBar/ej2-progressBar'));
    return this;
  }

  ej2QueryBuilder(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/queryBuilder/ej2-queryBuilder'));
    return this;
  }

  ej2Ribbon(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/ribbon/ej2-ribbon'));
    return this;
  }

  ej2RichTextEditorUI(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/richTextEditorUI/ej2-richTextEditorUI'));
    return this;
  }

  ej2RecurrenceEditor(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/recurrenceEditor/ej2-recurrenceEditor'));
    return this;
  }

  ej2DropDownButton(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/dropDownButton/ej2-dropDownButton'));
    return this;
  }

  ej2SplitButton(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/splitButton/ej2-splitButton'));
    return this;
  }

  ej2Spreadsheet(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/spreadsheet/ej2-spreadsheet'));
    return this;
  }

  ej2TreeGrid(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/treeGrid/ej2-treeGrid'));
    return this;
  }

  ej2TreeMap(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/treeMap/ej2-treeMap'));
    return this;
  }
}
