import { constants } from './../../common/constants';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DropDownList, DropDownListModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";

@generateBindables("dropDownList")
export class Ej2DropDownList extends SyncfusionWrapper<DropDownList, DropDownListModel> {
  protected syncfusionWidgetType = DropDownList;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
    let _this = this;
    this.widget.addEventListener("change", (args) => { _this.onChange(args) });
  }

  onChange(args) {
    this[`${constants.bindablePrefix}value`] = args.value;
  }

  attached() {
    this.widgetElement = this.element.querySelector("select,ul,input") as HTMLElement;

    super.attached();
  }
}
