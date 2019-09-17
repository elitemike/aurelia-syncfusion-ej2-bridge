import { ControlBase } from "./controlBase";


export abstract class SyncfusionWrapper<T, U> extends ControlBase<T, U> {
  protected abstract syncfusionWidgetType: any = null;
  protected abstract onWrapperCreated();
  protected abstract onWidgetCreated();




  onCreateControl() {
    this.onBeforeWidgetInstantiation();
    this.widget = new this.syncfusionWidgetType(this.eModel);
    (<any>this.widget).created = () => { this.onWidgetCreated(); };
    this.onWrapperCreated();
    this.createControlEvents(this.getBindables());
  }

  public recreate() {
    this.debug("recreate");
    (<any>this.widget).destroy();
    this.setInitialBindings();
    this.onCreateControl();
    this.appendWidget();
  }

  public refresh() {
    (<any>this.widget).refresh();
  }

  public dataBind() {
    (<any>this.widget).dataBind();
  }

  protected get controlType() {
    if (this.syncfusionWidgetType) {
      return this.syncfusionWidgetType;
    }

    throw "syncfusionControlType is not set";
  }

  protected onBeforeWidgetInstantiation() {

  }
}
