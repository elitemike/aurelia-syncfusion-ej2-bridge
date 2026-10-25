import { test, expect } from './fixtures';
import { wrapperProp, wrapperPath } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('tab'));

const headers = (root) => root.locator('.e-tab-header .e-toolbar-item');

test('renders headers and the content of the selected tab', async ({ app }) => {
  const host = app.section('tab-default').getByTestId('tab-default');
  await expect(headers(host)).toHaveCount(4);
  await expect(headers(host).nth(1)).toHaveClass(/e-active/);
  await expect(host.locator('.e-content .e-item.e-active', { hasText: 'Facebook content' })).toBeVisible();
});

test('two-way selectedItem: view to model with selecting and selected events', async ({ app }) => {
  const section = app.section('tab-default');
  await expect(section.getByTestId('tab-index')).toHaveText('1');
  await headers(section).nth(2).click();
  await expect(section.getByTestId('tab-index')).toHaveText('2');
  await expect(section.getByTestId('tab-selecting')).toHaveText('1');
  await expect(section.getByTestId('tab-last-selecting')).toHaveText('2');
  await expect(section.getByTestId('tab-selected')).toHaveText('1');
  await expect(section.locator('.e-content .e-item.e-active', { hasText: 'WhatsApp content' })).toBeVisible();
});

test('two-way selectedItem: model to view', async ({ app }) => {
  const section = app.section('tab-default');
  await section.getByTestId('tab-select-two').click();
  await expect(headers(section).nth(2)).toHaveClass(/e-active/);
  await expect(section.locator('.e-content .e-item.e-active', { hasText: 'WhatsApp content' })).toBeVisible();
  await expect(section.getByTestId('tab-index')).toHaveText('2');
});

test('keyboard navigation writes selectedItem back', async ({ app, page }) => {
  const section = app.section('tab-default');
  await headers(section).nth(1).locator('.e-tab-wrap').focus();
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  await expect(section.getByTestId('tab-index')).toHaveText('2');
});

test('selecting can be cancelled', async ({ app }) => {
  const section = app.section('tab-default');
  await section.getByTestId('tab-block').click();
  await headers(section).nth(3).click();
  await expect(section.getByTestId('tab-selecting')).toHaveText('1');
  await expect(section.getByTestId('tab-last-selecting')).toHaveText('3');
  await expect(section.getByTestId('tab-selected')).toHaveText('0');
  await expect(section.getByTestId('tab-index')).toHaveText('1');
  await expect(headers(section).nth(1)).toHaveClass(/e-active/);
});

test('created and destroyed events with if.bind', async ({ app }) => {
  const section = app.section('tab-default');
  await expect(section.getByTestId('tab-created')).toHaveText('1');
  await section.getByTestId('tab-toggle').click();
  await expect(section.locator('.e-tab')).toHaveCount(0);
  await expect(section.getByTestId('tab-destroyed')).toHaveText('1');
  await section.getByTestId('tab-toggle').click();
  await expect(section.getByTestId('tab-created')).toHaveText('2');
  await expect(headers(section)).toHaveCount(4);
  await expect(headers(section).nth(1)).toHaveClass(/e-active/);
});

test('headerPlacement, heightAdjustMode, cssClass, width and height follow the view-model', async ({ app }) => {
  const section = app.section('tab-layout');
  const tab = section.locator('.e-tab');
  await expect(tab).toHaveClass(/tab-one/);
  const header = tab.locator('.e-tab-header');
  const content = tab.locator('.e-content');
  expect((await header.boundingBox()).y).toBeLessThan((await content.boundingBox()).y);
  await section.getByTestId('tab-bottom').click();
  await expect.poll(async () => (await header.boundingBox()).y > (await content.boundingBox()).y).toBe(true);
  await section.getByTestId('tab-fill').click();
  await expect.poll(async () => (await tab.boundingBox()).height).toBeCloseTo(240, 0);
  await expect.poll(() => wrapperProp(section.getByTestId('tab-layout'), 'heightAdjustMode')).toBe('Fill');
  await section.getByTestId('tab-restyle').click();
  await expect(tab).toHaveClass(/tab-two/);
  await section.getByTestId('tab-resize').click();
  await expect.poll(async () => (await tab.boundingBox()).width).toBeCloseTo(320, 0);
  await expect.poll(() => wrapperProp(section.getByTestId('tab-layout'), 'height')).toBe('180px');
});

test('Scrollable overflow shows arrows and scrollStep is bound', async ({ app }) => {
  const section = app.section('tab-overflow');
  const host = section.getByTestId('tab-scrollable');
  await expect.poll(() => wrapperProp(host, 'overflowMode')).toBe('Scrollable');
  await expect(host.locator('.e-scroll-right-nav')).toBeVisible();
  const bar = host.locator('.e-hscroll-bar');
  const before = await bar.evaluate((el) => el.scrollLeft);
  await host.locator('.e-scroll-right-nav').click();
  await expect.poll(() => bar.evaluate((el) => el.scrollLeft)).toBeGreaterThan(before);
  await expect.poll(() => wrapperProp(host, 'scrollStep')).toBe(40);
  await section.getByTestId('tab-step').click();
  await expect.poll(() => wrapperProp(host, 'scrollStep')).toBe(100);
});

