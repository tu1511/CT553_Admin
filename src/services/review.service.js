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

  // toggle status
  async toggleStatus(accessToken, reviewId) {
    const response = await this.api.put(
      `/toggleHide/${reviewId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          reviewId,
        },
      }
    );
    return response.data;
  }

  async getUnsendReviews() {
    const response = await this.api.get("/unsend");

    return response.data;
  }
}

export default new reviewService();
