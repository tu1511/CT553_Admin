import { v4 as uuidv4 } from "uuid";
import {
  Component,
  Gift,
  HomeIcon,
  Image,
  LayoutGrid,
  MonitorCog,
  Newspaper,
  ShoppingCart,
  Siren,
  Star,
  UserIcon,
} from "lucide-react";
import { CategoryPage, OrderPage, ProductPage } from "@pages/index";
import AccountPage from "@pages/AccountPage";
import CouponPage from "@pages/CouponPage";
import ArticlePage from "@pages/ArticlePage";
import Dashboard from "@pages/Dashboard";
import ReviewPage from "@pages/ReviewPage";
import PolicyPage from "@pages/PolicyPage";
import BannerPage from "@pages/BannerPage";
import ShopInfoPage from "@pages/ShopInfoPage";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate to="/dang-nhap" replace />;
};
// Tạo component để lấy role người dùng và định nghĩa routes
const useRoutes = () => {
  const [account, setAccount] = useState(null);

  const { authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (authUser) {
      setAccount(authUser);
    }
  }, [authUser]);

  const routes = [
    {
      id: uuidv4(),
      path: "/",
      element: (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      ),
      icon: <HomeIcon />,
      label: "Trang chủ",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/danh-muc",
      element: (
        <PrivateRoute>
          <CategoryPage />
        </PrivateRoute>
      ),
      icon: <Component />,
      label: "Quản lý danh mục",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/san-pham",
      element: (
        <PrivateRoute>
          <ProductPage />
        </PrivateRoute>
      ),
      icon: <LayoutGrid />,
      label: "Quản lý Sản phẩm",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/ma-giam-gia",
      element: (
        <PrivateRoute>
          <CouponPage />
        </PrivateRoute>
      ),
      icon: <Gift />,
      label: "Quản lý mã giảm giá",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/don-hang",
      element: (
        <PrivateRoute>
          <OrderPage />
        </PrivateRoute>
      ),
      icon: <ShoppingCart />,
      label: "Quản lý đơn hàng",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/danh-gia",
      element: (
        <PrivateRoute>
          <ReviewPage />
        </PrivateRoute>
      ),
      icon: <Star />,
      label: "Quản lý đánh giá",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/bai-viet",
      element: (
        <PrivateRoute>
          <ArticlePage />
        </PrivateRoute>
      ),
      icon: <Newspaper />,
      label: "Quản lý bài viết",
      childItems: [],
    },
  ];

  if (account?.roleId === 1) {
    routes.push(
      {
        id: uuidv4(),
        path: "/chinh-sach",
        element: (
          <PrivateRoute>
            <PolicyPage />
          </PrivateRoute>
        ),
        icon: <Siren />,
        label: "Quản lý chính sách",
        childItems: [],
      },
      {
        id: uuidv4(),
        path: "/tai-khoan",
        element: (
          <PrivateRoute>
            <AccountPage />
          </PrivateRoute>
        ),
        icon: <UserIcon />,
        label: "Quản lý tài khoản",
        childItems: [],
      },
      {
        id: uuidv4(),
        path: "/banner",
        element: (
          <PrivateRoute>
            <BannerPage />
          </PrivateRoute>
        ),
        icon: <Image />,
        label: "Quản lý banner",
        childItems: [],
      },
      {
        id: uuidv4(),
        path: "/thong-tin-cua-hang",
        element: (
          <PrivateRoute>
            <ShopInfoPage />
          </PrivateRoute>
        ),
        icon: <MonitorCog />,
        label: "Quản lý thông tin của hàng",
        childItems: [],
      }
    );
  }

  return routes;
};

export default useRoutes;
