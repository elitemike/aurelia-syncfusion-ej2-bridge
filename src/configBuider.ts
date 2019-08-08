import { PLATFORM } from "aurelia-pal";
import { Ej2Button } from "elements/button/ej2-button";
import { Ej2Checkbox } from "elements/checkbox/ej2-checkbox";

import { Ej2Radio } from "elements/radio/ej2-radio";
import { Ej2ProgressButton } from "elements/progressButton/ej2-progress-button";

export class ConfigBuilder {
  public resources: any[] = [];
  public useGlobalResources: boolean = true;

  /**
  * Globally register all EJ wrappers including templating support
  */
  useAll(): ConfigBuilder {
    this.ej2Button()
      .ej2Checkbox()
      .ej2ProgressButton()
      .ej2Radio()
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

  ej2ProgressButton(): ConfigBuilder {
    this.resources.push(Ej2ProgressButton);
    return this;
  }

  ej2Radio(): ConfigBuilder {
    this.resources.push(Ej2Radio);
    return this;
  }
}
