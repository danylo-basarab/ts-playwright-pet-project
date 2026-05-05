import { test, expect } from "../../fixtures/ui-fixture";
import { ProfilePage } from "../../pages/ProfilePage";
import { SettingsPage } from "../../pages/SettingsPage";
import { HomePage } from "../../pages/HomePage";
import "dotenv/config";

test.describe("Profile Page", () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
  });

  test("check profile icon", async ({ page, loginPage }) => {
    await page.goto(`/profile/danylo`);
    let profileUrl = await profilePage.getProfileIcon();
    expect(profileUrl).toEqual(
      "https://avatars.githubusercontent.com/u/33275488?v=4",
    );
  });

  test("change settings for my profile", async ({ page, loginPage }) => {
    await page.goto(`/profile/danylo`);
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

  test("check logout button", async ({ page, loginPage }) => {
    await page.goto(`/profile/danylo`);
    await profilePage.openEditProfileSettings();
    let settingsPage = new SettingsPage(page);

    await profilePage.openEditProfileSettings();
    await settingsPage.logout();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("ensure tab switcher for 'My Posts' and 'Favorited Posts' works", async ({
    page,
    loginPage,
  }) => {
    await page.goto(`/profile/danylo`);
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
    loginPage,
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

  test("ensure new tab is opened after clicking tag link", async ({
    page,
    loginPage,
  }) => {
    const homePage = new HomePage(page);

    await page.goto("/");
    await homePage.clickTagLink();

    expect(
      (await page.locator(".nav-pills .nav-link.active").textContent())?.trim(),
    ).toEqual("Test");
  });
});
