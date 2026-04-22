// api/ArticlesApi.ts
import { APIRequestContext } from "@playwright/test";

export class UsersApi {
  constructor(private request: APIRequestContext) {}

  async registerUser(body: {
    username: string;
    email: string;
    password: string;
  }) {
    const response = await this.request.post(
      "https://conduit-api.bondaracademy.com/api/users",
      {
        data: { user: body },
      },
    );
    return response.status();
  }

  async loginUser(body: { email: string; password: string }) {
    const loginResponse = await this.request.post(
      "https://conduit-api.bondaracademy.com/api/users/login",
      {
        data: { user: body },
      },
    );
    const loginResponseJSON = await loginResponse.json();
    return loginResponseJSON.user.token;
  }

  async updateUserInfo(
    token: string,
    body: {
      image?: string;
      username?: string;
      bio?: string;
      email?: string;
      password?: string;
    },
  ) {
    const loginResponse = await this.request.put(
      "https://conduit-api.bondaracademy.com/api/user",
      {
        headers: { Authorization: "Token " + token },
        data: { user: body },
      },
    );
    const updateResponseJSON = await loginResponse.json();

    console.log(updateResponseJSON);
    return updateResponseJSON.user;
  }
}
