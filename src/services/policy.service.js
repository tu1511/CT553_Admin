import createApiClient from "@services/api.service";

class policyService {
  constructor(path = "/policy") {
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

  //   create policy
  async create(accessToken, data) {
    const response = await this.api.post("/", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //update policy
  async update(accessToken, policyId, data) {
    const response = await this.api.put(`/${policyId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        policyId,
      },
    });
    return response.data;
  }

  //delete policy
  async delete(accessToken, policyId) {
    const response = await this.api.delete(`/${policyId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        policyId,
      },
    });
    return response.data;
  }
}

export default new policyService();
