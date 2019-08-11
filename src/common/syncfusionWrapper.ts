import { ControlBase } from "./controlBase";

export abstract class SyncfusionWrapper<T, U> extends ControlBase<T, U> {
  protected abstract syncfusionWidgetType: any = null;
  protected abstract onCreated();

  onCreateControl() {
    this.widget = new this.syncfusionWidgetType(this.eModel);
    this.onCreated();
  }

  protected get controlType() {
    if (this.syncfusionWidgetType) {
      return this.syncfusionWidgetType;
    }

    throw "syncfusionControlType is not set";
  }
}
