import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { beforeEach, describe } from "node:test";
import { LoginPage } from "../../pages/LoginPage";
import fs from "fs";

const jsonPath = "test-data/loginData.json";
const loginData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

const urls = [
  "/editor",
  "/settings",
  "/profile/danylo",
  "/profile/danylo/favorites",
  "/article/test-52045",
  "/editor/test-52045",
];

test.describe.skip("guest - a11y tests", async () => {
  for (let url of urls) {
    test(`guest - a11y check for ${url}`, async ({ page }, testInfo) => {
      await page.goto(url);
      await page.waitForTimeout(10000);

      const a11yRes = (await new AxeBuilder({ page }).analyze()).violations;
      const seriousIssues = a11yRes.filter(
        (violation) => violation.impact == "serious",
      );

      expect(seriousIssues).toEqual([]);

      await testInfo.attach("a11y results", {
        body: JSON.stringify(seriousIssues, null, 2),
        contentType: "application/json",
      });
    });
  }
});

test.describe.skip("logged in user - a11y tests", async () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await page.goto("/login");
    await loginPage.login(
      loginData.users[0].email,
      loginData.users[0].password,
    );
  });

  for (let url of urls) {
    test(`logged in user - a11y check for ${url}`, async ({
      page,
    }, testInfo) => {
      await page.goto(url);
      await page.waitForTimeout(10000);

      const a11yRes = (await new AxeBuilder({ page }).analyze()).violations;
      const seriousIssues = a11yRes.filter(
        (violation) => violation.impact == "serious",
      );

      expect(seriousIssues).toEqual([]);

      await testInfo.attach("a11y results", {
        body: JSON.stringify(seriousIssues, null, 2),
        contentType: "application/json",
      });
    });
  }
});
