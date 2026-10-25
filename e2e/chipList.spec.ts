import { test, expect } from './fixtures';
import { widgetProp } from './misc-widget-helpers';

test.beforeEach(async ({ app }) => app.open('chipList'));

test('basic: chips render with css class, created is raised', async ({ app }) => {
  const section = app.section('chip-basic');
  await expect(section.getByTestId('chip-created')).toHaveText('1');
  const chips = section.getByTestId('chip-basic').locator('.e-chip');
  await expect(chips).toHaveCount(3);
  await expect(chips.locator('.e-chip-text')).toHaveText(['Small', 'Medium', 'Large']);
  await expect(chips.first()).toHaveClass(/chip-basic-class/);
});

test('basic: beforeClick and click events carry the chip data', async ({ app }) => {
  const section = app.section('chip-basic');
  await section.getByTestId('chip-basic').locator('.e-chip', { hasText: 'Medium' }).click();
  await expect(section.getByTestId('chip-before-click')).toHaveText('1');
  await expect(section.getByTestId('chip-click')).toHaveText('1');
  await expect(section.getByTestId('chip-last')).toHaveText('Medium');
});

test('basic: cancelling beforeClick suppresses click', async ({ app }) => {
  const section = app.section('chip-basic');
  await section.getByTestId('chip-chk-cancel').check();
  await section.getByTestId('chip-basic').locator('.e-chip', { hasText: 'Large' }).click();
  await expect(section.getByTestId('chip-before-click')).toHaveText('1');
  await expect(section.getByTestId('chip-click')).toHaveText('0');
});

test('basic: chips and enabled follow the view-model', async ({ app }) => {
  const section = app.section('chip-basic');
  const chips = section.getByTestId('chip-basic').locator('.e-chip');
  await section.getByTestId('chip-add').click();
  await expect(chips).toHaveCount(4);
  await expect(chips.last().locator('.e-chip-text')).toHaveText('Chip 4');
  await section.getByTestId('chip-chk-enabled').uncheck();
  await expect(chips.first()).toHaveClass(/e-disabled/);
  expect(await widgetProp(section.getByTestId('chip-basic'), 'enabled')).toBe(false);
  await section.getByTestId('chip-chk-enabled').check();
  await expect(chips.first()).not.toHaveClass(/e-disabled/);
});

test('single selection: selectedChips is two-way', async ({ app }) => {
  const section = app.section('chip-single');
  const chips = section.getByTestId('chip-single').locator('.e-chip');
  expect(await widgetProp(section.getByTestId('chip-single'), 'selection')).toBe('Single');
  await expect(chips.nth(0)).toHaveClass(/e-active/);
  // view to model
  await chips.nth(1).click();
  await expect(chips.nth(1)).toHaveClass(/e-active/);
  await expect(chips.nth(0)).not.toHaveClass(/e-active/);
  await expect(section.getByTestId('chip-single-out')).toHaveText('1');
  // model to view
  await section.getByTestId('chip-single-set').click();
  await expect(chips.nth(2)).toHaveClass(/e-active/);
  await expect(chips.nth(1)).not.toHaveClass(/e-active/);
});

test('multiple selection: selectedChips is a two-way array', async ({ app }) => {
  const section = app.section('chip-multiple');
  const chips = section.getByTestId('chip-multiple').locator('.e-chip');
  await expect(chips.nth(1)).toHaveClass(/e-active/);
  await chips.nth(2).click();
  await expect(chips.nth(2)).toHaveClass(/e-active/);
  await expect(chips.nth(1)).toHaveClass(/e-active/);
  await expect(section.getByTestId('chip-multiple-out')).toHaveText('[1,2]');
  await chips.nth(1).click();
  await expect(section.getByTestId('chip-multiple-out')).toHaveText('[2]');
  await section.getByTestId('chip-multiple-set').click();
  await expect(chips.nth(0)).toHaveClass(/e-active/);
  await expect(chips.nth(3)).toHaveClass(/e-active/);
  await expect(chips.nth(2)).not.toHaveClass(/e-active/);
});

test('single chip: text, avatars, icons, images and html attributes', async ({ app }) => {
  const section = app.section('chip-icons');
  const avatarText = section.getByTestId('chip-avatar-text').locator('.e-chip');
  await expect(avatarText.locator('.e-chip-text')).toHaveText('Anne');
  await expect(avatarText.locator('.e-chip-avatar')).toHaveText('AN');
  // Syncfusion v35 stores htmlAttributes on the widget, it is not copied to the chip element
  expect(await widgetProp(section.getByTestId('chip-avatar-text'), 'htmlAttributes')).toEqual({ 'data-chip': 'anne' });
  await expect(section.getByTestId('chip-avatar-icon').locator('.e-chip-avatar')).toHaveClass(/e-user/);
  await expect(section.getByTestId('chip-leading').locator('.e-chip-icon')).toHaveClass(/e-star-filled/);
  await expect(section.getByTestId('chip-trailing').locator('.e-chip-delete')).toHaveClass(/e-close/);
  await expect(section.getByTestId('chip-leading-url').locator('.e-chip-avatar.image-url')).toHaveCSS('background-image', /data:image\/gif/);
  await expect(section.getByTestId('chip-trailing-url').locator('.trailing-icon-url')).toHaveCSS('background-image', /data:image\/gif/);
});

test('enableDelete: the delete icon raises delete then deleted and removes the chip', async ({ app }) => {
  const section = app.section('chip-delete');
  const chips = section.getByTestId('chip-delete').locator('.e-chip');
  await expect(chips).toHaveCount(3);
  await chips.nth(1).locator('.e-chip-delete').click();
  await expect(chips).toHaveCount(2);
  await expect(chips.locator('.e-chip-text')).toHaveText(['Apple', 'Banana']);
  await expect(section.getByTestId('chip-delete-count')).toHaveText('1');
  await expect(section.getByTestId('chip-deleted')).toHaveText('1');
});

test('enableDelete: cancelling delete keeps the chip', async ({ app }) => {
  const section = app.section('chip-delete');
  const chips = section.getByTestId('chip-delete').locator('.e-chip');
  await section.getByTestId('chip-chk-protect').check();
  await chips.nth(0).locator('.e-chip-delete').click();
  await expect(section.getByTestId('chip-delete-count')).toHaveText('1');
  await expect(chips).toHaveCount(3);
  await expect(section.getByTestId('chip-deleted')).toHaveText('0');
});

test('allowDragAndDrop raises the drag events within dragArea', async ({ app, page }) => {
  const section = app.section('chip-drag');
  expect(await widgetProp(section.getByTestId('chip-drag'), 'allowDragAndDrop')).toBe(true);
  expect(await widgetProp(section.getByTestId('chip-drag'), 'dragArea')).toBe('#chip-drag-area');
  const chip = section.getByTestId('chip-drag').locator('.e-chip', { hasText: 'Red' });
  await chip.scrollIntoViewIfNeeded();
  const box = await chip.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + 60, box.y + 40, { steps: 6 });
  await page.mouse.move(box.x + 120, box.y + 60, { steps: 6 });
  await page.mouse.up();
  await expect(section.getByTestId('chip-drag-start')).toHaveText('1');
  await expect(section.getByTestId('chip-drag-stop')).toHaveText('1');
  expect(Number(await section.getByTestId('chip-dragging').textContent())).toBeGreaterThan(0);
});
