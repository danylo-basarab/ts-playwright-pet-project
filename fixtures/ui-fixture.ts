import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CreateArticlePage } from "../pages/CreateArticlePage";
import { ViewArticlePage } from "../pages/viewArticlePage";
import fs from "fs";

const jsonPath = "test-data/loginData.json";
const loginData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

type UiFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<UiFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await page.goto(`/login`);
    await loginPage.login(
      loginData.users[0].email,
      loginData.users[0].password,
    );
    await page.waitForURL("https://conduit.bondaracademy.com/");
    await use(loginPage);
  },
});

export { expect } from "@playwright/test";
