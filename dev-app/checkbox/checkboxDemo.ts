import { IOptionModel } from "widgets/checkbox/ej2-checkbox-list";


export class CheckboxDemo {
  label1 = "this is my label";
  testChecked: boolean = false;
  showCheckbox: boolean = true;

  testClicked() {
    console.log("test Clicked")
  }

  toggle() {
    this.showCheckbox = !this.showCheckbox;
  }

  dataSource1 = [
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

  dataSource2 = ["A", "B", "C", "D"]

  dataSource3 = [
    {
      label: "Item 1",
      name: "blah",
      id: "AAA"
    },
    {
      label: "Item 2",
      name: "boo",
      id: "asdfa"
    },
    {
      label: "item 3",
      name: "basdf",
      id: "3rfsdfga"
    }
  ]

  matcher = (a, b) => { return a.id === b.id };

  selectedItems1 = [];
  selectedItems2 = [];
  selectedItems3 = [{
    label: "Item 2",
    name: "boo",
    id: "asdfa"
  }];

  optionModel1: IOptionModel = {
    label: "label",
    name: "name",
    value: "value"
  }

  optionModel3: IOptionModel = {
    label: "label",
    name: "name",
    value: "value"
  }

  constructor() {
    this.selectedItems1.push(this.dataSource1[1]);

    let _this = this;
    // setTimeout(() => {
    //   _this.selectedItems.push(_this.dataSource[2]);
    //   console.log("selected tiems", _this.selectedItems)
    // }, 5000);
  }
}
