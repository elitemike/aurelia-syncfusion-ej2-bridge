import { BindableProperty, HtmlBehaviorResource } from 'aurelia-templating';
import { Container } from 'aurelia-dependency-injection';
import { metadata } from 'aurelia-metadata';
import { bindingMode } from 'aurelia-binding';
import { TaskQueue } from 'aurelia-task-queue';
import { ControlBindings } from '../controlBindings';

export function generateBindables(controlName: string): any {
  return function (target, key, descriptor) {

    console.log("generateBindales", { target: target, key: key, descriptor: descriptor })
    let behaviorResource = metadata.getOrCreateOwn(metadata.resource, HtmlBehaviorResource, target) as HtmlBehaviorResource;

    for (let i = 0; i < ControlBindings[controlName].oneWay.length; i++) {
      let option = ControlBindings[controlName].oneWay[i];

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
