import { ControlBase } from "./controlBase";

export abstract class SyncfusionWrapper<T, U> extends ControlBase<T, U> {
  protected abstract syncfusionWidgetType: any = null;
  protected abstract onWrapperCreated();
  protected abstract onWidgetCreated();

  onCreateControl() {
    this.widget = new this.syncfusionWidgetType(this.eModel);
    (<any>this.widget).created = () => { this.onWidgetCreated(); };
    this.onWrapperCreated();
  }

  protected get controlType() {
    if (this.syncfusionWidgetType) {
      return this.syncfusionWidgetType;
    }

    throw "syncfusionControlType is not set";
  }
}
