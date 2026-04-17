import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { HomePage } from "../../pages/HomePage";
import fs from "fs";

const jsonPath = "test-data/loginData.json";
const loginData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

test.describe("Login Page", () => {
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    await page.goto("/login");
  });

  test("page loads with sign in form", async () => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test("successful login", async ({ page }) => {
    await loginPage.login(
      loginData.users[0].email,
      loginData.users[0].password,
    );
    await page.waitForURL("https://conduit.bondaracademy.com/");

    expect(await homePage.isLoggedIn()).toBeTruthy();
  });

  test("login with wrong password shows error", async () => {
    await loginPage.login(
      loginData.users[2].email,
      loginData.users[2].password,
    );

    const errors = await loginPage.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("email or password is invalid");
  });

  test("login with empty fields shows error", async () => {
    await loginPage.login(
      loginData.users[1].email,
      loginData.users[1].password,
    );

    const errors = await loginPage.getErrorMessages();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain("email can't be blank");
  });

  test("sign up link navigates to register page", async ({ page }) => {
    await loginPage.goToSignUp();

    await expect(page).toHaveURL("https://conduit.bondaracademy.com/register");
  });
});
