import { autoinject, BindingEngine, bindable, Disposable, BindableProperty, HtmlBehaviorResource, bindingMode } from "aurelia-framework";
import { metadata } from 'aurelia-metadata';
import { Ej2Button } from "./button/ej2-button";

@autoinject
export class ControlBase<T, U> {
  @bindable
  public ej2Model: U = null;
  @bindable
  public disabled: boolean = false;

  protected element: HTMLElement = null;
  protected control: T = null;
  protected context: any = null;

  private propertyChangedSubscriptions: Disposable[] = [];

  onBind() {

  }

  onCreateControl() {
    throw "onCreateControl is not implemented";
  }

  constructor(protected bindingEngine: BindingEngine) {
    (<any>this.ej2Model) = {};

  }

  created() {

  }

  bind(context) {
    this.createPropertySubscriptions();
    this.context = context;

    this.onCreateControl();
    console.log("control", this.control);

    this.onBind();
  }

  createPropertySubscriptions() {
    console.log("this", this);
    for (let property in this["__observers__"]) {
      if (property !== "__propertiesDefined__") {
        console.log("creating subscription", property)
        this.propertyChangedSubscriptions.push(this.bindingEngine.propertyObserver(this, property).subscribe((newValue) => {
          if ((<any>this.control).properties.hasOwnProperty(property)) {
            (<any>this.control)[property] = newValue;
          }
        }));
      }
    }
  }

  attached() {
    (<any>this.control).appendTo(this.element);
  }

  detached() {
    this.propertyChangedSubscriptions.forEach((subscription) => subscription.dispose());
  }
}
