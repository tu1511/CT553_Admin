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

  // get order by id
  async getOrderById(accessToken, id) {
    try {
      const response = await this.api.get(`/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting order by id:", error);
    }
  }

  // update order status
  async updateOrderStatus(accessToken, orderId, fromStatus, toStatus) {
    try {
      const response = await this.api.put(
        `/${orderId}/status`,
        { fromStatus, toStatus },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  async getAllReport(accessToken, beginDate, endDate) {
    try {
      const response = await this.api.get("/allForReport", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          beginDate,
          endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error getting all report:", error);
    }
  }

  async getWaitingConfirmOrder() {
    try {
      const response = await this.api.get("/awaiting-confirm");
      return response.data;
    } catch (error) {
      console.error("Error getting waiting confirm order:", error);
    }
  }
}

export default new OrderService();
