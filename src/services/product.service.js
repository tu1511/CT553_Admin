import createApiClient from "@services/api.service";

class productService {
  constructor(path = "/product") {
    this.api = createApiClient(path);
  }

  // Get all products
  async getProducts({ type, limit = -1 } = {}) {
    const response = await this.api.get("/", {
      params: {
        type, // Bắt buộc (nếu thiếu sẽ bị lỗi "Product query type is missing!")
        limit, // Bắt buộc là số
        // page,
        // categoryIds,
      },
    });
    return response.data;
  }

  //get one by slug
  async getOneBySlug({ accessToken, slug }) {
    const response = await this.api.get(`/slug/${slug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //get one by slug
  async getOneBySlugWithAllDiscounts(accessToken, slug) {
    const response = await this.api.get(`/slug/allDiscounts/${slug}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  // create product
  async createProduct(accessToken, product) {
    const response = await this.api.post("/", product, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  // update product
  async updateProduct(accessToken, product) {
    const response = await this.api.put(`/${product.id}`, product, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //update discounts
  async updateDiscounts(
    accessToken,
    productId,
    discountValue,
    startDate,
    endDate
  ) {
    const response = await this.api.put(
      `/${productId}/discount`,
      {
        productId,
        discountValue,
        startDate,
        endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  //  create product discount
  async createProductDiscount(
    accessToken,
    productId,
    discountValue,
    startDate,
    endDate
  ) {
    const response = await this.api.post(
      `/${productId}/discount`,
      {
        discountValue,
        startDate,
        endDate,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }
}

export default new productService();
