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
  private eModel: U = null;
  protected _eModel: U = null;
  protected widgetElement: HTMLElement = null;
  public widget: T = null;
  protected bindingContext: any = null;
  protected logName: string = "";
  // this controls if the indivual bindings override the model values at initial binding
  private propertyPriority = true;

  protected get controlType(): Function {
    throw "syncfusionControlType is not set";
  }

  protected subscriptions: Disposable[] = [];

  constructor(protected bindingEngine: BindingEngine, private controlContainer: ControlContainer,
    protected taskQueue: TaskQueue, protected eventAggregator: EventAggregator, protected element: Element) {
  }

  onBind() {

  }

  onAttached() {

  }

  onCreateControl() {
    throw "onCreateControl is not implemented";
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
    this.logName = this.controlType.name;
    this.bindingContext = context;
    this._eModel = Object.assign({}, this.eModel);
    this.setInitialBindings();
    this.onCreateControl();
    this.onBind();
  }

  protected setInitialBindings() {
    //  this.debug("set initial bindables")
    let _control = this.getBindables();

    let bindablePrefixLength = constants.bindablePrefix.length;

    //  this.debug("bindables", _control.bindables)
    // Get initial values from any bound properties
    _control.bindableProperties.forEach((property) => {
      if (!property.startsWith(constants.eventPrefix)) {
        let modelProperty = property.substr(bindablePrefixLength)
        if (this[property] !== undefined && (this.propertyPriority || this._eModel[modelProperty] === undefined)) {
          this._eModel[modelProperty] = this[property];
          //    this.info('has value', { name: property, value: this[property] })
        }
      }

    });

    this.createControlPropertySubscriptions(_control);
  }


  getBindables() {
    let _control = this.controlContainer.get(this.controlType);

    if (!_control) {
      (<any>_control) = {};
      _control.type = this.controlType;
      _control.bindableProperties = [];
      _control.bindableEvents = [];
      for (let property in this["__observers__"]) {
        if (ExcludedProperties.indexOf(property) === -1) {
          if (property.startsWith(constants.eventPrefix)) {
            _control.bindableEvents.push(property);
          } else {
            _control.bindableProperties.push(property);
          }
        }
      }
    }

    return _control;
  }

  createControlEvents(control: Control) {
    control.bindableEvents.forEach((event) => {
      let eventName = event.substr(constants.eventPrefix.length);
      //  logger.debug("create event", eventName);

      (<any>this.widget).addEventListener(eventName,
        (args) => {
          this.element.dispatchEvent(new CustomEvent(event, {
            bubbles: true,
            detail: args
          }))
        }
      );
      // this.widget[eventName] = (args) => {
      //   this.element.dispatchEvent(new CustomEvent(event, {
      //     bubbles: true,
      //     detail: args
      //   }));
    }
    );
  }

  createControlPropertySubscriptions(control: Control) {
    //  this.debug("create control property subscriptions");
    if (control) {
      let bindablePrefixLength = constants.bindablePrefix.length;

      // control.bindables.forEach((binding) => {
      //   let modelBinding = binding.substr(bindablePrefixLength);
      //   this.propertyChangedSubscriptions.push(this.bindingEngine.propertyObserver(this, binding).subscribe((newValue) => {
      //     if ((<any>this.widget).properties.hasOwnProperty(modelBinding)) {
      //       logger.debug(`changed - ${modelBinding}`, newValue);
      //       (<any>this.widget)[modelBinding] = newValue;
      //     }
      //   }));
      // });
      control.bindableProperties.forEach((binding) => {
        let modelBinding = binding.substr(bindablePrefixLength);
        this.subscriptions.push(this.bindingEngine.propertyObserver(this, binding).subscribe((newValue) => {
          if ((<any>this.widget).properties.hasOwnProperty(modelBinding)) {
            let customFunc = `${modelBinding}Changed`;
            // this.debug('custom func', customFunc)
            if (typeof this[customFunc] === "function") {
              this[customFunc].call(this, newValue);
            } else {
              // this.debug(`changed - ${modelBinding}`, newValue);
              (<any>this.widget)[modelBinding] = newValue;
            }
          }
        }));
      });
    }
  }

  attached() {
    this.appendWidget();
    this.onAttached();
  }

  protected appendWidget() {
    (<any>this.widget).appendTo(this.widgetElement);
  }

  detached() {
    this.subscriptions.forEach((subscription) => { if (subscription) { subscription.dispose(); } });
    if ((<any>this.widget).destroy) {
      this.debug("destroy method", null);
      (<any>this.widget).destroy();
    }
    this.widget = null;
    this._eModel = null;
    this.widgetElement = null;
  }



}

export const ExcludedProperties = [
  "__propertiesDefined__",
  "eModel",
  "onClick"
];
