import { BindableProperty, HtmlBehaviorResource } from 'aurelia-templating';
import { Container } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { ControlBindings } from '../controlBindings';

export function generateBindables(controlName: string): any {
  return function (target, key, descriptor) {
    let behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target) as HtmlBehaviorResource;

    let oneWay = ControlBindings.common.oneWay.concat(ControlBindings[controlName].oneWay);

    for (let i = 0; i < oneWay.length; i++) {
      let option = oneWay[i];

      // set the name of the bindable property to the option
      let nameOrConfigOrTarget: any = {
        name: option,
        defaultBindingMode: bindingMode.toView
      };

      let prop = new BindableProperty(nameOrConfigOrTarget);
      prop.registerWith(target, behaviorResource, descriptor);
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
