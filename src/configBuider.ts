import { Ej2ComboBox } from './widgets/comboBox/ej2-comboBox';
import { Ej2TreeView } from './widgets/treeView/ej2-treeView';
import { Ej2Switch } from './widgets/switch/ej2-switch';
import { Ej2Slider } from './widgets/slider/ej2-slider';
import { Ej2MaskedTextBox } from './widgets/maskedTextBox/ej2-maskedTextBox';
import { PLATFORM } from "aurelia-pal";
import { Ej2Button } from "./widgets/button/ej2-button";
import { Ej2Checkbox } from "./widgets/checkbox/ej2-checkbox";
import { Ej2Radio } from "./widgets/radio/ej2-radio";
import { Ej2ProgressButton } from "./widgets/progressButton/ej2-progress-button";
import { Ej2Grid } from "./widgets/grid/ej2-grid";
import { Ej2Uploader } from "./widgets/uploader/ej2-uploader";
import { Ej2CheckboxList } from "./widgets/checkbox/ej2-checkbox-list";
import { Ej2TextBox } from "./widgets/textBox/ej2-textBox";
import { Ej2DashboardLayout } from './widgets/dashboardLayout/ej2-dashboardLayout';
import { Ej2DatePicker } from './widgets/datePicker/ej2-DatePicker';
import { Ej2DateRangePicker } from './widgets/dateRangePicker/ej2-dateRangePicker';
import { Ej2DateTimePicker } from './widgets/dateTimePicker/ej2-dateTimePicker';
import { Ej2Accordion } from './widgets/accordion/ej2-accordion';
import { Ej2DropDownList } from './widgets/dropDownList/ej2-dropDownList';
import { Ej2NumericTextBox } from './widgets/numericTextBox/ej2-numericTextBox';
import { Ej2TimePicker } from './widgets/timePicker/ej2-timePicker';
import { Ej2AutoComplete } from './widgets/autoComplete/ej2-autoComplete';
import { Ej2ListView } from './widgets/listView/ej2-listView';

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
    this.resources.push(Ej2Accordion);
    return this;
  }

  ej2AutoComplete(): ConfigBuilder {
    this.resources.push(Ej2AutoComplete);
    return this;
  }

  ej2Button(): ConfigBuilder {
    this.resources.push(Ej2Button);
    return this;
  }

  ej2Checkbox(): ConfigBuilder {
    this.resources.push(Ej2Checkbox);
    return this;
  }

  ej2CheckboxList(): ConfigBuilder {
    this.resources.push(Ej2CheckboxList);
    return this;
  }

  ej2ComboBox(): ConfigBuilder {
    this.resources.push(Ej2ComboBox);
    return this;
  }

  ej2DashboardLayout(): ConfigBuilder {
    this.resources.push(Ej2DashboardLayout);
    return this;
  }

  ej2DatePicker(): ConfigBuilder {
    this.resources.push(Ej2DatePicker);
    return this;
  }

  ej2DateRangePicker(): ConfigBuilder {
    this.resources.push(Ej2DateRangePicker);
    return this;
  }

  ej2DateTimePicker(): ConfigBuilder {
    this.resources.push(Ej2DateTimePicker);
    return this;
  }

  ej2DropDownList(): ConfigBuilder {
    this.resources.push(Ej2DropDownList);
    return this;
  }

  ej2Grid(): ConfigBuilder {
    this.resources.push(Ej2Grid);
    return this;
  }

  ej2ListView(): ConfigBuilder {
    this.resources.push(Ej2ListView);
    return this;
  }

  ej2MaskedTextBox(): ConfigBuilder {
    this.resources.push(Ej2MaskedTextBox);
    return this;
  }

  ej2NumericTextBox(): ConfigBuilder {
    this.resources.push(Ej2NumericTextBox);
    return this;
  }

  ej2ProgressButton(): ConfigBuilder {
    this.resources.push(Ej2ProgressButton);
    return this;
  }

  ej2Radio(): ConfigBuilder {
    this.resources.push(Ej2Radio);
    return this;
  }

  ej2Slider(): ConfigBuilder {
    this.resources.push(Ej2Slider);
    return this;
  }

  ej2Switch(): ConfigBuilder {
    this.resources.push(Ej2Switch);
    return this;
  }

  ej2TextBox(): ConfigBuilder {
    this.resources.push(Ej2TextBox);
    return this;
  }

  ej2TimePicker(): ConfigBuilder {
    this.resources.push(Ej2TimePicker);
    return this;
  }

  ej2TreeView(): ConfigBuilder {
    this.resources.push(Ej2TreeView);
    return this;
  }

  ej2Uploader(): ConfigBuilder {
    this.resources.push(Ej2Uploader);
    return this;
  }
}
