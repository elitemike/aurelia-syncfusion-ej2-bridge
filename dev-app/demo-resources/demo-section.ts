import { bindable } from 'aurelia-framework';

/** Wrapper for one feature sample on a demo page, mirrors the section layout of the Syncfusion demo site. */
export class DemoSection {
  @bindable title: string;
  @bindable description: string;
  @bindable id: string;
}
