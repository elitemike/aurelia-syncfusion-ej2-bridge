import { FormBuilder, FormBuilderModel } from '@syncfusion/ej2-form-builder';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

let nextId = 0;

@generateBindables("formBuilder")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-form-builder')
export class Ej2FormBuilder extends SyncfusionWrapper<FormBuilder, FormBuilderModel> {
  protected syncfusionWidgetType = FormBuilder;

  protected onBeforeWidgetInstantiation() {
    // ids of the builder parts are derived from the host id
    if (!this.widgetElement.id) {
      this.widgetElement.id = `form-builder-${nextId++}`;
    }
    // The builder only raises its field events when the property itself holds a handler (`if (this.onFieldDropped)`),
    // a listener added with addEventListener (which is how the bridge forwards events) does not count.
    ['onFieldDragStarted', 'onFieldDragOver', 'onFieldDropped', 'onFieldPropertyChanged'].forEach(name => {
      if (!(<any>this._eModel)[name]) {
        (<any>this._eModel)[name] = () => undefined;
      }
    });
  }

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
