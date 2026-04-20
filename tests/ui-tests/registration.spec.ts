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

  test.skip("successful registration", async ({ page }) => {
    await registrationPage.register(
      registrationData.users[0].username,
      registrationData.users[0].email,
      registrationData.users[0].password,
    );
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  // validation of invalid flows
  test("registration with short username and invalid email", async () => {
    await registrationPage.register(
      registrationData.users[1].username,
      registrationData.users[1].email,
      registrationData.users[1].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "username is too short (minimum is 3 characters)",
      "email is invalid",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with short username only", async () => {
    await registrationPage.register(
      registrationData.users[2].username,
      registrationData.users[2].email,
      registrationData.users[2].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "username is too short (minimum is 3 characters)",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with all blank fields", async () => {
    await registrationPage.register(
      registrationData.users[3].username,
      registrationData.users[3].email,
      registrationData.users[3].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "email can't be blank",
      "username can't be blank",
      "password can't be blank",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with blank username", async () => {
    await registrationPage.register(
      registrationData.users[4].username,
      registrationData.users[4].email,
      registrationData.users[4].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "username can't be blank",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with blank email", async () => {
    await registrationPage.register(
      registrationData.users[5].username,
      registrationData.users[5].email,
      registrationData.users[5].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "email can't be blank",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with blank password", async () => {
    await registrationPage.register(
      registrationData.users[6].username,
      registrationData.users[6].email,
      registrationData.users[6].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "password can't be blank",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with taken username", async () => {
    await registrationPage.register(
      registrationData.users[7].username,
      registrationData.users[7].email,
      registrationData.users[7].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "username has already been taken",
    ]);

    expect(isValidError).toBeTruthy();
  });

  test("registration with taken email", async () => {
    await registrationPage.register(
      registrationData.users[8].username,
      registrationData.users[8].email,
      registrationData.users[8].password,
    );

    const isValidError = await registrationPage.checkErrorMessage([
      "email has already been taken",
    ]);

    expect(isValidError).toBeTruthy();
  });
});
