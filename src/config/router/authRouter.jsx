import { HomePage, LoginPage } from "@pages/index";
import { v4 as uuidv4 } from "uuid";

export default [
  {
    id: uuidv4(),
    path: "/dang-nhap",
    element: <LoginPage />,
  },
  {
    id: uuidv4(),
    path: "/forgot-password",
    element: <HomePage />,
  },
];
