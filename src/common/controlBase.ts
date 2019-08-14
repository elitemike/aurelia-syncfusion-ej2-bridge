import { TaskQueue } from 'aurelia-task-queue';
import { autoinject, BindingEngine, bindable, Disposable, LogManager } from "aurelia-framework";
import { ControlContainer, Control } from "./controlContainer";
import { constants } from "./constants";
import { EventAggregator } from 'aurelia-event-aggregator';
import { Logger } from 'aurelia-logging';

let logger: Logger = LogManager.getLogger("SyncfusionBridge");

@autoinject
export class ControlBase<T, U> {
  @bindable
  public eModel: U = null;

  protected widgetElement: HTMLElement = null;
  public widget: T = null;
  protected context: any = null;
  protected logName: string = "";
  // this controls if the indivual bindings override the model values at initial binding
  private propertyPriority = true;

  protected get controlType(): Function {
    throw "syncfusionControlType is not set";
  }

  private propertyChangedSubscriptions: Disposable[] = [];

  constructor(protected bindingEngine: BindingEngine, private controlContainer: ControlContainer,
    protected taskQueue: TaskQueue, protected eventAggregator: EventAggregator, protected element: Element) {
    (<any>this.eModel) = {};

  }

  onBind() {

  }

  onCreateControl() {
    throw "onCreateControl is not implemented";
  }

  created(view) {
    logger.debug("view", view)
    this.logName = this.controlType.name;
  }

  protected debug(message: string, ...rest: any[]) {
    logger.debug(`[${this.logName}] - ${message}`, rest);
  }

  protected info(message: string, ...rest: any[]) {
    logger.info(`[${this.logName}] - ${message}`, rest);
  }

  protected error(message: string, ...rest: any[]) {
    logger.error(`[${this.logName}] - ${message}`, rest);
  }

  protected warn(message: string, ...rest: any[]) {
    logger.warn(`[${this.logName}] - ${message}`, rest);
  }

  bind(context) {
    this.context = context;

    let _control = this.getBindableProperties();

    let bindablePrefixLength = constants.bindablePrefix.length;

    this.debug("bindables", _control.bindables)
    // Get initial values from any bound properties
    _control.bindables.forEach((property) => {
      let modelProperty = property.substr(bindablePrefixLength)
      if (this[property] !== undefined && (this.propertyPriority || this.eModel[modelProperty] === undefined)) {
        this.eModel[modelProperty] = this[property];
        this.info('has value', { name: property, value: this[property] })
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
          if ((<any>this.widget).properties.hasOwnProperty(modelBinding)) {
            (<any>this.widget)[modelBinding] = newValue;
          }
        }));
      });
    }
  }

  attached() {
    (<any>this.widget).appendTo(this.widgetElement);
  }

  detached() {
    this.propertyChangedSubscriptions.forEach((subscription) => subscription.dispose());
  }

}

export const ExcludedProperties = [
  "__propertiesDefined__",
  "eModel",
  "onClick"
];
