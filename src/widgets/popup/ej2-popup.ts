import { Popup, PopupModel } from '@syncfusion/ej2-popups';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("popup")
@inlineView('<template><div element.ref="widgetElement"><slot></slot></div></template>')
@customElement('ej2-popup')
export class Ej2Popup extends SyncfusionWrapper<Popup, PopupModel> {
  protected syncfusionWidgetType = Popup;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }

  // Unlike the other controls the Popup constructor takes (element, options) and renders immediately. It also resolves
  // `relateTo` while rendering, so it has to be created once the host is in the DOM (attached), not at bind time.
  onCreateControl() {
  }

  attached() {
    this.createPopup();
    this.onAttached();
  }

  private createPopup() {
    this.onBeforeWidgetInstantiation();
    this.widget = new Popup(this.widgetElement, this._eModel);
    this.onWrapperCreated();
    this.createControlEvents(this.getBindables());
    this.onWidgetCreated();
  }

  public recreate() {
    this.onRecreate();
    this.widget.destroy();
    this.widget = null;
    this.recreating();
    this.setInitialBindings();
    this.createPopup();
    this.recreated();
  }

  protected appendWidget() {
    // already rendered on the host element by the constructor
  }
}
