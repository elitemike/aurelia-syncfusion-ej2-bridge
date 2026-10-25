import { test, expect } from './fixtures';
import { propertyGroups, resourceUrlToken } from './pdfViewerProps.data';
import { documentLoaded, evArg, evCount, expectEvent, expectViewer, getVm, setVm, viewerValue } from './pdfViewerHelpers';

test.beforeEach(async ({ app }) => app.open('pdfViewer'));

// ---------------------------------------------------------------- bound properties

test.describe('bound properties reach the widget', () => {
  for (const group of propertyGroups) {
    test(`${group.id}: ${group.props.length} properties`, async ({ app, page }) => {
      const section = app.section(group.id);
      await section.scrollIntoViewIfNeeded();
      await expect(section.locator('.e-pdfviewer')).toBeVisible();
      if (group.id !== 'pv-server') {
        await documentLoaded(page, group.id);
      }
      const origin = new URL(page.url()).origin;
      const checks = group.checks.map(([expr, expected]) =>
        [expr, expected === resourceUrlToken ? `${origin}/scripts/ej2-pdfviewer-lib` : expected] as [string, unknown]);
      // report every mismatching property at once
      await expect.poll(async () => {
        const actual = await page.evaluate(([id, exprs]) => {
          const el: any = document.querySelector(`[data-testid="${id}"]`);
          const w = el.au['ej2-pdf-viewer'].viewModel.widget;
          return (exprs as string[]).map(e => { try { return new Function('w', `return ${e};`)(w); } catch (err) { return `ERR ${err}`; } });
        }, [group.id, checks.map(c => c[0])] as [string, string[]]);
        return checks.map(([expr, expected], i) => JSON.stringify(actual[i]) === JSON.stringify(expected) ? null : `${expr}: expected ${JSON.stringify(expected)} got ${JSON.stringify(actual[i])}`).filter(Boolean);
      }, { timeout: 10_000 }).toEqual([]);
    });
  }
});
