import { PivotFieldList, PivotFieldListModel } from '@syncfusion/ej2-pivotview';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("pivotFieldList")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-pivot-field-list')
export class Ej2PivotFieldList extends SyncfusionWrapper<PivotFieldList, PivotFieldListModel> {
  protected syncfusionWidgetType = PivotFieldList;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
