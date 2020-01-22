import { PLATFORM } from "aurelia-pal";

export class ConfigBuilder {
  public resources: any[] = [];
  public useGlobalResources: boolean = true;

  /**
  * Globally register all EJ wrappers including templating support
  */
  useAll(): ConfigBuilder {
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
      .ej2Grid()
      .ej2ListView()
      .ej2MaskedTextBox()
      .ej2NumericTextBox()
      .ej2Pager()
      .ej2ProgressButton()
      .ej2Radio()
      .ej2Slider()
      .ej2Switch()
      .ej2TextBox()
      .ej2TimePicker()
      .ej2TreeView()
      .ej2Uploader()
    return this;
  }

  useDefaults() {
    return this.useAll().useTheme("material");
  }

  useTheme(theme: "material" | "bootstrap" | "bootstrap4" | "fabric" | "highcontrast") {
    switch (theme) {
      case "material":
        return this.materialTheme();
      case "fabric":
        return this.fabricTheme();
      case "bootstrap":
        return this.bootstrapTheme();
      case "bootstrap4":
        return this.bootstrap4Theme();
      case "highcontrast":
        return this.highcontrastTheme();
      default:
        return this;
    }
  }

  materialTheme() {
    this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/material.css"));
    return this;
  }

  fabricTheme() {
    this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/fabric.css"));
    return this;
  }

  bootstrapTheme() {
    this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/bootstrap.css"));
    return this;
  }

  bootstrap4Theme() {
    this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/bootstrap4.css"));
    return this;
  }

  highcontrastTheme() {
    this.resources.push(PLATFORM.moduleName("@syncfusion/ej2/highcontrast.css"));
    return this;
  }

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
    this.resources.push(PLATFORM.moduleName("./widgets/button/ej2-button"));
    return this;
  }

  ej2Checkbox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/checkbox/ej2-checkbox"));
    return this;
  }

  ej2CheckboxList(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/checkbox/ej2-checkbox-list"));
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

  ej2Grid(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/grid/ej2-grid"));
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

  ej2NumericTextBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/numericTextBox/ej2-numericTextBox'));
    return this;
  }

  ej2Pager(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/pager/ej2-pager'));
    return this;
  }

  ej2ProgressButton(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/progressButton/ej2-progress-button"));
    return this;
  }

  ej2Radio(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/radio/ej2-radio"));
    return this;
  }

  ej2Slider(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/slider/ej2-slider'));
    return this;
  }

  ej2Switch(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/switch/ej2-switch'));
    return this;
  }

  ej2TextBox(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/textBox/ej2-textBox"));
    return this;
  }

  ej2TimePicker(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/timePicker/ej2-timePicker'));
    return this;
  }

  ej2TreeView(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName('./widgets/treeView/ej2-treeView'));
    return this;
  }

  ej2Uploader(): ConfigBuilder {
    this.resources.push(PLATFORM.moduleName("./widgets/uploader/ej2-uploader"));
    return this;
  }
}
