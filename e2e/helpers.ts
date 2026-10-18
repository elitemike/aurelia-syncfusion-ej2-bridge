import { Locator, Page, expect } from '@playwright/test';

/**
 * Open a Syncfusion popup control and wait until the popup finished animating in.
 * Clicking mid-animation races the popup's own blur handling.
 */
export async function openPopup(page: Page, trigger: Locator, popupSelector = '.e-popup-open') {
  await trigger.click();
  const popup = page.locator(popupSelector).last();
  await expect(popup).toBeVisible();
  await page.waitForTimeout(250);
  return popup;
}

/** Type like a user so Syncfusion key handlers (filtering, autocomplete) fire. */
export async function typeInto(input: Locator, text: string) {
  await input.click();
  await input.pressSequentially(text);
}
