import { test, expect } from './fixtures';
import { host, inst, hostId, eventCount, eventLast, center } from './vizHelpers';

test.beforeEach(async ({ app }) => app.open('sankey'));

const STORE = '__sankeyEvents';
const fired = (page, name: string) => expect.poll(() => eventCount(page, STORE, name), { message: name }).toBeGreaterThan(0);

/** Nodes, links and labels of a sankey, located through the host id. */
async function parts(section, testId: string) {
  const el = host(section, testId);
  const id = await hostId(el);
  return {
    el, id,
    nodes: el.locator(`rect[id^="${id}_node_level_"]`),
    links: el.locator(`path[id^="${id}_link_level_"]`),
    labels: el.locator(`text[id^="${id}_label_level_"]`),
    legendTexts: el.locator(`text[id^="${id}_chart_legend_text_"]`),
    legendShapes: el.locator(`path[id^="${id}_chart_legend_shape_"]`),
    node: (nodeId: string) => el.locator(`rect[id^="${id}_node_level_"][aria-label="${nodeId}"]`),
    link: (from: string, to: string) => el.locator(`path[id^="${id}_link_level_"][data-source="${from}"][data-target="${to}"]`)
  };
}

test.describe('default sample', () => {
  test('renders nodes, links, labels, title and subtitle from the bound data', async ({ app }) => {
    const p = await parts(app.section('sk-basic'), 'sk-basic');
    await expect(p.nodes).toHaveCount(6);
    await expect(p.links).toHaveCount(5);
    await expect(p.labels).toHaveCount(6);
    await expect(p.el.locator(`#${p.id}_title`)).toHaveText('Energy flow');
    await expect(p.el.locator(`#${p.id}_subtitle`)).toHaveText('Terawatt hours');
    await expect(p.link('Gas', 'Grid')).toHaveAttribute('data-value', '40');
    expect(await inst(p.el, w => [w.nodes.length, w.links.length, w.title, w.subTitle])).toEqual([6, 5, 'Energy flow', 'Terawatt hours']);
  });

  test('titleStyle and subTitleStyle format the headings, margin shifts the diagram', async ({ app }) => {
    const p = await parts(app.section('sk-basic'), 'sk-basic');
    const title = p.el.locator(`#${p.id}_title`);
    await expect(title).toHaveAttribute('fill', '#264b73');
    await expect(title).toHaveAttribute('font-size', '18px');
    await expect(title).toHaveAttribute('font-weight', '600');
    await expect(p.el.locator(`#${p.id}_subtitle`)).toHaveAttribute('fill', '#666666');
    expect(await inst(p.el, w => [w.margin.left, w.margin.right, w.titleStyle.textAlignment, w.subTitleStyle.fontStyle])).toEqual([20, 20, 'Center', 'italic']);
    const node = await p.node('Solar').boundingBox();
    const svg = await p.el.locator(`#${p.id}_svg`).boundingBox();
    expect(node.x - svg.x).toBeGreaterThanOrEqual(20);
  });

  test('node colors come from the nodes, nodeRendering can override the fill', async ({ app }) => {
    const p = await parts(app.section('sk-basic'), 'sk-basic');
    await expect(p.node('Solar')).toHaveAttribute('fill', '#f9a825');
    await expect(p.node('Gas')).toHaveAttribute('fill', '#8d6e63');
    await expect(p.node('Homes')).toHaveAttribute('fill', '#ff00ff'); // set by the nodeRendering handler
  });

  test('legend lists the nodes with their colors', async ({ app }) => {
    const p = await parts(app.section('sk-basic'), 'sk-basic');
    await expect(p.legendTexts).toHaveCount(6);
    await expect(p.legendTexts.first()).toHaveText('Solar power');
    await expect(p.legendShapes.first()).toHaveAttribute('fill', '#f9a825');
    expect(await inst(p.el, w => [w.legendSettings.position, w.legendSettings.title, w.legendSettings.width, w.legendSettings.height,
      w.legendSettings.enableHighlight, w.legendSettings.shapeWidth, w.legendSettings.background, w.legendSettings.border.color]))
      .toEqual(['Bottom', 'Sources', '60%', '40px', true, 12, '#f5f5f5', '#cccccc']);
    await expect(p.el.locator(`#${p.id}_chart_legend_title`)).toHaveText('Sources');
  });

  test('load, loaded, nodeRendering, linkRendering, labelRendering and legendItemRendering events', async ({ app, page }) => {
    const section = app.section('sk-basic');
    for (const id of ['sk-load', 'sk-loaded', 'sk-node-rendering', 'sk-link-rendering', 'sk-label-rendering', 'sk-legend-rendering']) {
      await expect(section.getByTestId(id)).not.toHaveText('0');
    }
    expect(await eventLast(page, STORE, 'legendItemRendering')).toMatchObject({ text: expect.any(String) });
    expect(await eventLast(page, STORE, 'nodeRendering')).toMatchObject({ fill: expect.any(String) });
  });

  test('labelRendering can rewrite the label text', async ({ app }) => {
    const p = await parts(app.section('sk-basic'), 'sk-basic');
    await expect(p.labels.filter({ hasText: 'Factories' })).toHaveCount(1);
    await expect(p.labels.filter({ hasText: 'Industry' })).toHaveCount(0);
  });

  test('tooltip is enabled and animation disabled on the widget', async ({ app }) => {
    const p = await parts(app.section('sk-basic'), 'sk-basic');
    expect(await inst(p.el, w => [w.tooltip.enable, w.tooltip.nodeFormat, w.tooltip.linkFormat, w.animation.enable, w.tooltip.fadeOutMode, w.tooltip.duration]))
      .toEqual([true, '$name carries $value', '$start.name to $target.name : $value', false, 'Move', 100]);
  });
});

