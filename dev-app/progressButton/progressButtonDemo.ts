import { observable } from 'aurelia-binding';
import { IEJ2WidgetBridge } from './../../src/interfaces/IEJ2WidgetBridge';
import { ProgressButtonModel, ProgressButton } from "@syncfusion/ej2-splitbuttons";

export class ProgressButtonDemo {
  showButton = true;
  
  hideClicked(){
    this.showButton = false;
    let _this = this;
    setTimeout(() => {
      _this.showButton =true;
    }, 2000);
  }

  @observable
  progressButtonVM: IEJ2WidgetBridge<ProgressButton> = null;

  progressButtonModel: ProgressButtonModel = {
    spinSettings: { position: "Right" }
  };

  progressButtonModelStarted: ProgressButtonModel = {
   // spinSettings: { position: "Right" },
    duration:30000,
    cssClass: 'e-hide-spinner',
    enableProgress:true
  }


  buttonClicked() {
    console.log("button clicked");
  }

  attached() {
  }

  progressButtonVMChanged(){
    if(this.progressButtonVM){
      let _this = this;
      setTimeout(() => {
        _this.progressButtonVM.widget.start();

      }, 1000);
    }
  }
  restart(){
    this.progressButtonVM.widget.start();
  }
}
