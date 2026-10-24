import { test, expect } from './fixtures';
import { chartHost, inst } from './chartHelpers';
import { gallery } from '../dev-app/chart/chartSeriesDemo';

test.beforeEach(async ({ app }) => app.open('chart'));

// the module each series type needs on the chart instance, proves the wrapper injected it from the options
const moduleOf = (type: string) => {
  const base = type.replace('100', '');
  return base.charAt(0).toLowerCase() + base.slice(1) + 'SeriesModule';
};

test.describe('series types (Syncfusion series samples)', () => {
  for (const g of gallery) {
    test(`${g.id}`, async ({ app }) => {
      const host = chartHost(app.section(`chart-series-${g.id}`));
      await expect(host.locator('svg[id$="_svg"]')).toBeVisible();
      await expect(host.locator('[id*="_Series_0"]').first()).toBeAttached();
      const type = g.series[0].type;
      expect(await inst(host, (c) => c.visibleSeries[0].type)).toBe(type);
      expect(await inst(host, (c) => c.visibleSeries[0].points.length)).toBeGreaterThan(0);
      expect(await inst(host, (c) => c.visibleSeries.length)).toBe(type === 'Pareto' ? 2 : g.series.length); // Pareto adds its cumulative line
      const mod = moduleOf(type);
      expect(await host.evaluate((el: any, m: string) => !!el.ej2_instances[0][m], mod), `${mod} injected`).toBe(true);
    });
  }
});
