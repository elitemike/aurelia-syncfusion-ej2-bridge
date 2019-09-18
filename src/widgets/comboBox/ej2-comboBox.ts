import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { ComboBox, ComboBoxModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "utilities/decorator";

@generateBindables("comboBox")
export class Ej2ComboBox extends SyncfusionWrapper<ComboBox, ComboBoxModel> {
  protected syncfusionWidgetType = ComboBox;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
