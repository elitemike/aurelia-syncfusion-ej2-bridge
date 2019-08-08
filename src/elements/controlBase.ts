import { autoinject, BindingEngine, bindable, Disposable } from "aurelia-framework";

@autoinject
export class ControlBase<T, U> {
  @bindable
  public ej2Model: U = null;
  @bindable
  public disabled: boolean = false;

  protected element: HTMLElement = null;
  protected control: T = null;
  protected context: any = null;

  private disabledSubscription: Disposable = null;

  onBind() {

  }

  onCreateControl() {
    throw "onCreateControl is not implemented";
  }

  constructor(protected bindingEngine: BindingEngine) {
    (<any>this.ej2Model) = {};
  }

  bind(context) {
    this.context = context;
    this.disabledSubscription = this.bindingEngine.propertyObserver(this, "disabled").subscribe((newValue: boolean) => {
      (<any>this.control).disabled = newValue;
    });
    this.onCreateControl();
    console.log("control", this.control);

    this.onBind();
  }

  attached() {
    (<any>this.control).appendTo(this.element);
  }

  detached() {
    this.disabledSubscription.dispose();
  }
}
