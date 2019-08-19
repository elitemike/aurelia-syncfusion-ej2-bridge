import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DashboardLayout, DashboardLayoutModel } from '@syncfusion/ej2-layouts';
import { generateBindables } from "../../utilities/decorator";

@generateBindables("dashboardLayout")
export class Ej2DashboardLayout extends SyncfusionWrapper<DashboardLayout, DashboardLayoutModel> {
  protected syncfusionWidgetType = DashboardLayout;
  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }


}
