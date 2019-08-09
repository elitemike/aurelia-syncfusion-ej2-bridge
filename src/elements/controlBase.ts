import { autoinject, BindingEngine, bindable, Disposable } from "aurelia-framework";
import { ControlContainer } from "./controlContainer";


@autoinject
export class ControlBase<T, U> {
  @bindable
  public ej2Model: U = null;

  protected element: HTMLElement = null;
  protected control: T = null;
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
    this.createControlPropertySubscriptions();
    this.context = context;
    this.onCreateControl();
    // console.log("control", this.control);

    this.onBind();
  }

  createControlPropertySubscriptions() {
    // console.log("this", this);

    let _control = this.controlContainer.get(this.controlType);

    if (_control) {
      _control.propertyChangeSubscriptions.forEach((binding) => {
        // console.log("creating subscription from existing bindings", binding)
        this.propertyChangedSubscriptions.push(this.bindingEngine.propertyObserver(this, binding).subscribe((newValue) => {
          if ((<any>this.control).properties.hasOwnProperty(binding)) {
            (<any>this.control)[binding] = newValue;
          }
        }));
      });
    } else {
      (<any>_control) = {};
      _control.type = this.controlType;
      _control.propertyChangeSubscriptions = [];
      for (let property in this["__observers__"]) {
        if (ExcludedProperties.indexOf(property) === -1) {
          // console.log("creating subscription for first time", property)
          _control.propertyChangeSubscriptions.push(property);
          this.propertyChangedSubscriptions.push(this.bindingEngine.propertyObserver(this, property).subscribe((newValue) => {
            if ((<any>this.control).properties.hasOwnProperty(property)) {
              (<any>this.control)[property] = newValue;
            }
          }));
        }
      }

      this.controlContainer.add(_control);
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
