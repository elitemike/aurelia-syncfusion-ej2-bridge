import { ButtonModel } from '@syncfusion/ej2-buttons';
import { observable } from 'aurelia-binding';
export class App {

  @observable
  isChecked = false
  @observable
  rdo1Checked = false;
  @observable
  rdo2Checked = true;


  buttonSettings: ButtonModel = {
    isPrimary: true
  };

  buttonClick() {
    this.isChecked = !this.isChecked;
  }

  checkboxClick() {
    console.log("checkbox clicked", this.isChecked);
  }

  isCheckedChanged() {
    console.log("checkbox changed - new value", this.isChecked);
  }

  rdo1CheckedChanged() {
    console.log("radio 1 changed - new value", this.rdo1Checked);
  }

  rdo2CheckedChanged() {
    console.log("radio 2 changed - new value", this.rdo2Checked);

  }
}
