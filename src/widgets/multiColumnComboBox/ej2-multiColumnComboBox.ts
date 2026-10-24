import { MultiColumnComboBox, MultiColumnComboBoxModel } from '@syncfusion/ej2-multicolumn-combobox';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("multiColumnComboBox")
@inlineView('<template><input element.ref="widgetElement" /></template>')
@customElement('ej2-multi-column-combo-box')
export class Ej2MultiColumnComboBox extends SyncfusionWrapper<MultiColumnComboBox, MultiColumnComboBoxModel> {
  protected syncfusionWidgetType = MultiColumnComboBox;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
