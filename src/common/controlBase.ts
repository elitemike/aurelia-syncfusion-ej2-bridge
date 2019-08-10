import { autoinject, BindingEngine, bindable, Disposable } from "aurelia-framework";
import { ControlContainer, Control } from "./controlContainer";
import { constants } from "./constants";


@autoinject
export class ControlBase<T, U> {
  @bindable
  public eModel: U = null;

  protected element: HTMLElement = null;
  public syncfusionControl: T = null;
  protected context: any = null;

  // this controls if the indivual bindings override the model values at initial binding
  private propertyPriority = true;

  protected get controlType(): Function {
    throw "syncfusionControlType is not set";
  }

  private propertyChangedSubscriptions: Disposable[] = [];

  constructor(protected bindingEngine: BindingEngine, private controlContainer: ControlContainer) {
    (<any>this.eModel) = {};

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

    let bindablePrefixLength = constants.bindablePrefix.length;

    // Get initial values from any bound properties
    _control.bindables.forEach((property) => {
      let modelProperty = property.substr(bindablePrefixLength)
      if (this[property] !== undefined && (this.propertyPriority || this.eModel[modelProperty] === undefined)) {
        this.eModel[modelProperty] = this[property];
        console.log('has value', { name: modelProperty, value: this[property] })
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
      let bindablePrefixLength = constants.bindablePrefix.length;

      control.bindables.forEach((binding) => {
        let modelBinding = binding.substr(bindablePrefixLength);
        this.propertyChangedSubscriptions.push(this.bindingEngine.propertyObserver(this, binding).subscribe((newValue) => {
          if ((<any>this.syncfusionControl).properties.hasOwnProperty(modelBinding)) {
            (<any>this.syncfusionControl)[modelBinding] = newValue;
          }
        }));
      });
    }
  }

  attached() {
    (<any>this.syncfusionControl).appendTo(this.element);
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
