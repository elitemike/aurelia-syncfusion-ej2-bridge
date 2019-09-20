import { constants } from '../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { ComboBox, ComboBoxModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("comboBox")
export class Ej2ComboBox extends SyncfusionWrapper<ComboBox, ComboBoxModel> {
  protected syncfusionWidgetType = ComboBox;

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
