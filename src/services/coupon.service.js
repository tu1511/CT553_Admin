import createApiClient from "@services/api.service";

class couponService {
  constructor(path = "/coupon") {
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

  //   create coupon
  async create(accessToken, data) {
    const response = await this.api.post("/", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //update coupon
  async update(accessToken, couponId, data) {
    const response = await this.api.put(`/${couponId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        couponId,
      },
    });
    return response.data;
  }

  //delete coupon
  async delete(accessToken, couponId) {
    const response = await this.api.delete(`/${couponId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        couponId,
      },
    });
    return response.data;
  }
}

export default new couponService();
