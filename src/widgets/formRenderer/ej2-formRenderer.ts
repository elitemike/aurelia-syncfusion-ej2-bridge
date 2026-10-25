import { FormRenderer, FormRendererModel } from '@syncfusion/ej2-form-renderer';
import { inlineView, customElement } from 'aurelia-framework';
import { constants } from '../../common/constants';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let nextId = 0;

@generateBindables("formRenderer")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-form-renderer')
export class Ej2FormRenderer extends SyncfusionWrapper<FormRenderer, FormRendererModel> {
  protected syncfusionWidgetType = FormRenderer;

  protected onBeforeWidgetInstantiation() {
    // field ids and labels are derived from the host id, without one every renderer on a page produces
    // the same `-fieldName` ids
    if (!this.widgetElement.id) {
      this.widgetElement.id = `form-renderer-${nextId++}`;
    }
    // The renderer only raises `failure`, `submit` and `buttonClick` when the property itself holds a handler
    // (`if (this.submit)`), a listener added with addEventListener (which is how the bridge forwards events) does not
    // count.
    ['failure', 'submit', 'buttonClick', 'change'].forEach(name => {
      if (!(<any>this._eModel)[name]) {
        (<any>this._eModel)[name] = () => undefined;
      }
    });
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }

  // A re-render keeps the values the user already entered (formState wins over the data model), so a new data
  // model never shows up. Drop the entered values first so the new data model is what the form shows.
  dataModelChanged(newValue: any) {
    const latest = this[`${constants.bindablePrefix}dataModel`];
    const widget: any = this.widget;
    if (!widget) {
      return;
    }
    widget.formState = { values: Object.create(null), errors: Object.create(null) };
    widget.dataModel = latest;
  }
}
