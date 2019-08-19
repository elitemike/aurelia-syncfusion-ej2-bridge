import { bindable } from "aurelia-framework";
import { ProgressButton, ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { generateBindables } from "../../utilities/decorator";

@generateBindables("progressButton")
export class Ej2ProgressButton extends SyncfusionWrapper<ProgressButton, ProgressButtonModel> {
  clickEvent: Event = null;

  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {
    this.clickEvent = new CustomEvent("on-click", {
      bubbles: true
    });
  }

  protected syncfusionWidgetType = ProgressButton;

  _onClick(event: Event) {
    this.element.dispatchEvent(this.clickEvent);
    event.stopPropagation();
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
