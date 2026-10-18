import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import { ConfigBuilder } from './../src/configBuider';
import environment from './environment';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    // load the plugin ../src
    // The "resources" is mapped to "../src" in aurelia.json "paths"
    .feature('resources', (configBuilder: ConfigBuilder) => configBuilder.useDefaults())
    .globalResources([
      PLATFORM.moduleName('demo-resources/demo-section'),
      PLATFORM.moduleName('demo-resources/date-iso-value-converter'),
      PLATFORM.moduleName('demo-resources/date-time-iso-value-converter')
    ]);

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
