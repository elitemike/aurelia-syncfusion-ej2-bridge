export class ButtonDemo {
  showButton = true;
  
  hideClicked(){
    this.showButton = false;
    let _this = this;
    setTimeout(() => {
      _this.showButton =true;
    }, 2000);
  }
  buttonClicked() {
    console.log("button clicked")
  }
}
