import { bindable, customElement, inlineView, PLATFORM } from "aurelia-framework";
import { Ej2Checkbox } from "./ej2-checkbox";
import { constants } from "../../common/constants";

@customElement("ej2-checkbox-list")
@inlineView(`<template>
  <div repeat.for="option of dataSource" css="\${orientation === 'horizontal' ? 'display: inline;' : ''}">
    <ej2-checkbox view-model.ref="viewModels[$index]" e-label.bind="optionModel? option[optionModel.label]: option"
      e-name.bind="optionModel? option[optionModel.name]: option"
      click.delegate="checkboxClick(option, viewModels[$index])"
      e-checked.bind="selectedItems.length >0 && matcher? isMatch(option) : selectedItems.indexOf(option) !== -1">
    </ej2-checkbox>
  </div>
</template>`)
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
    //console.log("matcher", this.matcher)
    if (ej2Checkbox[`${constants.bindablePrefix}checked`]) {
      if ((this.matcher && this.selectedItems.find((x) => this.matcher(x, option))) || !this.selectedItems.includes(option)) {
        this.selectedItems.push(option);
      }
    }
    else {
      let index = this.matcher ? this.selectedItems.findIndex((x) => this.matcher(x, option)) : this.selectedItems.indexOf(option);
      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      } else {
      }
    }
  }

  isMatch(option) {
    return this.selectedItems.findIndex((x) => this.matcher(x, option)) !== -1;
  }
}

export interface IOptionModel {
  name: string;
  value: string;
  label: string;
}