test.describe('customization', () => {
  test('nodeStyle, linkStyle, labelSettings, border, background and theme', async ({ app }) => {
    const p = await parts(app.section('sk-style'), 'sk-style');
    const node = p.node('Solar');
    await expect(node).toHaveAttribute('fill', '#9e9e9e');
    await expect(node).toHaveAttribute('stroke', '#222222');
    await expect(node).toHaveAttribute('stroke-width', '2');
    await expect(node).toHaveAttribute('opacity', '0.9');
    await expect(node).toHaveAttribute('width', '24');
    const link = p.link('Solar', 'Grid');
    await expect(link).toHaveAttribute('opacity', '0.5');
    await expect(link).toHaveAttribute('fill', '#5c6bc0'); // colorType Target takes the color of the Grid node
    const label = p.labels.first();
    await expect(label).toHaveAttribute('fill', '#aa0000');
    await expect(label).toHaveAttribute('font-family', 'Georgia');
    await expect(label).toHaveAttribute('font-weight', '700');
    const border = p.el.locator(`#${p.id}_border`);
    await expect(border).toHaveAttribute('stroke', '#336699');
    await expect(border).toHaveAttribute('fill', '#fffde7');
    expect(await inst(p.el, w => [w.theme, w.background, w.linkStyle.curvature, w.linkStyle.highlightOpacity, w.linkStyle.inactiveOpacity,
      w.nodeStyle.padding, w.labelSettings.padding, w.labelSettings.fontStyle, w.labelSettings.visible]))
      .toEqual(['Bootstrap5', '#fffde7', 0.8, 0.9, 0.1, 20, 12, 'italic', true]);
  });

  test('vertical orientation lays the nodes out as rows, linkStyle colorType Source and backgroundImage', async ({ app }) => {
    const p = await parts(app.section('sk-style'), 'sk-vertical');
    const box = await p.node('Solar').boundingBox();
    expect(box.width).toBeGreaterThan(box.height);
    await expect(p.link('Solar', 'Grid')).toHaveAttribute('fill', '#f9a825'); // Source color
    await expect(p.link('Solar', 'Grid')).toHaveAttribute('opacity', '0.6');
    await expect(p.el.locator('image')).toHaveCount(1);
    expect(await inst(p.el, w => [w.orientation, w.backgroundImage.indexOf('data:image/svg+xml') === 0])).toEqual(['Vertical', true]);
  });
});

