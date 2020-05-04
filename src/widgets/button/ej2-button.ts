import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';


@generateBindables("button")
@inlineView('<template><button element.ref="widgetElement" click.delegate="_onClick($event)"><slot></slot></button></template>')
@customElement('ej2-button')
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
