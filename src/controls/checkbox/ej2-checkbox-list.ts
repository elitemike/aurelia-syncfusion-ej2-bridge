import { bindable } from "aurelia-framework";
import { Ej2Checkbox } from "./ej2-checkbox";
import { constants } from "common/constants";

export class Ej2CheckboxList {
  @bindable
  public dataSource: any[] = [];
  @bindable
  public selectedItems: any[] = [];
  @bindable
  public optionModel: IOptionModel = null;
  @bindable
  public orientation: "horizontal" | "vertical" = "horizontal";
  @bindable
  public matcher: (a, b) => boolean = null;

  viewModels: Ej2Checkbox[] = [];

  attached() {

  }

  checkboxClick(option: any, ej2Checkbox: Ej2Checkbox) {
    console.log("matcher", this.matcher)
    if (ej2Checkbox[`${constants.bindablePrefix}checked`]) {
      if ((this.matcher && this.selectedItems.find((x) => { return this.matcher(x, option) })) || !this.selectedItems.includes(option)) {
        this.selectedItems.push(option);
      }
    }
    else {
      let index = this.matcher ? this.selectedItems.findIndex((x) => { return this.matcher(x, option) }) : this.selectedItems.indexOf(option);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      } else {
      }
    }
  }
}

export interface IOptionModel {
  name: string;
  value: string;
  label: string;
}