test.describe('legend', () => {
  test('legendSettings position, reverse and legendItemHover', async ({ app, page }) => {
    const section = app.section('sk-legend');
    const p = await parts(section, 'sk-legend');
    await expect(p.legendTexts).toHaveCount(6);
    expect(await inst(p.el, w => [w.legendSettings.position, w.legendSettings.reverse, w.legendSettings.isInversed])).toEqual(['Right', true, true]);
    // reversed: the first node is listed last
    await expect(p.legendTexts.last()).toHaveText('Solar power');
    const legendBox = await p.legendTexts.first().boundingBox();
    const nodeBox = await p.node('Solar').boundingBox();
    expect(legendBox.x).toBeGreaterThan(nodeBox.x); // to the right of the diagram
    const { x, y } = await center(p.legendTexts.first());
    await page.mouse.move(x - 15, y);
    await page.mouse.move(x, y, { steps: 4 });
    await expect(section.getByTestId('sk-legend-hover')).not.toHaveText('0');
    await expect(section.getByTestId('sk-legend-hover-id')).not.toHaveText('');
    await fired(page, 'legendItemHover');
  });
});

test.describe('interaction', () => {
  test('hovering a node raises nodeEnter, tooltipRendering and shows the tooltip, leaving raises nodeLeave', async ({ app, page }) => {
    const section = app.section('sk-interaction');
    const p = await parts(section, 'sk-interaction');
    const grid = p.node('Grid');
    const { x, y } = await center(grid);
    await page.mouse.move(x + 100, y + 100);
    await page.mouse.move(x, y, { steps: 5 });
    await expect(section.getByTestId('sk-node-enter')).not.toHaveText('0');
    await expect(section.getByTestId('sk-node-enter-id')).toHaveText('Grid');
    await expect(section.getByTestId('sk-tooltip-rendering')).not.toHaveText('0');
    await expect(p.el.locator(`#${p.id}_tooltip_parent_text`)).toHaveText(/Power grid.*carries.*90/);
    await page.mouse.move(x - 150, y + 150, { steps: 5 });
    await expect(section.getByTestId('sk-node-leave')).not.toHaveText('0');
  });

  test('clicking a node raises nodeClick with the node', async ({ app }) => {
    const section = app.section('sk-interaction');
    const p = await parts(section, 'sk-interaction');
    const { x, y } = await center(p.node('Wind'));
    await section.page().mouse.click(x, y);
    await expect(section.getByTestId('sk-node-click')).not.toHaveText('0');
    await expect(section.getByTestId('sk-node-click-id')).toHaveText('Wind');
  });

  test('hovering and clicking a link raises linkEnter, linkLeave and linkClick', async ({ app, page }) => {
    const section = app.section('sk-interaction');
    const p = await parts(section, 'sk-interaction');
    const { x, y } = await center(p.link('Gas', 'Grid'));
    await page.mouse.move(x + 60, y + 140);
    await page.mouse.move(x, y, { steps: 5 });
    await expect(section.getByTestId('sk-link-enter')).not.toHaveText('0');
    await expect(section.getByTestId('sk-link-enter-id')).toHaveText('Gas>Grid');
    await expect(p.el.locator(`#${p.id}_tooltip_parent_text`)).toHaveText(/Natural gas.*to.*Power grid.*40/);
    await page.mouse.click(x, y);
    await expect(section.getByTestId('sk-link-click')).not.toHaveText('0');
    await expect(section.getByTestId('sk-link-click-id')).toHaveText('Gas>Grid');
    await page.mouse.move(x + 60, y + 140, { steps: 5 });
    await expect(section.getByTestId('sk-link-leave')).not.toHaveText('0');
  });
});

