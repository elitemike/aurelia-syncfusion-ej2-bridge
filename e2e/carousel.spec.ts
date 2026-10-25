import { test, expect } from './fixtures';
import { wrapperProp, wrapperPath } from './navHelpers';

test.beforeEach(async ({ app }) => app.open('carousel'));

const active = (host) => host.locator('.e-carousel-item.e-active');

test('renders slides with the selected one active, navigators and indicators', async ({ app }) => {
  const host = app.section('c-default').getByTestId('c-default');
  await expect(active(host)).toContainText('Slide 2');
  await expect(host.locator('.e-previous-button')).toBeVisible();
  await expect(host.locator('.e-next-button')).toBeVisible();
  await expect(host.locator('.e-indicator-bar')).toHaveCount(4);
  await expect(host.locator('.e-indicator-bar.e-active')).toHaveAttribute('data-index', '1');
});

test('two-way selectedIndex: view to model with slideChanging and slideChanged', async ({ app }) => {
  const section = app.section('c-default');
  const host = section.getByTestId('c-default');
  await expect(section.getByTestId('c-index')).toHaveText('1');
  await host.locator('.e-next-button').click();
  await expect(section.getByTestId('c-index')).toHaveText('2');
  await expect(section.getByTestId('c-changing')).toHaveText('1');
  await expect(section.getByTestId('c-changed')).toHaveText('1');
  await expect(section.getByTestId('c-current')).toHaveText('1');
  await expect(section.getByTestId('c-next')).toHaveText('2');
  await expect(active(host)).toContainText('Slide 3');
  await host.locator('.e-indicator-bar[data-index="0"] button').click();
  await expect(section.getByTestId('c-index')).toHaveText('0');
});

test('two-way selectedIndex: model to view', async ({ app }) => {
  const section = app.section('c-default');
  await section.getByTestId('c-select-two').click();
  await expect(active(section.getByTestId('c-default'))).toContainText('Slide 3');
  await expect(section.getByTestId('c-index')).toHaveText('2');
});

test('slideChanging can cancel the slide', async ({ app }) => {
  const section = app.section('c-default');
  const host = section.getByTestId('c-default');
  await section.getByTestId('c-block').click();
  await host.locator('.e-indicator-bar[data-index="3"] button').click();
  await expect(section.getByTestId('c-changing')).toHaveText('1');
  await expect(section.getByTestId('c-changed')).toHaveText('0');
  await expect(section.getByTestId('c-index')).toHaveText('1');
  await expect(active(host)).toContainText('Slide 2');
});

test('loop and animationEffect follow the view-model', async ({ app }) => {
  const section = app.section('c-default');
  const host = section.getByTestId('c-default');
  await expect.poll(() => wrapperProp(host, 'loop')).toBe(true);
  await expect(host.locator('.e-carousel')).toHaveClass(/e-carousel-slide-animation/);
  await section.getByTestId('c-fade').click();
  await expect(host.locator('.e-carousel')).toHaveClass(/e-carousel-fade-animation/);
  await section.getByTestId('c-no-loop').click();
  await expect.poll(() => wrapperProp(host, 'loop')).toBe(false);
});

test('autoPlay advances slides, play button toggles and pauseOnHover is bound', async ({ app }) => {
  const section = app.section('c-auto');
  const host = section.getByTestId('c-auto');
  await expect(host.locator('.e-play-pause')).toBeVisible();
  await expect.poll(() => wrapperProp(host, 'interval')).toBe(400);
  await expect.poll(() => wrapperProp(host, 'showPlayButton')).toBe(true);
  await expect.poll(() => wrapperProp(host, 'pauseOnHover')).toBe(true);
  await expect(active(host)).toContainText('Slide 1');
  await section.getByTestId('c-play').click();
  await expect(active(host)).not.toContainText('Slide 1');
  await section.getByTestId('c-no-pause').click();
  await expect.poll(() => wrapperProp(host, 'pauseOnHover')).toBe(false);
});

