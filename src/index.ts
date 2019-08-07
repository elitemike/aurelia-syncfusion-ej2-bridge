import { ConfigBuilder } from './configBuider';

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
