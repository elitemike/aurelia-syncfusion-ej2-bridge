import { DateTimePickerDemo } from './dateTimePicker/dateTimePickerDemo';
import { MaskedTextBoxDemo } from './maskedTextBox/maskedTextBoxDemo';
import { UploaderDemo } from './uploader/uploaderDemo';
import { ConfigBuilder } from './../src/configBuider';
import { Aurelia } from 'aurelia-framework'
import environment from './environment';
import { CheckboxDemo } from './checkbox/checkboxDemo';
import { TextBoxDemo } from './textBox/textBoxDemo';
import { DashboardLayoutDemo } from './dashboardLayout/dashboardLayoutDemo';
import { DatePickerDemo } from './datePicker/datePickerDemo';
import { DateRangePickerDemo } from './dateRangePicker/dateRangePickerDemo';
import { AccordionDemo } from './accordion/accordionDemo';
import { DropDownListDemo } from './dropDownList/dropDownListDemo';
import { NumericTextBoxDemo } from './numericTextBox/numericTextBoxDemo';


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

  aurelia.start().then(() => aurelia.setRoot());
}
