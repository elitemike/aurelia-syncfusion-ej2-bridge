import { Aurelia } from 'aurelia-framework';
import { PLATFORM } from 'aurelia-pal';
import environment from './environment';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    // Controls are not registered globally: every demo declares the ones it uses with @viewResources, so a route loads only those
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
