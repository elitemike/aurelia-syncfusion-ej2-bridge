import { Button, ButtonModel } from '@syncfusion/ej2-buttons';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';


@generateBindables("button")
@inlineView('<template><button element.ref="widgetElement"><slot></slot></button></template>')
@customElement('ej2-button')
export class Ej2Button extends SyncfusionWrapper<Button, ButtonModel> {
  clickEvent: Event = null;
  _onClick: (event: Event)=> void = null;

  protected onWidgetCreated() {
    let _this = this;
    this._onClick = (event: Event) => {
      _this.element.dispatchEvent(_this.clickEvent);
      event.stopPropagation();
    }

    this.widget.element.addEventListener("click", this._onClick, false);
  }

  protected onWrapperCreated() {
    this.clickEvent = new CustomEvent("on-click", {
      bubbles: true
    });
  }


  protected syncfusionWidgetType = Button  

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

  public detached() {
    this.widget.element.removeEventListener("click", this._onClick, false);
  }
}
