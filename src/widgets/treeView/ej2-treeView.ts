import { SyncfusionWrapper } from 'common/syncfusionWrapper';
import { TreeView, TreeViewModel } from '@syncfusion/ej2-navigations';
import { generateBindables } from 'utilities/decorator';

@generateBindables("treeView")
export class Ej2TreeView extends SyncfusionWrapper<TreeView, TreeViewModel> {
  protected syncfusionWidgetType = TreeView;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
