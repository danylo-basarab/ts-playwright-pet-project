// api/ArticlesApi.ts
import { APIRequestContext } from "@playwright/test";

export class UserApi {
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
    const response = await this.request.put(
      "https://conduit-api.bondaracademy.com/api/user",
      {
        headers: { Authorization: "Token " + token },
        data: { user: body },
      },
    );

    return response.status();
  }

  async followUser(personToFollow: string, token: string) {
    const response = await this.request.post(
      `https://conduit-api.bondaracademy.com/api/profiles/${personToFollow.replace(" ", "%20")}/follow`,
      { headers: { Authorization: "Token " + token }, data: {} },
    );

    return response.status();
  }

  async unfollowUser(personToFollow: string, token: string) {
    const response = await this.request.delete(
      `https://conduit-api.bondaracademy.com/api/profiles/${personToFollow.replaceAll(" ", "%20")}/follow`,
      { headers: { Authorization: "Token " + token }, data: {} },
    );

    return response.status();
  }
}
