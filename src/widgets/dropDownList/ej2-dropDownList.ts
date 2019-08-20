import { DOM } from 'aurelia-pal';
import { SyncfusionWrapper } from "../../common/syncfusionWrapper";
import { DropDownList, DropDownListModel } from "@syncfusion/ej2-dropdowns";
import { generateBindables } from "../../utilities/decorator";
import { basename } from 'path';


@generateBindables("dropDownList")
export class Ej2DropDownList extends SyncfusionWrapper<DropDownList, DropDownListModel> {
  protected syncfusionWidgetType = DropDownList;

  protected onWrapperCreated() {
  }
  protected onWidgetCreated() {
  }

  attached() {
    this.widgetElement = this.element.querySelector("select,ul,input") as HTMLElement;

    super.attached();
  }
}
