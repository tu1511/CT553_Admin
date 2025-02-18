import HomePage from "@pages/HomePage";
import LoginPage from "@pages/LoginPage";

const routes = [
  {
    id: "trangchu",
    path: "/",
    element: <HomePage />,
  },

  {
    id: "dangnhap",
    path: "/dang-nhap",
    element: <LoginPage />,
  },
];

export default routes;
