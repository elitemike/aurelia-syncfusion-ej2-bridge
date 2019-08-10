import { ControlBase } from "./controlBase";

export abstract class SyncfusionWrapper<T, U> extends ControlBase<T, U> {
  protected abstract syncfusionControlType: any = null;
  onCreateControl() {
    this.syncfusionControl = new this.syncfusionControlType(this.eModel);
  }

  protected get controlType() {
    if (this.syncfusionControlType) {
      return this.syncfusionControlType;
    }

    throw "syncfusionControlType is not set";
  }
}
