import { Page, Locator } from "@playwright/test";

export class HomePage {
  readonly page: Page;

  readonly navBar: Locator;
  readonly userNavLink: Locator;
  readonly newArticleLink: Locator;
  readonly settingsLink: Locator;
  readonly feedToggle: Locator;
  readonly globalFeedTab: Locator;
  readonly yourFeedTab: Locator;
  readonly articleList: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navBar = page.locator("nav.navbar");
    this.userNavLink = page.locator("nav .nav-item a.nav-link").last();
    this.newArticleLink = page.locator('a[href="/editor"]');
    this.settingsLink = page.locator('a[href="/settings"]');
    this.feedToggle = page.locator(".feed-toggle");
    this.globalFeedTab = page.locator(".feed-toggle a", {
      hasText: "Global Feed",
    });
    this.yourFeedTab = page.locator(".feed-toggle a", { hasText: "Your Feed" });
    this.articleList = page.locator("app-article-list article-preview");
  }

  async isLoggedIn(): Promise<boolean> {
    return this.newArticleLink.isVisible();
  }
}
