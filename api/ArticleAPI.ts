import { APIRequestContext } from "@playwright/test";
import fs from "fs";

export class ArticleApi {
  constructor(private request: APIRequestContext) {}

  async createArticle(
    body: {
      body: string;
      description: string;
      tagList: string[];
      title: string;
    },
    token: string,
  ) {
    const response = await this.request.post(
      "https://conduit-api.bondaracademy.com/api/articles/",
      {
        headers: { Authorization: `Token ${token}` },
        data: { article: body },
      },
    );

    const articleData = await response.json();
    fs.writeFileSync(
      "test-data/articleData.json",
      JSON.stringify(articleData, null, 2),
    );

    return response.status();
  }

  async editArticle(
    body: {
      title?: string;
      description?: string;
      text?: string;
      tagList?: string[];
    },
    token: string,
  ) {
    const rawData = fs.readFileSync("test-data/articleData.json", "utf-8");
    body["slug"] = JSON.parse(rawData).article.slug;

    const response = await this.request.put(
      `https://conduit-api.bondaracademy.com/api/articles/${body["slug"]}`,
      { headers: { Authorization: `Token ${token}` }, data: { article: body } },
    );

    const articleData = await response.json();
    fs.writeFileSync(
      "test-data/articleData.json",
      JSON.stringify(articleData, null, 2),
    );

    return response.status();
  }

  async deleteArticle(token: string) {
    const rawData = fs.readFileSync("test-data/articleData.json", "utf-8");
    const articleId = JSON.parse(rawData).article.slug;

    const response = await this.request.delete(
      `https://conduit-api.bondaracademy.com/api/articles/${articleId}`,
      { headers: { Authorization: `Token ${token}` } },
    );

    fs.writeFileSync("test-data/articleData.json", JSON.stringify({}, null, 2));

    return response.status();
  }

  async addComment(comment: string, token: string) {
    const rawData = fs.readFileSync("test-data/articleData.json", "utf-8");
    const articleId = JSON.parse(rawData).article.slug;

    const response = await this.request.post(
      `https://conduit-api.bondaracademy.com/api/articles/${articleId}/comments/`,
      {
        headers: { Authorization: `Token ${token}` },
        data: { comment: { body: comment } },
      },
    );

    const commentData = await response.json();
    fs.writeFileSync(
      "test-data/commentData.json",
      JSON.stringify(commentData, null, 2),
    );

    return response.status();
  }

  async deleteComment(token: string) {
    const articleData = fs.readFileSync("test-data/articleData.json", "utf-8");
    const articleId = JSON.parse(articleData).article.slug;

    const commentData = fs.readFileSync("test-data/commentData.json", "utf-8");
    const commentId = JSON.parse(commentData).comment.id;

    const response = await this.request.delete(
      `https://conduit-api.bondaracademy.com/api/articles/${articleId}/comments/${commentId}`,
      { headers: { Authorization: `Token ${token}` } },
    );

    fs.writeFileSync("test-data/commentData.json", JSON.stringify({}, null, 2));

    return response.status();
  }

  async favoriteArticle(article: string, token: string) {
    const response = await this.request.post(
      `https://conduit-api.bondaracademy.com/api/articles/${article}/favorite`,
      {
        headers: { Authorization: `Token ${token}` },
        data: {},
      },
    );
    return response.status();
  }

  async unfavoriteArticle(article: string, token: string) {
    const response = await this.request.delete(
      `https://conduit-api.bondaracademy.com/api/articles/${article}/favorite`,
      {
        headers: { Authorization: `Token ${token}` },
      },
    );
    return response.status();
  }
}
