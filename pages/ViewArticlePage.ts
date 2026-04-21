import { Page, Locator } from "@playwright/test";

export class ViewArticlePage {
  readonly page: Page;

  // header
  readonly articleTitle: Locator;
  readonly articleAuthor: Locator;
  readonly editArticleButtonInHeader: Locator;
  readonly deleteArticleButtonInHeader: Locator;
  // main section
  readonly articleText: Locator;
  readonly articleTags: Locator;
  readonly editArticleButtonInMain: Locator;
  readonly deleteArticleButtonInMain: Locator;

  constructor(page: Page) {
    this.page = page;

    this.articleTitle = page.locator("h1");
    //this.articleTopic = page.getByPlaceholder("What's this article about?");
    this.articleText = page.locator(".article-content p");
    this.articleTags = page.locator(".tag-list li");
    this.articleAuthor = page.locator(".banner .author");
    this.deleteArticleButtonInHeader = page.locator(
      ".banner .btn-outline-danger",
    );
  }

  async getArticleTitle() {
    return await this.articleTitle.textContent();
  }

  // async getArticleTopic() {
  //   return await this.articleTopic.textContent();
  // }

  async getArticleText() {
    return await this.articleText.textContent();
  }

  async getArticleTags() {
    return await this.articleTags.allInnerTexts();
  }

  async getArticleAuthor() {
    return await this.articleAuthor.textContent();
  }

  async deleteArticleFromHeader() {
    await this.deleteArticleButtonInHeader.click();
  }
}
