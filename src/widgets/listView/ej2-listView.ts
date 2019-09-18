import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { ListView, ListViewModel, Virtualization } from "@syncfusion/ej2-lists";
import { generateBindables } from "utilities/decorator";

@generateBindables("listView")
export class Ej2ListView extends SyncfusionWrapper<ListView, ListViewModel> {

  protected syncfusionWidgetType = ListView;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }

  onBeforeWidgetInstantiation() {
    if (this.eModel.enableVirtualization) {
      ListView.Inject(Virtualization);
    }
  }
}