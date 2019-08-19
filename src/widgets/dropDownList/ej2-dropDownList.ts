import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DropDownList, DropDownListModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("dropDownList")
export class Ej2DropDownList extends SyncfusionWrapper<DropDownList, DropDownListModel> {
  protected syncfusionWidgetType = DropDownList;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
