import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('message'));

test('basic: content, default severity, variant and icon', async ({ app }) => {
  const section = app.section('message-basic');
  const msg = section.getByTestId('msg-basic').locator('.e-message');
  await expect(section.getByTestId('msg-created')).toHaveText('1');
  await expect(msg.locator('.e-msg-content')).toHaveText('This is a message');
  await expect(msg).toHaveClass(/msg-basic-class/);
  await expect(msg.locator('.e-msg-icon')).toBeVisible();
  await expect(msg.locator('.e-msg-close-icon')).toHaveCount(0);
  expect(await widgetProp(section.getByTestId('msg-basic'), 'severity')).toBe('Normal');
  expect(await widgetProp(section.getByTestId('msg-basic'), 'variant')).toBe('Text');
});

test('basic: severity and variant follow the view-model', async ({ app }) => {
  const section = app.section('message-basic');
  const msg = section.getByTestId('msg-basic').locator('.e-message');
  await section.getByTestId('msg-severity').selectOption('Error');
  await expect(msg).toHaveClass(/e-error/);
  await section.getByTestId('msg-severity').selectOption('Success');
  await expect(msg).toHaveClass(/e-success/);
  await expect(msg).not.toHaveClass(/e-error/);
  await section.getByTestId('msg-variant').selectOption('Outlined');
  await expect(msg).toHaveClass(/e-outline/);
  await section.getByTestId('msg-variant').selectOption('Filled');
  await expect(msg).toHaveClass(/e-filled/);
  expect(await widgetProp(section.getByTestId('msg-basic'), 'variant')).toBe('Filled');
});

test('basic: content, showIcon and showCloseIcon follow the view-model', async ({ app }) => {
  const section = app.section('message-basic');
  const msg = section.getByTestId('msg-basic').locator('.e-message');
  await section.getByTestId('msg-content-change').click();
  await expect(msg.locator('.e-msg-content')).toHaveText('Updated message');
  await section.getByTestId('msg-chk-close').check();
  await expect(msg.locator('.e-msg-close-icon')).toBeVisible();
  await section.getByTestId('msg-chk-icon').uncheck();
  await expect(msg.locator('.e-msg-icon')).toHaveCount(0);
});

test('visible is two-way and closed is raised by the close icon', async ({ app }) => {
  const section = app.section('message-visible');
  const msg = section.getByTestId('msg-visible').locator('.e-message');
  await expect(msg).toBeVisible();
  await expect(msg).toHaveText('Closable message');
  // view to model
  await msg.locator('.e-msg-close-icon').click();
  await expect(msg).toBeHidden();
  await expect(section.getByTestId('msg-visible-out')).toHaveText('false');
  await expect(section.getByTestId('msg-closed')).toHaveText('1');
  await expect(section.getByTestId('msg-interacted')).toHaveText('true');
  // model to view
  await section.getByTestId('msg-show').click();
  await expect(msg).toBeVisible();
  await expect(section.getByTestId('msg-visible-out')).toHaveText('true');
  await section.getByTestId('msg-hide').click();
  await expect(msg).toBeHidden();
});

test('every severity renders its own css class', async ({ app }) => {
  const section = app.section('message-severities');
  for (const [name, cls] of [['Normal', /e-normal|e-message/], ['Success', /e-success/], ['Info', /e-info/], ['Warning', /e-warning/], ['Error', /e-error/]] as const) {
    await expect(section.getByTestId(`msg-sev-${name}`).locator('.e-message')).toHaveClass(cls);
    await expect(section.getByTestId(`msg-sev-${name}`).locator('.e-message')).toHaveClass(/e-filled/);
  }
});

test('the element body is used as content', async ({ app }) => {
  const section = app.section('message-slot');
  await expect(section.getByTestId('msg-slot').locator('.e-msg-content b')).toHaveText('Rich');
  await expect(section.getByTestId('msg-slot').locator('.e-msg-content')).toHaveText('Rich body content');
});

test('destroyed is raised when the message is removed', async ({ app }) => {
  const section = app.section('message-destroy');
  await expect(section.getByTestId('msg-destroyed')).toHaveText('0');
  await section.getByTestId('msg-chk-exists').uncheck();
  await expect(section.getByTestId('msg-destroyed')).toHaveText('1');
});
