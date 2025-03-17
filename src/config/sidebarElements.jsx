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

// Tạo component để lấy role người dùng và định nghĩa routes
const useRoutes = () => {
  //   const userRole = useSelector((state) => state.users?.user?.role?.role);

  const routes = [
    {
      id: uuidv4(),
      path: "/",
      element: <Dashboard />,
      icon: <HomeIcon />,
      label: "Trang chủ",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/danh-muc",
      element: <CategoryPage />,
      icon: <Component />,
      label: "Quản lý danh mục",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/san-pham",
      element: <ProductPage />,
      icon: <LayoutGrid />,
      label: "Quản lý Sản phẩm",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/ma-giam-gia",
      element: <CouponPage />,
      icon: <Gift />,
      label: "Quản lý mã giảm giá",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/don-hang",
      element: <OrderPage />,
      icon: <ShoppingCart />,
      label: "Quản lý đơn hàng",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/danh-gia",
      element: <ReviewPage />,
      icon: <Star />,
      label: "Quản lý đánh giá",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/bai-viet",
      element: <ArticlePage />,
      icon: <Newspaper />,
      label: "Quản lý bài viết",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/chinh-sach",
      element: <PolicyPage />,
      icon: <Siren />,
      label: "Quản lý chính sách",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/tai-khoan",
      element: <AccountPage />,
      icon: <UserIcon />,
      label: "Quản lý tài khoản",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/banner",
      element: <BannerPage />,
      icon: <Image />,
      label: "Quản lý banner",
      childItems: [],
    },
    {
      id: uuidv4(),
      path: "/thong-tin-cua-hang",
      element: <ShopInfoPage />,
      icon: <MonitorCog />,
      label: "Quản lý thông tin của hàng",
      childItems: [],
    },
  ];

  return routes;
};

export default useRoutes;
