import { UsersApi } from "../../api/UserAPI";
import { test, expect } from "../../fixtures/api-fixture";
import { faker } from "@faker-js/faker";

test.describe("e2e api user flow", async () => {
  test("register user via api", async ({ usersApi }) => {
    const usernameData = faker.animal.bird();
    const emailData = `${usernameData}@email.com`;

    const response = await usersApi.registerUser({
      username: usernameData,
      email: emailData,
      password: "12345678",
    });
    console.log("response: ", response);
  });

  test("update user", async ({ usersApi, token }) => {
    const bio = "updated bio";
    const updatedInfo = await usersApi.updateUserInfo(token, { bio });
    console.log("Updated info: ", updatedInfo);
  });
});
