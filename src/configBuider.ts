import { Ej2MaskedTextBox } from './widgets/maskedTextBox/ej2-maskedTextBox';
import { PLATFORM } from "aurelia-pal";
import { Ej2Button } from "./widgets/button/ej2-button";
import { Ej2Checkbox } from "./widgets/checkbox/ej2-checkbox";
import { Ej2Radio } from "./widgets/radio/ej2-radio";
import { Ej2ProgressButton } from "./widgets/progressButton/ej2-progress-button";
import { Ej2Grid } from "./widgets/grid/ej2-grid";
import { Ej2Uploader } from "./widgets/uploader/ej2-uploader";
import { Ej2CheckboxList } from "./widgets/checkbox/ej2-checkbox-list";
import { Ej2TextBox } from "widgets/textBox/ej2-textBox";
import { Ej2DashboardLayout } from 'widgets/dashboardLayout/ej2-dashboardLayout';
import { Ej2DatePicker } from 'widgets/datePicker/ej2-DatePicker';
import { Ej2DateRangePicker } from 'widgets/dateRangePicker/ej2-dateRangePicker';
import { Ej2DateTimePicker } from 'widgets/dateTimePicker/ej2-dateTimePicker';

export class ConfigBuilder {
  public resources: any[] = [];
  public useGlobalResources: boolean = true;

  /**
  * Globally register all EJ wrappers including templating support
  */
  useAll(): ConfigBuilder {
    this
      .ej2Button()
      .ej2Checkbox()
      .ej2CheckboxList()
      .ej2DatePicker()
      .ej2DateRangePicker()
      .ej2DateTimePicker()
      .ej2DashboardLayout()
      .ej2Grid()
      .ej2ProgressButton()
      .ej2MaskedTextBox()
      .ej2Radio()
      .ej2TextBox()
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

  ej2Grid(): ConfigBuilder {
    this.resources.push(Ej2Grid);
    return this;
  }

  ej2ProgressButton(): ConfigBuilder {
    this.resources.push(Ej2ProgressButton);
    return this;
  }
  ej2MaskedTextBox(): ConfigBuilder {
    this.resources.push(Ej2MaskedTextBox);
    return this;
  }

  ej2Radio(): ConfigBuilder {
    this.resources.push(Ej2Radio);
    return this;
  }

  ej2TextBox(): ConfigBuilder {
    this.resources.push(Ej2TextBox);
    return this;
  }

  ej2Uploader(): ConfigBuilder {
    this.resources.push(Ej2Uploader);
    return this;
  }
}
