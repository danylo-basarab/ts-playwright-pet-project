import { test, expect } from "@playwright/test";
import { ProfilePage } from "../../pages/ProfilePage";
import { LoginPage } from "../../pages/LoginPage";
import { SettingsPage } from "../../pages/SettingsPage";
import { HomePage } from "../../pages/HomePage";

test.describe("Profile Page", () => {
  let profilePage: ProfilePage;
  let loginPage: LoginPage;
  let username = "danylo";

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    loginPage = new LoginPage(page);

    await page.goto(`/login`);
    await loginPage.login("danylo@email.com", "12345678");
    await page.waitForURL("https://conduit.bondaracademy.com/");
    await page.goto(`/profile/${username}`);
  });

  test("check profile icon", async () => {
    let profileUrl = await profilePage.getProfileIcon();
    expect(profileUrl).toEqual(
      "https://avatars.githubusercontent.com/u/33275488?v=4",
    );
  });

  test("change settings for my profile", async ({ page }) => {
    await profilePage.openEditProfileSettings();
    let settingsPage = new SettingsPage(page);
    await settingsPage.fillIconUrl(
      "https://avatars.githubusercontent.com/u/33275488?v=4",
    );
    await settingsPage.fillUsername("Danylo");
    await settingsPage.fillUsername("test description 123");
    await settingsPage.fillUsername("danylo@email.com");
    await settingsPage.fillNewPassword("12345678");
    await settingsPage.saveChanges();
  });

  test("check logout button", async ({ page }) => {
    await profilePage.openEditProfileSettings();
    let settingsPage = new SettingsPage(page);

    await profilePage.openEditProfileSettings();
    await settingsPage.logout();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("ensure tab switcher for 'My Posts' and 'Favorited Posts' works", async ({
    page,
  }) => {
    expect
      .soft(await page.getByText("My Posts").getAttribute("class"))
      .toEqual("nav-link active");
    expect
      .soft(await page.getByText("Favorited Posts").getAttribute("class"))
      .toEqual("nav-link");

    await page.getByText("Favorited Posts").click();

    await page.waitForSelector('a.nav-link.active:has-text("Favorited Posts")');

    expect
      .soft(await page.getByText("My Posts").getAttribute("class"))
      .toEqual("nav-link");
    expect
      .soft(await page.getByText("Favorited Posts").getAttribute("class"))
      .toEqual("nav-link active");
  });

  test("ensure tab switcher for 'Your Feed' and 'Global Feed' works", async ({
    page,
  }) => {
    await page.goto("/");
    expect
      .soft(await page.getByText("Your Feed").getAttribute("class"))
      .toEqual("nav-link");
    expect
      .soft(await page.getByText("Global Feed").getAttribute("class"))
      .toEqual("nav-link active");

    await page.getByText("Your Feed").click();

    await page.waitForSelector('a.nav-link.active:has-text("Your Feed")');

    expect
      .soft(await page.getByText("Your Feed").getAttribute("class"))
      .toEqual("nav-link active");
    expect
      .soft(await page.getByText("Global Feed").getAttribute("class"))
      .toEqual("nav-link");
  });

  test("ensure new tab is opened after clicking tag link", async ({ page }) => {
    const homePage = new HomePage(page);

    await page.goto("/");
    await homePage.clickTagLink();

    expect(
      (await page.locator(".nav-pills .nav-link.active").textContent())?.trim(),
    ).toEqual("Test");
  });
});
