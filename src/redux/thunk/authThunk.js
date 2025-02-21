import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@services/auth.service";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = (await authService.login(credentials)).data;

      const userRole = response?.metadata?.account?.role;
      if (userRole !== "ADMIN") {
        return rejectWithValue("Bạn không có quyền truy cập vào hệ thống!");
      }

      // Lưu access token và refresh token vào localStorage
      localStorage.setItem(
        "accessToken",
        response?.metadata.tokens.accessToken
      );

      return response;
    } catch (error) {
      console.log("Lỗi khi đăng nhập:", error.data.message);
      return rejectWithValue(error.data.message);
    }
  }
);

// export const loginWithSocialThunk = createAsyncThunk(
//   "auth/loginWithSocial",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const data = await authService.loginWithSocial(credentials);

//       // Lưu access token và refresh token vào localStorage
//       localStorage.setItem("accessToken", data.data.accessToken);
//       localStorage.setItem("refreshToken", data.data.refreshToken);

//       return data.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data.error);
//     }
//   }
// );

// export const logoutThunk = createAsyncThunk(
//   "auth/logout",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       console.log(credentials);
//       const response = await authService.logout(credentials);

//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       localStorage.removeItem("loggedInUserId");
//       // localStorage.removeItem(
//       //   `viewedProducts_${localStorage.getItem("loggedInUserId")}`
//       // );
//       // localStorage.removeItem("productQuantity");
//       // localStorage.removeItem("viewedProducts_null");

//       window.location.reload();

//       return response;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.error || "Logout failed!");
//     }
//   }
// );
