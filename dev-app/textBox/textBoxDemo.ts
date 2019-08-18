export class TextBoxDemo {
  textBox = null;
  textBoxValue = "asdf"
  onInput(args: CustomEvent) {
    // console.log("input clicked", args.detail);
  }

  onFocus() {
    // console.log("focus")
  }

  onBlur() {
    //  console.log("blur")
  }

  attached() {
    let _this = this;

    setTimeout(() => {
      this.textBoxValue = "Updated "
    }, 5000);
  }
}
