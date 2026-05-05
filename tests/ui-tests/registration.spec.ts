import { test, expect } from "@playwright/test";
import { RegistrationPage } from "../../pages/RegistrationPage";
import fs from "fs";

const jsonPath = "test-data/registrationData.json";
const registrationData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

test.describe("Registration Page", () => {
  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await page.goto("/register");
  });

  test("page loads with sign up form", async () => {
    await expect(registrationPage.usernameInput).toBeVisible();
    await expect(registrationPage.emailInput).toBeVisible();
    await expect(registrationPage.passwordInput).toBeVisible();
    await expect(registrationPage.signUpButton).toBeVisible();
  });

  test("successful registration", async ({ page }) => {
    await registrationPage.register(registrationPage.generateUser().user);
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("registration with short username and invalid email", async () => {
    await registrationPage.register(registrationData.users[1]);
    const isValidError = await registrationPage.checkErrorMessage([
      "username is too short (minimum is 3 characters)",
      "email is invalid",
    ]);
    expect(isValidError).toBeTruthy();
  });

  test("registration with short username only", async () => {
    await registrationPage.register(registrationData.users[2]);
    const isValidError = await registrationPage.checkErrorMessage([
      "username is too short (minimum is 3 characters)",
    ]);
    expect(isValidError).toBeTruthy();
  });

  test("registration with invalid email only", async () => {
    await registrationPage.register(registrationData.users[3]);
    const isValidError = await registrationPage.checkErrorMessage([
      "email is invalid",
    ]);
    expect(isValidError).toBeTruthy();
  });

  test("registration with empty fields shows error", async () => {
    await registrationPage.register(registrationData.users[4]);
    const isValidError = await registrationPage.checkErrorMessage([
      "username can't be blank",
      "email can't be blank",
      "password can't be blank",
    ]);
    expect(isValidError).toBeTruthy();
  });
});
