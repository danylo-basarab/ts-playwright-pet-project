import { test, expect } from "../../fixtures/ui-fixture";
import { faker } from "@faker-js/faker";

import { CreateArticlePage } from "../../pages/CreateArticlePage";
import { ViewArticlePage } from "../../pages/ViewArticlePage";
import { HomePage } from "../../pages/HomePage";

let urlOfCreatedArticle: string;
let expectedCommentText: string;

const BASE_URL = "https://conduit.bondaracademy.com";
const STATIC_ARTICLE_URL =
  "https://conduit.bondaracademy.com/article/Take-the-Next-Step:-Join-Bondar-Academy-Today-and-Enroll-into-the-class-1";
const USERNAME = "danylo";

test.describe("Interaction with article", () => {
  test.describe.configure({ mode: "serial" });

  let createArticlePage: CreateArticlePage;
  let viewArticlePage: ViewArticlePage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    createArticlePage = new CreateArticlePage(page);
    viewArticlePage = new ViewArticlePage(page);
    homePage = new HomePage(page);
  });

  test("create, check new article", async ({ page, loginPage }) => {
    //create article
    await page.goto("/editor");
    let articleTitle = "New title " + Date.now();

    await createArticlePage.publish(articleTitle, "New topic", "New text", [
      "tag1",
      "tag2",
    ]);

    //check created article
    await page.waitForURL(/\/article\//);
    expect(await viewArticlePage.getArticleTitle()).toEqual(articleTitle);
    expect(await viewArticlePage.getArticleAuthor()).toContain(USERNAME);
    expect(await viewArticlePage.getArticleText()).toEqual("New text");
    expect(await viewArticlePage.getArticleTags()).toEqual(["Tag1", "tag2"]);

    urlOfCreatedArticle = page.url();
  });

  test("edit and check existing article", async ({ page, loginPage }) => {
    //edit article
    const articleUpdatedTitle = `upd title ${Date.now()}`;

    await page.goto(urlOfCreatedArticle);

    await viewArticlePage.openEditArticleMode();
    await createArticlePage.fillArticleTitle(articleUpdatedTitle);
    await createArticlePage.fillArticleTopic("upd topic");
    await createArticlePage.fillArticleText("upd text");
    await createArticlePage.fillArticleTags(["upd tag"]);
    await createArticlePage.clickPublishArticle();

    //check edited article
    await page.waitForURL(/\/article\//);
    expect
      .soft(await viewArticlePage.getArticleTitle())
      .toEqual(articleUpdatedTitle);
    expect.soft(await viewArticlePage.getArticleText()).toEqual("upd text");
    expect.soft(await viewArticlePage.getArticleTags()).toEqual(["upd tag"]);

    urlOfCreatedArticle = page.url();
  });

  test("delete existing article", async ({ page, loginPage }) => {
    //delete article
    await page.goto(urlOfCreatedArticle);
    await viewArticlePage.deleteArticleFromHeader();
    await page.waitForURL(BASE_URL + "/");
  });

  test("like article", async ({ page, loginPage }) => {
    await viewArticlePage.likeArticle(STATIC_ARTICLE_URL);
    await page.waitForResponse(/favorite/);
    await expect(viewArticlePage.unlikeArticleInHeader).toBeVisible();
  });

  test("unlike article", async ({ page, loginPage }) => {
    await viewArticlePage.unlikeArticle(STATIC_ARTICLE_URL);
    await page.waitForResponse(/favorite/);
    await expect(viewArticlePage.likeArticleInHeader).toBeVisible();
  });

  test("follow author", async ({ page, loginPage }) => {
    await viewArticlePage.followAuthor(STATIC_ARTICLE_URL);
    await page.waitForResponse(/follow/);
    await expect(viewArticlePage.unfollowAuthorInHeader).toBeVisible();
  });

  test("unfollow author", async ({ page, loginPage }) => {
    await viewArticlePage.unfollowAuthor(STATIC_ARTICLE_URL);
    await page.waitForResponse(/follow/);
    await expect(viewArticlePage.followAuthorInHeader).toBeVisible();
  });

  test("add and check comment", async ({ page, loginPage }) => {
    expectedCommentText = `test comment - ${faker.music.album()}`;

    await viewArticlePage.addComment(STATIC_ARTICLE_URL, expectedCommentText);

    await expect(page.getByPlaceholder("Write a comment...")).toBeEditable();

    const createdCommentText = (
      await viewArticlePage.lastComment.locator("p.card-text").textContent()
    )?.trim();
    const createdCommentAuthor = (
      await viewArticlePage.lastComment
        .locator("a.comment-author")
        .last()
        .textContent()
    )?.trim();
    const createdCommentDate = (
      await viewArticlePage.lastComment.locator(".date-posted").textContent()
    )?.trim();

    const now = new Date();
    const currentDate = now.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });

    expect(createdCommentText).toEqual(expectedCommentText);
    expect(createdCommentAuthor).toEqual(USERNAME);
    expect(createdCommentDate).toEqual(currentDate);
  });

  test("delete comment", async ({ page, loginPage }) => {
    const actualCommentText = (
      await viewArticlePage.getLastCommentText(STATIC_ARTICLE_URL)
    )?.trim();

    expect(actualCommentText).toEqual(expectedCommentText);

    await viewArticlePage.deleteComment(STATIC_ARTICLE_URL, 0);
    await page.waitForResponse(
      /^https:\/\/conduit-api\.bondaracademy\.com\/api\/articles\/[^\/]+\/comments\/\d+$/,
    );

    await expect(page.getByText(expectedCommentText)).not.toBeVisible();
  });

  test("check navigation links", async ({ page, loginPage }) => {
    await homePage.clickProfileLink();
    await expect(page).toHaveURL(new RegExp(`${BASE_URL}/profile/([^/]+)`));
    await homePage.clickLogoLink();
    await expect(page).toHaveURL(BASE_URL + "/");
    await homePage.clickSettingsLink();
    await expect(page).toHaveURL(BASE_URL + "/settings");
    await homePage.clickHomeLink();
    await expect(page).toHaveURL(BASE_URL);
    await homePage.clickNewArticleLink();
    await expect(page).toHaveURL(BASE_URL + "/editor");
  });
});
