import { test, expect } from './fixtures';
import { wrapperProp, wrapperPath } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('stepper'));

const steps = (root) => root.locator('li.e-step-container');

test('renders steps with labels, icons and the active step', async ({ app }) => {
  const host = app.section('st-default').getByTestId('st-default');
  await expect(steps(host)).toHaveCount(4);
  await expect(host.locator('.e-label')).toHaveText(['Step 1', 'Step 2', 'Step 3', 'Step 4']);
  await expect(host.locator('.e-step.e-folder')).toHaveCount(4);
  await expect(steps(host).nth(1)).toHaveClass(/e-step-selected/);
  await expect(steps(host).nth(0)).toHaveClass(/e-step-completed/);
});

test('two-way activeStep: view to model through a step click', async ({ app }) => {
  const section = app.section('st-default');
  const host = section.getByTestId('st-default');
  await expect(section.getByTestId('st-active')).toHaveText('1');
  await steps(host).nth(3).locator('.e-step').click();
  await expect(section.getByTestId('st-active')).toHaveText('3');
  await expect(section.getByTestId('st-clicks')).toHaveText('1');
  await expect(section.getByTestId('st-changing')).toHaveText('1');
  await expect(section.getByTestId('st-changed')).toHaveText('1');
  await expect(section.getByTestId('st-last')).toHaveText('3');
  await expect(section.getByTestId('st-previous')).toHaveText('1');
  await expect(steps(host).nth(3)).toHaveClass(/e-step-selected/);
});

test('nextStep, previousStep and reset write activeStep back', async ({ app }) => {
  const section = app.section('st-default');
  await section.getByTestId('st-next').click();
  await expect(section.getByTestId('st-active')).toHaveText('2');
  await section.getByTestId('st-prev').click();
  await expect(section.getByTestId('st-active')).toHaveText('1');
  await section.getByTestId('st-reset').click();
  await expect(section.getByTestId('st-active')).toHaveText('0');
});

test('two-way activeStep: model to view', async ({ app }) => {
  const section = app.section('st-default');
  await section.getByTestId('st-go-two').click();
  await expect(steps(section.getByTestId('st-default')).nth(2)).toHaveClass(/e-step-selected/);
  await expect(section.getByTestId('st-active')).toHaveText('2');
});

test('stepChanging can cancel a step change', async ({ app }) => {
  const section = app.section('st-default');
  const host = section.getByTestId('st-default');
  await section.getByTestId('st-block').click();
  await steps(host).nth(3).locator('.e-step').click();
  await expect(section.getByTestId('st-changing')).toHaveText('1');
  await expect(section.getByTestId('st-changed')).toHaveText('0');
  await expect(section.getByTestId('st-active')).toHaveText('1');
  await expect(steps(host).nth(1)).toHaveClass(/e-step-selected/);
});

test('created event', async ({ app }) => {
  await expect(app.section('st-default').getByTestId('st-created')).toHaveText('1');
});

test('linear stepper blocks skipping steps and flags optional and invalid steps', async ({ app }) => {
  const section = app.section('st-linear');
  const host = section.getByTestId('st-linear');
  await expect(host.locator('.e-step-optional, .e-step-label-optional').first()).toBeAttached();
  await steps(host).nth(2).click({ force: true });
  await expect(steps(host).nth(0)).toHaveClass(/e-step-selected/);
  await section.getByTestId('st-linear-next').click();
  await expect(steps(host).nth(1)).toHaveClass(/e-step-selected/);
  await section.getByTestId('st-free').click();
  await expect.poll(() => wrapperProp(host, 'linear')).toBe(false);
  await steps(host).nth(3).click({ force: true });
  await expect(steps(host).nth(3)).toHaveClass(/e-step-selected/);
});

test('orientation, labelPosition, stepType and cssClass follow the view-model', async ({ app }) => {
  const section = app.section('st-layout');
  const host = section.getByTestId('st-layout');
  const el = host.locator('.e-stepper');
  await expect(el).toHaveClass(/e-vertical/);
  await expect(el).toHaveClass(/st-one/);
  await section.getByTestId('st-horizontal').click();
  await expect(el).toHaveClass(/e-horizontal/);
  await section.getByTestId('st-top').click();
  await expect(el).toHaveClass(/e-label-before/);
  await section.getByTestId('st-label-only').click();
  await expect.poll(() => wrapperProp(host, 'stepType')).toBe('Label');
  await expect(host.locator('.e-step.e-indicator')).toHaveCount(0);
  await section.getByTestId('st-restyle').click();
  await expect(el).toHaveClass(/st-two/);
});

test('stepType Label and Indicator render only that part', async ({ app }) => {
  const section = app.section('st-layout');
  await expect(section.getByTestId('st-label').locator('.e-label')).toHaveCount(4);
  await expect(section.getByTestId('st-label').locator('.e-indicator')).toHaveCount(0);
  await expect(section.getByTestId('st-indicator').locator('.e-indicator')).toHaveCount(4);
  await expect(section.getByTestId('st-indicator').locator('.e-label')).toHaveCount(0);
});

test('template and tooltipTemplate render custom markup and showTooltip toggles tooltips', async ({ app, page }) => {
  const section = app.section('st-template');
  const host = section.getByTestId('st-template');
  await expect(host.locator('.st-tpl')).toHaveText(['Step 1', 'Step 2', 'Step 3', 'Step 4']);
  await steps(host).nth(2).hover();
  await expect(page.locator('.e-tooltip-wrap .st-tip')).toContainText('Step');
  await section.getByTestId('st-hide-tips').click();
  await expect.poll(() => wrapperProp(host, 'showTooltip')).toBe(false);
});

test('readOnly blocks interaction, animation and beforeStepRender reach the widget', async ({ app }) => {
  const section = app.section('st-misc');
  const host = section.getByTestId('st-misc');
  await expect(section.getByTestId('st-render')).toHaveText('4');
  await expect.poll(() => wrapperPath(host, 'animation.enable')).toBe(false);
  await steps(host).nth(2).locator('.e-step').click();
  await expect(steps(host).nth(2)).toHaveClass(/e-step-selected/);
  await section.getByTestId('st-lock').click();
  await expect.poll(() => wrapperProp(host, 'readOnly')).toBe(true);
  await steps(host).nth(3).locator('.e-step').click({ force: true });
  await expect(steps(host).nth(2)).toHaveClass(/e-step-selected/);
});
