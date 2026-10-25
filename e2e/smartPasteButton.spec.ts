import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('smartPasteButton'));

const btn = (section: any, id: string) => section.getByTestId(id).locator('button.e-btn');

test('button renders content, icon, css class, primary state and raises created', async ({ app }) => {
  const section = app.section('sp-form');
  await expect(section.getByTestId('sp-created')).toHaveText('1');
  const b = btn(section, 'sp-button');
  await expect(b).toContainText('Smart paste');
  await expect(b.locator('.e-btn-icon')).toHaveClass(/e-paste/);
  await expect(b).toHaveClass(/sp-class/);
  await expect(b).toHaveClass(/e-primary/);
  expect(await widgetProp(b, 'enableHtmlSanitizer')).toBe(true);
});

test('aiAssistHandler receives the clipboard prompt and the form is filled from its answer', async ({ app }) => {
  const section = app.section('sp-form');
  await btn(section, 'sp-button').click();
  await expect(section.getByTestId('sp-name')).toHaveValue('Jane Doe');
  await expect(section.getByTestId('sp-email')).toHaveValue('jane@example.com');
  await expect(section.getByTestId('sp-country')).toHaveValue('ca');
  await expect(section.getByTestId('sp-subscribe')).toBeChecked();
  await expect(section.getByTestId('sp-calls')).toHaveText('1');
  await expect(section.getByTestId('sp-prompt')).toContainText('USER_DATA: Jane Doe, jane@example.com, from Canada');
  // the button is usable again after the handler finished
  await expect(btn(section, 'sp-button')).toBeEnabled();
});

test('iconPosition, isPrimary and disabled follow the view-model', async ({ app }) => {
  const section = app.section('sp-form');
  const b = btn(section, 'sp-button');
  await section.getByTestId('sp-icon-position').selectOption('Right');
  await expect(b.locator('.e-btn-icon')).toHaveClass(/e-icon-right/);
  await section.getByTestId('sp-chk-primary').uncheck();
  await expect(b).not.toHaveClass(/e-primary/);
  await section.getByTestId('sp-chk-disabled').check();
  await expect(b).toBeDisabled();
  await section.getByTestId('sp-chk-disabled').uncheck();
  await expect(b).toBeEnabled();
});

test('isToggle and the repeat options reach the widget; SmartPasteButton overrides wireEvents so clicked never fires', async ({ app, page }) => {
  const section = app.section('sp-repeat');
  const b = btn(section, 'sp-repeat');
  expect(await widgetProp(b, 'isToggle')).toBe(true);
  expect(await widgetProp(b, 'enableRepeat')).toBe(true);
  expect(await widgetProp(b, 'repeatDelay')).toBe(100);
  expect(await widgetProp(b, 'repeatInterval')).toBe(50);
  await b.scrollIntoViewIfNeeded();
  const box = await b.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(500);
  await page.mouse.up();
  // the button only wires its own click handler: no repeat, no toggle, no clicked event, and no handler call without a form
  await expect(section.getByTestId('sp-repeat-count')).toHaveText('0');
  await expect(b).not.toHaveClass(/e-active/);
  await expect(app.section('sp-form').getByTestId('sp-calls')).toHaveText('0');
});
