import { bindable } from "aurelia-framework";
import { ProgressButton, ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { SyncfusionWrapper } from 'common/syncfusionWrapper';
import { generateBindables } from "utilities/decorator";

@generateBindables("progressButton")
export class Ej2ProgressButton extends SyncfusionWrapper<ProgressButton, ProgressButtonModel> {
  @bindable
  private onClick: Function = null;

  protected syncfusionWidgetType = ProgressButton;

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

  public progressComplete() {
    this.widget.progressComplete();
  }

  public start() {
    this.widget.start();
  }

  public stop() {
    this.widget.stop();
  }
}
