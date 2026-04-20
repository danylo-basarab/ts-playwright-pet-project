import { Page, Locator } from "@playwright/test";

export class RegistrationPage {
  readonly page: Page;

  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signUpButton: Locator;
  readonly errorMessages: Locator;

  constructor(page: Page) {
    this.page = page;

    this.usernameInput = page.getByPlaceholder("Username");
    this.emailInput = page.getByPlaceholder("Email");
    this.passwordInput = page.getByPlaceholder("Password");
    this.signUpButton = page.locator('[type="submit"]');
    this.errorMessages = page.locator(".error-messages li");
  }

  async fillUsername(username: string) {
    await this.usernameInput.fill(username);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignUp() {
    await this.signUpButton.click();
  }

  async register(username: string, email: string, password: string) {
    await this.fillUsername(username);
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignUp();
  }

  // errors validation

  async getErrorMessages(): Promise<string[]> {
    await this.errorMessages.first().waitFor({ state: "visible" });
    return this.errorMessages.allTextContents();
  }

  async checkErrorMessage(expectedErrors: string[]) {
    await this.errorMessages.first().waitFor({ state: "visible" });
    const errors = await this.errorMessages.allTextContents();

    for (let error of errors) {
      if (!expectedErrors.includes(error)) {
        return false;
      }
    }
    return true;
  }
}
