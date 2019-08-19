import { generateBindables } from '../../utilities/decorator';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DashboardLayout, DashboardLayoutModel } from '@syncfusion/ej2-layouts';


@generateBindables("dashboardLayout")
export class Ej2DashboardLayout extends SyncfusionWrapper<DashboardLayout, DashboardLayoutModel> {
  protected syncfusionWidgetType = DashboardLayout;
  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }


}
