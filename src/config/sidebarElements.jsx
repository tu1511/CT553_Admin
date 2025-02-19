import { v4 as uuidv4 } from "uuid";
import { HomeIcon, LayoutGrid, ShoppingCart } from "lucide-react";
import { CategoryPage, HomePage, OrderPage, ProductPage } from "@pages/index";

// Tạo component để lấy role người dùng và định nghĩa routes
const useRoutes = () => {
  //   const userRole = useSelector((state) => state.users?.user?.role?.role);

  const routes = [
    {
      id: uuidv4(),
      path: "/",
      element: <HomePage />,
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
      path: "/don-hang",
      element: <OrderPage />,
      icon: <ShoppingCart />,
      label: "Quản lý Đơn hàng",
      childItems: [],
    },
  ];

  return routes;
};

export default useRoutes;
