import { APIRequestContext } from "@playwright/test";

const BASE_API_URL = "https://conduit-api.bondaracademy.com/api";

export interface UserLoginResponse {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
  };
}

export interface UserRegisterResponse {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string;
    image: string;
  };
}

export class UserApi {
  constructor(private request: APIRequestContext) {}

  async registerUser(body: {
    username: string;
    email: string;
    password: string;
  }): Promise<UserRegisterResponse> {
    const response = await this.request.post(`${BASE_API_URL}/users`, {
      data: { user: body },
    });

    if (!response.ok()) {
      throw new Error(`Failed to register user. Status: ${response.status()}`);
    }

    return await response.json();
  }

  async loginUser(body: { email: string; password: string }): Promise<string> {
    const response = await this.request.post(`${BASE_API_URL}/users/login`, {
      data: { user: body },
    });

    if (!response.ok()) {
      throw new Error(`Failed to login user. Status: ${response.status()}`);
    }

    const loginResponseJSON: UserLoginResponse = await response.json();
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
  ): Promise<UserLoginResponse> {
    const response = await this.request.put(`${BASE_API_URL}/user`, {
      headers: { Authorization: `Token ${token}` },
      data: { user: body },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to update user info. Status: ${response.status()}`,
      );
    }

    return await response.json();
  }

  async followUser(
    personToFollow: string,
    token: string,
  ): Promise<{ profile: object }> {
    const encodedUsername = this.encodeUsername(personToFollow);
    const response = await this.request.post(
      `${BASE_API_URL}/profiles/${encodedUsername}/follow`,
      { headers: { Authorization: `Token ${token}` }, data: {} },
    );

    if (!response.ok()) {
      throw new Error(`Failed to follow user. Status: ${response.status()}`);
    }

    return await response.json();
  }

  async unfollowUser(
    personToFollow: string,
    token: string,
  ): Promise<{ profile: object }> {
    const encodedUsername = this.encodeUsername(personToFollow);
    const response = await this.request.delete(
      `${BASE_API_URL}/profiles/${encodedUsername}/follow`,
      { headers: { Authorization: `Token ${token}` }, data: {} },
    );

    if (!response.ok()) {
      throw new Error(`Failed to unfollow user. Status: ${response.status()}`);
    }

    return await response.json();
  }

  private encodeUsername(username: string): string {
    return username
      .split(" ")
      .map((part) => encodeURIComponent(part))
      .join("%20");
  }
}
