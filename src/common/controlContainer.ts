export class ControlContainer {
  public controls: Control[] = [];

  public add(control: Control) {
    let existing = this.controls.find((x) => x.type === control.type);
    if (!existing) {
      this.controls.push(control);
    }
  }

  public get(type: Function) {
    let _control = this.controls.find((x) => x.type === type);
    return _control;
  }
}

export interface Control {
  type: Function;
  bindableProperties: string[];
  bindableEvents: string[];
}

export interface ControlBindings {
  oneWayBindings: string[];
}