test.describe('export and accessibility', () => {
  test('export raises beforeExport and afterExport, beforeExport can cancel', async ({ app }) => {
    const section = app.section('sk-export');
    await section.getByTestId('sk-export-png').click();
    await expect(section.getByTestId('sk-before-export')).toHaveText('1');
    await expect(section.getByTestId('sk-after-export')).toHaveText('1');
    await section.getByTestId('sk-export-svg').click();
    await expect(section.getByTestId('sk-before-export')).toHaveText('2');
    await expect(section.getByTestId('sk-after-export')).toHaveText('2');
    await section.getByTestId('sk-export-cancel').click();
    await expect(section.getByTestId('sk-before-export')).toHaveText('3');
    await expect(section.getByTestId('sk-after-export')).toHaveText('2'); // cancelled, no afterExport
  });

  test('enableExport and allowExport reach the widget, exportCompleted is registered but never raised by Syncfusion', async ({ app, page }) => {
    const section = app.section('sk-export');
    const el = host(section, 'sk-export');
    expect(await inst(el, w => [w.enableExport, w.allowExport, !!w.sankeyExportModule])).toEqual([true, true, true]);
    // Sankey declares exportCompleted but nothing in the control triggers it: assert the bridge forwards what is raised
    await section.getByTestId('sk-export-png').click();
    await expect(section.getByTestId('sk-after-export')).toHaveText('1');
    expect(await eventCount(page, STORE, 'exportCompleted')).toBe(0);
  });

  test('print raises beforePrint', async ({ app }) => {
    const section = app.section('sk-export');
    await section.getByTestId('sk-print').click();
    await expect(section.getByTestId('sk-before-print')).toHaveText('1');
  });

  test('sizeChanged is raised when the container width changes', async ({ app, page }) => {
    const section = app.section('sk-export');
    await expect(host(section, 'sk-export').locator('svg').first()).toBeVisible();
    await page.setViewportSize({ width: 800, height: 700 });
    await expect(section.getByTestId('sk-size-changed')).not.toHaveText('0');
    await expect(section.getByTestId('sk-size-width')).toHaveText(/^\d+$/);
  });

  test('accessibility settings and focus border settings reach the element and widget', async ({ app }) => {
    const el = host(app.section('sk-export'), 'sk-export');
    await expect(el).toHaveAttribute('role', 'figure');
    await expect(el).toHaveAttribute('tabindex', '3');
    await expect(el).toHaveAttribute('aria-label', 'Energy flow diagram');
    expect(await inst(el, w => [w.focusBorderColor, w.focusBorderWidth, w.focusBorderMargin, w.accessibility.focusable]))
      .toEqual(['#ff6600', 3, 4, true]);
  });
});

test('model to widget: links, orientation, theme, title and width follow the view-model', async ({ app }) => {
  const section = app.section('sk-dynamic');
  const p = await parts(section, 'sk-dynamic');
  await expect(p.link('Wind', 'Grid')).toHaveCount(1);
  await expect(p.links).toHaveCount(5);
  await section.getByTestId('sk-swap').click();
  await expect(p.links).toHaveCount(4);
  await expect(p.link('Wind', 'Grid')).toHaveAttribute('data-value', '10');
  const before = await p.node('Solar').boundingBox();
  await section.getByTestId('sk-vertical').click();
  await expect.poll(async () => { const b = await p.node('Solar').boundingBox(); return b.width > b.height; }).toBe(true);
  expect(before.height).toBeGreaterThan(before.width);
  await section.getByTestId('sk-dark').click();
  await expect.poll(() => inst(p.el, w => w.theme)).toBe('Bootstrap5Dark');
  await section.getByTestId('sk-rename').click();
  await expect(p.el.locator(`#${p.id}_title`)).toHaveText('Renamed');
  await section.getByTestId('sk-narrow').click();
  await expect(p.el.locator(`#${p.id}_svg`)).toHaveAttribute('width', '500');
});
