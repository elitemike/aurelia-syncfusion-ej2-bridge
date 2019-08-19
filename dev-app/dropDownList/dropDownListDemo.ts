import { DropDownListModel } from "@syncfusion/ej2-dropdowns";

export class DropDownListDemo {

  data = [{ text: "item 1", value: 1 }, { text: "item 2", value: 2 }];

  model: DropDownListModel = {
    fields: { text: "text", value: "value" },
    placeholder: "select a value"
  };
}
