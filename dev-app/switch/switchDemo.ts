import { observable } from "aurelia-binding";

export class SwitchDemo {
  @observable
  isChecked = true;

  isCheckedChanged() {
    console.log("isChecked", this.isChecked)
  }
}
