export class StepperDemo {
  // default
  steps = this.makeSteps();
  activeStep = 1;
  changingCount = 0;
  changedCount = 0;
  clickCount = 0;
  createdCount = 0;
  lastChanged = -1;
  lastPrevious = -1;
  blockLast = false;
  stepper: any;

  // linear
  linearSteps: any[] = [
    { label: 'Cart', iconCss: 'e-icons e-cart' },
    { label: 'Address', optional: true },
    { label: 'Payment', isValid: false },
    { label: 'Done' }
  ];
  linear = true;
  linearStepper: any;

  // layout
  verticalSteps = this.makeSteps();
  orientation = 'Vertical';
  labelPosition = 'End';
  stepType = 'Default';
  cssClass = 'st-one';
  labelSteps = this.makeSteps();
  indicatorSteps = this.makeSteps();

  // templates and tooltips
  templateSteps = this.makeSteps();
  template = '<div class="st-tpl">${step.label}</div>';
  tooltipTemplate = '<span class="st-tip">Step ${value}</span>';
  showTooltip = true;

  // read only, animation, beforeStepRender
  miscSteps = this.makeSteps();
  readOnly = false;
  animation: any = { enable: false, duration: 0, delay: 0 };
  renderCount = 0;
  renderedLabels: string[] = [];

  makeSteps(): any[] {
    return [
      { label: 'Step 1', iconCss: 'e-icons e-folder' },
      { label: 'Step 2', iconCss: 'e-icons e-folder' },
      { label: 'Step 3', iconCss: 'e-icons e-folder' },
      { label: 'Step 4', iconCss: 'e-icons e-folder' }
    ];
  }

  onStepChanging(event: CustomEvent) {
    this.changingCount++;
    if (this.blockLast && event.detail.activeStep === 3) {
      event.detail.cancel = true;
    }
  }

  onStepChanged(event: CustomEvent) {
    this.changedCount++;
    this.lastChanged = event.detail.activeStep;
    this.lastPrevious = event.detail.previousStep;
  }

  onStepClick() { this.clickCount++; }
  onCreated() { this.createdCount++; }

  onBeforeStepRender(event: CustomEvent) {
    this.renderCount++;
    this.renderedLabels.push(event.detail.stepIndex);
  }

  next() { this.stepper.widget.nextStep(); }
  previous() { this.stepper.widget.previousStep(); }
  reset() { this.stepper.widget.reset(); }
  goTo(index: number) { this.activeStep = index; }
  block() { this.blockLast = true; }
  linearNext() { this.linearStepper.widget.nextStep(); }
  freeLinear() { this.linear = false; }
  horizontal() { this.orientation = 'Horizontal'; }
  top() { this.labelPosition = 'Top'; }
  labelOnly() { this.stepType = 'Label'; }
  restyle() { this.cssClass = 'st-two'; }
  lock() { this.readOnly = true; }
  hideTips() { this.showTooltip = false; }
}
