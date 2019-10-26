import { PagerModel, Pager } from "@syncfusion/ej2-grids";
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("pager")
export class Ej2Pager extends SyncfusionWrapper<Pager, PagerModel> {
  protected syncfusionWidgetType = Pager;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
