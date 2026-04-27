import { test, expect } from "@playwright/test";
import fs from "fs";

const jsonPath = "test-data/snapshots.json";
const snapshots = JSON.parse(fs.readFileSync(jsonPath, "utf-8")).snapshots;

test.describe.skip("snapshots testing", async () => {
  for (let record of snapshots) {
    test(`snapshot testing - ${record.page}`, async ({ page }) => {
      await page.goto(record.url);
      await page.waitForSelector(".article-preview");

      await expect(page).toHaveScreenshot(record.snapshot, {
        fullPage: true,
      });
    });
  }
});
