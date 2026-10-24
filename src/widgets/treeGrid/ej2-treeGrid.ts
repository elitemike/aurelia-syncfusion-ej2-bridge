import { TreeGrid, TreeGridModel } from '@syncfusion/ej2-treegrid';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("treeGrid")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tree-grid')
export class Ej2TreeGrid extends SyncfusionWrapper<TreeGrid, TreeGridModel> {
  protected syncfusionWidgetType = TreeGrid;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
