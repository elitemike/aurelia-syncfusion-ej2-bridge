import { autoinject, BindingEngine, bindable, Disposable } from "aurelia-framework";
import { ControlContainer, Control } from "./controlContainer";


@autoinject
export class ControlBase<T, U> {
  @bindable
  public ej2Model: U = null;

  protected element: HTMLElement = null;
  public control: T = null;
  protected context: any = null;

  protected get controlType(): Function {
    throw "syncfusionControlType is not set";
  }

  private propertyChangedSubscriptions: Disposable[] = [];

  constructor(protected bindingEngine: BindingEngine, private controlContainer: ControlContainer) {
    (<any>this.ej2Model) = {};

  }

  onBind() {

  }

  onCreateControl() {
    throw "onCreateControl is not implemented";
  }

  created() {

  }

  bind(context) {
    this.context = context;

    let _control = this.getBindableProperties();

    // Get initial values from any bound properties
    _control.bindables.forEach((property) => {
      if (this[property] !== undefined && this.ej2Model[property] === undefined) {
        this.ej2Model[property] = this[property];
        console.log('has value', { name: property, value: this[property] })
      }
    });



    this.createControlPropertySubscriptions(_control);
    this.onCreateControl();
    // console.log("control", this.control);

    this.onBind();
  }

  getBindableProperties() {
    let _control = this.controlContainer.get(this.controlType);

    if (!_control) {
      (<any>_control) = {};
      _control.type = this.controlType;
      _control.bindables = [];
      for (let property in this["__observers__"]) {
        if (ExcludedProperties.indexOf(property) === -1) {
          _control.bindables.push(property);
        }
      }
    }

    return _control;
  }

  createControlPropertySubscriptions(control: Control) {
    if (control) {
      control.bindables.forEach((binding) => {
        this.propertyChangedSubscriptions.push(this.bindingEngine.propertyObserver(this, binding).subscribe((newValue) => {
          if ((<any>this.control).properties.hasOwnProperty(binding)) {
            (<any>this.control)[binding] = newValue;
          }
        }));
      });
    }
  }

  attached() {
    (<any>this.control).appendTo(this.element);
  }

  detached() {
    this.propertyChangedSubscriptions.forEach((subscription) => subscription.dispose());
  }
}

export const ExcludedProperties = [
  "__propertiesDefined__",
  "ej2Model",
  "onClick"
];
