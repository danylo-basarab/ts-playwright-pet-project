import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  readonly logoLink: Locator;
  readonly homeLink: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;
  readonly profileLink: Locator;
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logoLink = page.locator(".navbar-brand");
    this.homeLink = page.locator(".navbar li:has-text('Home')");
    this.newArticleLink = page.locator('a[href="/editor"]');
    this.settingsLink = page.locator('a[href="/settings"]');
    this.profileLink = page.locator(".navbar .nav-link").last();
    this.globalFeedTab = page.locator("a:has-text('Global Feed')");
    this.yourFeedTab = page.locator("a:has-text('Your Feed')");
  }

  async isLoggedIn(): Promise<boolean> {
    return this.newArticleLink.isVisible();
  }

  async clickLogoLink() {
    await this.logoLink.click();
  }
  async clickHomeLink() {
    await this.homeLink.click();
  }
  async clickNewArticleLink() {
    await this.newArticleLink.click();
  }
  async clickSettingsLink() {
    await this.settingsLink.click();
  }
  async clickProfileLink() {
    await this.profileLink.click();
  }
}
