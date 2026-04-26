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
  // comments
  readonly commentInput: Locator;
  readonly addCommentButton: Locator;
  readonly lastComment: Locator;
  readonly deleteCommentButton: Locator;

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
    this.editArticleButtonInHeader = page.locator(
      '.banner a:has-text("Edit Article")',
    );
    this.commentInput = page.getByPlaceholder("Write a comment...");
    this.addCommentButton = page.getByText("Post Comment");
    this.lastComment = page.locator("app-article-comment .card").last();
    this.deleteCommentButton = page.locator(".ion-trash-a");
  }

  async getArticleTitle() {
    const title = await this.articleTitle.textContent();
    return title?.trim();
  }

  // async getArticleTopic() {
  //   return await this.articleTopic.textContent();
  // }

  async getArticleText() {
    const text = await this.articleText.textContent();
    return text?.trim();
  }

  async getArticleTags() {
    const tags = await this.articleTags.allInnerTexts();
    tags.forEach((value) => value.trim());
    console.log(tags);
    return tags;
  }

  async getArticleAuthor() {
    const author = await this.articleAuthor.textContent();
    return author?.trim();
  }

  async deleteArticleFromHeader() {
    await this.deleteArticleButtonInHeader.click();
  }

  async openEditArticleMode() {
    await this.editArticleButtonInHeader.click();
  }

  async addComment(articleLink: string, commentText: string) {
    await this.page.goto(articleLink);
    await this.commentInput.fill(commentText);
    await this.addCommentButton.click();
  }

  async getLastCommentText(articleLink: string) {
    await this.page.goto(articleLink);
    return await this.lastComment.locator(".card-text").textContent();
  }

  async deleteComment(articleLink: string, commentNumber: number) {
    await this.page.goto(articleLink);
    await this.deleteCommentButton.nth(commentNumber).click();
  }
}
