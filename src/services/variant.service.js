import createApiClient from "@services/api.service";

class variantService {
  constructor(path = "/variant") {
    this.api = createApiClient(path);
  }

  //   delete variant
  async deleteVariant(accessToken, variantId, productId) {
    console.log("variantId", variantId);
    console.log("productId", productId);

    try {
      const response = await this.api.delete(`/${variantId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          productId,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete variant:", error);
      throw error;
    }
  }

  // create variant for product
  async createVariant(accessToken, productId, size, quantity, price) {
    try {
      const response = await this.api.post(
        `/${productId}`,
        {
          size,
          quantity,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create variant:", error);
      throw error;
    }
  }

  // update variant
  async updateVariant(accessToken, id, productId, size, quantity, price) {
    try {
      const response = await this.api.put(
        `/${id}`,
        {
          id,
          size,
          quantity,
          price,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            productId,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update variant:", error);
      throw error;
    }
  }
}

export default new variantService();
