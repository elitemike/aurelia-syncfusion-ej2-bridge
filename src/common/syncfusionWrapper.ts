import { ControlBase } from "./controlBase";

export abstract class SyncfusionWrapper<T, U> extends ControlBase<T, U> {
  protected abstract syncfusionControlType: any = null;
  onCreateControl() {
    this.control = new this.syncfusionControlType(this.ej2Model);
  }

  protected get controlType() {
    if (this.syncfusionControlType) {
      return this.syncfusionControlType;
    }

    throw "syncfusionControlType is not set";
  }
}
