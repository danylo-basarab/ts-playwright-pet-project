import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly errorMessages: Locator;
  readonly needAnAccountLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.signInButton = page.locator('button[type="submit"]');
    this.errorMessages = page.locator(".error-messages li");
    this.needAnAccountLink = page.getByText("Need an account?");
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSignIn() {
    await this.signInButton.click();
  }

  async login(email: string, password: string) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  async goToSignUp() {
    await this.needAnAccountLink.click();
  }

  async getErrorMessages(): Promise<string[]> {
    await this.errorMessages.first().waitFor({ state: "visible" });
    return this.errorMessages.allTextContents();
  }
}
