import { observable } from "aurelia-binding";

export class DateTimePickerDemo {
  @observable
  value = new Date();

  valueChanged(nv) {
    console.log("value changed", nv)
  }
}
