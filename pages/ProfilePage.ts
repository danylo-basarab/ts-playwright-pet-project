import { Page, Locator } from "@playwright/test";

export class ProfilePage {
  readonly page: Page;

  readonly profileIcon: Locator;
  readonly editProfileButton: Locator;
  readonly myPostsTabButton: Locator;
  readonly favoritedPostsTabButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.profileIcon = page.locator(".user-img");
    this.editProfileButton = page.getByText("Edit Profile Settings");
    this.myPostsTabButton = page.getByText("My Posts");
    this.favoritedPostsTabButton = page.getByText("Favorited Posts");
  }

  async getProfileIcon() {
    return await this.profileIcon.getAttribute("src");
  }

  async openEditProfileSettings() {
    await this.editProfileButton.click();
  }

  async openMyPostsTab() {
    await this.myPostsTabButton.click();
  }

  async openFavoritedPostsTab() {
    await this.favoritedPostsTabButton.click();
  }
}
