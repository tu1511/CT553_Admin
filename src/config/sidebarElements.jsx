import { v4 as uuidv4 } from "uuid";
import HomePage from "@pages/HomePage";
import { HomeIcon } from "lucide-react";

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
  ];

  return routes;
};

export default useRoutes;
