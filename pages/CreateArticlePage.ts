import { Page, Locator } from "@playwright/test";

export class CreateArticlePage {
  readonly page: Page;

  readonly articleTitleInput: Locator;
  readonly articleTopicInput: Locator;
  readonly articleTextInput: Locator;
  readonly articleTagsInput: Locator;
  readonly publishArticleButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.articleTitleInput = page.getByPlaceholder("Article Title");
    this.articleTopicInput = page.getByPlaceholder(
      "What's this article about?",
    );
    this.articleTextInput = page.getByPlaceholder(
      "Write your article (in markdown)",
    );
    this.articleTagsInput = page.getByPlaceholder("Enter tags");
    this.publishArticleButton = page.getByText("Publish Article");
  }

  async fillArticleTitle(articleTitle: string) {
    await this.articleTitleInput.fill(articleTitle);
  }

  async fillArticleTopic(articleTopic: string) {
    await this.articleTopicInput.fill(articleTopic);
  }
  async fillArticleText(articleText: string) {
    await this.articleTextInput.fill(articleText);
  }

  async fillArticleTags(articleTags: string[]) {
    for (let tag of articleTags) {
      await this.articleTagsInput.fill(tag);
      await this.page.keyboard.press("Enter");
    }
  }

  async clickPublishArticle() {
    await this.publishArticleButton.click();
  }

  async publish(
    articleTitle: string,
    articleTopic: string,
    articleText: string,
    articleTags: string[],
  ) {
    await this.fillArticleTitle(articleTitle);
    await this.fillArticleTopic(articleTopic);
    await this.fillArticleText(articleText);
    await this.fillArticleTags(articleTags);
    await this.clickPublishArticle();
  }
}
