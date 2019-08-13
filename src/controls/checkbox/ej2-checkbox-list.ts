import { bindable } from "aurelia-framework";

export class Ej2CheckboxList {
  @bindable
  public dataSource: any[] = [];
  @bindable
  public selectedItems: any[] = [];
  @bindable
  public optionModel: IOptionModel = { name: "name", value: "value", label: "label" };
  @bindable
  orientation: "horizontal" | "vertical";

  attached() {


  }
}

export interface IOptionModel {
  name: string;
  value: string;
  label: string;
}
