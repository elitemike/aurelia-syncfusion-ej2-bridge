import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { bindable } from 'aurelia-framework';
import { generateBindables } from 'utilities/decorator';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';


@generateBindables("button")
export class Ej2Button extends SyncfusionWrapper<Button, ButtonModel> {
  protected syncfusionControlType = Button
  @bindable
  private onClick: Function = null;

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }
}
