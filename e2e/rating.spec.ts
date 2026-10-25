import { test, expect } from './fixtures';
import { widgetProp, widgetProps } from './pickerHelpers';

test.beforeEach(async ({ app }) => app.open('rating'));

test('default renders 5 items and the value is two-way: view to model', async ({ app }) => {
  const section = app.section('rt-basic');
  await expect(section.locator('.e-rating-item-container')).toHaveCount(5);
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(2);
  await expect(section.getByTestId('rt-value-out')).toHaveText('2');
  await section.locator('.e-rating-item-container').nth(3).click();
  await expect(section.getByTestId('rt-value-out')).toHaveText('4');
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(4);
});

test('valueChanged event carries value, previous value and interaction flag', async ({ app }) => {
  const section = app.section('rt-basic');
  const before = Number(await section.getByTestId('rt-change-count').textContent());
  await section.locator('.e-rating-item-container').nth(4).click();
  await expect(section.getByTestId('rt-change-count')).toHaveText(String(before + 1));
  await expect(section.getByTestId('rt-previous')).toHaveText('2');
  await expect(section.getByTestId('rt-interacted')).toHaveText('true');
});

test('value is two-way: model to view', async ({ app }) => {
  const section = app.section('rt-basic');
  await section.getByTestId('rt-set').click();
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(5);
  await expect.poll(() => widgetProp(section.getByTestId('rt-basic'), 'value')).toBe(5);
  await expect(section.getByTestId('rt-change-count')).toHaveText('0');
});

test('onItemHover reports the hovered value', async ({ app }) => {
  const section = app.section('rt-basic');
  await section.locator('.e-rating-item-container').nth(2).hover();
  await expect(section.getByTestId('rt-hover')).toHaveText('3');
});

test('beforeItemRender and created are raised', async ({ app }) => {
  const section = app.section('rt-basic');
  await expect(section.getByTestId('rt-created')).toHaveText('1');
  expect(Number(await section.getByTestId('rt-before').textContent())).toBeGreaterThanOrEqual(5);
});

test('precision: initial half value and switching to Exact', async ({ app }) => {
  const section = app.section('rt-precision');
  const host = section.getByTestId('rt-precision');
  expect(await widgetProps(host, ['precision', 'value'])).toEqual({ precision: 'Half', value: 2.5 });
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(2);
  await expect(section.locator('.e-rating-item-container.e-rating-intermediate')).toHaveCount(1);
  // the left half of the first item selects half a star
  await section.locator('.e-rating-item-container').first().click({ position: { x: 3, y: 10 } });
  await expect.poll(() => widgetProp(host, 'value')).toBe(0.5);
  await section.getByTestId('rt-precision-exact').click();
  await expect.poll(() => widgetProp(host, 'precision')).toBe('Exact');
});

test('itemsCount, min, allowReset and enableSingleSelection', async ({ app }) => {
  const section = app.section('rt-items');
  const host = section.getByTestId('rt-items');
  await expect(section.locator('.e-rating-item-container')).toHaveCount(5);
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(3);
  expect(await widgetProps(host, ['allowReset', 'enableSingleSelection', 'min'])).toEqual({ allowReset: true, enableSingleSelection: false, min: 0 });
  await section.locator('.e-reset').click();
  await expect.poll(() => widgetProp(host, 'value')).toBe(0);
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(0);
  await section.getByTestId('rt-items-change').click();
  await expect(section.locator('.e-rating-item-container')).toHaveCount(8);
  expect(await widgetProps(host, ['min', 'enableSingleSelection'])).toEqual({ min: 1, enableSingleSelection: true });
  await section.locator('.e-rating-item-container').nth(5).click();
  await expect.poll(() => widgetProp(host, 'value')).toBe(6);
  await expect(section.locator('.e-rating-item-container.e-rating-selected')).toHaveCount(1);
});

test('label with template and position', async ({ app }) => {
  const section = app.section('rt-label');
  await expect(section.locator('.rt-label-tpl')).toHaveText('Rated 3');
  await expect(section.locator('.e-rating-label')).toHaveClass(/e-label-right/);
  await section.getByTestId('rt-label-move').click();
  await expect(section.locator('.e-rating-label')).toHaveClass(/e-label-bottom/);
  await section.locator('.e-rating-item-container').nth(4).click();
  await expect(section.locator('.rt-label-tpl')).toHaveText('Rated 5');
});

test('tooltip template is shown on hover', async ({ app, page }) => {
  const section = app.section('rt-label');
  expect(await widgetProp(section.getByTestId('rt-label'), 'showTooltip')).toBe(true);
  await section.locator('.e-rating-item-container').nth(1).hover();
  await expect(page.locator('.rt-tooltip-tpl')).toHaveText('Stars 2');
});

test('empty and full templates replace the icons', async ({ app }) => {
  const section = app.section('rt-templates');
  await expect(section.locator('.rt-full-tpl')).toHaveCount(2);
  await expect(section.locator('.rt-empty-tpl')).toHaveCount(3);
});

test('readOnly, disabled, visible, animation, cssClass and rtl', async ({ app }) => {
  const section = app.section('rt-state');
  const readonly = section.getByTestId('rt-readonly').locator('.e-rating-container');
  await expect(readonly).toHaveClass(/e-rating-readonly/);
  await expect(readonly).toHaveClass(/rt-custom/);
  await expect(readonly).not.toHaveClass(/e-rating-animation/);
  const disabled = section.getByTestId('rt-disabled').locator('.e-rating-container');
  await expect(disabled).toHaveClass(/e-disabled/);
  await expect(disabled).toHaveClass(/e-rating-animation/);
  await expect(disabled).toHaveClass(/e-rtl/);
  await expect(section.getByTestId('rt-visible').locator('.e-rating-container')).not.toHaveClass(/e-rating-hidden/);
  // readonly ignores clicks
  await readonly.locator('.e-rating-item-container').first().click({ force: true });
  expect(await widgetProp(section.getByTestId('rt-readonly'), 'value')).toBe(4);
  await section.getByTestId('rt-state-toggle').click();
  await expect(readonly).not.toHaveClass(/e-rating-readonly/);
  await expect(readonly).toHaveClass(/rt-custom-two/);
  await expect(disabled).not.toHaveClass(/e-disabled/);
  await expect(section.getByTestId('rt-visible').locator('.e-rating-container')).toHaveClass(/e-rating-hidden/);
});
