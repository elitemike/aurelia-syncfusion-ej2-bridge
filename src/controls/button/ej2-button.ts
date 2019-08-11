import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { bindable } from 'aurelia-framework';
import { generateBindables } from 'utilities/decorator';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';


@generateBindables("button")
export class Ej2Button extends SyncfusionWrapper<Button, ButtonModel> {
  protected onCreated() {
  }
  protected syncfusionWidgetType = Button
  @bindable
  private onClick: Function = null;

  _onClick() {
    if (this.onClick) {
      this.onClick();
    }
  }

  public refresh() {
    this.widget.refresh();
  }

  public focusIn() {
    this.widget.focusIn();
  }

  public click() {
    this.widget.click();
  }

  public dataBind() {
    this.widget.dataBind();
  }
}
