import { test, expect } from "@playwright/test";
import { ProfilePage } from "../../pages/ProfilePage";
import { LoginPage } from "../../pages/LoginPage";
import { SettingsPage } from "../../pages/SettingsPage";

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
    expect(page).toHaveURL("https://conduit.bondaracademy.com/");
  });
});
