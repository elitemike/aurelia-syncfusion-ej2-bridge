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
          this._eModel[modelProperty] = coerceLiteral(modelProperty, this[property]);
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
          // HTML attributes are case-insensitive, so `e-on-rowSelected.delegate` in a template listens for
          // `e-on-rowselected` and `e-on-row-selected.delegate` for the kebab form. Dispatch every spelling.
          // 'bridge-event' is raised once per widget event so a host page can observe all of them (dev-app event log)
          this.element.dispatchEvent(new CustomEvent('bridge-event', { bubbles: true, detail: { name: eventName, args } }));
          const names = new Set([event, event.toLowerCase(), toKebabCase(event)]);
          names.forEach((name) => {
            this.element.dispatchEvent(new CustomEvent(name, {
              bubbles: true,
              detail: args
            }));
          });
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
              // Observer callbacks are delivered asynchronously, so by now `newValue` may be stale: widget `change`
              // events write the binding back and programmatic widget updates raise `change` themselves. Always
              // sync the latest bound value and skip no-op writes, otherwise stale values echo back and win.
              const latest = coerceLiteral(modelBinding, this[binding]);
              if (!isSameValue((<any>this.widget)[modelBinding], latest)) {
                (<any>this.widget)[modelBinding] = latest;
                // lets a host page observe binding to widget writes (the dev-app event log listens for this)
                this.element.dispatchEvent(new CustomEvent('bridge-property-set', {
                  bubbles: true,
                  detail: { property: modelBinding, value: latest }
                }));
              }
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
      (<any>this.widget).destroy();
    }
    this.widget = null;
    this._eModel = null;
    this.widgetElement = null;
  }



}

// Plain attributes like `e-enabled="false"` reach the bridge as the string "false", which is truthy. Turn the
// boolean literals into booleans, except for properties that legitimately carry text.
const textProperties = ['value', 'text', 'placeholder', 'label', 'content', 'name', 'title', 'format', 'mask', 'onLabel', 'offLabel'];
function coerceLiteral(property: string, value: any) {
  if ((value === 'true' || value === 'false') && textProperties.indexOf(property) === -1) {
    return value === 'true';
  }
  return value;
}

function isSameValue(a: any, b: any) {
  if (a === b) { return true; }
  if (a instanceof Date && b instanceof Date) { return a.getTime() === b.getTime(); }
  if (Array.isArray(a) && Array.isArray(b)) { return a.length === b.length && a.every((v, i) => isSameValue(v, b[i])); }
  return false;
}

function toKebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

export const ExcludedProperties = [
  "__propertiesDefined__",
  "eModel",
  "onClick"
];
