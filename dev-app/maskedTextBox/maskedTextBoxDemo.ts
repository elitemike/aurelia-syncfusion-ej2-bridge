export class MaskedTextBoxDemo {
  phone: string = null;
  changeCount = 0;

  onChange() {
    this.changeCount++;
  }

  setPhone() {
    this.phone = '5551234567';
  }
}
