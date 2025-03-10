import createApiClient from "@services/api.service";

class reviewService {
  constructor(path = "/review") {
    this.api = createApiClient(path);
  }

  async getAll(accessToken) {
    const response = await this.api.get("/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  // reply comment
  async replyComment(accessToken, data) {
    const response = await this.api.post(`/reply`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
}

export default new reviewService();
