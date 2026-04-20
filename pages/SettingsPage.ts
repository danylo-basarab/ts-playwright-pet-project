import { Page, Locator } from "@playwright/test";

export class SettingsPage {
  readonly page: Page;

  readonly iconUrlInput: Locator;
  readonly usernameInput: Locator;
  readonly bioInut: Locator;
  readonly emailInput: Locator;
  readonly newPasswordInput: Locator;
  readonly updateSettingsButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.iconUrlInput = page.getByPlaceholder("URL of profile picture");
    this.usernameInput = page.getByPlaceholder("Username");
    this.bioInut = page.getByPlaceholder("Short bio about you");
    this.emailInput = page.getByLabel("Email");
    this.newPasswordInput = page.getByLabel("New Password");
    this.updateSettingsButton = page.getByText("Update Settings");
    this.logoutButton = page.getByText(" Or click here to logout. ");
  }

  async fillIconUrl(iconUrl: string) {
    await this.iconUrlInput.fill(iconUrl);
  }

  async fillUsername(username: string) {
    await this.iconUrlInput.fill(username);
  }
  async fillBio(bio: string) {
    await this.iconUrlInput.fill(bio);
  }

  async fillEmail(email: string) {
    await this.iconUrlInput.fill(email);
  }

  async fillNewPassword(newPassword: string) {
    await this.iconUrlInput.fill(newPassword);
  }

  async saveChanges() {
    await this.updateSettingsButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
