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

  // create category for product
  async createCategoryForProduct(accessToken, productId, categoryId) {
    const response = await this.api.post(
      `/${productId}/add-category`,
      { categoryId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  // delete category for product

  async deleteCategoryForProduct(accessToken, productId, categoryId) {
    const response = await this.api.delete(
      `/${productId}/delete-category/${categoryId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  // add image for product
  async addImageForProduct(accessToken, productId, uploadedImageId) {
    const response = await this.api.post(
      `/${productId}/add-image`,
      { uploadedImageId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  }

  // delete image for product
  async deleteImageForProduct(accessToken, productId, productImageId) {
    const response = await this.api.delete(`/delete-image/${productImageId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        productId,
        productImageId,
      },
    });
    return response.data;
  }
}

export default new productService();
