import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { AutoComplete, AutoCompleteModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("autoComplete")
export class Ej2AutoComplete extends SyncfusionWrapper<AutoComplete, AutoCompleteModel> {
  protected syncfusionWidgetType = AutoComplete;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }


}
