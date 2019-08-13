import { IOptionModel } from "controls/checkbox/ej2-checkbox-list";


export class CheckboxDemo {
  dataSource = [
    {
      label: "Item 1",
      name: "blah"
    },
    {
      label: "Item 2",
      name: "boo"
    },
    {
      label: "item 3",
      name: "basdf"
    }
  ]

  selectedItems = [];

  optionModel: IOptionModel = {
    label: "label",
    name: "name",
    value: "value"
  }

  constructor() {
    this.selectedItems.push(this.dataSource[1]);

    let _this = this;
    setTimeout(() => {
      _this.selectedItems.push(_this.dataSource[2]);
      console.log("selected tiems", _this.selectedItems)
    }, 5000);
  }
}
