import { ListBox, ListBoxModel } from '@syncfusion/ej2-dropdowns';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("listBox")
@inlineView('<template><select element.ref="widgetElement"></select></template>')
@customElement('ej2-list-box')
export class Ej2ListBox extends SyncfusionWrapper<ListBox, ListBoxModel> {
  protected syncfusionWidgetType = ListBox;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
