import createApiClient from "@services/api.service";

class accountService {
  constructor(path = "/account") {
    this.api = createApiClient(path);
  }

  // get all account
  async getAllAccount(limit, page, accessToken) {
    const response = await this.api.get("/", {
      params: {
        limit,
        page,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async getLoggedInUser(accessToken) {
    const response = await this.api.get("/logged-in-account", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  //   permission
  async updateAccount(id, data, accessToken) {
    console.log("accessToken", accessToken);

    const response = await this.api.put(`/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }

  async changePassword(data, accessToken) {
    const response = await this.api.put("/password", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  }
}
export default new accountService();
