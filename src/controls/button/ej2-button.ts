import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { bindable, autoinject } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';
import { DOM } from 'aurelia-pal';


@generateBindables("button")
export class Ej2Button extends SyncfusionWrapper<Button, ButtonModel> {
  clickEvent: Event = null;

  protected onWidgetCreated() {
  }
  protected onWrapperCreated() {
    this.clickEvent = new CustomEvent("on-click", {
      bubbles: true
    });
  }


  protected syncfusionWidgetType = Button


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
}
