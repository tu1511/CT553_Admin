import createApiClient from "@services/api.service";

class OrderService {
  constructor(path = "/order") {
    this.api = createApiClient(path);
  }

  //  create order
  async createOrder(accessToken, data) {
    try {
      const response = await this.api.post("/", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  }

  // get order by buyid
  async getOrderByBuyId(accessToken, orderStatusId, limit) {
    try {
      const response = await this.api.get("/", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          orderStatusId,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting order by buyId:", error);
    }
  }

  // get all order
  async getAllOrder(accessToken, limit, page) {
    try {
      const response = await this.api.get("/all", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          limit,
          page,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting all order:", error);
    }
  }
}

export default new OrderService();