test('indicatorsType renders each indicator style', async ({ app }) => {
  const section = app.section('c-indicators');
  await expect(section.getByTestId('c-dots').locator('.e-carousel-indicators')).toHaveClass(/e-default/);
  await expect(section.getByTestId('c-dynamic').locator('.e-carousel-indicators')).toHaveClass(/e-dynamic/);
  await expect(section.getByTestId('c-fraction').locator('.e-indicator-bars')).toHaveText('1 / 4');
  await expect(section.getByTestId('c-progress').locator('.e-carousel-indicators')).toHaveClass(/e-progress/);
});

test('showIndicators and buttonsVisibility follow the view-model', async ({ app }) => {
  const section = app.section('c-indicators');
  const host = section.getByTestId('c-dots');
  await expect(host.locator('.e-carousel-indicators')).toBeVisible();
  await section.getByTestId('c-hide-ind').click();
  await expect(host.locator('.e-carousel-indicators')).toHaveCount(0);
  await expect(host.locator('.e-carousel-navigators')).toHaveClass(/e-carousel-navigators/);
  await section.getByTestId('c-hover-btn').click();
  await expect.poll(() => wrapperProp(host, 'buttonsVisibility')).toBe('VisibleOnHover');
  await expect(host.locator('.e-carousel-navigators .e-next')).toHaveClass(/e-hover-arrows/);
});

test('button, indicator and play button templates render custom markup', async ({ app }) => {
  const host = app.section('c-templates').getByTestId('c-templates');
  await expect(host.locator('.c-prev-tpl')).toHaveText('Back');
  await expect(host.locator('.c-next-tpl')).toHaveText('Forward');
  await expect(host.locator('.c-play-tpl')).toHaveText('Play it');
  await expect(host.locator('.c-ind-tpl')).toHaveCount(4);
  await host.locator('.c-next-tpl').click();
  await expect(active(host)).toContainText('Slide 2');
});

test('dataSource with itemTemplate renders records', async ({ app }) => {
  const host = app.section('c-templates').getByTestId('c-data');
  await expect(host.locator('.e-carousel-item.e-active .c-record')).toHaveText('First record');
  await expect(host.locator('.e-indicator-bar')).toHaveCount(3);
});

test('partialVisible, swipeMode, touch swipe and keyboard flags reach the widget', async ({ app }) => {
  const section = app.section('c-misc');
  const host = section.getByTestId('c-misc');
  await expect(host.locator('.e-carousel')).toHaveClass(/e-partial/);
  await section.getByTestId('c-full').click();
  await expect(host.locator('.e-carousel')).not.toHaveClass(/e-partial/);
  await expect.poll(() => wrapperProp(host, 'swipeMode')).toBe('Touch');
  await section.getByTestId('c-mouse').click();
  await expect.poll(() => wrapperProp(host, 'swipeMode')).toBe('Mouse');
  await section.getByTestId('c-no-touch').click();
  await expect.poll(() => wrapperProp(host, 'enableTouchSwipe')).toBe(false);
  await expect.poll(() => wrapperProp(host, 'allowKeyboardInteraction')).toBe(true);
  await section.getByTestId('c-no-keys').click();
  await expect.poll(() => wrapperProp(host, 'allowKeyboardInteraction')).toBe(false);
});

test('cssClass, htmlAttributes, width and height follow the view-model', async ({ app }) => {
  const section = app.section('c-misc');
  const host = section.getByTestId('c-misc');
  const el = host.locator('.e-carousel');
  await expect(el).toHaveClass(/c-one/);
  await expect(el).toHaveAttribute('data-custom', 'yes');
  expect((await el.boundingBox()).width).toBeCloseTo(420, 0);
  await section.getByTestId('c-restyle').click();
  await expect(el).toHaveClass(/c-two/);
  await section.getByTestId('c-resize').click();
  await expect.poll(async () => (await el.boundingBox()).width).toBeCloseTo(300, 0);
  await expect.poll(async () => (await el.boundingBox()).height).toBeCloseTo(90, 0);
  await expect.poll(() => wrapperPath(host, 'width')).toBe('300px');
});
