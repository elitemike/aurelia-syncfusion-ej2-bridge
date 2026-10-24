import { TreeMap, TreeMapModel } from '@syncfusion/ej2-treemap';
import { inlineView, customElement } from 'aurelia-framework';
import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from '../../common/syncfusionWrapper';

@generateBindables("treeMap")
@inlineView('<template><div element.ref="widgetElement"></div></template>')
@customElement('ej2-tree-map')
export class Ej2TreeMap extends SyncfusionWrapper<TreeMap, TreeMapModel> {
  protected syncfusionWidgetType = TreeMap;

  protected onWrapperCreated() {
  }

  protected onWidgetCreated() {
  }
}
