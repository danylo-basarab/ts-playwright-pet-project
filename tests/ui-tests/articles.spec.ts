import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { CreateArticlePage } from "../../pages/CreateArticlePage";
import { ViewArticlePage } from "../../pages/ViewArticlePage";
import { faker } from "@faker-js/faker";

import { HomePage } from "../../pages/HomePage";

let urlOfCreatedArticle: string;

test.describe("New Article Page", () => {
  let loginPage: LoginPage;
  let newArticlePage: CreateArticlePage;
  let viewArticlePage: ViewArticlePage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    newArticlePage = new CreateArticlePage(page);
    viewArticlePage = new ViewArticlePage(page);

    await page.goto(`/login`);
    await loginPage.login("danylo@email.com", "12345678");
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("create, check and delete new article", async ({ page }) => {
    //create article
    await page.goto("/editor");
    let articleTitle = "New title " + faker.animal.petName();

    await newArticlePage.publish(articleTitle, "New topic", "New text", [
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

    //delete article
    urlOfCreatedArticle = page.url();

    await page.goto(urlOfCreatedArticle);
    await viewArticlePage.deleteArticleFromHeader();
    await page.waitForURL("https://conduit.bondaracademy.com/");
  });

  test("check navigation links", async ({ page }) => {
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
