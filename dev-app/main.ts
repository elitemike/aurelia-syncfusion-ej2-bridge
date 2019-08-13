import { UploaderDemo } from './uploader/uploaderDemo';
import { ConfigBuilder } from './../src/configBuider';
import { Aurelia } from 'aurelia-framework'
import environment from './environment';

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    // load the plugin ../src
    // The "resources" is mapped to "../src" in aurelia.json "paths"
    .feature('resources', (configBuilder: ConfigBuilder) => configBuilder.useDefaults());

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot(UploaderDemo));
}
