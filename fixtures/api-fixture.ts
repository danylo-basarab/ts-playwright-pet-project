import { test as base } from "@playwright/test";
import { UsersApi } from "../api/UserAPI";

type ApiFixtures = {
  usersApi: UsersApi;
  token: string;
};

export const test = base.extend<ApiFixtures>({
  token: async ({ request }, use) => {
    const usersAPI = new UsersApi(request);
    const authToken = await usersAPI.loginUser({
      email: "danylo@email.com",
      password: "12345678",
    });
    await use(authToken);
  },

  usersApi: async ({ request, token }, use) => {
    const usersAPI = new UsersApi(request);
    await use(usersAPI);
  },
});

export { expect } from "@playwright/test";
