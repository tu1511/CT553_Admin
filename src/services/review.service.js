import createApiClient from "@services/api.service";

class reviewService {
  constructor(path = "/review") {
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
}

export default new reviewService();
