import createApiClient from "@services/api.service";

class articleService {
  constructor(path = "/article") {
    this.api = createApiClient(path);
  }

  // Get all categorys
  async getAll(accessToken) {
    const response = await this.api.get("/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //   create article
  async create(accessToken, data) {
    const response = await this.api.post("/", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //update article
  async update(accessToken, articleId, data) {
    const response = await this.api.put(`/${articleId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        articleId,
      },
    });
    return response.data;
  }

  //delete article
  async delete(accessToken, articleId) {
    const response = await this.api.delete(`/${articleId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        articleId,
      },
    });
    return response.data;
  }
}

export default new articleService();
