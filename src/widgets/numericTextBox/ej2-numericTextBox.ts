import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { NumericTextBox, NumericTextBoxModel } from "@syncfusion/ej2-inputs";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("numericTextBox")
export class Ej2NumericTextBox extends SyncfusionWrapper<NumericTextBox, NumericTextBoxModel> {
  protected syncfusionWidgetType = NumericTextBox;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onChange(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }
}
