import { ProgressButtonModel } from '@syncfusion/ej2-splitbuttons';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { observable } from 'aurelia-binding';
export class App {

  @observable
  isChecked = false
  @observable
  rdo1Checked = false;
  @observable
  rdo2Checked = true;
  buttonDisabled = false;
  title = "Initial title";
  index = 0;
  isPrimary = true;

  progressButtonModel: ProgressButtonModel = {

    created: () => { this.onCreated(); },
    spinSettings: { position: "Right" }
  };


  onCreated() {
    console.log("progress created")
  }

  buttonModel: ButtonModel = {
    isPrimary: true
  };

  buttonClick() {
    this.isChecked = !this.isChecked;
    this.title = `Updated value ${this.index++}`;
  }

  progressClicked() {
    console.log("progress clicked")
    this.isPrimary = false;
  }

  checkboxClick() {
    console.log("checkbox clicked", this.isChecked);
  }

  isCheckedChanged() {
    console.log("checkbox changed - new value", this.isChecked);
  }

  rdo1CheckedChanged() {
    console.log("radio 1 changed - new value", this.rdo1Checked);
    this.buttonDisabled = this.rdo1Checked;
  }

  rdo2CheckedChanged() {
    console.log("radio 2 changed - new value", this.rdo2Checked);

  }


}
