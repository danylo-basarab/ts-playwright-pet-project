import { test as base } from "@playwright/test";
import { UserApi } from "../api/UserAPI";
import { ArticleApi } from "../api/ArticleAPI";

type ApiFixtures = {
  usersAPI: UserApi;
  articlesAPI: ArticleApi;
  token: string;
};

export const test = base.extend<ApiFixtures>({
  token: async ({ request }, use) => {
    const usersAPI = new UserApi(request);
    const authToken = await usersAPI.loginUser({
      email: "danylo@email.com",
      password: "12345678",
    });
    await use(authToken);
  },

  usersAPI: async ({ request }, use) => {
    const usersAPI = new UserApi(request);
    await use(usersAPI);
  },

  articlesAPI: async ({ request }, use) => {
    const articleAPI = new ArticleApi(request);
    await use(articleAPI);
  },
});

export { expect } from "@playwright/test";
