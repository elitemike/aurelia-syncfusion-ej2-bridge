import { BindableProperty, HtmlBehaviorResource } from 'aurelia-templating';
import { Container } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { ControlBindings } from '../controlBindings';
import { constants } from '../common/constants';

export function generateBindables(controlName: string): any {
  return function (target, key, descriptor) {
    let behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target) as HtmlBehaviorResource;
    let oneWay = [];

    if (ControlBindings[controlName].oneWay) {
      oneWay = ControlBindings.common.oneWay.concat(ControlBindings[controlName].oneWay);
    } else {
      oneWay = ControlBindings.common.oneWay;
    }

    let createBinding = (name: string, bindingMode: bindingMode, prefix) => {
      let nameOrConfigOrTarget: any = {
        name: `${prefix}${name}`,
        defaultBindingMode: bindingMode
      };

      let prop = new BindableProperty(nameOrConfigOrTarget);
      prop.registerWith(target, behaviorResource, descriptor);
    };

    // One way bindings
    for (let i = 0; i < oneWay.length; i++) {
      let option = oneWay[i];
      createBinding(option, bindingMode.oneWay, constants.bindablePrefix);
    }

    // From view bindings
    if (ControlBindings[controlName].fromView) {
      for (let i = 0; i < ControlBindings[controlName].fromView.length; i++) {
        let option = ControlBindings[controlName].fromView[i];
        createBinding(option, bindingMode.fromView, constants.bindablePrefix);
      }
    }

    // Two way
    if (ControlBindings[controlName].twoWay) {
      for (let i = 0; i < ControlBindings[controlName].twoWay.length; i++) {
        let option = ControlBindings[controlName].twoWay[i];
        createBinding(option, bindingMode.twoWay, constants.bindablePrefix);
      }
    }

    // Events
    if (ControlBindings[controlName].events) {
      for (let i = 0; i < ControlBindings[controlName].events.length; i++) {
        let option = ControlBindings[controlName].events[i];
        createBinding(option, bindingMode.oneTime, constants.eventPrefix);
      }
    }
  };
}


export function delayed() {
  return function (target, key, descriptor) {
    let taskQueue = (Container.instance || new Container()).get(TaskQueue);
    let ptr = descriptor.value;

    descriptor.value = function (...args) {
      taskQueue.queueTask(() => ptr.apply(this, args));
    };

    return descriptor;
  };
}
