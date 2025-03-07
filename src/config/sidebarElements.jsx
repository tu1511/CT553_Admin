import { v4 as uuidv4 } from "uuid";
import {
  Gift,
  HomeIcon,
  LayoutGrid,
  Newspaper,
  ShoppingCart,
  Star,
  UserIcon,
} from "lucide-react";
import { CategoryPage, OrderPage, ProductPage } from "@pages/index";
import AccountPage from "@pages/AccountPage";
import CouponPage from "@pages/CouponPage";
import ArticlePage from "@pages/ArticlePage";
import Dashboard from "@pages/Dashboard";
import ReviewPage from "@pages/ReviewPage";

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
      path: "/san-pham",
      element: <ProductPage />,
      icon: <LayoutGrid />,
      label: "Quản lý Sản phẩm",
      childItems: [
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Giảm giá",
        //   path: "/discount",
        //   element: <DiscountPage />,
        // },
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Ưu đãi",
        //   path: "/promotion",
        //   element: <PromotionPage />,
        // },
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Dịch vụ",
        //   path: "/service",
        //   element: <ServicePage />,
        // },
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Voucher",
        //   path: "/voucher",
        //   element: <VoucherPage />,
        // },
        {
          childId: `${uuidv4()}-child`,
          label: "Danh mục",
          path: "/danh-muc",
          element: <CategoryPage />,
        },
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Thương hiệu",
        //   path: "/brand",
        //   element: <BrandPage />,
        // },
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Loại thông số",
        //   path: "/specification",
        //   element: <SpecificationPage />,
        // },
        // {
        //   childId: `${uuidv4()}-child`,
        //   label: "Loại sản phẩm",
        //   path: "/product-type",
        //   element: <ProductTypePage />,
        // },
      ],
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
      path: "/bai-viet",
      element: <ArticlePage />,
      icon: <Newspaper />,
      label: "Quản lý bài viết",
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
      path: "/tai-khoan",
      element: <AccountPage />,
      icon: <UserIcon />,
      label: "Quản lý tài khoản",
      childItems: [],
    },
  ];

  return routes;
};

export default useRoutes;
