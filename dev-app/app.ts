import { ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { observable } from 'aurelia-binding';
import { Ej2Button } from 'controls/button/ej2-button';
export class App {

  @observable
  isChecked = false
  @observable
  rdo1Checked = false;
  @observable
  rdo2Checked = true;
  buttonDisabled = false;
  index = 0;
  isPrimary = true;
  myContent = "blah"
  isToggle = false;
  ej2Button: Ej2Button = null;

  progressButtonModel: ProgressButtonModel = {

    created: () => { this.onCreated(); },
    spinSettings: { position: "Right" }
  };


  onCreated() {
    console.log("progress created")
  }

  buttonModel: ButtonModel = {

  };

  buttonClick() {
    this.isChecked = !this.isChecked;
    this.myContent = "button clicked"
  }

  progressClicked() {
    // console.log("progress clicked")
    this.ej2Button.refresh();
  }

  checkboxClick() {
    console.log("checkbox clicked", this.isChecked);
  }

  isCheckedChanged() {
    // console.log("checkbox changed - new value", this.isChecked);
  }

  rdo1CheckedChanged() {
    // console.log("radio 1 changed - new value", this.rdo1Checked);
    this.buttonDisabled = this.rdo1Checked;
  }

  rdo2CheckedChanged() {
    //   console.log("radio 2 changed - new value", this.rdo2Checked);
    this.isToggle = true;

  }


}
