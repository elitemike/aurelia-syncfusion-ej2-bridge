
import { ConfigBuilder } from './configBuider';
export { ConfigBuilder } from './configBuider';

// export { Ej2Checkbox } from "./controls/checkbox/ej2-checkbox";
// export { Ej2CheckboxList } from './controls/checkbox/ej2-checkbox-list';
// export { Ej2Button } from './controls/button/ej2-button';
// export { Ej2Grid } from './controls/grid/ej2-grid';
// export { Ej2ProgressButton } from "./controls/progressButton/ej2-progress-button";
// export { Ej2Radio } from "./controls/radio/ej2-radio";
// export { Ej2Uploader } from "./controls/uploader/ej2-uploader";
export { IEj2Uplaoder as Ej2Uploader } from "./interfaces/IEj2Uploader";
export { IEJ2WidgetBridge } from "./interfaces/IEJ2WidgetBridge";
export { Ej2UploaderDataAdapter } from "./widgets/uploader/ej2-uploader";

export function configure(aurelia, configCallback?: (builder: ConfigBuilder) => void) {
  let builder = new ConfigBuilder();

  if (configCallback !== undefined && typeof (configCallback) === 'function') {
    configCallback(builder);
  }

  // Pull the data off the builder
  let resources = builder.resources;

  if (builder.useGlobalResources) {
    aurelia.globalResources(resources);
  }
}
