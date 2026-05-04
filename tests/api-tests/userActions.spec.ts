import { timeStamp } from "console";
import { test, expect } from "../../fixtures/api-fixture";
import { faker } from "@faker-js/faker";

test.describe("api - articles", () => {
  let articleData;

  test.beforeEach("generate article data", async ({ articlesAPI }) => {
    articleData = articlesAPI.generateArticleData();
  });
  test("create article", async ({ articlesAPI, token }) => {
    const created = await articlesAPI.createArticle(articleData, token);
    expect(created.article).toBeDefined();
    expect(created.article.title).toBe(articleData.title);
    expect(created.article.description).toBe(articleData.description);
    expect(created.article.body).toBe(articleData.body);
    // Clean up
    const deleted = await articlesAPI.deleteArticle(
      token,
      created.article.slug,
    );
    expect(deleted).toEqual(204);
  });

  test("edit article", async ({ articlesAPI, token }) => {
    const created = await articlesAPI.createArticle(articleData, token);
    const updatedData = {
      body: `body text upd - ${faker.lorem.sentence()}`,
      description: `description updated - ${faker.lorem.words(2)}`,
      tagList: [faker.word.sample(), faker.word.sample()],
      title: `text updated - ${Date.now()}`,
    };
    const response = await articlesAPI.editArticle(
      updatedData,
      token,
      created.article.slug,
    );
    expect(response.article).toBeDefined();
    expect(response.article.title).toBe(updatedData.title);
    expect(response.article.body).toBe(updatedData.body);
    // Clean up
    const deleted = await articlesAPI.deleteArticle(
      token,
      response.article.slug,
    );
    expect(deleted).toEqual(204);
  });

  test("add and delete comment", async ({ articlesAPI, token }) => {
    const created = await articlesAPI.createArticle(articleData, token);
    const commentText = `test comment ${Date.now()} - ${faker.lorem.sentence()}`;
    const comment = await articlesAPI.addComment(
      commentText,
      token,
      created.article.slug,
    );
    expect(comment.comment).toBeDefined();
    expect(comment.comment.body).toBe(commentText);
    // Delete comment
    const delResp = await articlesAPI.deleteComment(
      token,
      created.article.slug,
      comment.comment.id,
    );
    expect(delResp).toBe(200);
    // Clean up
    const deleted = await articlesAPI.deleteArticle(
      token,
      created.article.slug,
    );
    expect(deleted).toEqual(204);
  });

  test("favorite and unfavorite article", async ({ articlesAPI, token }) => {
    const created = await articlesAPI.createArticle(articleData, token);
    // Favorite
    const favResp = await articlesAPI.favoriteArticle(
      created.article.slug,
      token,
    );
    expect(favResp.article).toBeDefined();
    expect(favResp.article.favorited).toBe(true);
    // Unfavorite
    const unfavResp = await articlesAPI.unfavoriteArticle(
      created.article.slug,
      token,
    );
    expect(unfavResp.article).toBeDefined();
    expect(unfavResp.article.favorited).toBe(false);
    // Clean up
    const deleted = await articlesAPI.deleteArticle(
      token,
      created.article.slug,
    );
    expect(deleted).toEqual(204);
  });
});

test.describe("api - users", () => {
  test("register user", async ({ usersAPI }) => {
    const usernameData = `user - ${Date.now()}`;
    const emailData = `${usernameData}@email.com`;

    const userData = {
      username: usernameData,
      email: emailData,
      password: "12345678",
    };
    const response = await usersAPI.registerUser(userData);

    expect(response.user).toBeDefined();
    expect(response.user.username).toBe(userData.username);
    expect(response.user.email).toBe(userData.email);
    expect(response.user.token).toBeDefined();
  });

  test("follow user", async ({ usersAPI, token }) => {
    const response = await usersAPI.followUser("Artem Bondar", token);

    expect(response.profile).toBeDefined();
  });

  test("unfollow user", async ({ usersAPI, token }) => {
    const response = await usersAPI.unfollowUser("Artem Bondar", token);

    expect(response.profile).toBeDefined();
  });

  test("update user", async ({ usersAPI, token }) => {
    const requestBody = { bio: `updated bio ${faker.lorem.sentence()}` };

    const response = await usersAPI.updateUserInfo(token, requestBody);

    expect(response.user).toBeDefined();
    expect(response.user.bio).toBe(requestBody.bio);
  });
});
