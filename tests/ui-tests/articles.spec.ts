import { test, expect } from "../../fixtures/ui-fixture";
import { faker } from "@faker-js/faker";
import { CreateArticlePage } from "../../pages/CreateArticlePage";
import { ViewArticlePage } from "../../pages/ViewArticlePage";
import { HomePage } from "../../pages/HomePage";

test.describe("Interaction with article", () => {
  let createArticlePage: CreateArticlePage;
  let viewArticlePage: ViewArticlePage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    createArticlePage = new CreateArticlePage(page);
    viewArticlePage = new ViewArticlePage(page);
    homePage = new HomePage(page);
  });

  test("create, check, and delete new article", async ({ page, loginPage }) => {
    // Create article
    const article = viewArticlePage.generateArticleData();
    await page.goto("/editor");
    await createArticlePage.publish(
      article.title,
      article.topic,
      article.text,
      article.tags,
    );
    await page.waitForURL(/\/article\//);
    // Check article
    expect(await viewArticlePage.getArticleTitle()).toEqual(article.title);
    expect(await viewArticlePage.getArticleAuthor()).toContain("danylo");
    expect(await viewArticlePage.getArticleText()).toEqual(article.text);

    const tags = await viewArticlePage.getArticleTags();
    expect(tags.map((el) => el.toLowerCase()).sort()).toEqual(
      article.tags.sort(),
    );
    // Clean up: delete article
    await viewArticlePage.deleteArticleFromHeader();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("edit article", async ({ page, loginPage }) => {
    // Create article
    const article = viewArticlePage.generateArticleData();
    await page.goto("/editor");
    await createArticlePage.publish(
      article.title,
      article.topic,
      article.text,
      article.tags,
    );
    await page.waitForURL(/\/article\//);

    // Edit article
    const updatedTitle = `upd title ${Date.now()}`;
    await viewArticlePage.openEditArticleMode();
    await createArticlePage.fillArticleTitle(updatedTitle);
    await createArticlePage.fillArticleTopic("upd topic");
    await createArticlePage.fillArticleText("upd text");
    await createArticlePage.fillArticleTags(["upd tag"]);
    await createArticlePage.clickPublishArticle();
    await page.waitForURL(/\/article\//);
    expect(await viewArticlePage.getArticleTitle()).toEqual(updatedTitle);
    expect(await viewArticlePage.getArticleText()).toEqual("upd text");
    expect(await viewArticlePage.getArticleTags()).toEqual(["upd tag"]);

    // Clean up
    await viewArticlePage.deleteArticleFromHeader();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("add and check comment", async ({ page, loginPage }) => {
    // Create article
    const article = viewArticlePage.generateArticleData();
    await page.goto("/editor");
    await createArticlePage.publish(
      article.title,
      article.topic,
      article.text,
      article.tags,
    );
    await page.waitForURL(/\/article\//);

    // Add comment
    const commentText = `test comment - ${faker.music.album()}`;
    await viewArticlePage.addComment(page.url(), commentText);
    await expect(page.getByPlaceholder("Write a comment...")).toBeEditable();
    const createdCommentText = (
      await viewArticlePage.lastComment.locator("p.card-text").textContent()
    )?.trim();
    expect(createdCommentText).toEqual(commentText);

    // Clean up: delete article
    await viewArticlePage.deleteArticleFromHeader();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });
});