test('Popup, MultiRow and Extended overflow', async ({ app, page }) => {
  const section = app.section('tab-overflow');
  const popup = section.getByTestId('tab-popup');
  await expect(popup.locator('.e-hor-nav')).toBeVisible();
  await popup.locator('.e-hor-nav').click();
  await expect(page.locator('.e-toolbar-pop.e-popup-open .e-toolbar-item').first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(section.getByTestId('tab-multirow').locator('.e-toolbar-multirow')).toBeAttached();
  await expect(section.getByTestId('tab-extended').locator('.e-extended-toolbar')).toBeAttached();
});

test('showCloseButton closes tabs and raises removing and removed', async ({ app }) => {
  const section = app.section('tab-closable');
  const host = section.getByTestId('tab-closable');
  await expect(host.locator('.e-close-icon')).toHaveCount(4);
  await headers(host).nth(0).hover();
  await headers(host).nth(0).locator('.e-close-icon').click();
  await expect(headers(host)).toHaveCount(3);
  await expect(section.getByTestId('tab-removing')).toHaveText('1');
  await expect(section.getByTestId('tab-removed')).toHaveText('1');
  await expect(section.getByTestId('tab-removed-header')).toContainText('Twitter');
});

test('removing can be cancelled', async ({ app }) => {
  const section = app.section('tab-closable');
  const host = section.getByTestId('tab-closable');
  await section.getByTestId('tab-block-remove').click();
  await headers(host).nth(0).locator('.e-close-icon').click();
  await expect(section.getByTestId('tab-removing')).toHaveText('1');
  await expect(section.getByTestId('tab-removed')).toHaveText('0');
  await expect(headers(host)).toHaveCount(4);
});

test('addTab and removeTab raise adding, added, removing and removed', async ({ app }) => {
  const section = app.section('tab-closable');
  const host = section.getByTestId('tab-closable');
  await section.getByTestId('tab-add').click();
  await expect(headers(host)).toHaveCount(5);
  await expect(headers(host).nth(1)).toContainText('Added 1');
  await expect(section.getByTestId('tab-adding')).toHaveText('1');
  await expect(section.getByTestId('tab-added')).toHaveText('1');
  await section.getByTestId('tab-remove').click();
  await expect(headers(host)).toHaveCount(4);
  await expect(section.getByTestId('tab-removed')).toHaveText('1');
});

test('reorderActiveTab moves a tab picked from the popup into the visible headers', async ({ app, page }) => {
  const section = app.section('tab-reorder');
  const host = section.getByTestId('tab-reorder');
  await expect.poll(() => wrapperProp(host, 'reorderActiveTab')).toBe(false);
  await section.getByTestId('tab-reorder-on').click();
  await expect.poll(() => wrapperProp(host, 'reorderActiveTab')).toBe(true);
  await host.locator('.e-hor-nav').click();
  const pop = page.locator('.e-toolbar-pop.e-popup-open');
  await expect(pop).toBeVisible();
  await page.waitForTimeout(250);
  await pop.locator('.e-toolbar-item', { hasText: 'Tab number 8' }).click();
  await expect(headers(host).nth(1)).toContainText('Tab number 8');
  await expect(headers(host).nth(1)).toHaveClass(/e-active/);
});

test('loadOn Demand renders bodies when selected, Init renders them all', async ({ app }) => {
  const section = app.section('tab-load');
  const demand = section.getByTestId('tab-demand');
  const init = section.getByTestId('tab-init');
  await expect(demand.locator('.e-content .e-item', { hasText: 'content' })).toHaveCount(1);
  await headers(demand).nth(2).click();
  await expect(demand.locator('.e-content .e-item.e-active', { hasText: 'WhatsApp content' })).toBeVisible();
  await expect(init.locator('.e-content .e-item', { hasText: 'content' })).toHaveCount(4);
  await expect.poll(() => wrapperProp(demand, 'loadOn')).toBe('Demand');
  await section.getByTestId('tab-init-mode').click();
  await expect.poll(() => wrapperProp(demand, 'loadOn')).toBe('Init');
  await expect.poll(() => wrapperProp(demand, 'clearTemplates')).toBe(true);
  await section.getByTestId('tab-keep').click();
  await expect.poll(() => wrapperProp(demand, 'clearTemplates')).toBe(false);
});

test('allowDragAndDrop raises onDragStart, dragging and dragged and reorders headers', async ({ app, page }) => {
  const section = app.section('tab-drag');
  const host = section.getByTestId('tab-drag');
  await expect.poll(() => wrapperProp(host, 'allowDragAndDrop')).toBe(true);
  await expect.poll(() => wrapperProp(host, 'dragArea')).toBe('#tab-drag-area');
  await headers(host).nth(0).scrollIntoViewIfNeeded();
  const from = await headers(host).nth(0).boundingBox();
  const to = await headers(host).nth(2).boundingBox();
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 10, from.y + from.height / 2, { steps: 5 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(section.getByTestId('tab-drag-start')).toHaveText('1');
  await expect(section.getByTestId('tab-dragging')).not.toHaveText('0');
  await expect(section.getByTestId('tab-dragged')).toHaveText('1');
  await expect(headers(host).nth(0)).not.toContainText('Twitter');
});

test('enableHtmlSanitizer strips inline handlers from tab content', async ({ app }) => {
  const section = app.section('tab-misc');
  await expect(section.getByTestId('tab-safe').locator('.tab-safe')).not.toHaveAttribute('onmouseover', /.*/);
  await expect(section.getByTestId('tab-unsafe').locator('.tab-safe')).toHaveAttribute('onmouseover', /__tabxss/);
  await section.getByTestId('tab-unsanitize').click();
  await expect.poll(() => wrapperProp(section.getByTestId('tab-safe'), 'enableHtmlSanitizer')).toBe(false);
});

test('animation and swipeMode reach the widget', async ({ app }) => {
  const section = app.section('tab-misc');
  const host = section.getByTestId('tab-safe');
  await expect.poll(() => wrapperPath(host, 'animation.next.effect')).toBe('None');
  await expect.poll(() => wrapperProp(host, 'swipeMode')).toBe('Touch');
  await section.getByTestId('tab-swipe').click();
  await expect.poll(() => wrapperProp(host, 'swipeMode')).toBe('Mouse');
});
