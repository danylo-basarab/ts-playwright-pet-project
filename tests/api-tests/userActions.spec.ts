import { timeStamp } from "console";
import { test, expect } from "../../fixtures/api-fixture";
import { faker } from "@faker-js/faker";

test.describe("api - articles", async () => {
  test.describe.configure({ mode: "serial" });

  test("create article", async ({ articlesAPI, token }) => {
    const articleData = {
      title: `title ${faker.book.title()}`,
      description: "test description",
      body: "test text",
      tagList: ["test-tag-1"],
    };

    const responseStatus = await articlesAPI.createArticle(articleData, token);
    expect(responseStatus).toBe(201);
  });

  test("edit article", async ({ articlesAPI, token }) => {
    const updatedData = {
      body: `body text upd`,
      description: `description updated`,
      tagList: ["tag1", "tag2"],
      title: `text updated ${faker.book.title()}`,
    };

    const response = await articlesAPI.editArticle(updatedData, token);
    expect(response).toBe(200);
  });

  test("add comment", async ({ articlesAPI, token }) => {
    const response = await articlesAPI.addComment("test comment 123", token);
    expect(response).toBe(200);
  });

  test("delete comment", async ({ articlesAPI, token }) => {
    const response = await articlesAPI.deleteComment(token);
    expect(response).toBe(200);
  });

  test("favorite article", async ({ articlesAPI, token }) => {
    const response = await articlesAPI.favoriteArticle(
      "Take-the-Next-Step:-Join-Bondar-Academy-Today-and-Enroll-into-the-class-1",
      token,
    );
    expect(response).toBe(200);
  });

  test("unfavorite article", async ({ articlesAPI, token }) => {
    const response = await articlesAPI.unfavoriteArticle(
      "Take-the-Next-Step:-Join-Bondar-Academy-Today-and-Enroll-into-the-class-1",
      token,
    );
    expect(response).toBe(200);
  });

  test("delete article", async ({ articlesAPI, token }) => {
    const response = await articlesAPI.deleteArticle(token);
    expect(response).toBe(204);
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
    expect(response).toBe(201);
  });

  test("follow user", async ({ usersAPI, token }) => {
    const response = await usersAPI.followUser("Artem Bondar", token);
    expect(response).toBe(200);
  });

  test("unfollow user", async ({ usersAPI, token }) => {
    const response = await usersAPI.unfollowUser("Artem Bondar", token);
    expect(response).toBe(200);
  });

  test("update user", async ({ usersAPI, token }) => {
    const requestBody = {
      bio: "updated bio 123",
    };

    const response = await usersAPI.updateUserInfo(token, requestBody);
    expect(response).toBe(200);
  });
});
