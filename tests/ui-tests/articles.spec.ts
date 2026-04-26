import { test, expect } from "../../fixtures/ui-fixture";
import { CreateArticlePage } from "../../pages/CreateArticlePage";
import { ViewArticlePage } from "../../pages/ViewArticlePage";
import { faker } from "@faker-js/faker";
import { HomePage } from "../../pages/HomePage";

let urlOfCreatedArticle: string;
let expectedCommentText: string;

test.describe("New Article Page", () => {
  let createArticlePage: CreateArticlePage;
  let viewArticlePage: ViewArticlePage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    createArticlePage = new CreateArticlePage(page);
    viewArticlePage = new ViewArticlePage(page);
  });

  test("create, check and delete new article", async ({ page, loginPage }) => {
    //create article
    await page.goto("/editor");
    let articleTitle = "New title " + faker.animal.petName();

    await createArticlePage.publish(articleTitle, "New topic", "New text", [
      "tag1",
      "tag2",
    ]);

    //check created article
    await expect
      .soft(page)
      .toHaveURL(/https:\/\/conduit\.bondaracademy\.com\/article\/([^\/]+)/);
    expect.soft(await viewArticlePage.getArticleTitle()).toEqual(articleTitle);
    expect.soft(await viewArticlePage.getArticleAuthor()).toContain("danylo");
    expect.soft(await viewArticlePage.getArticleText()).toEqual("New text");
    expect
      .soft(await viewArticlePage.getArticleTags())
      .toEqual(["Tag1", "tag2"]);

    //edit article
    await viewArticlePage.openEditArticleMode();
    await createArticlePage.fillArticleTitle("upd title");
    await createArticlePage.fillArticleTopic("upd topic");
    await createArticlePage.fillArticleText("upd text");
    await createArticlePage.fillArticleTags(["upd tag"]);
    await createArticlePage.clickPublishArticle();

    //check edited article
    await expect
      .soft(page)
      .toHaveURL(/https:\/\/conduit\.bondaracademy\.com\/article\/([^\/]+)/);
    expect.soft(await viewArticlePage.getArticleTitle()).toEqual("upd title");
    expect.soft(await viewArticlePage.getArticleText()).toEqual("upd text");
    expect.soft(await viewArticlePage.getArticleTags()).toEqual(["upd tag"]);

    //delete article
    urlOfCreatedArticle = page.url();

    await page.goto(urlOfCreatedArticle);
    await viewArticlePage.deleteArticleFromHeader();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("check navigation links", async ({ page, loginPage }) => {
    homePage = new HomePage(page);
    await homePage.clickProfileLink();
    await expect(page).toHaveURL(
      /https:\/\/conduit\.bondaracademy\.com\/profile\/([^\/]+)/,
    );
    await homePage.clickLogoLink();
    await expect.soft(page).toHaveURL("https://conduit.bondaracademy.com/");
    await homePage.clickSettingsLink();
    await expect
      .soft(page)
      .toHaveURL("https://conduit.bondaracademy.com/settings");
    await homePage.clickHomeLink();
    await expect.soft(page).toHaveURL("https://conduit.bondaracademy.com");
    await homePage.clickNewArticleLink();
    await expect
      .soft(page)
      .toHaveURL("https://conduit.bondaracademy.com/editor");
  });
});

test.describe("comments", async () => {
  test.describe.configure({ mode: "serial" });
  test("add and check comment", async ({ page, loginPage }) => {
    const viewArticlePage = new ViewArticlePage(page);
    expectedCommentText = `test comment - ${faker.music.album()}`;

    await viewArticlePage.addComment(
      "https://conduit.bondaracademy.com/article/Take-the-Next-Step:-Join-Bondar-Academy-Today-and-Enroll-into-the-class-1",
      expectedCommentText,
    );

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
    expect(createdCommentAuthor).toEqual("danylo");
    expect(createdCommentDate).toEqual(currentDate);
  });

  test("delete comment", async ({ page, loginPage }) => {
    const viewArticlePage = new ViewArticlePage(page);

    const actualCommentText = (
      await viewArticlePage.getLastCommentText(
        "https://conduit.bondaracademy.com/article/Take-the-Next-Step:-Join-Bondar-Academy-Today-and-Enroll-into-the-class-1",
      )
    )?.trim();

    expect(actualCommentText).toEqual(expectedCommentText);

    await viewArticlePage.deleteComment(
      "https://conduit.bondaracademy.com/article/Take-the-Next-Step:-Join-Bondar-Academy-Today-and-Enroll-into-the-class-1",
      0,
    );
    await page.waitForResponse(
      /^https:\/\/conduit-api\.bondaracademy\.com\/api\/articles\/[^\/]+\/comments\/\d+$/,
    );

    await expect(page.getByText(expectedCommentText)).not.toBeVisible();
  });
});
