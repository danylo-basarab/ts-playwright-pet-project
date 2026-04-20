import { test, expect } from "@playwright/test";
import { LoginPage } from "../../pages/LoginPage";
import { CreateArticlePage } from "../../pages/CreateArticlePage";
import { ViewArticlePage } from "../../pages/ViewArticlePage";
import { faker } from "@faker-js/faker";

test.describe("New Article Page", () => {
  let loginPage: LoginPage;
  let newArticlePage: CreateArticlePage;
  let viewArticlePage: ViewArticlePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    newArticlePage = new CreateArticlePage(page);
    viewArticlePage = new ViewArticlePage(page);

    await page.goto(`/login`);
    await loginPage.login("danylo@email.com", "12345678");
    await page.waitForURL("https://conduit.bondaracademy.com/");
    await page.goto("/editor");
  });

  test("create and check new article", async ({ page }) => {
    let articleTitle = "New title " + faker.animal.petName();

    await newArticlePage.publish(articleTitle, "New topic", "New text", [
      "tag1",
      "tag2",
    ]);
    await expect(page).toHaveURL(
      /https:\/\/conduit\.bondaracademy\.com\/article\/([^\/]+)/,
    );

    expect(await viewArticlePage.getArticleTitle()).toEqual(articleTitle);
    expect(await viewArticlePage.getArticleAuthor()).toContain("danylo");
    expect(await viewArticlePage.getArticleText()).toEqual("New text");
    expect(await viewArticlePage.getArticleTags()).toEqual(["Tag1", "tag2"]);
  });
});
