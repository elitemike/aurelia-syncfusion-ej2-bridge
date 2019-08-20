import { SyncfusionWrapper } from "common/syncfusionWrapper";
import { NumericTextBox, NumericTextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "utilities/decorator";

@generateBindables("numericTextBox")
export class Ej2NumericTextBox extends SyncfusionWrapper<NumericTextBox, NumericTextBoxModel> {
  protected syncfusionWidgetType = NumericTextBox;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }
}
