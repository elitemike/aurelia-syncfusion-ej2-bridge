import { test as base, expect, Page } from '@playwright/test';

export class DemoApp {
  readonly errors: string[] = [];

  constructor(readonly page: Page) {
    page.on('pageerror', e => this.errors.push(`pageerror: ${e.message}`));
    page.on('console', m => { if (m.type() === 'error') { this.errors.push(`console: ${m.text()}`); } });
  }

  /** Navigate through the router and wait for the demo content to be composed. */
  async open(route: string) {
    await this.page.goto(`/${route}`);
    await expect(this.page.getByTestId('nav')).toBeVisible();
    await expect(this.page.locator('main router-view > *').first()).toBeAttached();
  }

  section(id: string) {
    return this.page.getByTestId(id);
  }
}

export const test = base.extend<{ app: DemoApp }>({
  app: async ({ page }, use) => {
    const app = new DemoApp(page);
    await mockFileManagerService(page);
    await mockUploadService(page);
    await use(app);
    expect(app.errors, 'unexpected browser errors').toEqual([]);
  }
});

export { expect };

/** The File Manager demo talks to a hosted Syncfusion service, replace it with a deterministic stub. */
async function mockFileManagerService(page: Page) {
  const entry = (name: string, isFile: boolean) => ({
    name, isFile, size: isFile ? 1024 : 0, type: isFile ? '.txt' : '', hasChild: false, filterPath: '\\',
    dateModified: '2024-01-01T00:00:00Z', dateCreated: '2024-01-01T00:00:00Z', permission: null
  });
  await page.route('https://ej2-azure-aspcore-service.azurewebsites.net/**', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    headers: { 'access-control-allow-origin': '*' },
    body: JSON.stringify({
      cwd: { ...entry('Files', false), hasChild: true },
      files: [entry('Documents', false), entry('readme.txt', true)]
    })
  }));
}

/** Upload endpoints used by the uploader demo, there is no backend behind the dev server. */
async function mockUploadService(page: Page) {
  await page.route('**/api/file/**', route => {
    const url = route.request().url();
    const body = url.includes('/upload/')
      ? { id: `id-${Date.now()}`, fileContextId: 'ctx-1', sha256: 'abc123' }
      : {};
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  });
}
