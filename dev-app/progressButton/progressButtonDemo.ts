import { ProgressButtonModel } from "@syncfusion/ej2-splitbuttons";

export class ProgressButtonDemo {
  progressButtonModel: ProgressButtonModel = {
    spinSettings: { position: "Right" }
  };


  buttonClicked() {
    console.log("button clicked");
  }
}
