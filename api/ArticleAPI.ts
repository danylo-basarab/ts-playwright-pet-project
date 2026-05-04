import { APIRequestContext } from "@playwright/test";
import { faker } from "@faker-js/faker";

const BASE_API_URL = "https://conduit-api.bondaracademy.com/api";

export interface ArticleData {
  article: {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList: string[];
    author: { username: string };
    favorited?: boolean;
    favoritesCount?: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

export interface CommentData {
  comment: {
    id: number;
    body: string;
    author: { username: string };
  };
}

export class ArticleApi {
  private lastArticleSlug?: string;
  private lastCommentId?: number;

  constructor(private request: APIRequestContext) {}

  generateArticleData() {
    return {
      title: `title - ${Date.now()} - ${faker.animal.type()}`,
      description: `desc - ${faker.lorem.words(3)}`,
      body: `body - ${faker.lorem.sentence()}`,
      tagList: [faker.word.sample()],
    };
  }

  async createArticle(
    body: {
      body: string;
      description: string;
      tagList: string[];
      title: string;
    },
    token: string,
  ): Promise<ArticleData> {
    const response = await this.request.post(`${BASE_API_URL}/articles/`, {
      headers: { Authorization: `Token ${token}` },
      data: { article: body },
    });
    if (!response.ok()) {
      throw new Error(`Failed to create article. Status: ${response.status()}`);
    }
    const articleData: ArticleData = await response.json();
    this.lastArticleSlug = articleData.article.slug;
    return articleData;
  }

  async editArticle(
    body: {
      title?: string;
      description?: string;
      body?: string;
      tagList?: string[];
    },
    token: string,
    articleSlug?: string,
  ): Promise<ArticleData> {
    const slug = articleSlug || this.lastArticleSlug;
    if (!slug)
      throw new Error(
        "No article slug provided and no article has been created in this session",
      );
    const response = await this.request.put(
      `${BASE_API_URL}/articles/${slug}`,
      { headers: { Authorization: `Token ${token}` }, data: { article: body } },
    );
    if (!response.ok()) {
      throw new Error(`Failed to edit article. Status: ${response.status()}`);
    }
    const articleData: ArticleData = await response.json();
    this.lastArticleSlug = articleData.article.slug;
    return articleData;
  }

  async deleteArticle(token: string, articleSlug?: string): Promise<number> {
    const slug = articleSlug || this.lastArticleSlug;
    if (!slug)
      throw new Error(
        "No article slug provided and no article has been created in this session",
      );
    const response = await this.request.delete(
      `${BASE_API_URL}/articles/${slug}`,
      { headers: { Authorization: `Token ${token}` } },
    );
    if (!response.ok()) {
      throw new Error(`Failed to delete article. Status: ${response.status()}`);
    }
    this.lastArticleSlug = undefined;
    return response.status();
  }

  async addComment(
    comment: string,
    token: string,
    articleSlug?: string,
  ): Promise<CommentData> {
    const slug = articleSlug || this.lastArticleSlug;
    if (!slug)
      throw new Error(
        "No article slug provided and no article has been created in this session",
      );
    const response = await this.request.post(
      `${BASE_API_URL}/articles/${slug}/comments/`,
      {
        headers: { Authorization: `Token ${token}` },
        data: { comment: { body: comment } },
      },
    );
    if (!response.ok()) {
      throw new Error(`Failed to add comment. Status: ${response.status()}`);
    }
    const commentData: CommentData = await response.json();
    this.lastCommentId = commentData.comment.id;
    return commentData;
  }

  async deleteComment(
    token: string,
    articleSlug?: string,
    commentId?: number,
  ): Promise<number> {
    const slug = articleSlug || this.lastArticleSlug;
    const id = commentId ?? this.lastCommentId;
    if (!slug)
      throw new Error(
        "No article slug provided and no article has been created in this session",
      );
    if (id === undefined)
      throw new Error(
        "No comment ID provided and no comment has been created in this session",
      );
    const response = await this.request.delete(
      `${BASE_API_URL}/articles/${slug}/comments/${id}`,
      { headers: { Authorization: `Token ${token}` } },
    );
    if (!response.ok()) {
      throw new Error(`Failed to delete comment. Status: ${response.status()}`);
    }
    this.lastCommentId = undefined;
    return response.status();
  }

  async favoriteArticle(article: string, token: string): Promise<ArticleData> {
    const response = await this.request.post(
      `${BASE_API_URL}/articles/${article}/favorite`,
      {
        headers: { Authorization: `Token ${token}` },
        data: {},
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Failed to favorite article. Status: ${response.status()}`,
      );
    }
    return await response.json();
  }

  async unfavoriteArticle(
    article: string,
    token: string,
  ): Promise<ArticleData> {
    const response = await this.request.delete(
      `${BASE_API_URL}/articles/${article}/favorite`,
      {
        headers: { Authorization: `Token ${token}` },
      },
    );
    if (!response.ok()) {
      throw new Error(
        `Failed to unfavorite article. Status: ${response.status()}`,
      );
    }
    return await response.json();
  }
}
