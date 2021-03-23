import { observable } from "aurelia-binding";

export class SwitchDemo {
  showCheck = true;

  hideCheck(){
    let _this = this;
    this.showCheck = false;
    setTimeout(() => {
      _this.showCheck = true;
    }, 2000);
  }

  @observable
  isChecked = true;

  isCheckedChanged() {
    console.log("isChecked", this.isChecked)
  }
}
